import { useParams, Link } from "wouter";
import { useGetCar, getGetCarQueryKey } from "@workspace/api-client-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Check, Info, Phone, Calendar, Droplet, Settings, Gauge, Key, PaintBucket } from "lucide-react";
import { getCarImage } from "@/components/CarCard";
import { useLanguage } from "@/contexts/LanguageContext";
import { useState } from "react";

const WHATSAPP_NUMBER = "962787929281";

export default function CarDetail() {
  const { id } = useParams();
  const carId = parseInt(id || "0", 10);
  const { t } = useLanguage();
  const [activeImage, setActiveImage] = useState(0);

  const { data: car, isLoading, error } = useGetCar(carId, {
    query: { enabled: !!carId, queryKey: getGetCarQueryKey(carId) },
  });

  const formatPrice = (price: number) =>
    `JD ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price)}`;

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
          </div>
        </div>
      </div>
    );
  }

  if (error || !car) {
    return (
      <div className="container mx-auto px-4 py-24 text-center">
        <h2 className="text-2xl font-bold mb-4">Vehicle Not Found</h2>
        <Link href="/inventory"><Button>{t.detail.back}</Button></Link>
      </div>
    );
  }

  const fallback = getCarImage(car);
  const allImages = car.images?.length ? car.images : [fallback];
  const whatsappMsg = encodeURIComponent(`مرحباً، أريد الاستفسار عن ${car.year} ${car.brand} ${car.model}`);

  return (
    <div className="w-full flex flex-col min-h-screen bg-muted/10 pb-24">
      {/* Breadcrumb */}
      <div className="bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-8 py-4 flex items-center">
          <Link href="/inventory">
            <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
              <ArrowLeft className="h-4 w-4" />
              {t.detail.back}
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
                src={allImages[activeImage]}
                alt={`${car.brand} ${car.model}`}
                className="w-full h-full object-cover transition-opacity duration-300"
              />
              {!car.available && (
                <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
                  <div className="bg-destructive text-destructive-foreground px-6 py-3 rounded-lg font-bold text-2xl tracking-widest uppercase shadow-xl transform -rotate-12">
                    {t.detail.sold}
                  </div>
                </div>
              )}
            </div>
            {allImages.length > 1 && (
              <div className="grid grid-cols-4 gap-3">
                {allImages.slice(0, 4).map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setActiveImage(i)}
                    className={`aspect-[4/3] rounded-lg overflow-hidden border-2 transition-colors ${activeImage === i ? "border-primary" : "border-border hover:border-primary/50"}`}
                  >
                    <img src={img} alt={`View ${i + 1}`} className="w-full h-full object-cover" />
                  </button>
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
                    <Check className="h-3 w-3 me-1" /> {t.detail.available}
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="font-semibold">{t.detail.sold}</Badge>
                )}
                {car.featured && (
                  <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300">
                    {t.inventory.featured}
                  </Badge>
                )}
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-2">{car.model}</h1>
              <div className="text-3xl font-bold text-primary mt-4">{formatPrice(car.price)}</div>
            </div>

            {/* Specs */}
            <div className="p-6 bg-card border border-border rounded-xl shadow-sm space-y-6">
              <h3 className="text-lg font-semibold flex items-center gap-2 border-b border-border pb-2">
                <Info className="h-5 w-5 text-muted-foreground" />
                {t.detail.specs}
              </h3>
              <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                {[
                  { icon: Calendar, label: t.detail.year, value: car.year },
                  { icon: Gauge, label: t.detail.mileage, value: car.mileage ? `${car.mileage.toLocaleString()} km` : "—" },
                  { icon: Settings, label: t.detail.transmission, value: car.transmission || "—" },
                  { icon: Droplet, label: t.detail.fuel, value: car.fuelType || "—" },
                  { icon: Key, label: t.detail.engine, value: car.engine || "—" },
                  { icon: PaintBucket, label: t.detail.color, value: car.color || "—" },
                ].map(({ icon: Icon, label, value }) => (
                  <div key={label} className="space-y-1">
                    <p className="text-xs text-muted-foreground flex items-center gap-1.5 uppercase font-semibold tracking-wider">
                      <Icon className="h-4 w-4" /> {label}
                    </p>
                    <p className="font-medium text-foreground capitalize">{value}</p>
                  </div>
                ))}
              </div>
            </div>

            {car.description && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold border-b border-border pb-2">{t.detail.description}</h3>
                <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{car.description}</p>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="pt-6 border-t border-border space-y-3">
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}?text=${whatsappMsg}`}
                target="_blank"
                rel="noopener noreferrer"
                data-testid="button-whatsapp-car"
              >
                <Button size="lg" className="w-full h-14 text-lg font-bold gap-2 bg-[#25D366] hover:bg-[#1ebe5d] text-white shadow-lg">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                  {t.detail.whatsapp}
                </Button>
              </a>
              <Link href={`/contact?subject=Inquiry about ${car.year} ${car.brand} ${car.model}`}>
                <Button size="lg" variant="outline" className="w-full h-12 font-semibold gap-2">
                  <Phone className="h-5 w-5" />
                  {t.detail.contactAbout}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
