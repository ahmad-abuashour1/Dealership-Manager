import { useParams, useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateCar, useUpdateCar, useGetCar, getGetCarQueryKey, getListCarsQueryKey, getGetCarStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Save } from "lucide-react";
import { Link } from "wouter";

const formSchema = z.object({
  brand: z.string().min(1, "Brand is required"),
  model: z.string().min(1, "Model is required"),
  year: z.coerce.number().min(1900, "Invalid year").max(new Date().getFullYear() + 1, "Invalid year"),
  price: z.coerce.number().min(0, "Price must be positive"),
  description: z.string().optional(),
  engine: z.string().optional(),
  transmission: z.string().optional(),
  fuelType: z.string().optional(),
  seats: z.coerce.number().min(1).optional().or(z.literal("").transform(() => undefined)),
  color: z.string().optional(),
  mileage: z.coerce.number().min(0).optional().or(z.literal("").transform(() => undefined)),
  available: z.boolean().default(true),
  featured: z.boolean().default(false),
  imagesStr: z.string().optional(), // We'll parse this to string[]
});

export default function AdminCarForm() {
  const { id } = useParams();
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  const isEditing = !!id && id !== "new";
  const carId = isEditing ? parseInt(id!, 10) : 0;

  const { data: car, isLoading: isCarLoading } = useGetCar(carId, {
    query: {
      enabled: isEditing,
      queryKey: getGetCarQueryKey(carId)
    }
  });

  const createCar = useCreateCar();
  const updateCar = useUpdateCar();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      brand: "",
      model: "",
      year: new Date().getFullYear(),
      price: 0,
      description: "",
      engine: "",
      transmission: "",
      fuelType: "",
      seats: undefined,
      color: "",
      mileage: undefined,
      available: true,
      featured: false,
      imagesStr: "",
    },
  });

  useEffect(() => {
    if (car && isEditing) {
      form.reset({
        brand: car.brand,
        model: car.model,
        year: car.year,
        price: car.price,
        description: car.description || "",
        engine: car.engine || "",
        transmission: car.transmission || "",
        fuelType: car.fuelType || "",
        seats: car.seats || undefined,
        color: car.color || "",
        mileage: car.mileage || undefined,
        available: car.available,
        featured: car.featured,
        imagesStr: car.images?.join(", ") || "",
      });
    }
  }, [car, isEditing, form]);

  async function onSubmit(values: z.infer<typeof formSchema>) {
    const images = values.imagesStr ? values.imagesStr.split(",").map(s => s.trim()).filter(Boolean) : [];
    
    const payload = {
      brand: values.brand,
      model: values.model,
      year: values.year,
      price: values.price,
      description: values.description,
      engine: values.engine,
      transmission: values.transmission,
      fuelType: values.fuelType,
      seats: values.seats,
      color: values.color,
      mileage: values.mileage,
      available: values.available,
      featured: values.featured,
      images,
    };

    try {
      if (isEditing) {
        await updateCar.mutateAsync({ id: carId, data: payload });
        toast({ title: "Vehicle Updated", description: "Changes have been saved." });
      } else {
        await createCar.mutateAsync({ data: payload });
        toast({ title: "Vehicle Added", description: "New vehicle has been added to inventory." });
      }
      
      queryClient.invalidateQueries({ queryKey: getListCarsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetCarStatsQueryKey() });
      if (isEditing) queryClient.invalidateQueries({ queryKey: getGetCarQueryKey(carId) });
      
      setLocation("/admin");
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${isEditing ? 'update' : 'add'} vehicle.`,
        variant: "destructive",
      });
    }
  }

  if (isEditing && isCarLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="bg-card p-6 rounded-xl border border-border space-y-6">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-32 w-full" />
        </div>
      </div>
    );
  }

  const isPending = createCar.isPending || updateCar.isPending;

  return (
    <div className="max-w-4xl mx-auto pb-12 animate-in fade-in duration-300">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin">
          <Button variant="outline" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <h2 className="text-2xl font-bold text-foreground">
          {isEditing ? `Edit ${car?.brand} ${car?.model}` : "Add New Vehicle"}
        </h2>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="bg-card border border-border rounded-xl p-6 md:p-8 shadow-sm space-y-8">
            
            {/* Essential Info */}
            <div>
              <h3 className="text-lg font-semibold border-b border-border pb-2 mb-4">Essential Details</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="brand"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Brand *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Ford" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="model"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Model *</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Transit 350" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year *</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Price (USD) *</FormLabel>
                      <FormControl>
                        <Input type="number" step="0.01" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Status & Flags */}
            <div>
              <h3 className="text-lg font-semibold border-b border-border pb-2 mb-4">Visibility & Status</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-muted/30 p-4 rounded-lg border border-border/50">
                <FormField
                  control={form.control}
                  name="available"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border bg-card p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Available</FormLabel>
                        <FormDescription>Show as in-stock and ready for sale</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="featured"
                  render={({ field }) => (
                    <FormItem className="flex flex-row items-center justify-between rounded-lg border border-border bg-card p-4 shadow-sm">
                      <div className="space-y-0.5">
                        <FormLabel className="text-base">Featured</FormLabel>
                        <FormDescription>Highlight on the homepage hero section</FormDescription>
                      </div>
                      <FormControl>
                        <Switch checked={field.value} onCheckedChange={field.onChange} />
                      </FormControl>
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Specifications */}
            <div>
              <h3 className="text-lg font-semibold border-b border-border pb-2 mb-4">Specifications</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="engine"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Engine</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 3.5L V6" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="transmission"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Transmission</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. 10-Speed Automatic" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fuelType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fuel Type</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Diesel" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="color"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Color</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g. Oxford White" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="mileage"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Mileage</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 15000" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="seats"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Seats</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 2" {...field} value={field.value ?? ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Media & Description */}
            <div>
              <h3 className="text-lg font-semibold border-b border-border pb-2 mb-4">Media & Description</h3>
              <div className="space-y-6">
                <FormField
                  control={form.control}
                  name="imagesStr"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URLs (comma separated)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://example.com/img1.jpg, https://example.com/img2.jpg" {...field} />
                      </FormControl>
                      <FormDescription>Leave blank to use default brand placeholder images.</FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Detailed vehicle description, features, history..." 
                          className="min-h-[150px] resize-y" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-border flex justify-end">
              <Button type="submit" size="lg" disabled={isPending} className="gap-2 font-bold px-8">
                {isPending ? "Saving..." : (
                  <>
                    <Save className="h-5 w-5" />
                    {isEditing ? "Save Changes" : "Create Vehicle"}
                  </>
                )}
              </Button>
            </div>

          </div>
        </form>
      </Form>
    </div>
  );
}
