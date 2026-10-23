import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Home, Search, MapPinOff } from "lucide-react";

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
            <div className="bg-primary/10 p-6 rounded-full mb-6">
                <MapPinOff className="h-20 w-20 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-primary mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-4">عذراً، الصفحة غير موجودة</h2>
            <p className="text-muted-foreground max-w-md mb-8">
                يبدو أنك وصلت إلى رابط غير صحيح، أو أن هذا العقار قد تم حذفه أو بيعه بالفعل.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/">
                    <Button className="w-full gap-2 py-6 px-8 text-lg">
                        <Home className="h-5 w-5" /> العودة للرئيسية
                    </Button>
                </Link>
                <Link href="/properties">
                    <Button variant="outline" className="w-full gap-2 py-6 px-8 text-lg border-primary text-primary">
                        <Search className="h-5 w-5" /> تصفح العقارات
                    </Button>
                </Link>
            </div>
        </div>
    );
}