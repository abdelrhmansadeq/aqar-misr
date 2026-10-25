"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

// تعريف نوع البيانات عشان نمنع any
type SiteSettings = {
    id: string;
    whatsapp_number: string;
    contact_email: string;
};

export function SettingsForm({ initialData }: { initialData: SiteSettings | null }) {
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();

    const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const whatsapp_number = formData.get("whatsapp_number") as string;
        const contact_email = formData.get("contact_email") as string;

        const { error } = await supabase
            .from("site_settings")
            .update({ whatsapp_number, contact_email, updated_at: new Date().toISOString() })
            .eq("id", initialData?.id);

        if (error) {
            toast.error("حدث خطأ أثناء حفظ الإعدادات");
        } else {
            toast.success("تم حفظ الإعدادات بنجاح");
            router.refresh();
        }
        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
                {/* ✅ غيرنا الاسم هنا عشان يناسب اليوزر أو اللينك */}
                <Label>رقم الواتساب، اليوزر، أو الرابط المباشر</Label>
                <Input
                    name="whatsapp_number"
                    defaultValue={initialData?.whatsapp_number || "201012345678"}
                    placeholder="مثال: 201012345678 أو aqarmisr أو https://wa.me/..."
                    dir="ltr"
                    className="text-right"
                    required
                />
                <p className="text-xs text-muted-foreground">
                    يمكنك إدخال رقم بصيغة دولية (بدون +)، أو اسم المستخدم (Username)، أو رابط كامل (wa.me).
                </p>
            </div>

            <div className="space-y-2">
                <Label>البريد الإلكتروني للتواصل</Label>
                <Input
                    name="contact_email"
                    type="email"
                    defaultValue={initialData?.contact_email || "info@aqarmisr.com"}
                    dir="ltr"
                    className="text-right"
                    required
                />
            </div>

            <Button type="submit" disabled={loading} className="w-full">
                {loading ? "جاري الحفظ..." : "حفظ الإعدادات"}
            </Button>
        </form>
    );
}