import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { MapPin, Building2, CheckCircle2, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { PropertyCard } from "@/components/property/property-card";
import { Property } from "@/types/property";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const supabase = await createClient();
    const { data: compound } = await supabase.from("compounds").select("name, description").eq("slug", resolvedParams.slug).single();

    if (!compound) return { title: "الكومباوند غير موجود" };
    return { title: `${compound.name} | عقار مصر`, description: compound.description };
}

export default async function CompoundDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const supabase = await createClient();

    const { data: compound } = await supabase
        .from("compounds")
        .select(`
      *,
      developers:developer_id (name, logo_url, description)
    `)
        .eq("slug", resolvedParams.slug)
        .single();

    if (!compound) notFound();

    const { data: properties } = await supabase
        .from("properties")
        .select(`*, property_images (id, file_path, order)`)
        .eq("compound_id", compound.id)
        .eq("status", "published");

    const developer = Array.isArray(compound.developers) ? compound.developers[0] : compound.developers;

    return (
        <div className="container mx-auto px-0 md:px-4 py-0 md:py-8 max-w-6xl">
            <Link href="/compounds" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4 px-4 md:px-0">
                <ArrowRight className="h-4 w-4 ml-1" /> العودة للكومباوندات
            </Link>

            <div className="relative w-full aspect-video md:rounded-2xl overflow-hidden mb-8">
                <Image
                    src={compound.cover_image_url || "/placeholder.jpg"}
                    alt={compound.name}
                    fill
                    priority
                    sizes="(max-width: 1200px) 100vw, 1200px"
                    className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6 md:p-10">
                    <Badge className="w-fit mb-3 bg-primary text-primary-foreground">{compound.city}، {compound.district}</Badge>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-2">{compound.name}</h1>
                    <p className="text-white/80 text-lg md:text-xl">{developer?.name || "مطور عقاري"}</p>
                </div>
            </div>

            <div className="px-4 md:px-0 grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 space-y-8">
                    <section>
                        <h2 className="text-2xl font-bold mb-3 border-b pb-2">عن المشروع</h2>
                        <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{compound.description}</p>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3 border-b pb-2">المرافق والخدمات</h2>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {compound.amenities?.map((amenity: string, i: number) => (
                                <div key={i} className="flex items-center gap-2 bg-card p-3 rounded-lg border">
                                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                                    <span className="text-sm font-medium">{amenity}</span>
                                </div>
                            ))}
                        </div>
                    </section>

                    <section>
                        <h2 className="text-2xl font-bold mb-3 border-b pb-2">أنظمة الدفع</h2>
                        <div className="bg-primary/5 border border-primary/20 p-5 rounded-xl">
                            <p className="font-medium text-lg">{compound.payment_plans}</p>
                        </div>
                    </section>
                </div>

                <div>
                    <div className="sticky top-24 border rounded-2xl p-6 shadow-sm bg-card">
                        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                            <Building2 className="h-5 w-5 text-primary" /> المطور العقاري
                        </h3>
                        <div className="flex items-center gap-4 mb-4">
                            <div className="w-16 h-16 rounded-full overflow-hidden border">
                                <Image src={developer?.logo_url || "/placeholder.jpg"} alt={developer?.name} width={64} height={64} className="object-cover" />
                            </div>
                            <div>
                                <p className="font-bold">{developer?.name}</p>
                            </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-4 mb-4">{developer?.description}</p>
                        <Link href={`/developers/${developer?.name}`}>
                            <button className="w-full bg-primary text-primary-foreground py-2 rounded-lg hover:bg-primary/90 transition-colors text-sm font-medium">
                                عرض كل مشاريع المطور
                            </button>
                        </Link>
                    </div>
                </div>
            </div>

            <div className="px-4 md:px-0 mt-16 pt-8 border-t">
                <h2 className="text-2xl font-bold mb-6">عقارات متاحة في {compound.name}</h2>
                {properties && properties.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map((prop) => (
                            <PropertyCard key={prop.id} property={prop as Property} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-muted/20 rounded-xl">
                        <p className="text-muted-foreground">لا توجد عقارات متاحة في هذا الكومباوند حالياً.</p>
                    </div>
                )}
            </div>
        </div>
    );
}