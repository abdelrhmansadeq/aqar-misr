import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, CalendarDays, Eye } from "lucide-react";
import { DashboardCharts } from "@/components/admin/dashboard-charts";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // 1. جلب الأعداد الأساسية
    const { count: propertiesCount } = await supabase.from("properties").select("*", { count: "exact", head: true });
    const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
    const { count: leadsCount } = await supabase.from("leads").select("*", { count: "exact", head: true });

    // 2. جلب بيانات العقارات لعمل الرسوم البيانية
    const { data: properties } = await supabase.from("properties").select("purpose, type");

    // حساب الغرض (بيع/إيجار)
    let saleCount = 0;
    let rentCount = 0;

    // حساب الأنواع
    const typeCounts: Record<string, number> = {};

    properties?.forEach((prop) => {
        // الغرض
        if (prop.purpose === "sale") saleCount++;
        if (prop.purpose === "rent") rentCount++;

        // النوع
        typeCounts[prop.type] = (typeCounts[prop.type] || 0) + 1;
    });

    const purposeData = [
        { name: "للبيع", value: saleCount },
        { name: "للإيجار", value: rentCount },
    ];

    // تحويل أسماء الأنواع للعربي
    const typeTranslations: Record<string, string> = {
        apartment: "شقة",
        villa: "فيلا",
        land: "أرض",
        shop: "محل",
        office: "مكتب",
        chalet: "شاليه"
    };

    const typeData = Object.keys(typeCounts).map(key => ({
        name: typeTranslations[key] || key,
        value: typeCounts[key]
    }));

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">نظرة عامة</h1>

            {/* الكروت العلوية */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">إجمالي العقارات</CardTitle>
                        <Home className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{propertiesCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">عقار مسجل</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">طلبات المعاينة</CardTitle>
                        <CalendarDays className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{leadsCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">طلب مستلم</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">المستخدمين</CardTitle>
                        <Users className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{usersCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">مستخدم مسجل</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">زيارات اليوم</CardTitle>
                        <Eye className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">0</div>
                        <p className="text-xs text-muted-foreground mt-1">هنفعلها بعدين</p>
                    </CardContent>
                </Card>
            </div>

            {/* الرسوم البيانية */}
            <DashboardCharts purposeData={purposeData} typeData={typeData} />

        </div>
    );
}