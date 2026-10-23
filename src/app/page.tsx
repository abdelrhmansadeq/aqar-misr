import { Search, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createClient } from "@/lib/supabase/server";
import { PropertyCard } from "@/components/property/property-card";
import { Property } from "@/types/property";

export const dynamic = 'force-dynamic';

export default async function Home() {
  const supabase = await createClient();

  const { data: properties } = await supabase
      .from("properties")
      .select("*, property_images (id, file_path, order)")
      .eq("status", "published")
      .order("created_at", { ascending: false })
      .limit(6);

  return (
      <div className="flex flex-col">
        <section className="relative bg-primary/5 py-20 md:py-32">
          <div className="container mx-auto px-4 flex flex-col items-center text-center">

            {/* ضفنا هنا animate-fade-in-up */}
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-6 leading-tight animate-fade-in-up">
              ابحث عن بيت أحلامك <br /> في <span className="text-accent">مصر</span>
            </h1>

            <p className="text-lg text-muted-foreground mb-10 max-w-2xl animate-fade-in-up delay-100">
              آلاف العقارات الموثقة للبيع والإيجار. شقق، فيلات، وأراضي في أفضل المواقع.
            </p>

            <div className="w-full max-w-3xl bg-background p-2 rounded-xl shadow-lg border flex flex-col md:flex-row gap-2 animate-fade-in-up delay-200">
              <div className="flex-1 flex items-center px-3 bg-muted/50 rounded-lg md:bg-transparent">
                <Search className="h-5 w-5 text-muted-foreground ml-2" />
                <Input
                    placeholder="ابحث بالمنطقة، المدينة..."
                    className="border-0 bg-transparent focus-visible:ring-0 text-base"
                />
              </div>
              <Button size="lg" className="text-base px-8 py-6">
                بحث
              </Button>
            </div>
          </div>
        </section>

        <section className="container mx-auto px-4 py-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl font-bold text-primary">أحدث العقارات</h2>
          </div>

          {!properties || properties.length === 0 ? (
              <div className="text-center py-20 bg-muted/20 rounded-xl">
                <MapPin className="h-12 w-12 mx-auto text-muted-foreground mb-4 opacity-50" />
                <h3 className="text-lg font-semibold mb-2">لا توجد عقارات حالياً</h3>
                <p className="text-muted-foreground">قم بإضافة عقارات لتظهر هنا.</p>
              </div>
          ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {properties.map((property) => (
                    <PropertyCard key={property.id} property={property as Property} />
                ))}
              </div>
          )}
        </section>
      </div>
  );
}