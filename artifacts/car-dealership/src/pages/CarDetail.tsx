import { useParams, Link } from "wouter";
import { useGetCar, getGetCarQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Check, Info, Phone, Calendar, Droplet, Settings, Gauge, Key, PaintBucket } from "lucide-react";
import { getCarImage } from "@/components/CarCard";

export default function CarDetail() {
  const { id } = useParams();
  const carId = parseInt(id || "0", 10);

  const { data: car, isLoading, error } = useGetCar(carId, {
    query: {
      enabled: !!carId,
      queryKey: getGetCarQueryKey(carId)
    }
  });

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-12">
        <Skeleton className="h-8 w-32 mb-8" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <Skeleton className="h-[500px] w-full rounded-2xl" />
          <div className="space-y-6">
            <Skeleton className="h-12 w-3/4" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-32 w-full" />
            <div className="grid grid-cols-2 gap-4 pt-8">
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Vehicle Not Found</h2>
        <p className="text-muted-foreground mb-8">The vehicle you are looking for does not exist or has been removed.</p>
        <Link href="/inventory">
          <Button>Back to Inventory</Button>
        </Link>
      </div>
    );
  }

  const imageSrc = getCarImage(car);
  // Using the fallback images array if the car has multiple images
  const allImages = car.images?.length ? car.images : [imageSrc];

  return (
    <div className="w-full flex flex-col min-h-screen bg-muted/10 pb-24">
      {/* Breadcrumb Header */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center">
          <Link href="/inventory">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              Back to Inventory
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-8 md:py-12">
        <div className="flex flex-col lg:flex-row gap-12 items-start">
          
          {/* Gallery Section */}
          <div className="w-full lg:w-3/5 space-y-4 sticky top-28">
            <div className="aspect-[4/3] rounded-2xl overflow-hidden border border-border shadow-md bg-muted relative">
              <img 
                src={allImages[0]} 
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover"
              />
              {!car.available && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-destructive text-destructive-foreground px-6 py-3 rounded-lg font-bold text-2xl tracking-widest uppercase shadow-xl transform -rotate-12">
                    Sold
                  </div>
                </div>
              )}
            </div>
            
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-4">
                {allImages.slice(1, 5).map((img, i) => (
                  <div key={i} className="aspect-[4/3] rounded-lg overflow-hidden border border-border cursor-pointer hover:border-primary transition-colors">
                    <img src={img} alt={`View ${i+2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="w-full lg:w-2/5 flex flex-col space-y-8">
            <div>
              <div className="flex flex-wrap gap-2 mb-4">
                <Badge variant="outline" className="uppercase tracking-wider font-semibold border-primary/30 text-primary bg-primary/5">
                  {car.brand}
                </Badge>
                {car.available ? (
                  <Badge variant="default" className="bg-green-600 hover:bg-green-700 text-white font-semibold">
                    <Check className="h-3 w-3 mr-1" /> Available Now
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="font-semibold">
                    Sold Out
                  </Badge>
                )}
                {car.featured && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 hover:bg-orange-200 dark:bg-orange-900/30 dark:text-orange-300">
                    Featured
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-2">
                {car.model}
              </h1>
              <div className="text-3xl font-bold text-primary mt-4">
                {formatPrice(car.price)}
              </div>
            </div>

            <div className="p-6 bg-card border border-border rounded-xl shadow-sm space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-2">
                  <Info className="h-5 w-5 text-muted-foreground" />
                  Vehicle Specifications
                </h3>
                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 uppercase font-semibold tracking-wider">
                      <Calendar className="h-4 w-4" /> Year
                    </p>
                    <p className="font-medium text-foreground">{car.year}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 uppercase font-semibold tracking-wider">
                      <Gauge className="h-4 w-4" /> Mileage
                    </p>
                    <p className="font-medium text-foreground">{car.mileage ? `${car.mileage.toLocaleString()} mi` : "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 uppercase font-semibold tracking-wider">
                      <Settings className="h-4 w-4" /> Transmission
                    </p>
                    <p className="font-medium text-foreground capitalize">{car.transmission || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 uppercase font-semibold tracking-wider">
                      <Droplet className="h-4 w-4" /> Fuel Type
                    </p>
                    <p className="font-medium text-foreground capitalize">{car.fuelType || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 uppercase font-semibold tracking-wider">
                      <Key className="h-4 w-4" /> Engine
                    </p>
                    <p className="font-medium text-foreground">{car.engine || "N/A"}</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 uppercase font-semibold tracking-wider">
                      <PaintBucket className="h-4 w-4" /> Color
                    </p>
                    <p className="font-medium text-foreground capitalize">{car.color || "N/A"}</p>
                  </div>
                </div>
              </div>
            </div>

            {car.description && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold border-b border-border pb-2">Overview</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
                  {car.description}
                </p>
              </div>
            )}

            <div className="pt-6 border-t border-border">
              <Link href={`/contact?subject=Inquiry about ${car.year} ${car.brand} ${car.model}`}>
                <Button size="lg" className="w-full h-14 text-lg font-bold shadow-lg shadow-primary/20 gap-2">
                  <Phone className="h-5 w-5" />
                  Contact Sales Team
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
