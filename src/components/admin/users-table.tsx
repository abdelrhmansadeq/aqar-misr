"use client"

import { useState } from "react"
import { createBrowserClient } from "@supabase/ssr"
import { toast } from "sonner"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { ar } from "date-fns/locale"

// تعريف نوع البيانات المتوافق مع جدول profiles
type Profile = {
    id: string
    name: string
    email: string
    phone: string | null
    role: 'visitor' | 'admin' // اقتصرنا على الزائر والأدمن
    verified: boolean
    created_at: string
}

const roleLabels: Record<Profile['role'], string> = {
    visitor: 'زائر (مشتري)',
    admin: 'أدمن (مكتب)',
}

export function UsersTable({ initialUsers }: { initialUsers: Profile[] }) {
    const [users, setUsers] = useState<Profile[]>(initialUsers)
    const [updatingId, setUpdatingId] = useState<string | null>(null)

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    const handleRoleChange = async (userId: string, newRole: Profile['role']) => {
        setUpdatingId(userId)
        const { error } = await supabase
            .from('profiles')
            .update({ role: newRole })
            .eq('id', userId)

        if (error) {
            toast.error(`فشل تحديث الصلاحية: ${error.message}`)
        } else {
            toast.success('تم تحديث الصلاحية بنجاح')
            setUsers(users.map(u => u.id === userId ? { ...u, role: newRole } : u))
        }
        setUpdatingId(null)
    }

    const handleVerifiedToggle = async (userId: string, currentVerified: boolean) => {
        setUpdatingId(userId)
        const newVerified = !currentVerified
        const { error } = await supabase
            .from('profiles')
            .update({ verified: newVerified })
            .eq('id', userId)

        if (error) {
            toast.error(`فشل تحديث حالة التوثيق: ${error.message}`)
        } else {
            toast.success(newVerified ? 'تم توثيق المستخدم' : 'تم إلغاء توثيق المستخدم')
            setUsers(users.map(u => u.id === userId ? { ...u, verified: newVerified } : u))
        }
        setUpdatingId(null)
    }

    return (
        <div className="rounded-md border bg-card">
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead className="text-right">الاسم</TableHead>
                        <TableHead className="text-right">الإيميل</TableHead>
                        <TableHead className="text-right">الهاتف</TableHead>
                        <TableHead className="text-right">الصلاحية</TableHead>
                        <TableHead className="text-right">التوثيق</TableHead>
                        <TableHead className="text-right">تاريخ الانضمام</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users.length === 0 ? (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                لا يوجد مستخدمون حالياً.
                            </TableCell>
                        </TableRow>
                    ) : (
                        users.map((user) => (
                            <TableRow key={user.id}>
                                <TableCell className="font-medium">{user.name || 'بدون اسم'}</TableCell>
                                <TableCell dir="ltr" className="text-left">{user.email}</TableCell>
                                <TableCell dir="ltr" className="text-left">{user.phone || '—'}</TableCell>
                                <TableCell>
                                    <Select
                                        value={user.role}
                                        onValueChange={(value) => { void handleRoleChange(user.id, value as Profile['role']); }}
                                        disabled={updatingId === user.id}
                                    >
                                        <SelectTrigger className="w-30">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {Object.entries(roleLabels).map(([value, label]) => (
                                                <SelectItem key={value} value={value}>
                                                    {label}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={user.verified}
                                            onCheckedChange={() => handleVerifiedToggle(user.id, user.verified)}
                                            disabled={updatingId === user.id}
                                        />
                                        {user.verified && <Badge variant="default" className="bg-green-600">موثق</Badge>}
                                    </div>
                                </TableCell>
                                <TableCell className="text-sm text-muted-foreground">
                                    {format(new Date(user.created_at), 'dd MMM yyyy', { locale: ar })}
                                </TableCell>
                            </TableRow>
                        ))
                    )}
                </TableBody>
            </Table>
        </div>
    )
}