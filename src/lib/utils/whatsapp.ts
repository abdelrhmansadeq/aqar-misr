export function generateWhatsAppLink(phone: string, propertyTitle: string, propertyId: string) {
    // التأكد إن الرقم بيبدأ بـ 2 عشان كود مصر (20)
    const formattedPhone = phone.startsWith("0") ? `2${phone}` : phone;

    const message = `مرحباً، أنا مهتم بالعقار "${propertyTitle}" المعروض على موقع عقار مصر.\nرابط العقار: http://localhost:3000/properties/${propertyId}`;

    // تحويل النص لصيغة يفهمها المتصفح
    const encodedMessage = encodeURIComponent(message);

    return `https://wa.me/${formattedPhone}?text=${encodedMessage}`;
}