"use client";

import Link from "next/link";
import { Building2, LayoutDashboard, Home, Users, Settings, ArrowRight, CalendarDays, Search } from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";
import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    // دالة عشان نلون اللينك النشط
    const getLinkClass = (path: string) => {
        const baseClass = "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200 text-sm font-medium";
        if (pathname === path) {
            return `${baseClass} bg-primary/10 text-primary`;
        }
        return `${baseClass} text-muted-foreground hover:bg-muted hover:text-foreground`;
    };

    return (
        <div className="flex min-h-screen bg-muted/10">
            {/* القائمة الجانبية للكمبيوتر */}
            <aside className="hidden md:flex w-64 flex-col border-l bg-card shadow-sm z-10">
                <div className="h-16 flex items-center justify-center border-b px-4">
                    <Link href="/" className="flex items-center gap-2 font-bold text-primary">
                        <Building2 className="h-6 w-6" />
                        <span>لوحة التحكم</span>
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-1.5 overflow-y-auto">
                    <Link href="/aqar-ax6admin" className={getLinkClass("/aqar-ax6admin")}>
                        <LayoutDashboard className="h-5 w-5" />
                        <span>نظرة عامة</span>
                    </Link>
                    <Link href="/aqar-ax6admin/properties" className={getLinkClass("/aqar-ax6admin/properties")}>
                        <Home className="h-5 w-5" />
                        <span>إدارة العقارات</span>
                    </Link>
                    <Link href="/aqar-ax6admin/leads" className={getLinkClass("/aqar-ax6admin/leads")}>
                        <CalendarDays className="h-5 w-5" />
                        <span>طلبات المعاينة</span>
                    </Link>
                    {/* اللينك الجديد هنا */}
                    <Link href="/aqar-ax6admin/saved-searches" className={getLinkClass("/aqar-ax6admin/saved-searches")}>
                        <Search className="h-5 w-5" />
                        <span>البحثات المحفوظة</span>
                    </Link>
                    <Link href="/aqar-ax6admin/messages" className={getLinkClass("/aqar-ax6admin/messages")}>
                        <Mail className="h-5 w-5" />
                        <span>رسائل التواصل</span>
                    </Link>
                    <Link href="/aqar-ax6admin/users" className={getLinkClass("/aqar-ax6admin/users")}>
                        <Users className="h-5 w-5" />
                        <span>المستخدمين</span>
                    </Link>
                    <Link href="/aqar-ax6admin/settings" className={getLinkClass("/aqar-ax6admin/settings")}>
                        <Settings className="h-5 w-5" />
                        <span>الإعدادات</span>
                    </Link>
                </nav>
                <div className="p-4 border-t space-y-2">
                    <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-muted transition-colors">
                        <ArrowRight className="h-5 w-5" />
                        <span>العودة للموقع</span>
                    </Link>
                    <LogoutButton />
                </div>
            </aside>

            {/* محتوى الصفحة */}
            <div className="flex-1 flex flex-col min-w-0">
                <header className="md:hidden h-16 border-b bg-card flex items-center justify-between px-4 shadow-sm">
                    <span className="font-bold text-primary">لوحة التحكم</span>
                    <Link href="/" className="text-sm text-muted-foreground hover:text-primary">الموقع</Link>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-auto">
                    <div className="max-w-7xl mx-auto">
                        {children}
                    </div>
                </main>
            </div>
        </div>
    );
}