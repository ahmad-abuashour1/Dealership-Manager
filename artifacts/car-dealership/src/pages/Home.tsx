import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useListCars, useGetCarStats } from "@workspace/api-client-react";
import { CarCard } from "@/components/CarCard";
import { ArrowRight, ShieldCheck, Zap, Cog, Activity, BadgeCheck, Clock, Banknote, MapPin } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

const WHATSAPP_BUY =
  `https://wa.me/962787929281?text=${encodeURIComponent("مرحباً، أود الاستفسار عن خدمة شراء السيارات المستعملة في معرض الساحة.")}`;
const MAPS_URL =
  "https://www.google.com/maps/search/حراج+طبربور+عمان+الأردن";

export default function Home() {
  const { data: featuredCars, isLoading: isCarsLoading } = useListCars({ featured: true });
  const { data: stats, isLoading: isStatsLoading } = useGetCarStats();
  const { t } = useLanguage();

  return (
    <div className="w-full flex flex-col min-h-screen">

      {/* ── Hero Section ──────────────────────────────────────────────────── */}
      <section className="relative w-full h-[85vh] min-h-[600px] flex items-center justify-center overflow-hidden bg-black text-white">
        {/* Background image */}
        <div className="absolute inset-0 w-full h-full z-0">
          <img
            src="/images/hero-bg.png"
            alt="Commercial Pickup Truck"
            className="w-full h-full object-cover opacity-60 mix-blend-overlay"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/20 to-transparent" />
        </div>

        {/* Animated truck — flipped to face left, drives right → left */}
        <div className="hero-truck absolute bottom-4 z-[3] pointer-events-none select-none">
          <img
            src="/images/hero-truck.png"
            alt=""
            aria-hidden="true"
            className="h-36 md:h-48 w-auto drop-shadow-2xl"
            style={{ transform: "scaleX(-1)" }}
          />
        </div>

        {/* Road line under the truck */}
        <div className="absolute bottom-0 left-0 right-0 h-16 z-[2] bg-gradient-to-t from-black/80 to-transparent" />

        {/* Hero content */}
        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <div className="max-w-3xl space-y-6 animate-in slide-in-from-bottom-8 duration-700 fade-in">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/50 text-primary-foreground backdrop-blur-sm">
              <Zap className="h-4 w-4" />
              <span className="text-sm font-semibold uppercase tracking-wider">{t.hero.badge}</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.1] text-white">
              {t.hero.title1}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-300">
                {t.hero.title2}
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-300 max-w-2xl leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* Location badge */}
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors"
            >
              <MapPin className="h-4 w-4 text-primary" />
              <span>حراج طبربور، عمان، الأردن</span>
            </a>

            <div className="flex flex-col sm:flex-row gap-4 pt-2">
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

      {/* ── Stats Section ─────────────────────────────────────────────────── */}
      <section className="py-12 bg-card border-b border-border">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { icon: ShieldCheck, value: isStatsLoading ? null : (stats?.total || 0), label: t.stats.totalVehicles },
              { icon: Activity,    value: isStatsLoading ? null : (stats?.available || 0), label: t.stats.available },
              { icon: Cog,         value: "100%", label: t.stats.featured },
              { icon: Zap,         value: isStatsLoading ? null : (stats?.byBrand?.length || 0), label: t.stats.brands },
            ].map(({ icon: Icon, value, label }) => (
              <div key={label} className="flex flex-col items-center justify-center text-center space-y-2 p-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-2">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="text-3xl font-bold text-foreground">
                  {value === null ? <Skeleton className="h-8 w-16" /> : value}
                </h3>
                <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Buy Used Cars Section ─────────────────────────────────────────── */}
      <section className="py-20 bg-zinc-900 text-white relative overflow-hidden">
        {/* Subtle truck silhouette in background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none select-none flex items-center justify-end pe-8">
          <img src="/images/hero-truck.png" alt="" aria-hidden="true" className="h-64 w-auto" />
        </div>

        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text side */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/40 text-primary text-sm font-semibold">
                <Banknote className="h-4 w-4" />
                {t.buyUsed.badge}
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-tight">
                {t.buyUsed.title}
              </h2>
              <p className="text-lg text-zinc-300 leading-relaxed max-w-lg">
                {t.buyUsed.subtitle}
              </p>
              <div className="pt-2">
                <a href={WHATSAPP_BUY} target="_blank" rel="noopener noreferrer">
                  <Button size="lg" className="h-14 px-8 text-lg font-bold bg-[#25D366] hover:bg-[#1ebe5d] text-white gap-3 shadow-lg shadow-green-900/30">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {t.buyUsed.cta}
                  </Button>
                </a>
              </div>
            </div>

            {/* Features side */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-4">
              {[
                { icon: BadgeCheck, title: t.buyUsed.feature1.title, desc: t.buyUsed.feature1.desc, color: "text-primary" },
                { icon: Clock,      title: t.buyUsed.feature2.title, desc: t.buyUsed.feature2.desc, color: "text-blue-400" },
                { icon: Banknote,   title: t.buyUsed.feature3.title, desc: t.buyUsed.feature3.desc, color: "text-green-400" },
              ].map(({ icon: Icon, title, desc, color }) => (
                <div key={title} className="bg-white/5 border border-white/10 rounded-xl p-5 space-y-3 hover:bg-white/10 transition-colors">
                  <div className={`h-10 w-10 rounded-full bg-white/10 flex items-center justify-center ${color}`}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <h4 className="font-bold text-white text-base">{title}</h4>
                  <p className="text-zinc-400 text-sm leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Vehicles ─────────────────────────────────────────────── */}
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

      {/* ── Location CTA ──────────────────────────────────────────────────── */}
      <section className="py-20 bg-primary text-primary-foreground relative overflow-hidden">
        <div className="container relative z-10 mx-auto px-4 md:px-8 text-center max-w-3xl space-y-6">
          <MapPin className="h-10 w-10 mx-auto opacity-80" />
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {t.location.title}
          </h2>
          <p className="text-lg text-primary-foreground/80">
            {t.location.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center pt-2">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary" className="h-13 px-8 text-base font-bold shadow-xl gap-2">
                <MapPin className="h-5 w-5" />
                {t.location.mapsBtn}
              </Button>
            </a>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="h-13 px-8 text-base font-bold border-white/40 text-white hover:bg-white/10 bg-transparent gap-2">
                {t.hero.contactBtn}
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
