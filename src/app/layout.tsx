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

const cairo = Cairo({
    subsets: ["arabic", "latin"],
    variable: "--font-cairo",
    display: "swap",
});

export const metadata: Metadata = {
    title: "عقار مصر | موقع العقارات الأول",
    description: "ابحث عن شقق، فيلات، وأراضي للبيع والإيجار في مصر.",
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
                {/* الترتيب هنا مهم جداً عشان الأخطاء تختفي */}
                <FavoritesProvider>
                    <CompareProvider>
                        <Navbar />
                        <main className="flex-1 flex flex-col pb-20 md:pb-0">
                            {children}
                        </main>
                        <Footer />
                        <CompareBar />
                        <MobileBottomNav />
                    </CompareProvider>
                </FavoritesProvider>
            </NuqsAdapter>
        </ThemeProvider>
        </body>
        </html>
    );
}