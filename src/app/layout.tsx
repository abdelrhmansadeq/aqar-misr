import type { Metadata } from "next";
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
import { WhatsAppFloat } from "@/components/layout/whatsapp-float"; // ضفنا الاستيراد ده

const cairo = Cairo({
    subsets: ["arabic", "latin"],
    variable: "--font-cairo",
    display: "swap",
});

export const metadata: Metadata = {
    title: {
        default: "عقار مصر | بوابتك لعالم العقارات",
        template: "%s | عقار مصر"
    },
    description: "الموقع الأول للعقارات في مصر. تصفح آلاف الشقق، الفيلات، والأراضي للبيع والإيجار بأفضل الأسعار.",
    keywords: ["عقارات مصر", "شقق للبيع", "شقق للإيجار", "فيلات للبيع", "أراضي للبيع", "التجمع الخامس", "العاصمة الإدارية"],
    authors: [{ name: "Abdelrhman Sadeq" }],
    openGraph: {
        title: "عقار مصر | بوابتك لعالم العقارات",
        description: "تصفح آلاف العقارات الموثقة للبيع والإيجار في مصر.",
        url: "https://aqar-misr-six.vercel.app",
        siteName: "عقار مصر",
        locale: "ar_EG",
        type: "website",
    },
    twitter: {
        card: "summary_large_image",
        title: "عقار مصر",
        description: "تصفح آلاف العقارات الموثقة للبيع والإيجار في مصر.",
    },
};

export default function RootLayout({
                                       children,
                                   }: {
    children: React.ReactNode;
}) {
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
                        <MobileBottomNav />
                        <Toaster position="bottom-center" richColors />

                        {/* الزرار العائم هنا */}
                        <WhatsAppFloat />

                    </CompareProvider>
                </FavoritesProvider>
            </NuqsAdapter>
        </ThemeProvider>
        </body>
        </html>
    );
}