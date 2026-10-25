"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PropertiesSearch() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const initialQuery = searchParams.get("q") || "";

    const [query, setQuery] = useState(initialQuery);

    useEffect(() => {
        // تأخير البحث نص ثانية عشان ميبعتش طلب مع كل حرف
        const timer = setTimeout(() => {
            const params = new URLSearchParams(searchParams.toString());

            if (query) {
                params.set("q", query);
            } else {
                params.delete("q");
            }

            // نحدث الرابط من غير ما نعمل Refresh كامل للصفحة
            router.push(`/aqar-ax6admin/properties?${params.toString()}`);
        }, 500);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query]);

    return (
        <div className="relative w-full max-w-sm">
            <Search className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="ابحث باسم العقار أو المدينة..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pr-9 h-10"
            />
            {query && (
                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-1 top-1 h-8 w-8 text-muted-foreground hover:text-foreground"
                    onClick={() => setQuery("")}
                >
                    <X className="h-4 w-4" />
                </Button>
            )}
        </div>
    );
}