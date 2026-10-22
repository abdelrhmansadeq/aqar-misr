"use client"; // حولنا الصفحة لـ Client عشان نقدر نستخدم الـ State للتبديل

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyFilters } from "@/components/property/property-filters";
import { PropertyMap } from "@/components/property/property-map";
import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Map as MapIcon } from "lucide-react";

export default function PropertiesPage() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [viewMode, setViewMode] = useState<"list" | "map">("list");
    const supabase = createClient();

    // هنقرأ الفلاتر من الرابط يدوياً عشان الصفحة بقت Client
    useEffect(() => {
        async function fetchProperties() {
            setLoading(true);
            const searchParams = new URLSearchParams(window.location.search);

            let query = supabase.from("properties").select("*").eq("status", "published");

            if (searchParams.get("purpose") && searchParams.get("purpose") !== "all") query = query.eq("purpose", searchParams.get("purpose")!);
            if (searchParams.get("type") && searchParams.get("type") !== "all") query = query.eq("type", searchParams.get("type")!);
            if (searchParams.get("city")) query = query.ilike("city", `%${searchParams.get("city")}%`);
            if (searchParams.get("minPrice")) query = query.gte("price", Number(searchParams.get("minPrice")));
            if (searchParams.get("maxPrice")) query = query.lte("price", Number(searchParams.get("maxPrice")));

            const { data } = await query.order("created_at", { ascending: false });
            if (data) setProperties(data as Property[]);
            setLoading(false);
        }

        fetchProperties();
    }, [supabase]);

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-primary mb-2">تصفح العقارات</h1>
                    <p className="text-muted-foreground">ابحث عن العقار المناسب لك بسهولة.</p>
                </div>

                {/* أزرار التبديل بين القائمة والخريطة */}
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

            <div className="flex flex-col md:flex-row gap-8">
                <aside className="w-full md:w-64 shrink-0">
                    <PropertyFilters />
                </aside>

                <div className="flex-1">
                    {loading ? (
                        <div className="text-center py-20">جاري التحميل...</div>
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
        </div>
    );
}