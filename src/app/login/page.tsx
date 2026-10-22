"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Building2 } from "lucide-react";
import Link from "next/link";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError("بيانات الدخول غير صحيحة");
            setLoading(false);
        } else {
            // التوجيه للمسار السري الجديد
            router.push("/aqar-ax6admin");
            router.refresh();
        }
    };

    return (
        <div className="flex min-h-[80vh] items-center justify-center px-4">
            <div className="w-full max-w-md space-y-8 border p-8 rounded-2xl shadow-sm bg-card">
                <div className="text-center">
                    <Building2 className="mx-auto h-12 w-12 text-primary" />
                    <h2 className="mt-4 text-2xl font-bold">تسجيل الدخول للإدارة</h2>
                    <p className="text-sm text-muted-foreground mt-2">أدخل بياناتك للوصول للوحة التحكم</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium">البريد الإلكتروني</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@aqarmisr.com"
                            required
                            dir="ltr"
                            className="mt-1"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium">كلمة المرور</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            dir="ltr"
                            className="mt-1"
                        />
                    </div>

                    {error && <p className="text-sm text-destructive font-medium text-center">{error}</p>}

                    <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
                        {loading ? "جاري الدخول..." : "دخول"}
                    </Button>
                </form>

                <div className="text-center">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-primary">
                        العودة للصفحة الرئيسية
                    </Link>
                </div>
            </div>
        </div>
    );
}