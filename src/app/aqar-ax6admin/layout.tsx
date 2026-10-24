import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { AdminLayoutClient } from '@/components/admin/admin-layout-client'

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    // 1. إنشاء اتصال Supabase على السيرفر
    const supabase = await createClient()

    // 2. التأكد من وجود مستخدم مسجل (طبقة الحماية الثانية)
    const { data: { user } } = await supabase.auth.getUser()

    // 3. لو مفيش مستخدم، اطرده فوراً لصفحة الدخول
    if (!user) {
        redirect('/login')
    }

    // 4. لو فيه مستخدم، اعرض الواجهة العادية (التي نقلناها لملف منفصل)
    return (
        <AdminLayoutClient>
            {children}
        </AdminLayoutClient>
    )
}