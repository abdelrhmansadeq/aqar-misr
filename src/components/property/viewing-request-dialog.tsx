"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { CalendarDays } from "lucide-react";

export function ViewingRequestDialog({ propertyId }: { propertyId: string }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const supabase = createClient();

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;
        const date = formData.get("date") as string;
        const time = formData.get("time") as string;

        const phoneRegex = /^01[0125][0-9]{8}$/;
        if (!phoneRegex.test(phone)) {
            setError("يرجى إدخال رقم موبايل مصري صحيح (مثال: 01012345678)");
            setLoading(false);
            return;
        }

        const { error: dbError } = await supabase.from("leads").insert({
            property_id: propertyId,
            name,
            phone,
            preferred_date: date,
            preferred_time: time,
            status: "new",
        });

        if (dbError) {
            setError("حدث خطأ أثناء إرسال الطلب. حاول مرة أخرى.");
            setLoading(false);
            return;
        }

        setSuccess(true);
        setLoading(false);
    };

    const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
        if (!newOpen) {
            setTimeout(() => {
                setSuccess(false);
                setError(null);
            }, 300);
        }
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            {/* هنا استخدمنا render بدل asChild */}
            <DialogTrigger render={
                                <Button variant="outline" className="w-full py-6 text-lg gap-2 border-primary text-primary hover:bg-primary/5">
                                   <CalendarDays className="h-5 w-5" />
                                   احجز معاينة
                               </Button>
                           } />

            <DialogContent className="sm:max-w-[425px]" dir="rtl">
                <DialogHeader>
                    <DialogTitle className="text-xl">حجز موعد معاينة</DialogTitle>
                    <DialogDescription>
                        املأ البيانات التالية وسيتواصل معك المعلن لتأكيد الموعد.
                    </DialogDescription>
                </DialogHeader>

                {success ? (
                    <div className="text-center py-6 space-y-4">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                            <CalendarDays className="h-8 w-8" />
                        </div>
                        <h3 className="text-lg font-bold">تم إرسال طلبك بنجاح!</h3>
                        <p className="text-muted-foreground text-sm">سيتواصل معك المعلن في أقرب وقت لتأكيد موعد المعاينة.</p>
                        <Button onClick={() => setOpen(false)} className="w-full mt-4">إغلاق</Button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
                        <div className="space-y-2">
                            <Label>الاسم بالكامل</Label>
                            <Input name="name" required placeholder="محمد أحمد" />
                        </div>

                        <div className="space-y-2">
                            <Label>رقم الموبايل</Label>
                            <Input name="phone" type="tel" required placeholder="01xxxxxxxxx" dir="ltr" className="text-right" />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>التاريخ المفضل</Label>
                                <Input name="date" type="date" required min={new Date().toISOString().split("T")[0]} />
                            </div>
                            <div className="space-y-2">
                                <Label>الوقت المفضل</Label>
                                <Input name="time" type="time" required />
                            </div>
                        </div>

                        {error && <p className="text-sm text-destructive font-medium">{error}</p>}

                        <Button type="submit" className="w-full mt-2" disabled={loading}>
                            {loading ? "جاري الإرسال..." : "تأكيد الحجز"}
                        </Button>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}