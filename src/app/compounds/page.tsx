import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { MapPin, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";

export default async function CompoundsPage() {
    const supabase = await createClient();

    const { data: compounds } = await supabase
        .from("compounds")
        .select(`
      *,
      developers:developer_id (name)
    `);

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-primary mb-4">الكومباوندات والمشاريع</h1>
                <p className="text-muted-foreground text-lg">اكتشف أفضل المشاريع السكنية في مصر.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {compounds?.map((compound) => {
                    const developerName = Array.isArray(compound.developers)
                        ? compound.developers[0]?.name
                        : compound.developers?.name;

                    return (
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
                                    <div className="absolute top-3 right-3">
                                        <Badge className="bg-primary/90 text-primary-foreground backdrop-blur-sm">
                                            {developerName || "مطور عقاري"}
                                        </Badge>
                                    </div>
                                </div>
                                <CardContent className="p-5 flex-1 flex flex-col">
                                    <h3 className="text-2xl font-bold mb-2 text-foreground group-hover:text-primary transition-colors">{compound.name}</h3>
                                    <div className="flex items-center gap-2 text-muted-foreground text-sm mb-4">
                                        <MapPin className="h-4 w-4" />
                                        <span>{compound.city}، {compound.district}</span>
                                    </div>

                                    <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
                                        {compound.description}
                                    </p>

                                    <div className="space-y-2 mt-auto">
                                        <div className="flex items-start gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                            <span className="text-muted-foreground line-clamp-1"><strong className="text-foreground">المرافق:</strong> {compound.amenities?.join('، ')}</span>
                                        </div>
                                        <div className="flex items-start gap-2 text-sm">
                                            <CheckCircle2 className="h-4 w-4 text-green-500 mt-0.5 shrink-0" />
                                            <span className="text-muted-foreground line-clamp-1"><strong className="text-foreground">أنظمة الدفع:</strong> {compound.payment_plans}</span>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}