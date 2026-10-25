import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
    return {
        name: 'عقار مصر | بوابتك لعالم العقارات',
        short_name: 'عقار مصر',
        description: 'الموقع الأول للعقارات في مصر. تصفح آلاف الشقق، الفيلات، والأراضي للبيع والإيجار.',
        start_url: '/',
        display: 'standalone',
        background_color: '#ffffff',
        theme_color: '#0B1F3A',
        lang: 'ar',
        dir: 'rtl',
        icons: [
            {
                src: '/icon-192x192.png',
                sizes: '192x192',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
            },
            {
                src: '/icon-512x512.png',
                sizes: '512x512',
                type: 'image/png',
                purpose: 'maskable',
            },
        ],
    }
}