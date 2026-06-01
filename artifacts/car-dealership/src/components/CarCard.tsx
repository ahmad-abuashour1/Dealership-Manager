import { Car as CarType } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Settings, Droplet, Calendar, Gauge, ArrowUpRight } from "lucide-react";
import kiaBongoImg from "@assets/2025-kia-bongo-2_1780253666259.webp";
import hyundaiImg from "@assets/3c03a46904bc45a726fbfa6d913e1043_1780253670090.jpg";

interface CarCardProps {
  car: CarType;
}

export function getCarImage(car: CarType) {
  if (car.brand.toLowerCase() === "kia") return kiaBongoImg;
  if (car.brand.toLowerCase() === "hyundai") return hyundaiImg;
  if (car.brand.toLowerCase() === "peugeot") return "/images/peugeot-boxer.png";
  if (car.brand.toLowerCase() === "ford") return "/images/ford-transit.png";
  return car.images?.[0] || kiaBongoImg;
}

export function CarCard({ car }: CarCardProps) {
  const formatPrice = (price: number) =>
    `JD ${new Intl.NumberFormat("en-US", { maximumFractionDigits: 0 }).format(price)}`;

  const imageSrc = getCarImage(car);

  return (
    <Link href={`/cars/${car.id}`}>
      <div className="card-shine group relative cursor-pointer rounded-xl overflow-hidden bg-card border border-border/60 transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 hover:border-primary/40 flex flex-col h-full">

        {/* Image area */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <img
            src={imageSrc}
            alt={`${car.year} ${car.brand} ${car.model}`}
            className="object-cover w-full h-full transition-transform duration-700 group-hover:scale-105"
          />
          {/* Gradient overlay — bottom only */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

          {/* Status badges — top left */}
          <div className="absolute top-3 start-3 flex flex-col gap-1.5">
            {!car.available && (
              <Badge className="bg-red-500/90 text-white border-0 text-xs font-bold px-2.5 shadow-md backdrop-blur-sm">
                Sold
              </Badge>
            )}
            {car.featured && (
              <Badge className="bg-primary/90 text-white border-0 text-xs font-bold px-2.5 shadow-md backdrop-blur-sm">
                ★ Featured
              </Badge>
            )}
          </div>

          {/* Year chip — top right */}
          <div className="absolute top-3 end-3">
            <span className="text-xs font-bold text-white/90 bg-black/50 backdrop-blur-sm px-2 py-1 rounded-md">
              {car.year}
            </span>
          </div>

          {/* Brand + arrow overlay at bottom of image */}
          <div className="absolute bottom-0 inset-x-0 p-4 flex items-end justify-between">
            <p className="text-xs font-bold uppercase tracking-[0.15em] text-white/80">
              {car.brand}
            </p>
            <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300 shadow-lg">
              <ArrowUpRight className="h-4 w-4 text-white" />
            </div>
          </div>
        </div>

        {/* Card body */}
        <div className="p-5 flex-1 flex flex-col gap-4">
          <div>
            <h3 className="font-bold text-xl leading-tight line-clamp-1 group-hover:text-primary transition-colors duration-200">
              {car.model}
            </h3>
          </div>

          {/* Specs grid */}
          <div className="grid grid-cols-2 gap-y-2.5 gap-x-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Calendar className="h-3.5 w-3.5 shrink-0 text-primary/60" />
              <span>{car.year}</span>
            </div>
            {car.transmission && (
              <div className="flex items-center gap-2">
                <Settings className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                <span className="truncate">{car.transmission}</span>
              </div>
            )}
            {car.fuelType && (
              <div className="flex items-center gap-2">
                <Droplet className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                <span className="truncate">{car.fuelType}</span>
              </div>
            )}
            {car.mileage != null && (
              <div className="flex items-center gap-2">
                <Gauge className="h-3.5 w-3.5 shrink-0 text-primary/60" />
                <span>{car.mileage.toLocaleString()} km</span>
              </div>
            )}
          </div>

          {/* Price row */}
          <div className="mt-auto pt-4 border-t border-border/60 flex items-center justify-between">
            <div>
              <p className="text-[11px] text-muted-foreground uppercase tracking-wider font-medium mb-0.5">Price</p>
              <p className="text-2xl font-extrabold text-primary leading-none">
                {formatPrice(car.price)}
              </p>
            </div>
            <div className={`text-xs font-semibold px-3 py-1.5 rounded-full ${
              car.available
                ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-400"
                : "bg-red-50 text-red-600 dark:bg-red-950 dark:text-red-400"
            }`}>
              {car.available ? "Available" : "Sold"}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
