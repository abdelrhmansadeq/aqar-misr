"use client";

import { useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, X, SlidersHorizontal } from "lucide-react";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

export function PropertyFilters() {
    const router = useRouter();
    const searchParams = useSearchParams();

    const [purpose, setPurpose] = useState(searchParams.get("purpose") || "all");
    const [type, setType] = useState(searchParams.get("type") || "all");
    const [city, setCity] = useState(searchParams.get("city") || "");
    const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
    const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");

    const [bedrooms, setBedrooms] = useState(searchParams.get("bedrooms") || "all");
    const [finishing, setFinishing] = useState(searchParams.get("finishing") || "all");
    const [deliveryStatus, setDeliveryStatus] = useState(searchParams.get("delivery_status") || "all");

    const [isOpen, setIsOpen] = useState(false);

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
        if (bedrooms !== "all") params.set("bedrooms", bedrooms);
        if (finishing !== "all") params.set("finishing", finishing);
        if (deliveryStatus !== "all") params.set("delivery_status", deliveryStatus);

        router.push(`/properties?${params.toString()}`);
        setIsOpen(false);
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
        setIsOpen(false);
    };

    const renderFilterContent = (isMobile = false) => (
        <form onSubmit={handleSearch} className="space-y-5">
            {!isMobile && (
                <div className="flex items-center justify-between border-b pb-2">
                    <h2 className="font-bold text-lg">الفلاتر</h2>
                    <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground h-8 px-2">
                        <X className="h-4 w-4 ml-1" /> مسح
                    </Button>
                </div>
            )}

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
                    <Input placeholder="مثال: التجمع" value={city} onChange={(e) => setCity(e.target.value)} className="pr-9" />
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
                <Search className="h-5 w-5" /> عرض النتائج
            </Button>
        </form>
    );

    return (
        <>
            <div className="md:hidden mb-4">
                <Sheet open={isOpen} onOpenChange={setIsOpen}>
                    <SheetTrigger render={<Button className="w-full gap-2 py-6 text-lg" variant="outline" />}>
                        <SlidersHorizontal className="h-5 w-5" /> تصفية النتائج
                    </SheetTrigger>

                    {/* ✅ السر هنا: استخدمنا flex flex-col و h-[85dvh] عشان نقسم الشاشة صح */}
                    <SheetContent
                        side="bottom"
                        className="h-[85dvh] p-0 flex flex-col rounded-t-2xl bg-background/90 backdrop-blur-xl border-t border-border/50"
                    >
                        {/* 1. الهيدر (ثابت) */}
                        <SheetHeader className="flex-none flex flex-row items-center justify-between px-4 py-4 border-b bg-background/95 space-y-0 text-right">
                            <SheetTitle className="text-xl font-bold pr-8">تصفية العقارات</SheetTitle>

                            <Button
                                type="button"
                                variant="destructive"
                                size="sm"
                                onClick={clearFilters}
                                className="h-8 px-3 rounded-full text-xs"
                            >
                                <X className="h-3.5 w-3.5 ml-1" /> مسح
                            </Button>
                        </SheetHeader>

                        {/* 2. المحتوى (قابل للتمرير) */}
                        <div className="flex-1 overflow-y-auto px-4 py-6">
                            {renderFilterContent(true)}
                        </div>
                    </SheetContent>
                </Sheet>
            </div>

            <div className="hidden md:block bg-card border rounded-xl p-4 sticky top-24">
                {renderFilterContent(false)}
            </div>
        </>
    );
}