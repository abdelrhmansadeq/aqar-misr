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
    city: string;
    district: string;
    images: string[]; // هنفترض إنها روابط صور دلوقتي
    verified: boolean;
    created_at: string;
    image_url?: string;
    lat?: number | null;
    lng?: number | null;
};