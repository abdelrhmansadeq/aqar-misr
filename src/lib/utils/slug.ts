export function generateSlug(title: string): string {
    if (!title) return `عقار-${Date.now()}`;

    // 1. إزالة المسافات الزائدة من البداية والنهاية
    let slug = title.trim();

    // 2. استبدال المسافات بشرطة (-)
    slug = slug.replace(/\s+/g, '-');

    // 3. إزالة الرموز الغريبة (نسبق الحروف العربية والإنجليزية والأرقام والشرطات فقط)
    slug = slug.replace(/[^\u0621-\u064Aa-zA-Z0-9\-]/g, '');

    // 4. إضافة كود عشوائي صغير في الآخر لضمان عدم التكرار (مثلاً: -a3f9)
    const uniqueSuffix = Math.random().toString(36).substring(2, 6);

    return `${slug}-${uniqueSuffix}`;
}