"use client";

import { useEffect, useState } from "react";
import { useCompare } from "@/components/providers/compare-provider";
import { createClient } from "@/lib/supabase/client";
import { Property } from "@/types/property";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Scale, Trash2 } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { cn } from "@/lib/utils";

export default function ComparePage() {
    const { compareList, isMounted, toggleCompare } = useCompare();
    const [properties, setProperties] = useState<Property[]>([]);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        if (!isMounted) return;

        async function fetchProperties() {
            if (compareList.length === 0) {
                setProperties([]);
                setLoading(false);
                return;
            }

            const propertyIds = compareList.map(item => item.id);

            const { data } = await supabase
                .from("properties")
                .select("*, property_images (id, file_path, order)")
                .in("id", propertyIds);

            if (data) setProperties(data as Property[]);
            setLoading(false);
        }

        fetchProperties();
    }, [compareList, isMounted, supabase]);

    if (!isMounted || loading) return <div className="text-center py-20 text-muted-foreground">جاري التحميل...</div>;

    if (properties.length === 0) {
        return (
            <div className="container mx-auto px-4 py-20 text-center">
                <Scale className="h-16 w-16 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h1 className="text-2xl font-bold mb-2">لا توجد عقارات للمقارنة</h1>
                <p className="text-muted-foreground mb-6">أضف عقارات للمقارنة من الصفحة الرئيسية أو صفحة البحث.</p>
                <Link href="/properties"><Button>تصفح العقارات</Button></Link>
            </div>
        );
    }

    const minPrice = Math.min(...properties.map(p => p.price));
    const maxArea = Math.max(...properties.map(p => p.area_m2));
    const minPricePerMeter = Math.min(...properties.map(p => Math.round(p.price / p.area_m2)));

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">مقارنة العقارات</h1>
                <p className="text-muted-foreground">قارن بين مميزات العقارات التي اخترتها لتأخذ القرار الأفضل.</p>
            </div>

            <div className="border rounded-xl bg-card overflow-x-auto shadow-sm">
                <Table className="min-w-[800px]">
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            <TableHead className="w-1/4 bg-muted/30 font-bold text-foreground rounded-tr-xl">المواصفات</TableHead>
                            {properties.map((prop) => (
                                <TableHead key={prop.id} className="w-1/4 p-4 text-center border-r">
                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3">
                                        <Image src={prop.image_url || "/placeholder.jpg"} alt={prop.title} fill className="object-cover" />
                                    </div>
                                    <h3 className="font-bold text-lg line-clamp-1 mb-2">{prop.title}</h3>
                                    {/* التعديل هنا عشان نمرر الغرض */}
                                    <Button variant="ghost" size="sm" onClick={() => toggleCompare(prop.id, prop.purpose)} className="text-destructive hover:text-destructive hover:bg-destructive/10 h-8">
                                        <Trash2 className="h-4 w-4 ml-1" /> إزالة
                                    </Button>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-semibold bg-muted/10">السعر</TableCell>
                            {properties.map((prop) => (
                                <TableCell key={prop.id} className={cn("text-center font-bold text-lg border-r", prop.price === minPrice ? "text-green-600 bg-green-50/50 dark:bg-green-950/20" : "")}>
                                    {prop.price.toLocaleString("ar-EG")} ج.م
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold bg-muted/10">سعر المتر</TableCell>
                            {properties.map((prop) => {
                                const ppm = Math.round(prop.price / prop.area_m2);
                                return (
                                    <TableCell key={prop.id} className={cn("text-center font-medium border-r", ppm === minPricePerMeter ? "text-green-600 bg-green-50/50 dark:bg-green-950/20" : "")}>
                                        {ppm.toLocaleString("ar-EG")} ج.م
                                    </TableCell>
                                );
                            })}
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold bg-muted/10">الغرض</TableCell>
                            {properties.map((prop) => (
                                <TableCell key={prop.id} className="text-center border-r">
                                    {prop.purpose === "sale" ? "للبيع" : "للإيجار"}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold bg-muted/10">نوع العقار</TableCell>
                            {properties.map((prop) => (
                                <TableCell key={prop.id} className="text-center border-r">
                                    {prop.type === "apartment" ? "شقة" : prop.type === "villa" ? "فيلا" : prop.type === "land" ? "أرض" : prop.type === "office" ? "مكتب" : "أخرى"}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold bg-muted/10">المساحة</TableCell>
                            {properties.map((prop) => (
                                <TableCell key={prop.id} className={cn("text-center border-r", prop.area_m2 === maxArea ? "text-green-600 bg-green-50/50 dark:bg-green-950/20 font-bold" : "")}>
                                    {prop.area_m2} م²
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold bg-muted/10">غرف النوم</TableCell>
                            {properties.map((prop) => (
                                <TableCell key={prop.id} className="text-center border-r">{prop.bedrooms}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold bg-muted/10">الحمامات</TableCell>
                            {properties.map((prop) => (
                                <TableCell key={prop.id} className="text-center border-r">{prop.bathrooms}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold bg-muted/10">مستوى التشطيب</TableCell>
                            {properties.map((prop) => (
                                <TableCell key={prop.id} className="text-center border-r">
                                    {prop.finishing === "super_lux" ? "سوبر لوكس" : prop.finishing === "finished" ? "تشطيب كامل" : prop.finishing === "semi_finished" ? "نصف تشطيب" : prop.finishing === "furnished" ? "مفروش" : "بدون"}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold bg-muted/10">الموقع</TableCell>
                            {properties.map((prop) => (
                                <TableCell key={prop.id} className="text-center border-r">{prop.city}، {prop.district}</TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}