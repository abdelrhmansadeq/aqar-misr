import Link from "next/link";
import { Building2, LayoutDashboard, Home, Users, Settings, ArrowRight, CalendarDays } from "lucide-react";
import { LogoutButton } from "@/components/admin/logout-button";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    return (
        <div className="flex min-h-screen bg-muted/20">
            {/* القائمة الجانبية للكمبيوتر */}
            <aside className="hidden md:flex w-64 flex-col border-l bg-card text-card-foreground">
                <div className="h-16 flex items-center justify-center border-b px-4">
                    <Link href="/" className="flex items-center gap-2 font-bold text-primary">
                        <Building2 className="h-6 w-6" />
                        <span>لوحة التحكم</span>
                    </Link>
                </div>
                <nav className="flex-1 p-4 space-y-2">
                    <Link href="/aqar-ax6admin" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors">
                        <LayoutDashboard className="h-5 w-5" />
                        <span>الرئيسية</span>
                    </Link>
                    <Link href="/aqar-ax6admin/properties" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors">
                        <Home className="h-5 w-5" />
                        <span>العقارات</span>
                    </Link>
                    <Link href="/aqar-ax6admin/leads" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors">
                        <CalendarDays className="h-5 w-5" />
                        <span>طلبات المعاينة</span>
                    </Link>
                    <Link href="/aqar-ax6admin/users" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors">
                        <Users className="h-5 w-5" />
                        <span>المستخدمين</span>
                    </Link>
                    <Link href="/aqar-ax6admin/settings" className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-primary/10 hover:text-primary transition-colors">
                        <Settings className="h-5 w-5" />
                        <span>الإعدادات</span>
                    </Link>
                </nav>
                <div className="p-4 border-t space-y-2">
                    <Link href="/" className="flex items-center gap-3 px-3 py-2 rounded-md text-muted-foreground hover:bg-muted transition-colors">
                        <ArrowRight className="h-5 w-5" />
                        <span>العودة للموقع</span>
                    </Link>
                    <LogoutButton />
                </div>
            </aside>

            {/* محتوى الصفحة */}
            <div className="flex-1 flex flex-col">
                <header className="md:hidden h-16 border-b bg-card flex items-center justify-between px-4">
                    <span className="font-bold text-primary">لوحة التحكم</span>
                    <Link href="/" className="text-sm text-muted-foreground">الموقع</Link>
                </header>

                <main className="flex-1 p-4 md:p-8 overflow-auto">
                    {children}
                </main>
            </div>
        </div>
    );
}