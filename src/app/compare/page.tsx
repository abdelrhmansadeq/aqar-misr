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
            const { data } = await supabase.from("properties").select("*").in("id", compareList);
            if (data) setProperties(data as Property[]);
            setLoading(false);
        }

        fetchProperties();
    }, [compareList, isMounted, supabase]);

    if (!isMounted || loading) return <div className="text-center py-20">جاري التحميل...</div>;

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

    return (
        <div className="container mx-auto px-4 py-8 overflow-x-auto">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-primary mb-2">مقارنة العقارات</h1>
                <p className="text-muted-foreground">قارن بين مميزات العقارات التي اخترتها لتأخذ القرار الأفضل.</p>
            </div>

            <div className="border rounded-xl bg-card overflow-hidden min-w-[700px]">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="w-1/4 bg-muted/50 font-bold text-foreground">المواصفات</TableHead>
                            {properties.map((prop) => (
                                <TableHead key={prop.id} className="w-1/4 p-4 text-center">
                                    <div className="relative w-full aspect-video rounded-lg overflow-hidden mb-3">
                                        <Image src={prop.image_url || "/placeholder.jpg"} alt={prop.title} fill className="object-cover" />
                                    </div>
                                    <h3 className="font-bold text-lg line-clamp-1">{prop.title}</h3>
                                    <Button variant="ghost" size="sm" onClick={() => toggleCompare(prop.id)} className="text-destructive hover:text-destructive hover:bg-destructive/10 mt-2 h-8">
                                        <Trash2 className="h-4 w-4 ml-1" /> إزالة
                                    </Button>
                                </TableHead>
                            ))}
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        <TableRow>
                            <TableCell className="font-semibold bg-muted/20">السعر</TableCell>
                            {properties.map((prop) => (
                                <TableCell key={prop.id} className="text-center font-bold text-primary text-lg">
                                    {prop.price.toLocaleString("ar-EG")} ج.م
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold bg-muted/20">الغرض</TableCell>
                            {properties.map((prop) => (
                                <TableCell key={prop.id} className="text-center">
                                    {prop.purpose === "sale" ? "للبيع" : "للإيجار"}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold bg-muted/20">نوع العقار</TableCell>
                            {properties.map((prop) => (
                                <TableCell key={prop.id} className="text-center">
                                    {prop.type === "apartment" ? "شقة" : prop.type === "villa" ? "فيلا" : prop.type === "land" ? "أرض" : "آخر"}
                                </TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold bg-muted/20">المساحة</TableCell>
                            {properties.map((prop) => (
                                <TableCell key={prop.id} className="text-center">{prop.area_m2} م²</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold bg-muted/20">غرف النوم</TableCell>
                            {properties.map((prop) => (
                                <TableCell key={prop.id} className="text-center">{prop.bedrooms}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold bg-muted/20">الحمامات</TableCell>
                            {properties.map((prop) => (
                                <TableCell key={prop.id} className="text-center">{prop.bathrooms}</TableCell>
                            ))}
                        </TableRow>
                        <TableRow>
                            <TableCell className="font-semibold bg-muted/20">الموقع</TableCell>
                            {properties.map((prop) => (
                                <TableCell key={prop.id} className="text-center">{prop.city}، {prop.district}</TableCell>
                            ))}
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}