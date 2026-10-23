import { Building2, Target, Eye, ShieldCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-16 max-w-5xl">
            <div className="text-center mb-16 animate-fade-in-up">
                <Building2 className="h-16 w-16 mx-auto text-primary mb-4" />
                <h1 className="text-4xl font-bold text-primary mb-4">من نحن</h1>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                    "عقار مصر" هو منصتك الأولى والموثوقة للبحث عن العقارات في مصر. نسعى دائماً لتسهيل رحلة البحث عن منزل الأحلام أو الاستثمار العقاري الآمن من خلال توفير بيانات دقيقة وعقارات موثقة.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
                <Card className="bg-card border-border text-center p-6 animate-fade-in-up delay-100">
                    <CardContent className="space-y-4 pt-6">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                            <Eye className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold">رؤيتنا</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            أن نكون المنصة العقارية الرقمية الأكثر ثقة وشفافية في مصر والشرق الأوسط.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border text-center p-6 animate-fade-in-up delay-200">
                    <CardContent className="space-y-4 pt-6">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                            <Target className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold">مهمتنا</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            ربط المشترين والمستأجرين بأفضل العقارات بأسهل وأسرع الطرق، مع تقديم تجربة مستخدم استثنائية.
                        </p>
                    </CardContent>
                </Card>

                <Card className="bg-card border-border text-center p-6 animate-fade-in-up delay-300">
                    <CardContent className="space-y-4 pt-6">
                        <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto">
                            <ShieldCheck className="h-8 w-8 text-primary" />
                        </div>
                        <h2 className="text-xl font-bold">لماذا نحن؟</h2>
                        <p className="text-muted-foreground text-sm leading-relaxed">
                            نضمن لك عقارات موثقة، بيانات حقيقية، وحماية كاملة لبياناتك أثناء تصفحك للموقع.
                        </p>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}