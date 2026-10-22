import { createClient } from "@/lib/supabase/server";
import { PropertyForm } from "@/components/admin/property-form";
import { ArrowRight } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Property } from "@/types/property";

export default async function EditPropertyPage({ params }: { params: Promise<{ id: string }> }) {
    const resolvedParams = await params;
    const supabase = await createClient();

    const { data: property } = await supabase
        .from("properties")
        .select("*")
        .eq("id", resolvedParams.id)
        .single();

    if (!property) notFound();

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/aqar-ax6admin/properties" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowRight className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">تعديل العقار</h1>
                    <p className="text-sm text-muted-foreground">قم بتحديث بيانات العقار.</p>
                </div>
            </div>

            <PropertyForm initialData={property as Property} />
        </div>
    );
}