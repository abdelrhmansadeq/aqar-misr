"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X } from "lucide-react";

export function PropertyFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [purpose, setPurpose] = useState(searchParams.get("purpose") || "all");
    const [type, setType] = useState(searchParams.get("type") || "all");
    const [city, setCity] = useState(searchParams.get("city") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

    // الحقول الجديدة
    const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "all");
    const [finishing, setFinishing] = useState(searchParams.get("finishing") || "all");
    const [deliveryStatus, setDeliveryStatus] = useState(searchParams.get("delivery_status") || "all");

    const handlePurposeChange = (value: string | null) => { if (value) setPurpose(value); };
    const handleTypeChange = (value: string | null) => { if (value) setType(value); };
    const handleBedroomsChange = (value: string | null) => { if (value) setBedrooms(value); };
    const handleFinishingChange = (value: string | null) => { if (value) setFinishing(value); };
    const handleDeliveryChange = (value: string | null) => { if (value) setDeliveryStatus(value); };

    const handleSearch = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const params = new URLSearchParams();

        if (purpose !== "all") params.set("purpose", purpose);
        if (type !== "all") params.set("type", type);
        if (city) params.set("city", city);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);

        // إضافة الفلاتر الجديدة
        if (bedrooms !== "all") params.set("bedrooms", bedrooms);
        if (finishing !== "all") params.set("finishing", finishing);
        if (deliveryStatus !== "all") params.set("delivery_status", deliveryStatus);

        router.push(`/properties?${params.toString()}`);
    };

    const clearFilters = () => {
        setPurpose("all");
        setType("all");
        setCity("");
        setMinPrice("");
        setMaxPrice("");
        setBedrooms("all");
        setFinishing("all");
        setDeliveryStatus("all");
        router.push("/properties");
    };

    return (
        <form onSubmit={handleSearch} className="bg-card border rounded-xl p-4 space-y-5 sticky top-24">
            <div className="flex items-center justify-between border-b pb-2">
                <h2 className="font-bold text-lg">الفلاتر</h2>
                <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground h-8 px-2">
                    <X className="h-4 w-4 ml-1" /> مسح
                </Button>
            </div>

            <div className="space-y-2">
                <Label>الغرض</Label>
                <Select value={purpose} onValueChange={handlePurposeChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">الكل</SelectItem>
                        <SelectItem value="sale">للبيع</SelectItem>
                        <SelectItem value="rent">للإيجار</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>نوع العقار</Label>
                <Select value={type} onValueChange={handleTypeChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">الكل</SelectItem>
                        <SelectItem value="apartment">شقة</SelectItem>
                        <SelectItem value="villa">فيلا</SelectItem>
                        <SelectItem value="land">أرض</SelectItem>
                        <SelectItem value="office">مكتب</SelectItem>
                        <SelectItem value="shop">محل</SelectItem>
                    </SelectContent>
                </Select>
            </div>

            <div className="space-y-2">
                <Label>المدينة / المنطقة</Label>
                <div className="relative">
                    <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="مثال: التجمع"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        className="pr-9"
                    />
                </div>
            </div>

            <div className="space-y-2">
                <Label>السعر (جنيه)</Label>
                <div className="flex gap-2 items-center">
                    <Input type="number" placeholder="من" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                    <span className="text-muted-foreground">-</span>
                    <Input type="number" placeholder="إلى" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                </div>
            </div>

            {/* الفلاتر الجديدة */}
            <div className="pt-2 border-t space-y-4">
                <div className="space-y-2">
                    <Label>عدد غرف النوم</Label>
                    <Select value={bedrooms} onValueChange={handleBedroomsChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">الكل</SelectItem>
                            <SelectItem value="1">1 غرفة</SelectItem>
                            <SelectItem value="2">2 غرف</SelectItem>
                            <SelectItem value="3">3 غرف</SelectItem>
                            <SelectItem value="4">4 غرف</SelectItem>
                            <SelectItem value="5">5 غرف فأكثر</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>مستوى التشطيب</Label>
                    <Select value={finishing} onValueChange={handleFinishingChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">الكل</SelectItem>
                            <SelectItem value="unfinished">بدون تشطيب</SelectItem>
                            <SelectItem value="semi_finished">نصف تشطيب</SelectItem>
                            <SelectItem value="finished">تشطيب كامل</SelectItem>
                            <SelectItem value="super_lux">سوبر لوكس</SelectItem>
                            <SelectItem value="furnished">مفروش</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                <div className="space-y-2">
                    <Label>حالة التسليم</Label>
                    <Select value={deliveryStatus} onValueChange={handleDeliveryChange}>
                        <SelectTrigger><SelectValue /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">الكل</SelectItem>
                            <SelectItem value="ready">جاهز للاستلام</SelectItem>
                            <SelectItem value="under_construction">تحت الإنشاء</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <Button type="submit" className="w-full py-6 text-lg gap-2 mt-2">
                <Search className="h-5 w-5" /> بحث
            </Button>
        </form>
    );
}