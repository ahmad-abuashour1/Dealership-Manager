import { Car as CarType } from "@workspace/api-client-react";
import { Link } from "wouter";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Settings, Droplet, Users, Calendar, ArrowRight } from "lucide-react";
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
  return car.images?.[0] || kiaBongoImg; // Fallback
}

export function CarCard({ car }: CarCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  const imageSrc = getCarImage(car);

  return (
    <Link href={`/cars/${car.id}`}>
      <Card className="group cursor-pointer overflow-hidden border-border/50 bg-card hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 flex flex-col h-full">
        <div className="relative aspect-[4/3] overflow-hidden bg-muted">
          <img 
            src={imageSrc} 
            alt={`${car.year} ${car.brand} ${car.model}`}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
          />
          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {!car.available && (
              <Badge variant="destructive" className="font-semibold shadow-sm">
                Sold Out
              </Badge>
            )}
            {car.featured && (
              <Badge variant="default" className="bg-primary text-primary-foreground font-semibold shadow-sm">
                Featured
              </Badge>
            )}
          </div>
        </div>

        <CardContent className="p-5 flex-1 flex flex-col">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="text-sm font-medium text-muted-foreground mb-1 tracking-wider uppercase">{car.brand}</p>
              <h3 className="font-bold text-xl leading-tight line-clamp-1 group-hover:text-primary transition-colors">
                {car.model}
              </h3>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-y-3 gap-x-2 text-sm text-muted-foreground mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 shrink-0 text-primary/70" />
              <span>{car.year}</span>
            </div>
            {car.transmission && (
              <div className="flex items-center gap-2">
                <Settings className="h-4 w-4 shrink-0 text-primary/70" />
                <span className="truncate">{car.transmission}</span>
              </div>
            )}
            {car.fuelType && (
              <div className="flex items-center gap-2">
                <Droplet className="h-4 w-4 shrink-0 text-primary/70" />
                <span className="truncate">{car.fuelType}</span>
              </div>
            )}
            {car.seats && (
              <div className="flex items-center gap-2">
                <Users className="h-4 w-4 shrink-0 text-primary/70" />
                <span>{car.seats} Seats</span>
              </div>
            )}
          </div>
        </CardContent>

        <CardFooter className="p-5 pt-0 border-t border-border/50 mt-auto flex items-center justify-between bg-muted/10">
          <div className="text-2xl font-bold text-foreground">
            {formatPrice(car.price)}
          </div>
          <div className="h-10 w-10 rounded-full bg-primary/10 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
            <ArrowRight className="h-5 w-5" />
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}
