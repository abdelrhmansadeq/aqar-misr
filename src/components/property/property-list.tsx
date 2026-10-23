"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { createClient } from "@/lib/supabase/client";
import { PropertyCard } from "@/components/property/property-card";
import { PropertyFilters } from "@/components/property/property-filters";
import { PropertyMap } from "@/components/property/property-map";
import { Property } from "@/types/property";
import { Button } from "@/components/ui/button";
import { LayoutGrid, Map as MapIcon, Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { PropertySkeleton } from "@/components/property/property-skeleton";

const LIMIT = 10;

export default function PropertyList() {
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
    const [page, setPage] = useState(0);
    const [hasMore, setHasMore] = useState(true);
    const [viewMode, setViewMode] = useState<"list" | "map">("list");

    // التعديل 1: استخدام useMemo عشان نعمل الكلاينت مرة واحدة بس وميتعملش مع كل ريفريش
    const supabase = useMemo(() => createClient(), []);
    const searchParams = useSearchParams();

    const observerTarget = useRef(null);

    const fetchProperties = useCallback(async (pageNumber: number, isNewSearch = false) => {
        if (isNewSearch) {
            setLoading(true);
            setProperties([]);
            setPage(0);
            setHasMore(true);
        } else {
            setLoadingMore(true);
        }

        const from = pageNumber * LIMIT;
        const to = from + LIMIT - 1;

        let query = supabase.from("properties").select("*, property_images (id, file_path, order)").eq("status", "published");

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

        const { data, error } = await query
            .order("created_at", { ascending: false })
            .range(from, to);

        if (!error && data) {
            if (isNewSearch) {
                setProperties(data as Property[]);
            } else {
                setProperties((prev) => [...prev, ...(data as Property[])]);
            }

            // التعديل 2: بنزود رقم الصفحة بس لو الداتا رجعت بنجاح
            if (!isNewSearch) {
                setPage(pageNumber);
            }

            if (data.length < LIMIT) {
                setHasMore(false);
            }
        }

        setLoading(false);
        setLoadingMore(false);
    }, [supabase, searchParams]);

    useEffect(() => {
        void fetchProperties(0, true);
    }, [fetchProperties]);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                // التعديل 3: بنبعت الرقم اللي بعده بس ومش بنحدث الـ state هنا
                if (entries[0].isIntersecting && hasMore && !loading && !loadingMore) {
                    void fetchProperties(page + 1, false);
                }
            },
            { threshold: 1.0 }
        );

        const currentTarget = observerTarget.current;
        if (currentTarget) {
            observer.observe(currentTarget);
        }

        return () => {
            if (currentTarget) {
                observer.unobserve(currentTarget);
            }
        };
    }, [hasMore, loading, loadingMore, page, fetchProperties]);

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
                ) : properties.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {properties.map((property) => (
                                <PropertyCard key={property.id} property={property} />
                            ))}
                        </div>

                        <div ref={observerTarget} className="mt-10 flex justify-center py-4">
                            {loadingMore && (
                                <div className="flex items-center gap-2 text-muted-foreground">
                                    <Loader2 className="h-6 w-6 animate-spin text-primary" />
                                    <span>جاري تحميل المزيد...</span>
                                </div>
                            )}
                            {!hasMore && properties.length > 0 && (
                                <p className="text-muted-foreground text-sm">لقد وصلت لنهاية النتائج.</p>
                            )}
                        </div>
                    </>
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