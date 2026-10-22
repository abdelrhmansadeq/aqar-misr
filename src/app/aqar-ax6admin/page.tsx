import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Home, Users, Eye } from "lucide-react";

export default async function AdminDashboard() {
    const supabase = await createClient();

    // جلب عدد العقارات
    const { count: propertiesCount } = await supabase
        .from("properties")
        .select("*", { count: "exact", head: true });

    // جلب عدد المستخدمين
    const { count: usersCount } = await supabase
        .from("profiles")
        .select("*", { count: "exact", head: true });

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold">نظرة عامة</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">إجمالي العقارات</CardTitle>
                        <Home className="h-4 w-4 text-muted-foreground" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{propertiesCount || 0}</div>
                        <p className="text-xs text-muted-foreground mt-1">عقار مسجل في النظام</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-sm font-medium">إجمالي المستخدمين</CardTitle>
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
        </div>
    );
}