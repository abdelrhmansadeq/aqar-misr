"use client";

import { useEffect } from "react";
import { createClient } from "@/lib/supabase/client";

export function PropertyViewTracker({ propertyId }: { propertyId: string }) {
    const supabase = createClient();

    useEffect(() => {
        // بننادي على الدالة اللي عملناها في السوبابيز
        const trackView = async () => {
            await supabase.rpc("increment_property_view", { prop_id: propertyId });
        };

        // بنشغلها أول ما الصفحة تفتح
        void trackView();
    }, [propertyId, supabase]);

    return null; // المكون ده مش بيعرض حاجة على الشاشة
}