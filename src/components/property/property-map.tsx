"use client";

import dynamic from "next/dynamic";
import { Property } from "@/types/property";
import { Skeleton } from "@/components/ui/skeleton";

// بنستورد الخريطة ديناميكياً عشان نتجنب مشكلة السيرفر
const MapComponent = dynamic(() => import("./map-component"), {
    ssr: false,
    loading: () => (
        <div className="w-full h-[600px] rounded-xl border bg-muted flex items-center justify-center">
            <p className="text-muted-foreground animate-pulse">جاري تحميل الخريطة...</p>
        </div>
    ),
});

export function PropertyMap({ properties }: { properties: Property[] }) {
    return <MapComponent properties={properties} />;
}