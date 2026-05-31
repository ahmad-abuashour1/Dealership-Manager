import { Link } from "wouter";
import { Car, Mail, MapPin, Phone } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

export function Footer() {
  const { t } = useLanguage();

  return (
    <footer className="bg-sidebar border-t border-border mt-auto">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-primary">
              <Car className="h-8 w-8" />
              <span>Al Saha</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              {t.footer.description}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">{t.footer.quickLinks}</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/inventory" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.viewInventory}
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  {t.footer.contactUs}
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4 md:col-span-2">
            <h3 className="font-semibold text-lg">{t.footer.contactLocation}</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <a
                  href="https://wa.me/0787929281"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-primary transition-colors"
                >
                  0787929281
                </a>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>aabuashour3@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Al Saha. {t.footer.rights}
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="cursor-pointer hover:text-primary transition-colors">{t.footer.privacy}</span>
            <span className="cursor-pointer hover:text-primary transition-colors">{t.footer.terms}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
