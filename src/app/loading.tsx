import { PropertySkeleton } from "@/components/property/property-skeleton";

export default function Loading() {
    return (
        <div className="container mx-auto px-4 py-16">
            <div className="flex items-center justify-between mb-8">
                <div className="h-8 w-48 bg-muted animate-pulse rounded-md" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(3)].map((_, i) => (
                    <PropertySkeleton key={i} />
                ))}
            </div>
        </div>
    );
}