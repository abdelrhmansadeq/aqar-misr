import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import { MapPin, Bed, Bath, Square, Phone, MessageCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { generateWhatsAppLink } from "@/lib/utils/whatsapp";
import { InstallmentCalculator } from "@/components/property/installment-calculator";
import { ViewingRequestDialog } from "@/components/property/viewing-request-dialog";
import { SimilarProperties } from "@/components/property/similar-properties";
import { PropertyGallery } from "@/components/property/property-gallery";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const supabase = await createClient();
    const { data: property } = await supabase.from("properties").select("title, description, image_url").eq("id", resolvedParams.id).single();
    if (!property) return { title: "العقار غير موجود" };
    return { title: `${property.title} | عقار مصر`, description: property.description.substring(0, 160) };
}

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const supabase = await createClient();

    const { data: property } = await supabase
        .from("properties")
        .select(`*, profiles:advertiser_id (phone), property_images (id, file_path, order)`)
        .eq("id", resolvedParams.id)
        .single();

    if (!property) notFound();

    const rawImages = property.property_images as { id: string; file_path: string; order: number }[] | null;

    // غيرنا let إلى const هنا
    const images = rawImages?.sort((a, b) => a.order - b.order).map((img) => img.file_path) || [];

    if (images.length === 0 && property.image_url) images.push(property.image_url);
    if (images.length === 0) images.push("/placeholder.jpg");

    const advertiserPhone = Array.isArray(property.profiles) ? property.profiles[0]?.phone : property.profiles?.phone;
    const phoneToUse = advertiserPhone || "01000000000";
    const whatsappLink = generateWhatsAppLink(phoneToUse, property.title, property.id);

    return (
        <div className="container mx-auto px-0 md:px-4 py-0 md:py-8 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
                <div className="md:col-span-2 space-y-6">

                    {/* المكون ده هو اللي فيه الصور والـ Badges دلوقتي */}
                    <PropertyGallery images={images} title={property.title} verified={property.verified} purpose={property.purpose} />

                    <div className="px-4 md:px-0">
                        <Link href="/properties" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 md:hidden">
                            <ArrowRight className="h-4 w-4 ml-1" /> العودة للبحث
                        </Link>
                        <div className="mb-6">
                            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-2">{property.title}</h1>
                            <div className="flex items-center gap-2 text-muted-foreground">
                                <MapPin className="h-4 w-4 md:h-5 md:w-5" />
                                <span className="text-sm md:text-base">{property.city}، {property.district}</span>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 mb-8">
                            <div className="flex items-center gap-3 p-3 bg-card border rounded-xl">
                                <div className="bg-primary/10 p-2 rounded-full text-primary"><Bed className="h-5 w-5" /></div>
                                <div><p className="text-sm text-muted-foreground">غرف نوم</p><p className="font-bold">{property.bedrooms}</p></div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-card border rounded-xl">
                                <div className="bg-primary/10 p-2 rounded-full text-primary"><Bath className="h-5 w-5" /></div>
                                <div><p className="text-sm text-muted-foreground">حمام</p><p className="font-bold">{property.bathrooms}</p></div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-card border rounded-xl">
                                <div className="bg-primary/10 p-2 rounded-full text-primary"><Square className="h-5 w-5" /></div>
                                <div><p className="text-sm text-muted-foreground">المساحة</p><p className="font-bold">{property.area_m2} م²</p></div>
                            </div>
                            <div className="flex items-center gap-3 p-3 bg-card border rounded-xl">
                                <div className="bg-primary/10 p-2 rounded-full text-primary"><span className="font-bold text-xs">طابق</span></div>
                                <div><p className="text-sm text-muted-foreground">الدور</p><p className="font-bold">{property.floor}</p></div>
                            </div>
                        </div>
                        <div className="mb-8">
                            <h2 className="text-xl font-bold mb-3">تفاصيل العقار</h2>
                            <p className="text-muted-foreground leading-relaxed whitespace-pre-line text-sm md:text-base">{property.description}</p>
                        </div>
                        {property.purpose === "sale" && <InstallmentCalculator price={property.price} />}

                        <div className="md:hidden border rounded-2xl p-5 bg-card mt-8 mb-4">
                            <div className="mb-4">
                                <span className="text-sm text-muted-foreground block mb-1">السعر المطلوب</span>
                                <div className="flex items-baseline gap-1">
                                    <span className="text-3xl font-bold text-primary">{property.price.toLocaleString("ar-EG")}</span>
                                    <span className="text-muted-foreground">ج.م</span>
                                </div>
                            </div>
                            <div className="space-y-3">
                                <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
                                    <Button className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 text-white gap-2"><MessageCircle className="h-5 w-5" />تواصل واتساب</Button>
                                </a>
                                <a href={`tel:${phoneToUse}`} className="block">
                                    <Button variant="outline" className="w-full py-6 text-lg gap-2 border-primary text-primary hover:bg-primary/5"><Phone className="h-5 w-5" />اتصال هاتفي</Button>
                                </a>
                                <div className="mt-3"><ViewingRequestDialog propertyId={property.id} /></div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="hidden md:block md:col-span-1">
                    <div className="sticky top-24 border rounded-2xl p-6 shadow-sm bg-card">
                        <div className="mb-6">
                            <span className="text-sm text-muted-foreground block mb-1">السعر المطلوب</span>
                            <div className="flex items-baseline gap-1">
                                <span className="text-3xl font-bold text-primary">{property.price.toLocaleString("ar-EG")}</span>
                                <span className="text-muted-foreground">ج.م</span>
                            </div>
                        </div>
                        <div className="space-y-3">
                            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block">
                                <Button className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 text-white gap-2"><MessageCircle className="h-5 w-5" />تواصل واتساب</Button>
                            </a>
                            <a href={`tel:${phoneToUse}`} className="block">
                                <Button variant="outline" className="w-full py-6 text-lg gap-2 border-primary text-primary hover:bg-primary/5"><Phone className="h-5 w-5" />اتصال هاتفي</Button>
                            </a>
                            <div className="mt-3"><ViewingRequestDialog propertyId={property.id} /></div>
                        </div>
                    </div>
                </div>
            </div>
            <SimilarProperties currentId={property.id} type={property.type} purpose={property.purpose} />
        </div>
    );
}