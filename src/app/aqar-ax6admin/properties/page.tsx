import { createClient } from "@/lib/supabase/server";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Plus, Edit, Eye, Phone, MessageCircle, SearchX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DeletePropertyButton } from "@/components/admin/delete-property-button";
import { PropertiesSearch } from "@/components/admin/properties-search";
import { Suspense } from "react";

// في Next.js 15، الـ searchParams بقت Promise
export default async function AdminPropertiesPage({
                                                      searchParams
                                                  }: {
    searchParams: Promise<{ q?: string }>
}) {
    const supabase = await createClient();
    const resolvedParams = await searchParams;
    const searchQuery = resolvedParams.q;

    // بناء الاستعلام الأساسي
    let query = supabase.from("properties").select("*").order("created_at", { ascending: false });

    // لو فيه كلمة بحث، نفلتر بيها (بالاسم أو المدينة أو المنطقة)
    if (searchQuery) {
        // إشارة الـ or دي بتخلي الداتابيز تدور في الأعمدة دي كلها مرة واحدة
        query = query.or(`title.ilike.%${searchQuery}%, city.ilike.%${searchQuery}%, district.ilike.%${searchQuery}%`);
    }

    const { data: properties } = await query;

    return (
        <div className="space-y-6">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-2xl font-bold">إدارة العقارات</h1>
                    {searchQuery && (
                        <p className="text-sm text-muted-foreground mt-1">
                            نتائج البحث عن: <span className="font-bold text-primary">« {searchQuery} »</span>
                        </p>
                    )}
                </div>

                <div className="flex items-center gap-3 w-full md:w-auto">
                    {/* خانة البحث */}
                    <Suspense fallback={<div className="h-10 w-full max-w-sm bg-muted animate-pulse rounded-md"></div>}>
                        <PropertiesSearch />
                    </Suspense>

                    <Link href="/aqar-ax6admin/properties/new">
                        <Button className="gap-2 whitespace-nowrap">
                            <Plus className="h-4 w-4" /> إضافة عقار
                        </Button>
                    </Link>
                </div>
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

                    {/* لو مفيش نتائج */}
                    {(!properties || properties.length === 0) && (
                        <div className="flex flex-col items-center justify-center py-12 text-center">
                            <div className="bg-muted p-4 rounded-full mb-3">
                                <SearchX className="h-8 w-8 text-muted-foreground" />
                            </div>
                            <h3 className="text-lg font-bold mb-1">لا توجد نتائج</h3>
                            <p className="text-muted-foreground text-sm">
                                {searchQuery ? `لم نجد عقارات تطابق "${searchQuery}"` : "لا توجد عقارات مضافة حتى الآن."}
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}