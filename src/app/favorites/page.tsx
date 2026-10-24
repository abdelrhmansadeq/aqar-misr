"use client";

import { useEffect, useState } from "react";
import { useFavorites } from "@/components/providers/favorites-provider";
import { createClient } from "@/lib/supabase/client";
import { PropertyCard } from "@/components/property/property-card";
import { Property } from "@/types/property";
import { HeartCrack, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function FavoritesPage() {
    const { favorites, isMounted, clearFavorites } = useFavorites();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        if (!isMounted) return;

        async function fetchFavorites() {
            if (favorites.length === 0) {
                setProperties([]);
                setLoading(false);
                return;
            }

            const { data } = await supabase
                .from("properties")
                .select("*, property_images (id, file_path, order)")
                .in("id", favorites);

            if (data) setProperties(data as Property[]);
            setLoading(false);
        }

        fetchFavorites();
    }, [favorites, isMounted, supabase]);

    if (!isMounted || loading) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <p className="text-muted-foreground animate-pulse">جاري تحميل المفضلة...</p>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 min-h-[60vh]">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">عقاراتي المفضلة</h1>
                    <p className="text-muted-foreground">لديك {properties.length} عقار محفوظ.</p>
                </div>
                {properties.length > 0 && (
                    <Button variant="outline" onClick={clearFavorites} className="text-destructive border-destructive hover:bg-destructive/10 gap-2">
                        <Trash2 className="h-4 w-4" /> مسح الكل
                    </Button>
                )}
            </div>

            {properties.length === 0 ? (
                <div className="text-center py-20 bg-muted/20 rounded-xl border border-dashed">
                    <HeartCrack className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                    <h2 className="text-xl font-bold mb-2">قائمة المفضلة فارغة</h2>
                    <p className="text-muted-foreground mb-6">لم تقم بإضافة أي عقار للمفضلة حتى الآن.</p>
                    <Link href="/properties">
                        <Button>تصفح العقارات الآن</Button>
                    </Link>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {properties.map((property) => (
                        <PropertyCard key={property.id} property={property} />
                    ))}
                </div>
            )}
        </div>
    );
}