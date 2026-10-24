import { createClient } from "@/lib/supabase/server";
import { Card, CardContent } from "@/components/ui/card";
import { Mail, Phone, User, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default async function AdminMessagesPage() {
    const supabase = await createClient();

    const { data: messages } = await supabase
        .from("contact_messages")
        .select("*")
        .order("created_at", { ascending: false });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-2xl font-bold">رسائل التواصل</h1>
                <Badge variant="secondary">{messages?.length || 0} رسالة</Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {messages?.map((msg) => (
                    <Card key={msg.id} className="bg-card">
                        <CardContent className="p-5 space-y-4">
                            <div className="flex items-start justify-between">
                                <div className="flex items-center gap-2 font-bold">
                                    <User className="h-4 w-4 text-primary" />
                                    {msg.name}
                                </div>
                                <Badge variant={msg.is_read ? "secondary" : "default"}>
                                    {msg.is_read ? "تمت القراءة" : "جديدة"}
                                </Badge>
                            </div>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                                <a href={`tel:${msg.phone}`} className="flex items-center gap-1 hover:text-primary" dir="ltr">
                                    <Phone className="h-3 w-3" /> {msg.phone}
                                </a>
                                {msg.email && (
                                    <a href={`mailto:${msg.email}`} className="flex items-center gap-1 hover:text-primary">
                                        <Mail className="h-3 w-3" /> {msg.email}
                                    </a>
                                )}
                            </div>

                            <div className="bg-muted/50 p-4 rounded-lg text-sm leading-relaxed">
                                {msg.message}
                            </div>

                            <div className="flex items-center gap-1 text-xs text-muted-foreground">
                                <Clock className="h-3 w-3" />
                                {/* التعديل هنا: استخدمنا toLocaleString بدل toLocaleDateString */}
                                {new Date(msg.created_at).toLocaleString("ar-EG", { dateStyle: 'long', timeStyle: 'short' })}
                            </div>
                        </CardContent>
                    </Card>
                ))}
                {(!messages || messages.length === 0) && (
                    <div className="col-span-full text-center py-12 bg-muted/20 rounded-xl border border-dashed">
                        <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                        <p className="text-muted-foreground">لا توجد رسائل حتى الآن.</p>
                    </div>
                )}
            </div>
        </div>
    );
}