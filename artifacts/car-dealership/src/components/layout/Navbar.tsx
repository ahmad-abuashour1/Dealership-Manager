import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Car, Menu, X, User } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { t, language, setLanguage, isRTL } = useLanguage();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/inventory", label: t.nav.inventory },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <nav
      className={cn(
        "sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md transition-all duration-300",
        scrolled && "navbar-scrolled border-border/60"
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex h-[70px] items-center justify-between">

        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 font-extrabold text-xl tracking-tight text-primary group">
          <div className="relative">
            <Car className="h-7 w-7 transition-transform duration-300 group-hover:scale-110" />
            <span className="absolute -inset-1 rounded-full bg-primary/10 scale-0 group-hover:scale-100 transition-transform duration-300" />
          </div>
          <span className="hidden sm:inline">Al Saha</span>
          <span className="hidden sm:inline text-xs font-normal text-muted-foreground tracking-normal mt-0.5">معرض الساحة</span>
        </Link>

        {/* Desktop Navigation */}
        <div className={cn("hidden md:flex items-center gap-6", isRTL && "flex-row-reverse")}>
          <div className={cn("flex items-center gap-1", isRTL && "flex-row-reverse")}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "relative text-sm font-medium px-3 py-2 rounded-md transition-colors duration-200",
                  location === link.href
                    ? "text-primary nav-link-active"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/60"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="h-5 w-px bg-border" />

          {/* Language Toggle */}
          <button
            data-testid="button-language-toggle"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border/60 bg-muted/30 hover:bg-muted/70 text-sm font-semibold transition-all duration-200 hover:border-primary/40"
          >
            {language === "en" ? <span>عربي</span> : <span>EN</span>}
          </button>

          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-2 h-9 border-border/60 hover:border-primary/50 hover:text-primary transition-all duration-200">
              <User className="h-3.5 w-3.5" />
              {t.nav.admin}
            </Button>
          </Link>
        </div>

        {/* Mobile right */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="px-2.5 py-1.5 rounded-lg border border-border bg-muted/40 text-xs font-bold transition-colors hover:bg-muted"
          >
            {language === "en" ? "عربي" : "EN"}
          </button>
          <button
            className="p-2 rounded-lg text-foreground hover:bg-muted transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-t border-border/60 bg-background/98 px-4 py-4 space-y-1 shadow-xl animate-in slide-in-from-top-3 duration-200">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className={cn(
                "flex items-center text-base font-medium px-3 py-2.5 rounded-lg transition-all duration-200",
                location === link.href
                  ? "bg-primary/10 text-primary font-semibold"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="h-px bg-border/60 my-2" />
          <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
            <div className="flex items-center gap-2 text-base font-medium px-3 py-2.5 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground transition-colors">
              <User className="h-4 w-4" />
              {t.nav.admin}
            </div>
          </Link>
        </div>
      )}
    </nav>
  );
}
