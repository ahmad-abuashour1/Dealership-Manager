import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useListCars, useGetCarStats } from "@workspace/api-client-react";
import { CarCard } from "@/components/CarCard";
import { ArrowRight, ShieldCheck, Zap, Cog, Activity } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Home() {
  const { data: featuredCars, isLoading: isCarsLoading } = useListCars({ featured: true });
  const { data: stats, isLoading: isStatsLoading } = useGetCarStats();
  const { t } = useLanguage();

  return (
    <div className="w-full flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-black text-white">
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/images/hero-bg.png"
            alt="Commercial Pickup Truck at Sunset"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <div className="max-w-3xl space-y-6 animate-in slide-in-from-bottom-8 duration-700 fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-primary-foreground backdrop-blur-sm">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-semibold uppercase tracking-wider">{t.hero.badge}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
              {t.hero.title1}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-300">{t.hero.title2}</span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
              {t.hero.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Link href="/inventory">
                <Button size="lg" className="h-14 px-8 text-lg font-semibold bg-primary hover:bg-primary/90 text-white w-full sm:w-auto shadow-lg shadow-primary/20">
                  {t.hero.exploreBtn}
                </Button>
              </Link>
              <Link href="/contact">
                <Button size="lg" variant="outline" className="h-14 px-8 text-lg font-semibold border-white text-white hover:bg-white/10 w-full sm:w-auto backdrop-blur-sm bg-transparent">
                  {t.hero.contactBtn}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="flex flex-col items-center justify-center text-center space-y-2 p-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">
                {isStatsLoading ? <Skeleton className="h-8 w-16" /> : stats?.total || 0}
              </h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t.stats.totalVehicles}</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center space-y-2 p-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Activity className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">
                {isStatsLoading ? <Skeleton className="h-8 w-16" /> : stats?.available || 0}
              </h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t.stats.available}</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center space-y-2 p-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Cog className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">100%</h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t.stats.featured}</p>
            </div>
            <div className="flex flex-col items-center justify-center text-center space-y-2 p-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                <Zap className="h-6 w-6" />
              </div>
              <h3 className="text-3xl font-bold text-foreground">
                {isStatsLoading ? <Skeleton className="h-8 w-16" /> : stats?.byBrand?.length || 0}
              </h3>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{t.stats.brands}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Vehicles */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="max-w-2xl space-y-4">
              <h2 className="text-4xl font-extrabold tracking-tight text-foreground">{t.featured.title}</h2>
              <p className="text-lg text-muted-foreground">{t.featured.subtitle}</p>
            </div>
            <Link href="/inventory">
              <Button variant="ghost" className="group font-semibold text-primary hover:text-primary hover:bg-primary/5">
                {t.featured.viewAll}
                <ArrowRight className="ms-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {isCarsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col space-y-4">
                  <Skeleton className="h-[280px] w-full rounded-xl" />
                  <Skeleton className="h-6 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </div>
              ))}
            </div>
          ) : featuredCars && featuredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 animate-in slide-in-from-bottom-8 duration-700 fade-in">
              {featuredCars.slice(0, 3).map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-card border border-border border-dashed rounded-xl">
              <h3 className="text-xl font-medium text-muted-foreground">No featured vehicles at the moment.</h3>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="container relative z-10 mx-auto px-4 md:px-8 text-center max-w-4xl space-y-8">
          <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight">{t.hero.contactBtn}</h2>
          <p className="text-xl text-primary-foreground/80 font-medium">{t.hero.subtitle}</p>
          <div className="pt-4">
            <Link href="/contact">
              <Button size="lg" variant="secondary" className="h-14 px-10 text-lg font-bold shadow-xl">
                {t.hero.contactBtn}
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
