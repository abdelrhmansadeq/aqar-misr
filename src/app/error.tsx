"use client";

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
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="bg-destructive/10 p-6 rounded-full mb-6">
                <AlertTriangle className="h-20 w-20 text-destructive" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">حدث خطأ غير متوقع!</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                نعتذر عن هذا العطل، قد يكون هناك مشكلة مؤقتة في الاتصال بالسيرفر. يرجى المحاولة مرة أخرى.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Button onClick={() => reset()} className="w-full gap-2 py-6 px-8 text-lg">
                    <RefreshCcw className="h-5 w-5" /> حاول مرة أخرى
                </Button>
                <Link href="/">
                    <Button variant="outline" className="w-full gap-2 py-6 px-8 text-lg">
                        <Home className="h-5 w-5" /> العودة للرئيسية
                    </Button>
                </Link>
            </div>
        </div>
    );
}