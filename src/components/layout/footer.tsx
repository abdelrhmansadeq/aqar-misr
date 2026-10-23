"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Building2 } from "lucide-react";

export function Footer() {
    const pathname = usePathname();

    if (pathname.startsWith("/aqar-ax6admin")) return null;

    return (
        <footer className="border-t bg-muted/30 mt-auto mb-16 md:mb-0">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="md:col-span-2">
                        <Link href="/" className="flex items-center gap-2 mb-4">
                            <Building2 className="h-6 w-6 text-primary" />
                            <span className="text-xl font-bold text-primary">عقار مصر</span>
                        </Link>
                        <p className="text-muted-foreground text-sm leading-relaxed max-w-sm">
                            منصتك الأولى للبحث عن العقارات في مصر. نوفر لك آلاف الخيارات الموثقة للبيع والإيجار لتجد منزل أحلامك بسهولة.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4">روابط سريعة</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/properties" className="hover:text-primary transition-colors">تصفح العقارات</Link></li>
                            <li><Link href="/compounds" className="hover:text-primary transition-colors">الكومباوندات</Link></li>
                            <li><Link href="/developers" className="hover:text-primary transition-colors">المطورين</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-bold mb-4">المزيد</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link href="/about" className="hover:text-primary transition-colors">من نحن</Link></li>
                            <li><Link href="/contact" className="hover:text-primary transition-colors">اتصل بنا</Link></li>
                            <li><Link href="/favorites" className="hover:text-primary transition-colors">المفضلة</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="border-t pt-8 text-center text-sm text-muted-foreground flex flex-col md:flex-row items-center justify-between">
                    <p>© 2026 عقار مصر. جميع الحقوق محفوظة.</p>
                    <p className="mt-2 md:mt-0">صُنع بشغف في مصر 🇪🇬</p>
                </div>
            </div>
        </footer>
    );
}