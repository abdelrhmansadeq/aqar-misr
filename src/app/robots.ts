import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
    return {
        rules: {
            userAgent: '*',
            allow: '/',
            disallow: ['/aqar-ax6admin/', '/login/'], // منع جوجل من دخول لوحة التحكم
        },
        sitemap: 'https://aqar-misr-six.vercel.app/sitemap.xml', // تم تحديث اللينك بتاعك
    }
}