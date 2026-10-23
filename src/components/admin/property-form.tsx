"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import imageCompression from "browser-image-compression";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Property } from "@/types/property";
import { X, UploadCloud, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner"; // ضفنا ده

type FormImage = { id?: string; url: string; file?: File };

export function PropertyForm({ initialData }: { initialData?: Property }) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);

    const [images, setImages] = useState<FormImage[]>(() => {
        if (!initialData) return [];
        const existingImages: FormImage[] = [];
        if (initialData.property_images && initialData.property_images.length > 0) {
            [...initialData.property_images]
                .sort((a, b) => a.order - b.order)
                .forEach((img) => {
                    existingImages.push({ id: img.id, url: img.file_path });
                });
        } else if (initialData.image_url) {
            existingImages.push({ url: initialData.image_url });
        }
        return existingImages;
    });

    const [coverIndex, setCoverIndex] = useState<number>(() => {
        if (!initialData || !initialData.image_url) return 0;
        if (initialData.property_images && initialData.property_images.length > 0) {
            const idx = initialData.property_images.findIndex((img) => img.file_path === initialData.image_url);
            return idx !== -1 ? idx : 0;
        }
        return 0;
    });

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        if (files.length > 0) {
            const newImages = files.map(file => ({ url: URL.createObjectURL(file), file }));
            setImages((prev) => [...prev, ...newImages]);
        }
    };

    const removeImage = (index: number) => {
        setImages((prev) => prev.filter((_, i) => i !== index));
        if (coverIndex === index) setCoverIndex(0);
        else if (coverIndex > index) setCoverIndex(coverIndex - 1);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const finalImageUrls: FormImage[] = [];

            for (const img of images) {
                if (img.file) {
                    const compressedFile = await imageCompression(img.file, { maxSizeMB: 0.5, maxWidthOrHeight: 1920, useWebWorker: true });
                    const fileExt = compressedFile.name.split('.').pop();
                    const fileName = `${Date.now()}-${Math.random()}.${fileExt}`;

                    const { error: uploadError } = await supabase.storage.from("property-images").upload(fileName, compressedFile);
                    if (uploadError) throw new Error(uploadError.message);

                    const { data: { publicUrl } } = supabase.storage.from("property-images").getPublicUrl(fileName);
                    finalImageUrls.push({ url: publicUrl });
                } else {
                    finalImageUrls.push({ id: img.id, url: img.url });
                }
            }

            const coverUrl = finalImageUrls[coverIndex]?.url || initialData?.image_url || "";

            const propertyData = {
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                purpose: formData.get("purpose") as string,
                type: formData.get("type") as string,
                price: Number(formData.get("price")),
                area_m2: Number(formData.get("area_m2")),
                bedrooms: Number(formData.get("bedrooms")),
                bathrooms: Number(formData.get("bathrooms")),
                governorate: formData.get("governorate") as string,
                city: formData.get("city") as string,
                district: formData.get("district") as string,
                image_url: coverUrl,
                status: "published",
                verified: true,
            };

            let propertyId = initialData?.id;

            if (initialData) {
                const { error: dbError } = await supabase.from("properties").update(propertyData).eq("id", initialData.id);
                if (dbError) throw new Error(dbError.message);
            } else {
                const { data: newProp, error: dbError } = await supabase.from("properties").insert({
                    ...propertyData,
                    slug: `عقار-${Math.floor(Math.random() * 10000)}`,
                    advertiser_id: (await supabase.auth.getUser()).data.user?.id
                }).select("id").single();
                if (dbError) throw new Error(dbError.message);
                propertyId = newProp.id;
            }

            if (propertyId) {
                await supabase.from("property_images").delete().eq("property_id", propertyId);

                if (finalImageUrls.length > 0) {
                    const imageRecords = finalImageUrls.map((img, index) => ({
                        property_id: propertyId,
                        file_path: img.url,
                        order: index,
                        is_cover: index === coverIndex,
                    }));
                    const { error: imgError } = await supabase.from("property_images").insert(imageRecords);
                    if (imgError) throw new Error(imgError.message);
                }
            }

            toast.success(initialData ? "تم تعديل العقار بنجاح" : "تم إضافة العقار بنجاح"); // الإشعار الجديد
            router.push("/aqar-ax6admin/properties");
            router.refresh();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "حدث خطأ غير معروف";
            toast.error("حدث خطأ: " + message); // الإشعار الجديد
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">المعلومات الأساسية</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2"><Label>عنوان العقار</Label><Input name="title" defaultValue={initialData?.title} required /></div>
                        <div className="space-y-2"><Label>الغرض</Label><Select name="purpose" defaultValue={initialData?.purpose || "sale"}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="sale">للبيع</SelectItem><SelectItem value="rent">للإيجار</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label>نوع العقار</Label><Select name="type" defaultValue={initialData?.type || "apartment"}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="apartment">شقة</SelectItem><SelectItem value="villa">فيلا</SelectItem><SelectItem value="land">أرض</SelectItem><SelectItem value="office">مكتب</SelectItem></SelectContent></Select></div>
                        <div className="space-y-2"><Label>السعر (جنيه)</Label><Input name="price" type="number" defaultValue={initialData?.price} required /></div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">الموقع والتفاصيل</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2"><Label>المحافظة</Label><Input name="governorate" defaultValue={initialData?.governorate || "cairo"} required /></div>
                        <div className="space-y-2"><Label>المدينة/المنطقة</Label><Input name="city" defaultValue={initialData?.city} required /></div>
                        <div className="space-y-2"><Label>الحي/الشارع</Label><Input name="district" defaultValue={initialData?.district} required /></div>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2"><Label>المساحة (م²)</Label><Input name="area_m2" type="number" defaultValue={initialData?.area_m2} required /></div>
                        <div className="space-y-2"><Label>غرف النوم</Label><Input name="bedrooms" type="number" defaultValue={initialData?.bedrooms} required /></div>
                        <div className="space-y-2"><Label>الحمامات</Label><Input name="bathrooms" type="number" defaultValue={initialData?.bathrooms} required /></div>
                    </div>
                    <div className="space-y-2"><Label>الوصف</Label><Textarea name="description" defaultValue={initialData?.description} required className="min-h-32" /></div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">صور العقار (اختر صورة الغلاف)</h2>

                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted/20 hover:bg-muted/40 transition-colors">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                            <p className="text-sm text-muted-foreground">اضغط لاختيار الصور (يمكنك إضافة صور جديدة)</p>
                        </div>
                        <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageChange} />
                    </label>

                    {images.length > 0 && (
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            {images.map((img, index) => (
                                <div key={index} className={cn("relative aspect-video rounded-lg overflow-hidden border group cursor-pointer", coverIndex === index ? "ring-4 ring-primary ring-offset-2" : "")} onClick={() => setCoverIndex(index)}>
                                    <Image src={img.url} alt="Preview" fill className="object-cover" />
                                    {coverIndex === index && (
                                        <div className="absolute top-2 right-2 bg-primary text-primary-foreground px-2 py-1 text-xs rounded-md flex items-center gap-1">
                                            <Star className="h-3 w-3 fill-current" /> غلاف
                                        </div>
                                    )}
                                    <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(index); }} className="absolute bottom-2 right-2 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                        <X className="h-4 w-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>إلغاء</Button>
                <Button type="submit" disabled={loading} className="px-8">{loading ? "جاري الحفظ..." : (initialData ? "حفظ التعديلات" : "حفظ العقار")}</Button>
            </div>
        </form>
    );
}