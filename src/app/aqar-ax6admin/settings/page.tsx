import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { SettingsForm } from "@/components/admin/settings-form";

export default async function AdminSettingsPage() {
    const supabase = await createClient();

    const { data: settings } = await supabase
        .from("site_settings")
        .select("*")
        .limit(1)
        .single();

    return (
        <div className="space-y-6 max-w-2xl mx-auto">
            <div>
                <h1 className="text-2xl font-bold">إعدادات الموقع</h1>
                <p className="text-muted-foreground">تحكم في بيانات التواصل الأساسية للموقع.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>بيانات التواصل</CardTitle>
                    <CardDescription>
                        هذه البيانات تظهر للزوار في صفحة «اتصل بنا» وفي زرار الواتساب العائم.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SettingsForm initialData={settings} />
                </CardContent>
            </Card>
        </div>
    );
}