"use client";

import { Button } from "@/components/ui/button";
import { Share2, Link as LinkIcon, MessageCircle } from "lucide-react";
import { toast } from "sonner";

export function ShareButtons({ title, url }: { title: string; url: string }) {
    const handleCopy = () => {
        navigator.clipboard.writeText(url);
        toast.success("تم نسخ رابط العقار");
    };

    const whatsappShare = `https://wa.me/?text=${encodeURIComponent(`شوف هذا العقار: ${title}\n${url}`)}`;

    return (
        <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={handleCopy} title="نسخ الرابط">
                <LinkIcon className="h-4 w-4" />
            </Button>
            <a href={whatsappShare} target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="icon" className="text-green-600 border-green-600 hover:bg-green-50" title="مشاركة عبر واتساب">
                    <MessageCircle className="h-4 w-4" />
                </Button>
            </a>
        </div>
    );
}