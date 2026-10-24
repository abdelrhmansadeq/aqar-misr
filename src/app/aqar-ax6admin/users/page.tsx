import { createClient } from '@/lib/supabase/server'
import { UsersTable } from '@/components/admin/users-table'

export default async function UsersPage() {
    const supabase = await createClient()

    // جلب جميع المستخدمين من جدول profiles
    const { data: users, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        return (
            <div className="p-4 text-destructive bg-destructive/10 rounded-lg">
                حدث خطأ أثناء جلب المستخدمين: {error.message}
            </div>
        )
    }

    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-2xl font-bold text-primary">إدارة المستخدمين</h1>
                <p className="text-muted-foreground mt-1">
                    عرض وتعديل صلاحيات المستخدمين وحالة توثيقهم.
                </p>
            </div>
            <UsersTable initialUsers={users || []} />
        </div>
    )
}