import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import { Building2 } from "lucide-react";

export default async function DevelopersPage() {
    const supabase = await createClient();
    const { data: developers } = await supabase.from("developers").select("*");

    return (
        <div className="container mx-auto px-4 py-12">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-primary mb-4">شركات التطوير العقاري</h1>
                <p className="text-muted-foreground text-lg">تعرف على أكبر المطورين العقاريين في مصر ومشاريعهم.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {developers?.map((dev) => (
                    <Card key={dev.id} className="hover:shadow-lg transition-all duration-300 group bg-card border-border flex flex-col items-center p-6 text-center">
                        <div className="w-24 h-24 rounded-full overflow-hidden mb-4 border-2 border-primary/20 group-hover:border-primary transition-colors">
                            <Image src={dev.logo_url || "/placeholder.jpg"} alt={dev.name} width={96} height={96} className="object-cover" />
                        </div>
                        <h3 className="text-xl font-bold mb-2">{dev.name}</h3>
                        <p className="text-muted-foreground text-sm line-clamp-3 mb-6">{dev.description}</p>
                        <div className="mt-auto w-full">
                            <button className="w-full bg-primary/10 text-primary font-semibold py-2 rounded-lg hover:bg-primary hover:text-white transition-colors">
                                عرض المشاريع (قريباً)
                            </button>
                        </div>
                    </Card>
                ))}
                {(!developers || developers.length === 0) && (
                    <div className="col-span-full text-center py-20">
                        <Building2 className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <p className="text-muted-foreground">لا يوجد مطورين مضافين حالياً.</p>
                    </div>
                )}
            </div>
        </div>
    );
}