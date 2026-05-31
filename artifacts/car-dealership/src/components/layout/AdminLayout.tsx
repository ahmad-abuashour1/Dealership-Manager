import { Link, useLocation } from "wouter";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Car, LogOut, PackagePlus } from "lucide-react";
import { useEffect } from "react";
import { useGetAdminMe } from "@workspace/api-client-react";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const [, setLocation] = useLocation();
  const [locationPath] = useLocation();
  
  // Use enabled to only fetch when we have a token
  const hasToken = !!localStorage.getItem("adminToken");
  
  const { data: admin, error, isLoading } = useGetAdminMe({
    query: {
      enabled: hasToken,
      retry: false
    }
  });

  useEffect(() => {
    if (!hasToken) {
      setLocation("/admin/login");
    } else if (error) {
      localStorage.removeItem("adminToken");
      setLocation("/admin/login");
    }
  }, [hasToken, error, setLocation]);

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    setLocation("/admin/login");
  };

  if (!hasToken || isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="h-8 w-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
          <p className="text-muted-foreground font-medium">Verifying access...</p>
        </div>
      </div>
    );
  }

  const sidebarLinks = [
    { href: "/admin", icon: LayoutDashboard, label: "Dashboard" },
    { href: "/admin/cars/new", icon: PackagePlus, label: "Add Vehicle" },
  ];

  return (
    <div className="min-h-[100dvh] flex flex-col md:flex-row bg-muted/30">
      {/* Admin Sidebar */}
      <aside className="w-full md:w-64 bg-sidebar border-r border-border shrink-0 flex flex-col">
        <div className="h-20 flex items-center px-6 border-b border-border bg-sidebar-primary text-sidebar-primary-foreground">
          <Link href="/admin" className="flex items-center gap-2 font-bold text-xl">
            <Car className="h-6 w-6" />
            <span>AutoDeal Admin</span>
          </Link>
        </div>

        <div className="p-4 flex-1 flex flex-col gap-2">
          <div className="mb-4 px-2">
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Menu</p>
          </div>
          {sidebarLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors",
                locationPath === link.href
                  ? "bg-primary text-primary-foreground"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
            >
              <link.icon className="h-4 w-4" />
              {link.label}
            </Link>
          ))}
        </div>

        <div className="p-4 border-t border-border mt-auto">
          <div className="flex items-center justify-between mb-4 px-2">
            <span className="text-sm font-medium truncate">{admin?.username || "Admin"}</span>
          </div>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium text-destructive hover:bg-destructive/10 transition-colors w-full"
          >
            <LogOut className="h-4 w-4" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Admin Main Content */}
      <main className="flex-1 flex flex-col min-w-0">
        <div className="h-20 border-b border-border bg-background flex items-center px-8 shadow-sm">
          <div className="flex-1 flex items-center justify-between">
            <h1 className="text-xl font-semibold capitalize">
              {locationPath === "/admin" ? "Dashboard" : locationPath.split("/").pop()?.replace("-", " ")}
            </h1>
            <Link href="/" className="text-sm text-muted-foreground hover:text-primary flex items-center gap-1 transition-colors">
              View Public Site
            </Link>
          </div>
        </div>
        <div className="p-8 flex-1 overflow-auto">
          {children}
        </div>
      </main>
    </div>
  );
}
