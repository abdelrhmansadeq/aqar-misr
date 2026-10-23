"use client";

import { useState } from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

export function PropertyGallery({
                                    images,
                                    title,
                                    verified,
                                    purpose
                                }: {
    images: string[];
    title: string;
    verified: boolean;
    purpose: string;
}) {
    const [activeImage, setActiveImage] = useState(images[0]);

    return (
        <div className="space-y-4 px-4 md:px-0">
            {/* الصورة الرئيسية في إطار مربع */}
            <div className="relative aspect-square md:aspect-[4/3] w-full overflow-hidden rounded-2xl bg-muted border shadow-sm">
                <Image
                    src={activeImage}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, 800px"
                    className="object-cover"
                    priority
                />
                <div className="absolute top-4 right-4 flex gap-2">
                    {verified && (
                        <Badge className="bg-green-600 text-white border-0 px-3 py-1 text-sm flex items-center gap-1">
                            <CheckCircle2 className="h-4 w-4" /> موثق
                        </Badge>
                    )}
                    <Badge variant="secondary" className="px-3 py-1 text-sm bg-background/90 text-foreground">
                        {purpose === "sale" ? "للبيع" : "للإيجار"}
                    </Badge>
                </div>
            </div>

            {/* الصور المصغرة (بتظهر بس لو فيه أكتر من صورة) */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
                    {images.map((img, index) => (
                        <button
                            key={index}
                            onClick={() => setActiveImage(img)}
                            className={cn(
                                "relative w-20 h-20 md:w-24 md:h-24 shrink-0 rounded-lg overflow-hidden border-2 transition-all",
                                activeImage === img ? "border-primary ring-2 ring-primary/20" : "border-transparent opacity-70 hover:opacity-100"
                            )}
                        >
                            <Image src={img} alt={`${title} - ${index + 1}`} fill className="object-cover" />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}