import { MetadataRoute } from 'next'
import { createClient } from "@/lib/supabase/server";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const supabase = await createClient();

    // جلب كل العقارات المنشورة
    const { data: properties } = await supabase
        .from("properties")
        .select("id, updated_at")
        .eq("status", "published");

    const propertyUrls = (properties || []).map((prop) => ({
        url: `https://aqar-misr-six.vercel.app/properties/${prop.id}`, // تم تحديث اللينك
        lastModified: new Date(prop.updated_at || new Date()),
        changeFrequency: 'daily' as const,
        priority: 0.8,
    }));

    return [
        {
            url: 'https://aqar-misr-six.vercel.app', // تم تحديث اللينك
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: 'https://aqar-misr-six.vercel.app/properties', // تم تحديث اللينك
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        ...propertyUrls,
    ]
}