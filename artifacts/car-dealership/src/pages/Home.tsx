import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { useListCars, useGetCarStats } from "@workspace/api-client-react";
import { CarCard } from "@/components/CarCard";
import {
  ArrowRight, ShieldCheck, Zap, Cog, Activity,
  BadgeCheck, Clock, Banknote, MapPin, ChevronDown
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { useLanguage } from "@/contexts/LanguageContext";

const WHATSAPP_BUY =
  `https://wa.me/962787929281?text=${encodeURIComponent("مرحباً، أود الاستفسار عن خدمة شراء السيارات المستعملة في معرض الساحة.")}`;
const MAPS_URL = "https://www.google.com/maps/search/حراج+طبربور+عمان+الأردن";

export default function Home() {
  const { data: featuredCars, isLoading: isCarsLoading } = useListCars({ featured: true });
  const { data: stats, isLoading: isStatsLoading } = useGetCarStats();
  const { t } = useLanguage();

  return (
    <div className="w-full flex flex-col min-h-screen">

      {/* ── Hero ────────────────────────────────────────────────────────── */}
      <section className="relative w-full h-[90vh] min-h-[600px] flex items-center overflow-hidden bg-black text-white">

        {/* Background image with layered gradients */}
        <div className="absolute inset-0 z-0">
          <img
            src="/images/hero-bg.png"
            alt="Commercial Pickup Truck"
            className="w-full h-full object-cover"
            style={{ opacity: 0.45 }}
          />
          {/* Main atmospheric gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-black/50" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/30 to-transparent" />
          {/* Orange accent glow bottom-left */}
          <div className="absolute -bottom-24 -left-24 w-96 h-96 rounded-full bg-primary/20 blur-[100px] pointer-events-none" />
          <div className="absolute top-20 right-0 w-64 h-64 rounded-full bg-primary/10 blur-[80px] pointer-events-none" />
        </div>

        {/* Bottom fade */}
        <div className="absolute bottom-0 left-0 right-0 z-[2] h-16 bg-gradient-to-t from-black/70 to-transparent pointer-events-none" />

        {/* Hero content */}
        <div className="container relative z-10 mx-auto px-4 md:px-8 pb-16">
          <div className="max-w-3xl space-y-5 animate-in slide-in-from-bottom-8 duration-700 fade-in">

            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/15 border border-primary/40 text-white backdrop-blur-sm animate-float">
              <Zap className="h-3.5 w-3.5 text-primary" />
              <span className="text-xs font-bold uppercase tracking-[0.18em]">{t.hero.badge}</span>
            </div>

            {/* Headline */}
            <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight leading-[1.05] text-white drop-shadow-lg">
              {t.hero.title1}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-orange-400 to-amber-400">
                {t.hero.title2}
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-300/90 max-w-xl leading-relaxed">
              {t.hero.subtitle}
            </p>

            {/* Location */}
            <a
              href={MAPS_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors group"
            >
              <MapPin className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
              <span>حراج طبربور، عمان، الأردن</span>
            </a>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Link href="/inventory">
                <Button
                  size="lg"
                  className="btn-glow h-13 px-8 text-base font-bold bg-primary hover:bg-primary/90 text-white w-full sm:w-auto shadow-xl shadow-primary/25 rounded-xl gap-2"
                >
                  {t.hero.exploreBtn}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="h-13 px-8 text-base font-semibold border-white/30 text-white hover:bg-white/10 hover:border-white/50 w-full sm:w-auto backdrop-blur-sm bg-white/5 rounded-xl"
                >
                  {t.hero.contactBtn}
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 z-10 hidden md:flex flex-col items-center gap-1 text-white/40 animate-bounce">
          <ChevronDown className="h-5 w-5" />
        </div>
      </section>

      {/* ── Stats ────────────────────────────────────────────────────────── */}
      <section className="py-10 bg-card border-b border-border/60">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border/60">
            {[
              { icon: ShieldCheck, value: isStatsLoading ? null : (stats?.total ?? 0),         label: t.stats.totalVehicles, color: "text-primary" },
              { icon: Activity,    value: isStatsLoading ? null : (stats?.available ?? 0),     label: t.stats.available,     color: "text-emerald-500" },
              { icon: Cog,         value: "100%",                                               label: t.stats.featured,      color: "text-blue-500" },
              { icon: Zap,         value: isStatsLoading ? null : (stats?.byBrand?.length ?? 0), label: t.stats.brands,        color: "text-amber-500" },
            ].map(({ icon: Icon, value, label, color }) => (
              <div key={label} className="flex flex-col items-center justify-center text-center py-4 px-4 md:px-8 gap-1.5">
                <div className={`h-10 w-10 rounded-xl bg-muted/60 flex items-center justify-center ${color} mb-1`}>
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-3xl font-extrabold text-foreground tracking-tight">
                  {value === null ? <Skeleton className="h-9 w-16 mx-auto" /> : value}
                </h3>
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-widest">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Buy Used Cars ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-zinc-950 text-white relative overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-[0.03] pointer-events-none select-none flex items-center justify-end pe-12">
          <img src="/images/hero-truck.png" alt="" aria-hidden="true" className="h-80 w-auto" />
        </div>
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/40 to-transparent" />
        {/* Glow */}
        <div className="absolute top-1/2 left-0 -translate-y-1/2 w-96 h-96 bg-primary/10 rounded-full blur-[120px] pointer-events-none" />

        <div className="container relative z-10 mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 items-center">

            {/* Text */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-primary/20 border border-primary/40 text-primary text-xs font-bold uppercase tracking-widest">
                <Banknote className="h-3.5 w-3.5" />
                {t.buyUsed.badge}
              </div>
              <h2 className="text-4xl md:text-5xl font-extrabold tracking-tight leading-[1.1]">
                {t.buyUsed.title}
              </h2>
              <p className="text-base text-zinc-400 leading-relaxed max-w-lg">
                {t.buyUsed.subtitle}
              </p>
              <div className="pt-2">
                <a href={WHATSAPP_BUY} target="_blank" rel="noopener noreferrer">
                  <Button
                    size="lg"
                    className="h-13 px-8 text-base font-bold bg-[#25D366] hover:bg-[#1ebe5d] text-white gap-3 shadow-xl shadow-green-900/30 rounded-xl transition-all duration-200 hover:scale-[1.02]"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {t.buyUsed.cta}
                  </Button>
                </a>
              </div>
            </div>

            {/* Feature cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3 gap-3">
              {[
                { icon: BadgeCheck, title: t.buyUsed.feature1.title, desc: t.buyUsed.feature1.desc, color: "text-primary",       bg: "bg-primary/15",      border: "border-primary/20" },
                { icon: Clock,      title: t.buyUsed.feature2.title, desc: t.buyUsed.feature2.desc, color: "text-blue-400",       bg: "bg-blue-500/15",     border: "border-blue-500/20" },
                { icon: Banknote,   title: t.buyUsed.feature3.title, desc: t.buyUsed.feature3.desc, color: "text-emerald-400",    bg: "bg-emerald-500/15",  border: "border-emerald-500/20" },
              ].map(({ icon: Icon, title, desc, color, bg, border }) => (
                <div key={title} className={`${bg} border ${border} rounded-xl p-5 space-y-3 hover:scale-[1.02] transition-transform duration-200`}>
                  <div className={`h-9 w-9 rounded-lg bg-black/30 flex items-center justify-center ${color}`}>
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <h4 className="font-bold text-white text-sm">{title}</h4>
                  <p className="text-zinc-400 text-xs leading-relaxed">{desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── Featured Vehicles ─────────────────────────────────────────────── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
            <div className="space-y-3">
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-primary">
                <span className="h-px w-8 bg-primary" />
                {t.featured.title}
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground">
                {t.featured.subtitle}
              </h2>
            </div>
            <Link href="/inventory">
              <Button variant="ghost" className="group font-semibold text-primary hover:text-primary hover:bg-primary/5 rounded-xl gap-2">
                {t.featured.viewAll}
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>

          {isCarsLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="flex flex-col space-y-3">
                  <Skeleton className="h-[220px] w-full rounded-xl" />
                  <Skeleton className="h-5 w-2/3" />
                  <Skeleton className="h-4 w-1/2" />
                  <Skeleton className="h-9 w-full" />
                </div>
              ))}
            </div>
          ) : featuredCars && featuredCars.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in slide-in-from-bottom-6 duration-700 fade-in">
              {featuredCars.slice(0, 3).map((car) => (
                <CarCard key={car.id} car={car} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-muted/30 border border-border border-dashed rounded-2xl">
              <h3 className="text-lg font-medium text-muted-foreground">No featured vehicles at the moment.</h3>
            </div>
          )}
        </div>
      </section>

      {/* ── Location CTA ─────────────────────────────────────────────────── */}
      <section className="py-20 bg-primary text-white relative overflow-hidden">
        {/* Decorative lines */}
        <div className="absolute inset-0 opacity-10 pointer-events-none"
          style={{ backgroundImage: "repeating-linear-gradient(90deg, white 0, white 1px, transparent 0, transparent 60px)", backgroundSize: "60px 100%" }} />
        <div className="container relative z-10 mx-auto px-4 md:px-8 text-center max-w-3xl space-y-6">
          <MapPin className="h-12 w-12 mx-auto opacity-90 animate-float" />
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {t.location.title}
          </h2>
          <p className="text-base text-white/80 max-w-md mx-auto">
            {t.location.subtitle}
          </p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <a href={MAPS_URL} target="_blank" rel="noopener noreferrer">
              <Button size="lg" variant="secondary" className="h-12 px-8 text-sm font-bold shadow-xl gap-2 rounded-xl hover:scale-[1.02] transition-transform">
                <MapPin className="h-4 w-4" />
                {t.location.mapsBtn}
              </Button>
            </a>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="h-12 px-8 text-sm font-bold border-white/40 text-white hover:bg-white/15 bg-transparent rounded-xl transition-colors">
                {t.hero.contactBtn}
              </Button>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
