export type Property = {
    id: string;
    title: string;
    slug: string;
    description: string;
    purpose: "sale" | "rent";
    type: "apartment" | "villa" | "land" | "shop" | "office" | "chalet";
    price: number;
    area_m2: number;
    bedrooms: number;
    bathrooms: number;
    floor: number;
    city: string;
    district: string;
    governorate: string;
    verified: boolean;
    created_at: string;
    updated_at?: string;
    status: string;
    image_url?: string | null;

    // ضفنا السطر ده عشان الكارت يعرف يقرأ الصور
    property_images?: { id: string; file_path: string; order: number }[] | null;

    lat?: number | null;
    lng?: number | null;
    video_url?: string | null;
    tour_url?: string | null;
    advertiser_id?: string;
    compound_id?: string | null;
    developer_id?: string | null;
    views?: number;
    whatsapp_clicks?: number;
    call_clicks?: number;
};