"use client";

import { Button } from "@/components/ui/button";
import { MessageCircle, Phone } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

export function ContactButtons({
                                   propertyId,
                                   whatsappLink,
                                   phone
                               }: {
    propertyId: string;
    whatsappLink: string;
    phone: string;
}) {
    const supabase = createClient();

    const handleWhatsAppClick = async () => {
        // بنسجل النقرة
        await supabase.rpc("increment_whatsapp_click", { prop_id: propertyId });
    };

    const handleCallClick = async () => {
        // بنسجل النقرة
        await supabase.rpc("increment_call_click", { prop_id: propertyId });
    };

    return (
        <>
            <a href={whatsappLink} target="_blank" rel="noopener noreferrer" className="block" onClick={handleWhatsAppClick}>
                <Button className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 text-white gap-2">
                    <MessageCircle className="h-5 w-5" />تواصل واتساب
                </Button>
            </a>
            <a href={`tel:${phone}`} className="block" onClick={handleCallClick}>
                <Button variant="outline" className="w-full py-6 text-lg gap-2 border-primary text-primary hover:bg-primary/5">
                    <Phone className="h-5 w-5" />اتصال هاتفي
                </Button>
            </a>
        </>
    );
}