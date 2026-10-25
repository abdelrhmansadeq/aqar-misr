"use client";

import { useEffect } from "react"; // ضفنا useEffect
import { Button } from "@/components/ui/button";
import { AlertTriangle, RefreshCcw, Home } from "lucide-react";
import Link from "next/link";

export default function Error({
                                  error,
                                  reset,
                              }: {
    error: Error & { digest?: string };
    reset: () => void;
}) {
    // ✅ بنسجل الخطأ في الكونسول عشان لو حصل على Vercel نعرف سببه
    useEffect(() => {
        console.error("Application Error:", error);
    }, [error]);

    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 py-12 text-center">
            <div className="bg-destructive/10 p-5 md:p-6 rounded-full mb-6">
                <AlertTriangle className="h-16 w-16 md:h-20 md:w-20 text-destructive" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-3">حدث خطأ غير متوقع!</h1>
            <p className="text-muted-foreground max-w-md mb-8 text-sm md:text-base leading-relaxed">
                نعتذر عن هذا العطل، قد يكون هناك مشكلة مؤقتة في الاتصال بالسيرفر. يرجى المحاولة مرة أخرى.
            </p>

            {/* غيرنا التصميم عشان يبقى مريح للموبايل (زرار فوق التاني) */}
            <div className="flex flex-col w-full sm:w-auto sm:flex-row gap-3 sm:gap-4">
                <Button onClick={() => reset()} className="w-full gap-2 py-6 px-8 text-base md:text-lg">
                    <RefreshCcw className="h-5 w-5" /> حاول مرة أخرى
                </Button>
                <Link href="/" className="w-full sm:w-auto">
                    <Button variant="outline" className="w-full gap-2 py-6 px-8 text-base md:text-lg">
                        <Home className="h-5 w-5" /> العودة للرئيسية
                    </Button>
                </Link>
            </div>
        </div>
    );
}