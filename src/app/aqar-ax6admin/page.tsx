import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, CalendarDays, Eye, PlusCircle, ArrowLeft, Building2, User } from "lucide-react";
import { DashboardCharts } from "@/components/admin/dashboard-charts";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // 1. جلب الأعداد الأساسية
    const { count: propertiesCount } = await supabase.from("properties").select("*", { count: "exact", head: true });
    const { count: usersCount } = await supabase.from("profiles").select("*", { count: "exact", head: true });
    const { count: leadsCount } = await supabase.from("leads").select("*", { count: "exact", head: true });

    // ✅ إضافة: جلب عدد الزيارات الحقيقي من جدول السجلات
    const { count: viewsCount } = await supabase.from("property_views_log").select("*", { count: "exact", head: true });

    // 2. جلب بيانات العقارات للرسوم البيانية
    const { data: properties } = await supabase.from("properties").select("purpose, type");

    // 3. جلب أحدث 5 عقارات
    const { data: latestProperties } = await supabase
        .from("properties")
        .select("id, title, price, created_at, status")
        .order("created_at", { ascending: false })
        .limit(5);

    // 4. جلب أحدث 5 طلبات معاينة
    const { data: latestLeads } = await supabase
        .from("leads")
        .select("id, name, phone, status, created_at")
        .eq("name", "تنبيه بحث") // بنستبعد طلبات التنبيه عشان نعرض طلبات المعاينة بس
        .neq("name", "تنبيه بحث") // (للتأكيد)
        .order("created_at", { ascending: false })
        .limit(5);

    let saleCount = 0;
    let rentCount = 0;
    const typeCounts: Record<string, number> = {};

    properties?.forEach((prop) => {
        if (prop.purpose === "sale") saleCount++;
        if (prop.purpose === "rent") rentCount++;
        typeCounts[prop.type] = (typeCounts[prop.type] || 0) + 1;
    });

    const purposeData = [
        { name: "للبيع", value: saleCount },
        { name: "للإيجار", value: rentCount },
    ];

    const typeTranslations: Record<string, string> = {
        apartment: "شقة", villa: "فيلا", land: "أرض", shop: "محل", office: "مكتب", chalet: "شاليه"
    };

    const typeData = Object.keys(typeCounts).map(key => ({
        name: typeTranslations[key] || key,
        value: typeCounts[key]
    }));

    return (
        <div className="space-y-8 animate-fade-in-up">

            {/* قسم الترحيب */}
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between bg-card p-6 rounded-2xl border shadow-sm">
                <div>
                    <h1 className="text-2xl font-bold text-foreground mb-1">أهلاً بك، عبدالرحمن 👋</h1>
                    <p className="text-muted-foreground">إليك نظرة سريعة على ما يحدث في موقعك اليوم.</p>
                </div>
                <div className="flex gap-3 mt-4 md:mt-0">
                    <Link href="/aqar-ax6admin/properties/new">
                        <Button className="gap-2">
                            <PlusCircle className="h-4 w-4" /> إضافة عقار
                        </Button>
                    </Link>
                    <Link href="/">
                        <Button variant="outline" className="gap-2">
                            <Building2 className="h-4 w-4" /> عرض الموقع
                        </Button>
                    </Link>
                </div>
            </div>

            {/* الكروت الإحصائية */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <Card className="bg-card hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">إجمالي العقارات</CardTitle>
                        <div className="p-2 bg-blue-500/10 rounded-full">
                            <Home className="h-4 w-4 text-blue-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{propertiesCount || 0}</div>
                    </CardContent>
                </Card>

                <Card className="bg-card hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">طلبات المعاينة</CardTitle>
                        <div className="p-2 bg-amber-500/10 rounded-full">
                            <CalendarDays className="h-4 w-4 text-amber-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{leadsCount || 0}</div>
                    </CardContent>
                </Card>

                <Card className="bg-card hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">المستخدمين</CardTitle>
                        <div className="p-2 bg-green-500/10 rounded-full">
                            <Users className="h-4 w-4 text-green-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-bold">{usersCount || 0}</div>
                    </CardContent>
                </Card>

                <Card className="bg-card hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">الزيارات</CardTitle>
                        <div className="p-2 bg-purple-500/10 rounded-full">
                            <Eye className="h-4 w-4 text-purple-500" />
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* ✅ هنا بنعرض عدد الزيارات الحقيقي */}
                        <div className="text-3xl font-bold">{viewsCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">إجمالي مشاهدات العقارات</p>
                    </CardContent>
                </Card>
            </div>

            {/* الرسوم البيانية */}
            <DashboardCharts purposeData={purposeData} typeData={typeData} />

            {/* أحدث العقارات وأحدث الطلبات */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* أحدث العقارات */}
                <Card className="bg-card shadow-sm border-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">أحدث العقارات المضافة</CardTitle>
                        <Link href="/aqar-ax6admin/properties" className="text-sm text-primary hover:underline flex items-center gap-1">
                            عرض الكل <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {latestProperties?.map(prop => (
                                <div key={prop.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-primary/10 p-2 rounded-md"><Home className="h-4 w-4 text-primary" /></div>
                                        <div>
                                            <p className="text-sm font-bold line-clamp-1">{prop.title}</p>
                                            <p className="text-xs text-muted-foreground">{prop.price.toLocaleString('ar-EG')} ج.م</p>
                                        </div>
                                    </div>
                                    <Badge variant={prop.status === 'published' ? 'default' : 'secondary'}>
                                        {prop.status === 'published' ? 'منشور' : 'مسودة'}
                                    </Badge>
                                </div>
                            ))}
                            {(!latestProperties || latestProperties.length === 0) && (
                                <p className="text-sm text-muted-foreground text-center py-4">لا توجد عقارات مضافة.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* أحدث طلبات المعاينة */}
                <Card className="bg-card shadow-sm border-border">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">أحدث طلبات المعاينة</CardTitle>
                        <Link href="/aqar-ax6admin/leads" className="text-sm text-primary hover:underline flex items-center gap-1">
                            عرض الكل <ArrowLeft className="h-4 w-4" />
                        </Link>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {latestLeads?.map(lead => (
                                <div key={lead.id} className="flex items-center justify-between p-3 bg-muted/30 rounded-lg">
                                    <div className="flex items-center gap-3">
                                        <div className="bg-amber-500/10 p-2 rounded-md"><User className="h-4 w-4 text-amber-500" /></div>
                                        <div>
                                            <p className="text-sm font-bold">{lead.name}</p>
                                            <p className="text-xs text-muted-foreground dir-ltr text-right">{lead.phone}</p>
                                        </div>
                                    </div>
                                    <Badge variant={lead.status === 'new' ? 'default' : 'secondary'}>
                                        {lead.status === 'new' ? 'جديد' : 'تم التواصل'}
                                    </Badge>
                                </div>
                            ))}
                            {(!latestLeads || latestLeads.length === 0) && (
                                <p className="text-sm text-muted-foreground text-center py-4">لا توجد طلبات معاينة.</p>
                            )}
                        </div>
                    </CardContent>
                </Card>

            </div>

        </div>
    );
}