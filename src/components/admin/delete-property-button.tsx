"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

export function DeletePropertyButton({ propertyId }: { propertyId: string }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const handleDelete = async () => {
        setLoading(true);
        const { error } = await supabase.from("properties").delete().eq("id", propertyId);
        setLoading(false);

        if (error) {
            alert("حدث خطأ أثناء الحذف");
        } else {
            setOpen(false);
            router.refresh(); // تحديث الجدول
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger render={
                                <Button variant="ghost" size="sm" className="text-destructive hover:text-destructive hover:bg-destructive/10" />
                           }>
                <Trash2 className="h-4 w-4" />
            </DialogTrigger>
            <DialogContent dir="rtl">
                <DialogHeader>
                    <DialogTitle>هل أنت متأكد من الحذف؟</DialogTitle>
                    <DialogDescription>
                        هذا الإجراء لا يمكن التراجع عنه. سيتم حذف العقار نهائياً من الموقع.
                    </DialogDescription>
                </DialogHeader>
                <DialogFooter className="gap-2 mt-4">
                    <Button variant="outline" onClick={() => setOpen(false)} disabled={loading}>إلغاء</Button>
                    <Button variant="destructive" onClick={handleDelete} disabled={loading}>
                        {loading ? "جاري الحذف..." : "نعم، احذف العقار"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}