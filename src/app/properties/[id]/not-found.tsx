import Link from "next/link";
import { SearchX, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PropertyNotFound() {
    return (
        <div className="container mx-auto px-4 py-20 min-h-[70vh] flex flex-col items-center justify-center text-center">
            <div className="bg-muted/30 p-6 rounded-full mb-6">
                <SearchX className="h-16 w-16 text-primary opacity-80" />
            </div>
            <h1 className="text-3xl font-bold text-foreground mb-4">عذراً، هذا العقار غير موجود!</h1>
            <p className="text-muted-foreground max-w-md mx-auto mb-8 text-lg">
                ربما تم بيع هذا العقار أو حذفه من قبل الإدارة. يمكنك تصفح باقي العقارات المتاحة التي تناسبك.
            </p>
            <div className="flex gap-4">
                <Link href="/properties">
                    <Button size="lg" className="gap-2">
                        <ArrowRight className="h-5 w-5" />
                        تصفح كل العقارات
                    </Button>
                </Link>
                <Link href="/">
                    <Button size="lg" variant="outline">
                        العودة للرئيسية
                    </Button>
                </Link>
            </div>
        </div>
    );
}