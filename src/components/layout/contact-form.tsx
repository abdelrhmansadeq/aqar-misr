"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Send } from "lucide-react";

export function ContactForm() {
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const phone = formData.get("phone") as string;
        const message = formData.get("message") as string;

        const { error } = await supabase.from("contact_messages").insert({
            name,
            email,
            phone,
            message,
        });

        if (error) {
            toast.error("حدث خطأ أثناء إرسال الرسالة. حاول مرة أخرى.");
        } else {
            setSuccess(true);
            toast.success("تم إرسال رسالتك بنجاح! سنتواصل معك قريباً.");
        }
        setLoading(false);
    };

    if (success) {
        return (
            <div className="bg-green-50 text-green-700 p-8 rounded-2xl text-center border border-green-200">
                <Send className="h-12 w-12 mx-auto mb-4 text-green-500" />
                <h3 className="text-xl font-bold mb-2">تم استلام رسالتك!</h3>
                <p>شكراً لتواصلك معنا، فريقنا سيرد عليك في أقرب وقت ممكن.</p>
                <Button onClick={() => setSuccess(false)} variant="outline" className="mt-6 border-green-500 text-green-700">
                    إرسال رسالة أخرى
                </Button>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 bg-card border rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold mb-4">أرسل لنا رسالة</h3>
            <div className="space-y-2">
                <Label>الاسم بالكامل</Label>
                <Input name="name" required placeholder="محمد أحمد" />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label>البريد الإلكتروني (اختياري)</Label>
                    <Input name="email" type="email" placeholder="example@mail.com" dir="ltr" className="text-right" />
                </div>
                <div className="space-y-2">
                    <Label>رقم الموبايل</Label>
                    <Input name="phone" type="tel" required placeholder="01xxxxxxxxx" dir="ltr" className="text-right" />
                </div>
            </div>
            <div className="space-y-2">
                <Label>رسالتك</Label>
                <Textarea name="message" required placeholder="اكتب استفسارك هنا..." className="min-h-[120px]" />
            </div>
            <Button type="submit" disabled={loading} className="w-full py-6 text-lg gap-2">
                <Send className="h-5 w-5" /> {loading ? "جاري الإرسال..." : "إرسال الرسالة"}
            </Button>
        </form>
    );
}