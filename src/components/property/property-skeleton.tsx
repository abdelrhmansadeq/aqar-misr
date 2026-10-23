import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function PropertySkeleton() {
    return (
        <Card className="overflow-hidden border-border bg-card h-full">
            <Skeleton className="aspect-[4/3] w-full rounded-none" />
            <CardContent className="p-4 flex flex-col flex-1 justify-between">
                <div>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                </div>
                <div className="flex items-center justify-between pt-3 mt-3 border-t border-border">
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-8" />
                    <Skeleton className="h-4 w-12" />
                </div>
                <Skeleton className="h-6 w-1/3 mt-3" />
            </CardContent>
        </Card>
    );
}