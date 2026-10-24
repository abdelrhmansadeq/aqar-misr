import { fileTypeFromBuffer } from 'file-type';

// الأنواع المسموح بها فقط
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];

export async function validateImageMagicBytes(file: File): Promise<{ valid: boolean; detectedType?: string }> {
    try {
        // نقرأ أول 8 كيلوبايت فقط من الملف (كافية جداً لمعرفة نوع الصورة)
        const buffer = await file.slice(0, 8192).arrayBuffer();

        // نستخدم مكتبة file-type لفحص البصمة
        const type = await fileTypeFromBuffer(buffer);

        // لو الملف مش معروف أو نوعه مش صورة مسموح بها
        if (!type || !ALLOWED_IMAGE_TYPES.includes(type.mime)) {
            return { valid: false, detectedType: type?.mime };
        }

        return { valid: true, detectedType: type.mime };
    } catch (error) {
        // لو حصل أي خطأ في القراءة، نعتبره غير صالح
        console.error('Magic bytes validation error:', error);
        return { valid: false };
    }
}