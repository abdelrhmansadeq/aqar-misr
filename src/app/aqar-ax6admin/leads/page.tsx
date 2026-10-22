import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";

export default async function AdminLeadsPage() {
    const supabase = await createClient();

    // بنجيب الطلبات وبنربطها بجدول العقارات عشان نعرف اسم العقار
    const { data: leads } = await supabase
        .from("leads")
        .select(`
      *,
      properties:property_id (
        title
      )
    `)
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">طلبات المعاينة</h1>
                <Badge variant="secondary">{leads?.length || 0} طلب</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {leads?.map((lead) => {
                    // استخراج اسم العقار من العلاقة
                    const propertyTitle = Array.isArray(lead.properties)
                        ? lead.properties[0]?.title
                        : lead.properties?.title;

                    return (
                        <Card key={lead.id} className="bg-card">
                            <CardContent className="p-5 space-y-4">
                                <div className="flex items-start justify-between">
                                    <div className="space-y-1">
                                        <div className="flex items-center gap-2 font-bold">
                                            <User className="h-4 w-4 text-primary" />
                                            {lead.name}
                                        </div>
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground" dir="ltr">
                                            <Phone className="h-4 w-4" />
                                            {lead.phone}
                                        </div>
                                    </div>
                                    <Badge className={
                                               lead.status === 'new' ? 'bg-blue-500' :
                                                   lead.status === 'scheduled' ? 'bg-green-500' : 'bg-gray-500'
                                           }>
                                        {lead.status === 'new' ? 'جديد' : lead.status === 'scheduled' ? 'تم التأكيد' : 'مغلق'}
                                    </Badge>
                                </div>

                                <div className="bg-muted/50 p-3 rounded-lg text-sm space-y-1">
                                    <p className="font-medium line-clamp-1">العقار: {propertyTitle || "غير معروف"}</p>
                                    <div className="flex items-center gap-4 text-muted-foreground mt-2">
                    <span className="flex items-center gap-1">
                      <CalendarDays className="h-3 w-3" /> {lead.preferred_date}
                    </span>
                                        <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" /> {lead.preferred_time}
                    </span>
                                    </div>
                                </div>

                                <a href={`tel:${lead.phone}`} className="block">
                                    <Button className="w-full gap-2" variant="outline">
                                        <Phone className="h-4 w-4" /> اتصال بالعميل
                                    </Button>
                                </a>
                            </CardContent>
                        </Card>
                    );
                })}

                {(!leads || leads.length === 0) && (
                    <div className="col-span-full text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                        <p className="text-muted-foreground">لا توجد طلبات معاينة حتى الآن.</p>
                    </div>
                )}
            </div>
        </div>
    );
}