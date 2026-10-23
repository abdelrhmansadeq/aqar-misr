"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";

export function DeletePropertyButton({ propertyId }: { propertyId: string }) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const supabase = createClient();
    const router = useRouter();

    const handleDelete = async () => {
        setLoading(true);

        try {
            // 1. نجيب صور العقار عشان نعرف نمسحها من الـ Storage
            const { data: images } = await supabase
                .from("property_images")
                .select("file_path")
                .eq("property_id", propertyId);

            // 2. نمسح الصور من الـ Storage
            if (images && images.length > 0) {
                const fileNames = images.map((img) => {
                    // بنستخرج اسم الصورة من الرابط
                    const parts = img.file_path.split('/property-images/');
                    return parts.length > 1 ? parts[1] : null;
                }).filter(Boolean) as string[];

                if (fileNames.length > 0) {
                    await supabase.storage.from("property-images").remove(fileNames);
                }
            }

            // 3. نمسح العقار من الداتابيز (الـ CASCADE هيمسح السجلات من property_images)
            const { error } = await supabase.from("properties").delete().eq("id", propertyId);

            if (error) throw error;

            toast.success("تم حذف العقار وصوره بنجاح");
            setOpen(false);
            router.refresh();
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message : "حدث خطأ أثناء الحذف";
            toast.error(message);
        } finally {
            setLoading(false);
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
                        هذا الإجراء لا يمكن التراجع عنه. سيتم حذف العقار وصوره نهائياً من الموقع.
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