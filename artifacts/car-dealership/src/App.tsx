import { Switch, Route, Router as WouterRouter } from "wouter";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { lazy, Suspense, type ReactNode } from "react";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { setAuthTokenGetter } from "@workspace/api-client-react";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { WhatsAppButton } from "@/components/WhatsAppButton";

// Layouts
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";

// Pages
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Inventory from "@/pages/Inventory";
import Contact from "@/pages/Contact";

// Keep less frequently visited surfaces out of the initial bundle.
const CarDetail = lazy(() => import("@/pages/CarDetail"));
const AdminLayout = lazy(() =>
  import("@/components/layout/AdminLayout").then(({ AdminLayout }) => ({
    default: AdminLayout,
  })),
);
const AdminLogin = lazy(() => import("@/pages/admin/AdminLogin"));
const AdminDashboard = lazy(() => import("@/pages/admin/AdminDashboard"));
const AdminCarForm = lazy(() => import("@/pages/admin/AdminCarForm"));

// Configure api client auth
setAuthTokenGetter(() => localStorage.getItem("adminToken"));

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function PublicLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-[100dvh] flex flex-col selection:bg-primary/30 selection:text-foreground">
      <Navbar />
      <main className="flex-1">{children}</main>
      <Footer />
      <WhatsAppButton />
    </div>
  );
}

function RouteLoadingFallback() {
  return (
    <div className="container mx-auto flex min-h-[40vh] items-center justify-center px-4 py-12">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/20 border-t-primary" />
      <span className="sr-only">Loading page</span>
    </div>
  );
}

function AdminRoute({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <AdminLayout>{children}</AdminLayout>
    </Suspense>
  );
}

function Router() {
  return (
    <Switch>
      {/* Admin Routes */}
      <Route path="/admin/login">
        <Suspense fallback={<RouteLoadingFallback />}>
          <AdminLogin />
        </Suspense>
      </Route>
      <Route path="/admin">
        <AdminRoute>
          <AdminDashboard />
        </AdminRoute>
      </Route>
      <Route path="/admin/cars/new">
        <AdminRoute>
          <AdminCarForm />
        </AdminRoute>
      </Route>
      <Route path="/admin/cars/:id/edit">
        <AdminRoute>
          <AdminCarForm />
        </AdminRoute>
      </Route>

      {/* Public Routes */}
      <Route path="/">
        <PublicLayout>
          <Home />
        </PublicLayout>
      </Route>
      <Route path="/inventory">
        <PublicLayout>
          <Inventory />
        </PublicLayout>
      </Route>
      <Route path="/cars/:id">
        <PublicLayout>
          <Suspense fallback={<RouteLoadingFallback />}>
            <CarDetail />
          </Suspense>
        </PublicLayout>
      </Route>
      <Route path="/contact">
        <PublicLayout>
          <Contact />
        </PublicLayout>
      </Route>
      <Route>
        <PublicLayout>
          <NotFound />
        </PublicLayout>
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <LanguageProvider>
      <QueryClientProvider client={queryClient}>
        <TooltipProvider>
          <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, "")}>
            <Router />
          </WouterRouter>
          <Toaster />
        </TooltipProvider>
      </QueryClientProvider>
    </LanguageProvider>
  );
}

export default App;
