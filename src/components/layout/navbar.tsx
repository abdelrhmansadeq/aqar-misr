"use client";

import Link from "next/link";
import { Building2, Heart, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useFavorites } from "@/components/providers/favorites-provider";
import { usePathname } from "next/navigation"; // ضفنا ده

export function Navbar() {
    const { favorites, isMounted } = useFavorites();
    const pathname = usePathname(); // ضفنا ده

    // لو إحنا في لوحة التحكم، متظهرش
    if (pathname.startsWith("/aqar-ax6admin")) return null;

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 hidden md:block">
            <div className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link href="/" className="flex items-center gap-2">
                    <Building2 className="h-6 w-6 text-primary" />
                    <span className="text-xl font-bold text-primary">عقار مصر</span>
                </Link>

                <nav className="flex items-center gap-6 text-sm font-medium">
                    <Link href="/" className="transition-colors hover:text-primary">الرئيسية</Link>
                    <Link href="/properties" className="transition-colors hover:text-primary">العقارات</Link>
                    <Link href="/compounds" className="transition-colors hover:text-primary">الكومباوندات</Link>
                    <Link href="/developers" className="transition-colors hover:text-primary">المطورين</Link>
                </nav>

                <div className="flex items-center gap-4">
                    <Link href="/favorites" className="relative p-2 text-muted-foreground hover:text-primary transition-colors">
                        <Heart className="h-5 w-5" />
                        {isMounted && favorites.length > 0 && (
                            <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold h-4 w-4 rounded-full flex items-center justify-center">
                {favorites.length}
              </span>
                        )}
                    </Link>

                    <a href="https://wa.me/201012345678" target="_blank" rel="noopener noreferrer">
                        <Button className="gap-2">
                            <Phone className="h-4 w-4" /> تواصل معنا
                        </Button>
                    </a>
                </div>
            </div>
        </header>
    );
}