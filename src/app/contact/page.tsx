import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ContactForm } from "@/components/layout/contact-form";

export default function ContactPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-6xl animate-fade-in-up">
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold text-primary mb-4">اتصل بنا</h1>
                <p className="text-muted-foreground">نحن هنا لمساعدتك والإجابة على جميع استفساراتك.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* نموذج التواصل */}
                <ContactForm />

                {/* بيانات التواصل */}
                <div className="space-y-6">
                    <Card className="bg-card border-border">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-full text-primary">
                                <Phone className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold">اتصل بنا</h3>
                                <p className="text-muted-foreground dir-ltr text-right" dir="ltr">+20 101 234 5678</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-full text-primary">
                                <Mail className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold">البريد الإلكتروني</h3>
                                <p className="text-muted-foreground">info@aqarmisr.com</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card className="bg-card border-border">
                        <CardContent className="p-6 flex items-center gap-4">
                            <div className="bg-primary/10 p-3 rounded-full text-primary">
                                <MapPin className="h-6 w-6" />
                            </div>
                            <div>
                                <h3 className="font-bold">موقعنا</h3>
                                <p className="text-muted-foreground">القاهرة الجديدة، التجمع الخامس، مصر</p>
                            </div>
                        </CardContent>
                    </Card>

                    <div className="bg-primary/5 rounded-2xl border border-primary/20 p-8 text-center space-y-4">
                        <MessageCircle className="h-12 w-12 mx-auto text-green-500" />
                        <h2 className="text-xl font-bold">تواصل مباشر أسرع</h2>
                        <a href="https://wa.me/201012345678" target="_blank" rel="noopener noreferrer" className="block">
                            <Button className="w-full py-6 text-lg bg-green-600 hover:bg-green-700 text-white gap-2">
                                <MessageCircle className="h-5 w-5" /> تحدث معنا عبر واتساب
                            </Button>
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
}