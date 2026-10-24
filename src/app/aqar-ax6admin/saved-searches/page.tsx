import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Bell, Search, Phone } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default async function AdminSavedSearchesPage() {
    const supabase = await createClient();

    // بنجيب الطلبات اللي نوعها "تنبيه بحث" بس
    const { data: searches } = await supabase
        .from("leads")
        .select("*")
        .eq("name", "تنبيه بحث")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">البحثات المحفوظة</h1>
                    <p className="text-muted-foreground text-sm">الزوار اللي طلبوا تنبيهات لعقارات معينة.</p>
                </div>
                <Badge variant="secondary">{searches?.length || 0} طلب</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {searches?.map((search) => {
                    // بنستخرج الفلاتر من الرسالة اللي حفظناها
                    let filtersText = "بحث مخصص";
                    if (search.message) {
                        try {
                            const filters = JSON.parse(search.message.replace("طلب تنبيهات للبحث: ", ""));
                            const parts = [];
                            if (filters.purpose && filters.purpose !== "all") parts.push(filters.purpose === "sale" ? "للبيع" : "للإيجار");
                            if (filters.type && filters.type !== "all") {
                                const types: Record<string, string> = { apartment: "شقة", villa: "فيلا", land: "أرض", office: "مكتب" };
                                parts.push(types[filters.type] || filters.type);
                            }
                            if (filters.city) parts.push(`في ${filters.city}`);
                            filtersText = parts.join(" - ") || "كل العقارات";
                        } catch (e) {
                            // لو مفيش فلاتر
                        }
                    }

                    return (
                        <Card key={search.id} className="bg-card">
                            <CardContent className="p-5 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="flex items-center gap-2 font-bold text-primary">
                                        <Search className="h-5 w-5" />
                                        {filtersText}
                                    </div>
                                </div>

                                <div className="bg-muted/50 p-3 rounded-lg flex items-center justify-between text-sm">
                                    <span className="text-muted-foreground">رقم الزائر:</span>
                                    <span className="font-bold dir-ltr" dir="ltr">{search.phone}</span>
                                </div>

                                <a href={`tel:${search.phone}`} className="block">
                                    <Button className="w-full gap-2" variant="outline">
                                        <Phone className="h-4 w-4" /> اتصل بالزائر
                                    </Button>
                                </a>
                            </CardContent>
                        </Card>
                    );
                })}

                {(!searches || searches.length === 0) && (
                    <div className="col-span-full text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                        <Bell className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <p className="text-muted-foreground">لا توجد بحثات محفوظة حتى الآن.</p>
                    </div>
                )}
            </div>
        </div>
    );
}