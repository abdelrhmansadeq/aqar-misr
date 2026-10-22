"use client";

import Image from "next/image";
import Link from "next/link";
import { MapPin, Bed, Bath, Square, Heart, Scale } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Property } from "@/types/property";
import { useFavorites } from "@/components/providers/favorites-provider";
import { useCompare } from "@/components/providers/compare-provider";
import { cn } from "@/lib/utils";

export function PropertyCard({ property }: { property: Property }) {
    const imageUrl = property.image_url || "/placeholder.jpg";
    const { toggleFavorite, isFavorite } = useFavorites();
    const { toggleCompare, isInCompare } = useCompare();

    const favorited = isFavorite(property.id);
    const compared = isInCompare(property.id);

    const handleAction = (e: React.MouseEvent, action: () => void) => {
        e.preventDefault();
        e.stopPropagation();
        action();
    };

    return (
        <Link href={`/properties/${property.id}`}>
            <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 group h-full border-border bg-card flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                    <Image
                        src={imageUrl}
                        alt={property.title}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />

                    {/* أزرار المفضلة والمقارنة */}
                    <div className="absolute top-3 left-3 flex flex-col gap-2 z-10">
                        <button
                            onClick={(e) => handleAction(e, () => toggleFavorite(property.id))}
                            className="p-2 bg-background/80 hover:bg-background backdrop-blur-sm rounded-full transition-colors shadow-sm"
                            aria-label="إضافة للمفضلة"
                        >
                            <Heart className={cn("h-4 w-4 transition-colors", favorited ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
                        </button>
                        <button
                            onClick={(e) => handleAction(e, () => toggleCompare(property.id))}
                            className={cn(
                                "p-2 backdrop-blur-sm rounded-full transition-colors shadow-sm",
                                compared ? "bg-primary text-primary-foreground hover:bg-primary/90" : "bg-background/80 hover:bg-background text-muted-foreground"
                            )}
                            aria-label="إضافة للمقارنة"
                        >
                            <Scale className="h-4 w-4" />
                        </button>
                    </div>

                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                        {property.verified && (
                            <Badge className="bg-green-600 hover:bg-green-700 text-white border-0">موثق</Badge>
                        )}
                        <Badge variant="secondary" className="bg-background/90 backdrop-blur-sm text-foreground">
                            {property.purpose === "sale" ? "للبيع" : "للإيجار"}
                        </Badge>
                    </div>
                </div>
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
            <span className="text-lg md:text-xl font-bold text-primary">
              {property.price.toLocaleString("ar-EG")} <span className="text-sm font-normal text-muted-foreground">ج.م</span>
            </span>
                    </div>
                </CardContent>
            </Card>
        </Link>
    );
}