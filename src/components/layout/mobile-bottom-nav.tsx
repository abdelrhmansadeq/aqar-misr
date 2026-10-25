"use client";

import Link from "next/link";
import { Home, Search, Heart, Phone } from "lucide-react";
import { useFavorites } from "@/components/providers/favorites-provider";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

// دالة ذكية بتفهم لو الرقم، اليوزر، أو اللينك الكامل
function getWhatsAppLink(value: string) {
    if (!value) return "https://wa.me/201068595864";
    if (value.startsWith("http://") || value.startsWith("https://")) return value;

    const isNumeric = /^\d+$/.test(value.replace(/\s/g, ''));
    if (isNumeric) {
        let cleaned = value.replace(/\D/g, '');
        if (cleaned.startsWith('0')) {
            cleaned = '20' + cleaned.substring(1);
        }
        return `https://wa.me/${cleaned}`;
    }

    const cleanUsername = value.replace('@', '');
    return `https://wa.me/${cleanUsername}`;
}

export function MobileBottomNav({ whatsappNumber }: { whatsappNumber: string }) {
    const { favorites, isMounted } = useFavorites();
    const pathname = usePathname();

    if (pathname.startsWith("/aqar-ax6admin")) return null;

    const getLinkClass = (path: string) => {
        const isActive = path === "/" ? pathname === "/" : pathname.startsWith(path);
        return cn(
            "flex flex-col items-center gap-1 transition-colors duration-200",
            isActive ? "text-primary" : "text-muted-foreground hover:text-primary"
        );
    };

    const waLink = getWhatsAppLink(whatsappNumber);

    return (
        <nav className="fixed bottom-0 z-50 w-full border-t bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden pb-safe">
            <div className="flex h-16 items-center justify-around px-2">
                <Link href="/" className={getLinkClass("/")}>
                    <Home className="h-5 w-5" />
                    <span className="text-[10px] font-medium">الرئيسية</span>
                </Link>
                <Link href="/properties" className={getLinkClass("/properties")}>
                    <Search className="h-5 w-5" />
                    <span className="text-[10px] font-medium">العقارات</span>
                </Link>
                <Link href="/favorites" className={getLinkClass("/favorites")}>
                    <div className="relative">
                        <Heart className="h-5 w-5" />
                        {isMounted && favorites.length > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
                        )}
                    </div>
                    <span className="text-[10px] font-medium">المفضلة</span>
                </Link>
                <a href={waLink} target="_blank" rel="noopener noreferrer" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-green-600 transition-colors">
                    <Phone className="h-5 w-5" />
                    <span className="text-[10px] font-medium">تواصل</span>
                </a>
            </div>
        </nav>
    );
}