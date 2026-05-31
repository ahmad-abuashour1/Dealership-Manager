import { useState, useMemo } from "react";
import { useListCars, useGetCarStats } from "@workspace/api-client-react";
import { CarCard } from "@/components/CarCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, FilterX } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Inventory() {
  const [search, setSearch] = useState("");
  const [brand, setBrand] = useState<string>("all");
  const [availableOnly, setAvailableOnly] = useState(false);
  const { t } = useLanguage();

  const queryParams: Record<string, unknown> = {};
  if (brand !== "all") queryParams.brand = brand;
  if (availableOnly) queryParams.available = true;

  const { data: cars, isLoading } = useListCars(queryParams);
  const { data: stats } = useGetCarStats();

  const filteredCars = useMemo(() => {
    if (!cars) return [];
    if (!search) return cars;
    const s = search.toLowerCase();
    return cars.filter(
      (c) =>
        c.model.toLowerCase().includes(s) ||
        c.brand.toLowerCase().includes(s) ||
        (c.description && c.description.toLowerCase().includes(s))
    );
  }, [cars, search]);

  return (
    <div className="w-full flex flex-col min-h-screen bg-muted/20">
      {/* Header */}
      <div className="bg-card border-b border-border py-12 md:py-16">
        <div className="container mx-auto px-4 md:px-8">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">{t.inventory.title}</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">{t.inventory.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8 flex flex-col lg:flex-row gap-8">
        {/* Filters Sidebar */}
        <aside className="w-full lg:w-72 shrink-0 space-y-8">
          <div className="bg-card border border-border rounded-xl p-6 shadow-sm sticky top-28">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold">Filters</h2>
              {(search || brand !== "all" || availableOnly) && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => { setSearch(""); setBrand("all"); setAvailableOnly(false); }}
                  className="h-8 px-2 text-xs text-muted-foreground hover:text-foreground"
                >
                  <FilterX className="h-3 w-3 me-1" /> {t.inventory.clearFilters}
                </Button>
              )}
            </div>

            <div className="space-y-6">
              {/* Search */}
              <div className="space-y-3">
                <Label htmlFor="search">{t.inventory.searchPlaceholder}</Label>
                <div className="relative">
                  <Search className="absolute start-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="search"
                    placeholder={t.inventory.searchPlaceholder}
                    className="ps-9 bg-muted/50 border-border"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
                </div>
              </div>

              {/* Brand Filter */}
              <div className="space-y-3">
                <Label>{t.inventory.allBrands}</Label>
                <Select value={brand} onValueChange={setBrand}>
                  <SelectTrigger className="bg-muted/50 border-border">
                    <SelectValue placeholder={t.inventory.allBrands} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">{t.inventory.allBrands}</SelectItem>
                    {stats?.byBrand?.map((b) => (
                      <SelectItem key={b.brand} value={b.brand}>
                        <span className="capitalize">{b.brand}</span> ({b.count})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Availability Filter */}
              <div className="space-y-3 pt-2 border-t border-border">
                <div className="flex items-center justify-between">
                  <Label htmlFor="available" className="cursor-pointer">{t.inventory.availableOnly}</Label>
                  <Switch id="available" checked={availableOnly} onCheckedChange={setAvailableOnly} />
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
              {isLoading ? (
                <Skeleton className="h-5 w-32 inline-block" />
              ) : (
                <span>{filteredCars.length} {t.inventory.title}</span>
              )}
            </h2>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex flex-col space-y-4">
                  <Skeleton className="h-[240px] w-full rounded-xl" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : filteredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in duration-500">
              {filteredCars.map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-24 text-center bg-card border border-border border-dashed rounded-xl">
              <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
                <Search className="h-8 w-8 text-muted-foreground" />
              </div>
              <h3 className="text-xl font-bold text-foreground">{t.inventory.noResults}</h3>
              <Button variant="outline" className="mt-6" onClick={() => { setSearch(""); setBrand("all"); setAvailableOnly(false); }}>
                {t.inventory.clearFilters}
              </Button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
