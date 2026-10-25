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
            router.push("/aqar-ax6admin");
            router.refresh();
        }
    };

    return (
        // استخدمنا min-h-[100dvh] عشان نتعامل مع لوحة المفاتيح في الموبايل
        <div className="flex min-h-[100dvh] items-center justify-center px-4 py-12 bg-muted/30">
            <div className="w-full max-w-md space-y-8 border p-6 md:p-8 rounded-2xl shadow-lg bg-card">
                <div className="text-center">
                    <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                        <Building2 className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold text-primary">تسجيل الدخول للإدارة</h2>
                    <p className="text-sm text-muted-foreground mt-2">أدخل بياناتك للوصول للوحة التحكم</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-5">
                    <div>
                        <label className="text-sm font-medium mb-1 block">البريد الإلكتروني</label>
                        <Input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            placeholder="admin@aqarmisr.com"
                            required
                            dir="ltr"
                            className="mt-1 text-left text-base md:text-sm h-11" // text-base مهم جداً عشان يمنع الزوم في الموبايل
                            autoComplete="email"
                        />
                    </div>
                    <div>
                        <label className="text-sm font-medium mb-1 block">كلمة المرور</label>
                        <Input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            placeholder="••••••••"
                            required
                            dir="ltr"
                            className="mt-1 text-left text-base md:text-sm h-11"
                            autoComplete="current-password"
                        />
                    </div>

                    {error && <p className="text-sm text-destructive font-medium text-center bg-destructive/10 py-2 rounded-md">{error}</p>}

                    <Button type="submit" className="w-full h-11 text-lg" disabled={loading}>
                        {loading ? "جاري الدخول..." : "دخول"}
                    </Button>
                </form>

                <div className="text-center">
                    <Link href="/" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        العودة للصفحة الرئيسية
                    </Link>
                </div>
            </div>
        </div>
    );
}