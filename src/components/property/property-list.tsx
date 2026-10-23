"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyFilters } from "@/components/property/property-filters";
import { PropertyMap } from "@/components/property/property-map";
import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Map as MapIcon } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { PropertySkeleton } from "@/components/property/property-skeleton";

export default function PropertyList() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"list" | "map">("list");
    const supabase = createClient();
    const searchParams = useSearchParams();

    useEffect(() => {
        async function fetchProperties() {
            setLoading(true);

            let query = supabase.from("properties").select("*").eq("status", "published");

            const purpose = searchParams.get("purpose");
            const type = searchParams.get("type");
            const city = searchParams.get("city");
            const minPrice = searchParams.get("minPrice");
            const maxPrice = searchParams.get("maxPrice");

            if (purpose && purpose !== "all") query = query.eq("purpose", purpose);
            if (type && type !== "all") query = query.eq("type", type);
            if (city) query = query.ilike("city", `%${city}%`);
            if (minPrice) query = query.gte("price", Number(minPrice));
            if (maxPrice) query = query.lte("price", Number(maxPrice));

            const { data } = await query.order("created_at", { ascending: false });
            if (data) setProperties(data as Property[]);
            setLoading(false);
        }

        // void عشان نمنع تحذير الـ Promise
        void fetchProperties();
    }, [supabase, searchParams]);

    return (
        <div className="flex flex-col md:flex-row gap-8">
            <aside className="w-full md:w-64 shrink-0">
                <PropertyFilters />
            </aside>

            <div className="flex-1">
                <div className="flex justify-end mb-4">
                    <div className="flex bg-muted p-1 rounded-lg">
                        <Button
                            variant={viewMode === "list" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("list")}
                            className="gap-2"
                        >
                            <LayoutGrid className="h-4 w-4" /> قائمة
                        </Button>
                        <Button
                            variant={viewMode === "map" ? "default" : "ghost"}
                            size="sm"
                            onClick={() => setViewMode("map")}
                            className="gap-2"
                        >
                            <MapIcon className="h-4 w-4" /> خريطة
                        </Button>
                    </div>
                </div>

                {loading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <PropertySkeleton key={i} />
                        ))}
                    </div>
                ) : viewMode === "map" ? (
                    <PropertyMap properties={properties} />
                ) : properties && properties.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {properties.map((property) => (
                            <PropertyCard key={property.id} property={property} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-muted/20 rounded-xl">
                        <h3 className="text-xl font-bold mb-2">لا توجد نتائج مطابقة</h3>
                        <p className="text-muted-foreground">جرب تغيير معايير البحث أو إزالة بعض الفلاتر.</p>
                    </div>
                )}
            </div>
        </div>
    );
}