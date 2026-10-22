"use client";

import { useState } from "react";
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

    // دالة مساعدة تستقبل string | null وتضمن عدم حدوث خطأ
    const handlePurposeChange = (value: string | null) => {
        setPurpose(value || "all");
    };

    const handleTypeChange = (value: string | null) => {
        setType(value || "all");
    };

    const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const params = new URLSearchParams();

        if (purpose !== "all") params.set("purpose", purpose);
        if (type !== "all") params.set("type", type);
        if (city) params.set("city", city);
        if (minPrice) params.set("minPrice", minPrice);
        if (maxPrice) params.set("maxPrice", maxPrice);

        router.push(`/properties?${params.toString()}`);
    };

    const clearFilters = () => {
        setPurpose("all");
        setType("all");
        setCity("");
        setMinPrice("");
        setMaxPrice("");
        router.push("/properties");
    };

    return (
        <form onSubmit={handleSearch} className="bg-card border rounded-xl p-4 space-y-6 sticky top-24">
            <div className="flex items-center justify-between border-b pb-2">
                <h2 className="font-bold text-lg">الفلاتر</h2>
                <Button type="button" variant="ghost" size="sm" onClick={clearFilters} className="text-muted-foreground h-8 px-2">
                    <X className="h-4 w-4 ml-1" /> مسح
                </Button>
            </div>

            <div className="space-y-2">
                <Label>الغرض</Label>
                {/* نستخدم handlePurposeChange بدلاً من setPurpose مباشرة */}
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
                {/* نستخدم handleTypeChange بدلاً من setType مباشرة */}
                <Select value={type} onValueChange={handleTypeChange}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">الكل</SelectItem>
                        <SelectItem value="apartment">شقة</SelectItem>
                        <SelectItem value="villa">فيلا</SelectItem>
                        <SelectItem value="land">أرض</SelectItem>
                        <SelectItem value="office">مكتب</SelectItem>
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
                    <Input
                        type="number"
                        placeholder="من"
                        value={minPrice}
                        onChange={(e) => setMinPrice(e.target.value)}
                    />
                    <span className="text-muted-foreground">-</span>
                    <Input
                        type="number"
                        placeholder="إلى"
                        value={maxPrice}
                        onChange={(e) => setMaxPrice(e.target.value)}
                    />
                </div>
            </div>

            <Button type="submit" className="w-full py-6 text-lg gap-2">
                <Search className="h-5 w-5" />
                بحث
            </Button>
        </form>
    );
}