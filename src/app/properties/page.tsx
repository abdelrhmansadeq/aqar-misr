import { Suspense } from "react";
import PropertyList from "@/components/property/property-list";

export default function PropertiesPage() {
    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">تصفح العقارات</h1>
                <p className="text-muted-foreground">ابحث عن العقار المناسب لك بسهولة.</p>
            </div>

            {/* هنا نغلف المكون الداخلي بـ Suspense */}
            <Suspense fallback={<div className="text-center py-20 text-muted-foreground">جاري تحميل الفلاتر...</div>}>
                <PropertyList />
            </Suspense>
        </div>
    );
}