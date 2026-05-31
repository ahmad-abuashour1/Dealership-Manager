import { Link } from "wouter";
import { Car, Mail, MapPin, Phone } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-sidebar border-t border-border mt-auto">
      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-12">
          <div className="space-y-4">
            <Link href="/" className="flex items-center gap-2 font-bold text-2xl tracking-tight text-primary">
              <Car className="h-8 w-8" />
              <span>AutoDeal</span>
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-xs">
              Premium commercial vehicles for serious buyers. We provide the power, reliability, and service your business demands.
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/inventory" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  View Inventory
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact Us
                </Link>
              </li>
            </ul>
          </div>

          <div className="space-y-4 md:col-span-2">
            <h3 className="font-semibold text-lg">Contact & Location</h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3 text-sm text-muted-foreground">
                <MapPin className="h-5 w-5 text-primary shrink-0" />
                <span>100 Industrial Parkway<br />Metro Business District<br />CA 94123</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Phone className="h-5 w-5 text-primary shrink-0" />
                <span>+1 (800) 555-DEAL</span>
              </li>
              <li className="flex items-center gap-3 text-sm text-muted-foreground">
                <Mail className="h-5 w-5 text-primary shrink-0" />
                <span>sales@autodeal.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} AutoDeal Commercial Vehicles. All rights reserved.
          </p>
          <div className="flex gap-4 text-sm text-muted-foreground">
            <span className="cursor-pointer hover:text-primary transition-colors">Privacy Policy</span>
            <span className="cursor-pointer hover:text-primary transition-colors">Terms of Service</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
