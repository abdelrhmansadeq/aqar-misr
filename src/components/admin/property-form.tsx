"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Property } from "@/types/property";

export function PropertyForm({ initialData }: { initialData?: Property }) {
    const router = useRouter();
    const supabase = createClient();
    const [loading, setLoading] = useState(false);
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(initialData?.image_url || null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        let imageUrl = initialData?.image_url || "";

        try {
            // 1. رفع الصورة لو المستخدم اختار صورة جديدة
            if (imageFile) {
                const fileExt = imageFile.name.split('.').pop();
                const fileName = `${Math.random()}.${fileExt}`;
                const { error: uploadError } = await supabase.storage
                    .from("property-images")
                    .upload(fileName, imageFile);

                if (uploadError) throw uploadError;

                const { data: { publicUrl } } = supabase.storage
                    .from("property-images")
                    .getPublicUrl(fileName);

                imageUrl = publicUrl;
            }

            // 2. تجهيز البيانات
            const propertyData = {
                title: formData.get("title"),
                description: formData.get("description"),
                purpose: formData.get("purpose"),
                type: formData.get("type"),
                price: Number(formData.get("price")),
                area_m2: Number(formData.get("area_m2")),
                bedrooms: Number(formData.get("bedrooms")),
                bathrooms: Number(formData.get("bathrooms")),
                governorate: formData.get("governorate"),
                city: formData.get("city"),
                district: formData.get("district"),
                image_url: imageUrl,
                status: "published",
                verified: true,
            };

            // 3. لو فيه بيانات قديمة يبقى ده تعديل، لو مفيش يبقى ده إضافة جديدة
            if (initialData) {
                const { error: dbError } = await supabase
                    .from("properties")
                    .update(propertyData)
                    .eq("id", initialData.id);
                if (dbError) throw dbError;
            } else {
                const { error: dbError } = await supabase
                    .from("properties")
                    .insert({
                        ...propertyData,
                        slug: `عقار-${Math.floor(Math.random() * 10000)}`,
                        advertiser_id: (await supabase.auth.getUser()).data.user?.id
                    });
                if (dbError) throw dbError;
            }

            router.push("/aqar-ax6admin/properties");
            router.refresh();

        } catch (error: any) {
            alert("حدث خطأ: " + error.message);
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
                        <div className="space-y-2">
                            <Label>عنوان العقار</Label>
                            <Input name="title" defaultValue={initialData?.title} required placeholder="مثال: شقة سوبر لوكس في التجمع" />
                        </div>

                        <div className="space-y-2">
                            <Label>الغرض</Label>
                            <Select name="purpose" defaultValue={initialData?.purpose || "sale"} required>
                                <SelectTrigger><SelectValue placeholder="اختر الغرض" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="sale">للبيع</SelectItem>
                                    <SelectItem value="rent">للإيجار</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>نوع العقار</Label>
                            <Select name="type" defaultValue={initialData?.type || "apartment"} required>
                                <SelectTrigger><SelectValue placeholder="اختر النوع" /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="apartment">شقة</SelectItem>
                                    <SelectItem value="villa">فيلا</SelectItem>
                                    <SelectItem value="land">أرض</SelectItem>
                                    <SelectItem value="shop">محل</SelectItem>
                                    <SelectItem value="office">مكتب</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label>السعر (جنيه مصري)</Label>
                            <Input name="price" type="number" defaultValue={initialData?.price} required placeholder="مثال: 2500000" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">الموقع والتفاصيل</h2>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>المحافظة</Label>
                            <Input name="governorate" defaultValue={initialData?.district ? "cairo" : ""} required placeholder="القاهرة" />
                        </div>
                        <div className="space-y-2">
                            <Label>المدينة/المنطقة</Label>
                            <Input name="city" defaultValue={initialData?.city} required placeholder="التجمع الخامس" />
                        </div>
                        <div className="space-y-2">
                            <Label>الحي/الشارع</Label>
                            <Input name="district" defaultValue={initialData?.district} required placeholder="الحي الأول" />
                        </div>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                            <Label>المساحة (م²)</Label>
                            <Input name="area_m2" type="number" defaultValue={initialData?.area_m2} required placeholder="150" />
                        </div>
                        <div className="space-y-2">
                            <Label>غرف النوم</Label>
                            <Input name="bedrooms" type="number" defaultValue={initialData?.bedrooms} required placeholder="3" />
                        </div>
                        <div className="space-y-2">
                            <Label>الحمامات</Label>
                            <Input name="bathrooms" type="number" defaultValue={initialData?.bathrooms} required placeholder="2" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>الوصف</Label>
                        <Textarea name="description" defaultValue={initialData?.description} required placeholder="اكتب وصف تفصيلي للعقار..." className="min-h-[120px]" />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardContent className="p-6 space-y-4">
                    <h2 className="text-lg font-semibold border-b pb-2">صورة العقار</h2>
                    <div className="flex flex-col md:flex-row gap-6 items-center">
                        <Input type="file" accept="image/*" onChange={handleImageChange} className="cursor-pointer" />
                        {previewUrl && (
                            <div className="relative w-full md:w-48 aspect-video rounded-lg overflow-hidden border">
                                <Image src={previewUrl} alt="Preview" fill className="object-cover" />
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>

            <div className="flex justify-end gap-4">
                <Button type="button" variant="outline" onClick={() => router.back()} disabled={loading}>إلغاء</Button>
                <Button type="submit" disabled={loading} className="px-8">
                    {loading ? "جاري الحفظ..." : (initialData ? "حفظ التعديلات" : "حفظ العقار")}
                </Button>
            </div>
        </form>
    );
}