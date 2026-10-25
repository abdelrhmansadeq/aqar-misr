import type { Metadata, Viewport } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Navbar } from "@/components/layout/navbar";
import { MobileBottomNav } from "@/components/layout/mobile-bottom-nav";
import { Footer } from "@/components/layout/footer";
import { NuqsAdapter } from 'nuqs/adapters/next/app';
import { FavoritesProvider } from "@/components/providers/favorites-provider";
import { CompareProvider } from "@/components/providers/compare-provider";
import { CompareBar } from "@/components/property/compare-bar";
import { Toaster } from "sonner";
import { WhatsAppFloat } from "@/components/layout/whatsapp-float";
import { Analytics } from '@vercel/analytics/next';
// ✅ استيراد السوبابيز عشان نجيب الرقم
import { createClient } from "@/lib/supabase/server";

const cairo = Cairo({
    subsets: ["arabic", "latin"],
    variable: "--font-cairo",
    display: "swap",
});

export const viewport: Viewport = {
    themeColor: "#0B1F3A",
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
};

export const metadata: Metadata = {
    metadataBase: new URL('https://aqar-misr-six.vercel.app'),
    title: {
        default: "عقار مصر | بوابتك لعالم العقارات",
        template: "%s | عقار مصر"
    },
    description: "الموقع الأول للعقارات في مصر. تصفح آلاف الشقق، الفيلات، والأراضي للبيع والإيجار بأفضل الأسعار.",
    keywords: ["عقارات مصر", "شقق للبيع", "شقق للإيجار", "فيلات للبيع", "أراضي للبيع", "التجمع الخامس", "العاصمة الإدارية"],
    authors: [{ name: "Abdelrhman Sadeq" }],
    manifest: "/manifest.webmanifest",
    appleWebApp: {
        capable: true,
        statusBarStyle: "default",
        title: "عقار مصر",
    },
    openGraph: {
        title: "عقار مصر | بوابتك لعالم العقارات",
        description: "تصفح آلاف العقارات الموثقة للبيع والإيجار في مصر.",
        url: "https://aqar-misr-six.vercel.app",
        siteName: "عقار مصر",
        locale: "ar_EG",
        type: "website",
        images: [
            {
                url: "/og-image.jpg",
                width: 1200,
                height: 630,
                alt: "عقار مصر",
            }
        ],
    },
    twitter: {
        card: "summary_large_image",
        title: "عقار مصر",
        description: "تصفح آلاف العقارات الموثقة للبيع والإيجار في مصر.",
        images: ["/og-image.jpg"],
    },
};

export default async function RootLayout({
                                             children,
                                         }: {
    children: React.ReactNode;
}) {
    // ✅ جلب رقم الواتساب من الإعدادات
    const supabase = await createClient();
    const { data: settings } = await supabase
        .from("site_settings")
        .select("whatsapp_number")
        .limit(1)
        .single();

    // لو مفيش رقم في الداتابيز، هنستخدم الرقم ده كاحتياطي
    const whatsappNumber = settings?.whatsapp_number || "01068595864";

    return (
        <html lang="ar" dir="rtl" suppressHydrationWarning>
        <body className={`${cairo.variable} font-sans antialiased min-h-screen flex flex-col bg-background text-foreground`}>
        <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
        >
            <NuqsAdapter>
                <FavoritesProvider>
                    <CompareProvider>
                        <Navbar />
                        <main className="flex-1 flex flex-col pb-20 md:pb-0">
                            {children}
                        </main>
                        <Footer />
                        <CompareBar />
                        {/* ✅ بنمرر الرقم للمكونات */}
                        <MobileBottomNav whatsappNumber={whatsappNumber} />
                        <Toaster position="bottom-center" richColors />
                        <WhatsAppFloat whatsappNumber={whatsappNumber} />
                        <Analytics />
                    </CompareProvider>
                </FavoritesProvider>
            </NuqsAdapter>
        </ThemeProvider>
        </body>
        </html>
    );
}