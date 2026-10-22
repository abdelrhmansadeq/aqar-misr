import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Bed, Bath, Square, Phone, MessageCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { generateWhatsAppLink } from "@/lib/utils/whatsapp";
import { InstallmentCalculator } from "@/components/property/installment-calculator";
import { ViewingRequestDialog } from "@/components/property/viewing-request-dialog";

export default async function PropertyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const supabase = await createClient();

    const { data: property } = await supabase
        .from("properties")
        .select(`
      *,
      profiles:advertiser_id (phone)
    `)
        .eq("id", resolvedParams.id)
        .single();

    if (!property) notFound();

    const imageUrl = property.image_url || "/placeholder.jpg";
    const advertiserPhone = Array.isArray(property.profiles) ? property.profiles[0]?.phone : property.profiles?.phone;
    const phoneToUse = advertiserPhone || "01000000000";
    const whatsappLink = generateWhatsAppLink(phoneToUse, property.title, property.id);

    return (
        <div className="container mx-auto px-0 md:px-4 py-0 md:py-8 max-w-5xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">

                {/* الجزء الأيسر (الصور والتفاصيل) */}
                <div className="md:col-span-2 space-y-6">
                    <div className="relative aspect-[4/3] md:aspect-video w-full overflow-hidden md:rounded-2xl bg-muted">
                        <Image src={imageUrl} alt={property.title} fill className="object-cover" priority />
                        <div className="absolute top-4 right-4 flex gap-2">
                            {property.verified && (
                                <Badge className="bg-green-600 text-white border-0 px-3 py-1 text-sm flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4" /> موثق
                                </Badge>
                            )}
                            <Badge variant="secondary" className="px-3 py-1 text-sm bg-background/90 text-foreground">
                                {property.purpose === "sale" ? "للبيع" : "للإيجار"}
                            </Badge>
                        </div>
                    </div>

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

                        {/* حاسبة الأقساط (تظهر لو العقار للبيع بس) */}
                        {property.purpose === "sale" && (
                            <InstallmentCalculator price={property.price} />
                        )}

                        {/* أزرار التواصل للموبايل */}
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
                                {/* زرار حجز المعاينة في الموبايل */}
                                <div className="mt-3">
                                    <ViewingRequestDialog propertyId={property.id} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* الجزء الأيمن (للكمبيوتر) */}
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
                            {/* زرار حجز المعاينة في الكمبيوتر */}
                            <div className="mt-3">
                                <ViewingRequestDialog propertyId={property.id} />
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
}