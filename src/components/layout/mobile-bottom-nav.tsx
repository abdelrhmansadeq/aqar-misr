"use client";

import Link from "next/link";
import { Home, Search, Heart, User } from "lucide-react";
import { useFavorites } from "@/components/providers/favorites-provider";

export function MobileBottomNav() {
    const { favorites, isMounted } = useFavorites();

    return (
        <nav className="fixed bottom-0 z-50 w-full border-t bg-background md:hidden pb-safe">
            <div className="flex h-16 items-center justify-around px-2">
                <Link href="/" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
                    <Home className="h-5 w-5" />
                    <span className="text-[10px] font-medium">الرئيسية</span>
                </Link>
                <Link href="/properties" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
                    <Search className="h-5 w-5" />
                    <span className="text-[10px] font-medium">البحث</span>
                </Link>

                {/* أيقونة المفضلة مع العداد */}
                <Link href="/favorites" className="relative flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
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

                <Link href="/dashboard" className="flex flex-col items-center gap-1 text-muted-foreground hover:text-primary">
                    <User className="h-5 w-5" />
                    <span className="text-[10px] font-medium">حسابي</span>
                </Link>
            </div>
        </nav>
    );
}