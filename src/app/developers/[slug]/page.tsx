import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import Image from "next/image";
import { ArrowRight, MapPin, Building2, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Metadata } from "next";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const resolvedParams = await params;
    const supabase = await createClient();
    const { data: developer } = await supabase.from("developers").select("name, description").eq("slug", resolvedParams.slug).single();

    if (!developer) return { title: "المطور غير موجود" };
    return { title: `${developer.name} | عقار مصر`, description: developer.description };
}

export default async function DeveloperDetailsPage({ params }: { params: Promise<{ slug: string }> }) {
    const resolvedParams = await params;
    const supabase = await createClient();

    // 1. جلب بيانات المطور
    const { data: developer } = await supabase
        .from("developers")
        .select("*")
        .eq("slug", resolvedParams.slug)
        .single();

    if (!developer) notFound();

    // 2. جلب الكومباوندات الخاصة بالمطور
    const { data: compounds } = await supabase
        .from("compounds")
        .select("*")
        .eq("developer_id", developer.id);

    return (
        <div className="container mx-auto px-4 py-12 max-w-6xl">
            <Link href="/developers" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-8">
                <ArrowRight className="h-4 w-4 ml-1" /> العودة للمطورين
            </Link>

            {/* كارت معلومات المطور */}
            <div className="bg-card border rounded-2xl p-6 md:p-10 mb-12 flex flex-col md:flex-row items-center md:items-start gap-8 shadow-sm">
                <div className="w-32 h-32 md:w-48 md:h-48 rounded-full overflow-hidden border-4 border-primary/20 shrink-0">
                    <Image
                        src={developer.logo_url || "/placeholder.jpg"}
                        alt={developer.name}
                        width={192}
                        height={192}
                        className="object-cover w-full h-full"
                    />
                </div>
                <div className="text-center md:text-right">
                    <h1 className="text-3xl md:text-5xl font-bold text-primary mb-4">{developer.name}</h1>
                    <p className="text-muted-foreground text-lg leading-relaxed max-w-3xl">
                        {developer.description}
                    </p>
                </div>
            </div>

            {/* مشاريع المطور */}
            <div>
                <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-primary" />
                    مشاريع و كومباوندات {developer.name}
                </h2>

                {compounds && compounds.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {compounds.map((compound) => (
                            <Link href={`/compounds/${compound.slug}`} key={compound.id}>
                                <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group bg-card border-border flex flex-col h-full">
                                    <div className="relative aspect-video overflow-hidden">
                                        <Image
                                            src={compound.cover_image_url || "/placeholder.jpg"}
                                            alt={compound.name}
                                            fill
                                            sizes="(max-width: 768px) 100vw, 33vw"
                                            className="object-cover group-hover:scale-105 transition-transform duration-500"
                                        />
                                    </div>
                                    <CardContent className="p-5 flex-1 flex flex-col">
                                        <h3 className="text-xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{compound.name}</h3>
                                        <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                                            <MapPin className="h-4 w-4" />
                                            <span>{compound.city}، {compound.district}</span>
                                        </div>
                                        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                                            {compound.description}
                                        </p>
                                        <div className="mt-auto space-y-2">
                                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                                <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                <span className="line-clamp-1">{compound.payment_plans}</span>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-16 bg-muted/20 rounded-xl border border-dashed">
                        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <p className="text-muted-foreground">لا توجد مشاريع مضافة لهذا المطور حالياً.</p>
                    </div>
                )}
            </div>
        </div>
    );
}