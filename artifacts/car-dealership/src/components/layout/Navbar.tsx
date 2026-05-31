import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { Car, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useLanguage } from "@/contexts/LanguageContext";

export function Navbar() {
  const [location] = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const { t, language, setLanguage, isRTL } = useLanguage();

  const navLinks = [
    { href: "/", label: t.nav.home },
    { href: "/inventory", label: t.nav.inventory },
    { href: "/contact", label: t.nav.contact },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 md:px-8 flex h-20 items-center justify-between">
        <div className="flex items-center gap-2">
          <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-primary">
            <Car className="h-8 w-8" />
            <span>AutoDeal</span>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className={cn("hidden md:flex items-center gap-8", isRTL && "flex-row-reverse")}>
          <div className={cn("flex items-center gap-6", isRTL && "flex-row-reverse")}>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-primary",
                  location === link.href ? "text-primary" : "text-muted-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </div>
          <div className="h-6 w-px bg-border mx-2" />

          {/* Language Toggle */}
          <button
            data-testid="button-language-toggle"
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="flex items-center gap-1 px-3 py-1.5 rounded-md border border-border bg-muted/40 hover:bg-muted text-sm font-semibold transition-colors"
          >
            {language === "en" ? (
              <span>عربي</span>
            ) : (
              <span>EN</span>
            )}
          </button>

          <Link href="/admin">
            <Button variant="outline" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              {t.nav.admin}
            </Button>
          </Link>
        </div>

        {/* Mobile right side */}
        <div className="flex md:hidden items-center gap-2">
          {/* Language Toggle Mobile */}
          <button
            onClick={() => setLanguage(language === "en" ? "ar" : "en")}
            className="px-2 py-1 rounded border border-border bg-muted/40 text-xs font-bold"
          >
            {language === "en" ? "عربي" : "EN"}
          </button>
          <button
            className="p-2 text-foreground"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden border-b bg-background px-4 py-4 space-y-4 shadow-lg animate-in slide-in-from-top-4">
          <div className="flex flex-col space-y-3">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsMobileMenuOpen(false)}
                className={cn(
                  "text-base font-medium px-2 py-1.5 rounded-md transition-colors",
                  location === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-muted hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="h-px bg-border w-full my-2" />
            <Link href="/admin" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="flex items-center gap-2 text-base font-medium px-2 py-1.5 text-muted-foreground hover:text-foreground">
                <User className="h-4 w-4" />
                {t.nav.admin}
              </div>
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
