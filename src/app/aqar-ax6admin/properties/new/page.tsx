import { PropertyForm } from "@/components/admin/property-form";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function NewPropertyPage() {
    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4">
                <Link href="/aqar-ax6admin/properties" className="p-2 hover:bg-muted rounded-full transition-colors">
                    <ArrowRight className="h-5 w-5" />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">إضافة عقار جديد</h1>
                    <p className="text-sm text-muted-foreground">أدخل تفاصيل العقار وارفع الصور لإضافته للموقع.</p>
                </div>
            </div>

            <PropertyForm />
        </div>
    );
}