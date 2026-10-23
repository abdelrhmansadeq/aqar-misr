import { createClient } from "@/lib/supabase/server";
import { PropertyCard } from "./property-card";
import { Property } from "@/types/property";

export async function SimilarProperties({
                                            currentId,
                                            type,
                                            purpose
                                        }: {
    currentId: string;
    type: string;
    purpose: string;
}) {
    const supabase = await createClient();

    // بنجيب 3 عقارات بنفس النوع والغرض، ما عدا العقار الحالي
    const { data: properties } = await supabase
        .from("properties")
        .select("*")
        .eq("status", "published")
        .eq("type", type)
        .eq("purpose", purpose)
        .neq("id", currentId)
        .limit(3);

    if (!properties || properties.length === 0) return null;

    return (
        <div className="mt-16 pt-8 border-t">
            <h2 className="text-2xl font-bold text-primary mb-6">عقارات مشابهة قد تعجبك</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {properties.map((prop) => (
                    <PropertyCard key={prop.id} property={prop as Property} />
                ))}
            </div>
        </div>
    );
}