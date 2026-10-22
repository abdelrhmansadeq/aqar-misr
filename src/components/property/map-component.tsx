"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import Link from "next/link";
import { Property } from "@/types/property";

// حل مشكلة اختفاء أيقونة الدبوس (Pin) في Next.js
delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
    iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
    shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

export default function MapComponent({ properties }: { properties: Property[] }) {
    // إحداثيات افتراضية (القاهرة) لو مفيش عقارات
    const defaultCenter: [number, number] = [30.0444, 31.2357];

    return (
        <MapContainer
            center={defaultCenter}
            zoom={11}
            scrollWheelZoom={true}
            className="w-full h-[600px] rounded-xl z-0 border shadow-sm"
        >
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {properties.map((property) => {
                // التأكد إن العقار عنده إحداثيات
                if (!property.lat || !property.lng) return null;

                return (
                    <Marker key={property.id} position={[property.lat, property.lng]}>
                        <Popup className="rounded-xl">
                            <div className="p-1 min-w-[200px]">
                                <h3 className="font-bold text-sm mb-1">{property.title}</h3>
                                <p className="text-primary font-bold text-xs mb-2">
                                    {property.price.toLocaleString("ar-EG")} ج.م
                                </p>
                                <Link href={`/properties/${property.id}`} className="block">
                                    <button className="w-full bg-primary text-primary-foreground text-xs py-1.5 rounded-md hover:bg-primary/90 transition-colors">
                                        تفاصيل العقار
                                    </button>
                                </Link>
                            </div>
                        </Popup>
                    </Marker>
                );
            })}
        </MapContainer>
    );
}