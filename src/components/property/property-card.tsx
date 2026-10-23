"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Square, Heart, Scale, Clock, User } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types/property";
import { useFavorites } from "@/components/providers/favorites-provider";
import { useCompare } from "@/components/providers/compare-provider";
import { cn } from "@/lib/utils";
import { timeAgo } from "@/lib/utils/time";
import { useState } from "react";

export function PropertyCard({ property }: { property: Property }) {
    const { toggleFavorite, isFavorite } = useFavorites();
    const { toggleCompare, isInCompare } = useCompare();

    const favorited = isFavorite(property.id);
    const compared = isInCompare(property.id);

    let propertyImages: string[] = [];
    if (property.property_images && property.property_images.length > 0) {
        propertyImages = property.property_images
            .sort((a, b) => a.order - b.order)
            .map((img) => img.file_path)
            .filter((url) => url && url.trim() !== "" && url !== "null");
    }
    if (propertyImages.length === 0 && property.image_url) propertyImages.push(property.image_url);
    if (propertyImages.length === 0) propertyImages.push("/placeholder.jpg");

    const [activeIndex, setActiveIndex] = useState(0);

    // دالة بتحدث النقط اللي تحت لما تسحب الصورة
    const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
        const container = e.currentTarget;
        const scrollLeft = Math.abs(container.scrollLeft);
        const width = container.clientWidth;
        if (width > 0) {
            const index = Math.round(scrollLeft / width);
            setActiveIndex(index);
        }
    };

    const pricePerMeter = Math.round(property.price / property.area_m2);

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.preventDefault();
        e.stopPropagation();
        action();
    };

    return (
        <Link href={`/properties/${property.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group h-full border-border bg-card flex flex-col">

                {/* الحاوية الرئيسية للصورة */}
                <div className="relative w-full aspect-[4/3] bg-muted overflow-hidden">

                    {/* السلايدر الأصلي: Scroll Snap */}
                    <div
                        className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
                        onScroll={handleScroll}
                    >
                        {propertyImages.map((img, index) => (
                            <div key={index} className="relative w-full h-full flex-shrink-0 snap-center">
                                <Image
                                    src={img}
                                    alt={`${property.title} - ${index + 1}`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                />
                            </div>
                        ))}
                    </div>

                    {/* النقط (Dots) */}
                    {propertyImages.length > 1 && (
                        <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5 z-10">
                            {propertyImages.map((_, index) => (
                                <div
                                    key={index}
                                    className={cn(
                                        "h-1.5 rounded-full transition-all duration-300 shadow-sm",
                                        activeIndex === index ? "w-5 bg-white" : "w-1.5 bg-white/60"
                                    )}
                                />
                            ))}
                        </div>
                    )}

                    {/* أزرار المفضلة والمقارنة */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        <button
                            onClick={(e) => handleAction(e, () => toggleFavorite(property.id))}
                            className="p-2 bg-background/80 hover:bg-background backdrop-blur-sm rounded-full transition-colors shadow-sm"
                        >
                            <Heart className={cn("h-4 w-4 transition-colors", favorited ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
                        </button>
                        <button
                            onClick={(e) => handleAction(e, () => toggleCompare(property.id))}
                            className={cn(
                                "p-2 backdrop-blur-sm rounded-full transition-colors shadow-sm",
                                compared ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-background/80 hover:bg-background text-muted-foreground"
                            )}
                        >
                            <Scale className="h-4 w-4" />
                        </button>
                    </div>

                    {/* الشارات */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2 z-10">
                        {property.verified && (
                            <Badge className="bg-green-600 hover:bg-green-700 text-white border-0">موثق</Badge>
                        )}
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-foreground">
                            {property.purpose === "sale" ? "للبيع" : "للإيجار"}
                        </Badge>
                    </div>
                </div>

                {/* تفاصيل الكارت */}
                <CardContent className="p-4 flex flex-col flex-1 justify-between">
                    <div>
                        <h3 className="font-bold text-lg line-clamp-1 group-hover:text-primary transition-colors text-foreground mb-1">
                            {property.title}
                        </h3>
                        <div className="flex items-center gap-1 text-muted-foreground text-xs md:text-sm">
                            <MapPin className="h-3.5 w-3.5" />
                            <span>{property.city}، {property.district}</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between pt-3 mt-3 border-t border-border text-xs md:text-sm text-muted-foreground">
                        <div className="flex items-center gap-1"><Bed className="h-4 w-4" /><span>{property.bedrooms}</span></div>
                        <div className="flex items-center gap-1"><Bath className="h-4 w-4" /><span>{property.bathrooms}</span></div>
                        <div className="flex items-center gap-1"><Square className="h-4 w-4" /><span>{property.area_m2} م²</span></div>
                    </div>

                    <div className="pt-3">
                        <div className="flex items-end justify-between">
                            <div>
                <span className="text-lg md:text-xl font-bold text-primary">
                  {property.price.toLocaleString("ar-EG")} <span className="text-sm font-normal text-muted-foreground">ج.م</span>
                </span>
                                {property.purpose === "rent" && <span className="text-xs text-muted-foreground"> /شهرياً</span>}
                            </div>
                            <span className="text-[10px] md:text-xs text-muted-foreground bg-muted px-2 py-1 rounded-md">
                سعر المتر: {pricePerMeter.toLocaleString("ar-EG")}
              </span>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-border text-[10px] md:text-xs text-muted-foreground">
                        <div className="flex items-center gap-1"><User className="h-3 w-3" /><span>مالك مباشر</span></div>
                        <div className="flex items-center gap-1"><Clock className="h-3 w-3" /><span>{property.created_at ? timeAgo(property.created_at) : "الآن"}</span></div>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}