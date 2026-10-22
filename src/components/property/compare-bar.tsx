"use client";

import { useCompare } from "@/components/providers/compare-provider";
import { Button } from "@/components/ui/button";
import { Scale, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export function CompareBar() {
    const { compareList, clearCompare } = useCompare();
    const pathname = usePathname();

    // لو مفيش عقارات أو إحنا واقفين في صفحة المقارنة نفسها، منظهرش الشريط
    if (compareList.length === 0 || pathname === "/compare") return null;

    return (
        <div className="fixed bottom-16 md:bottom-6 left-1/2 -translate-x-1/2 z-50 w-[95%] max-w-lg">
            <div className="bg-primary text-primary-foreground px-4 py-3 rounded-full shadow-xl flex items-center justify-between border border-primary/20 backdrop-blur-lg bg-primary/95">
                <div className="flex items-center gap-2">
                    <Scale className="h-5 w-5" />
                    <span className="text-sm font-medium">لديك {compareList.length} عقارات للمقارنة</span>
                </div>
                <div className="flex items-center gap-2">
                    <Button variant="ghost" size="icon" onClick={clearCompare} className="h-8 w-8 text-primary-foreground/70 hover:text-primary-foreground hover:bg-primary-foreground/10 rounded-full">
                        <X className="h-4 w-4" />
                    </Button>
                    <Link href="/compare">
                        <Button size="sm" className="bg-accent text-accent-foreground hover:bg-accent/90 rounded-full font-bold">
                            مقارنة
                        </Button>
                    </Link>
                </div>
            </div>
        </div>
    );
}