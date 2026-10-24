import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Edit, Eye, Phone, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DeletePropertyButton } from "@/components/admin/delete-property-button";

export default async function AdminPropertiesPage() {
    const supabase = await createClient();

    const { data: properties } = await supabase
        .from("properties")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">إدارة العقارات</h1>
                <Link href="/aqar-ax6admin/properties/new">
                    <Button className="gap-2">
                        <Plus className="h-4 w-4" /> إضافة عقار
                    </Button>
                </Link>
            </div>

            <div className="border rounded-xl bg-card overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-right">
                        <thead className="bg-muted/50 border-b text-muted-foreground">
                        <tr>
                            <th className="px-4 py-4 font-medium">العقار</th>
                            <th className="px-4 py-4 font-medium text-center">التفاعل</th>
                            <th className="px-4 py-4 font-medium">السعر</th>
                            <th className="px-4 py-4 font-medium">الحالة</th>
                            <th className="px-4 py-4 font-medium text-left">إجراءات</th>
                        </tr>
                        </thead>
                        <tbody className="divide-y">
                        {properties?.map((prop) => (
                            <tr key={prop.id} className="hover:bg-muted/20 transition-colors">
                                <td className="px-4 py-4">
                                    <p className="font-semibold line-clamp-1">{prop.title}</p>
                                    <p className="text-xs text-muted-foreground">{prop.city}، {prop.district}</p>
                                </td>

                                {/* عمود التفاعل الجديد */}
                                <td className="px-4 py-4">
                                    <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
                                        <div className="flex items-center gap-1" title="مشاهدات">
                                            <Eye className="h-4 w-4 text-blue-500" />
                                            <span>{prop.views || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1" title="نقرات واتساب">
                                            <MessageCircle className="h-4 w-4 text-green-500" />
                                            <span>{prop.whatsapp_clicks || 0}</span>
                                        </div>
                                        <div className="flex items-center gap-1" title="نقرات اتصال">
                                            <Phone className="h-4 w-4 text-amber-500" />
                                            <span>{prop.call_clicks || 0}</span>
                                        </div>
                                    </div>
                                </td>

                                <td className="px-4 py-4 whitespace-nowrap font-medium">
                                    {prop.price.toLocaleString("ar-EG")} ج.م
                                </td>
                                <td className="px-4 py-4">
                                    <Badge variant={prop.status === 'published' ? 'default' : 'secondary'}>
                                        {prop.status === 'published' ? 'منشور' : 'مسودة'}
                                    </Badge>
                                </td>
                                <td className="px-4 py-4">
                                    <div className="flex items-center justify-end gap-2">
                                        <Link href={`/aqar-ax6admin/properties/${prop.id}/edit`}>
                                            <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                                                <Edit className="h-4 w-4" />
                                            </Button>
                                        </Link>
                                        <DeletePropertyButton propertyId={prop.id} />
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}