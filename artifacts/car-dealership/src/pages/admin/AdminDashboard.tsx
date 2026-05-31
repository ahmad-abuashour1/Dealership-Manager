import { Link } from "wouter";
import { useListCars, useGetCarStats, useDeleteCar, getListCarsQueryKey, getGetCarStatsQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Package, 
  CheckCircle2, 
  Star, 
  Edit, 
  Trash2,
  PlusCircle,
  MoreHorizontal
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export default function AdminDashboard() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const { data: cars, isLoading: isCarsLoading } = useListCars();
  const { data: stats, isLoading: isStatsLoading } = useGetCarStats();
  const deleteCar = useDeleteCar();
  const [carToDelete, setCarToDelete] = useState<number | null>(null);

  const handleDelete = async () => {
    if (!carToDelete) return;
    
    try {
      await deleteCar.mutateAsync({ id: carToDelete });
      queryClient.invalidateQueries({ queryKey: getListCarsQueryKey() });
      queryClient.invalidateQueries({ queryKey: getGetCarStatsQueryKey() });
      toast({
        title: "Vehicle Deleted",
        description: "The vehicle has been removed from inventory.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete vehicle.",
        variant: "destructive",
      });
    } finally {
      setCarToDelete(null);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-primary/10 text-primary rounded-lg">
            <Package className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Total Inventory</p>
            <h3 className="text-2xl font-bold text-foreground">
              {isStatsLoading ? <Skeleton className="h-8 w-12" /> : stats?.total || 0}
            </h3>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-green-500/10 text-green-600 rounded-lg">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Available</p>
            <h3 className="text-2xl font-bold text-foreground">
              {isStatsLoading ? <Skeleton className="h-8 w-12" /> : stats?.available || 0}
            </h3>
          </div>
        </div>
        <div className="bg-card border border-border rounded-xl p-6 shadow-sm flex items-center space-x-4">
          <div className="p-3 bg-orange-500/10 text-orange-600 rounded-lg">
            <Star className="h-6 w-6" />
          </div>
          <div>
            <p className="text-sm font-medium text-muted-foreground uppercase tracking-wider">Featured</p>
            <h3 className="text-2xl font-bold text-foreground">
              {isStatsLoading ? <Skeleton className="h-8 w-12" /> : stats?.featured || 0}
            </h3>
          </div>
        </div>
      </div>

      {/* Inventory Table */}
      <div className="bg-card border border-border rounded-xl shadow-sm overflow-hidden">
        <div className="p-6 border-b border-border flex items-center justify-between">
          <h2 className="text-xl font-bold">Inventory Management</h2>
          <Link href="/admin/cars/new">
            <Button size="sm" className="gap-2">
              <PlusCircle className="h-4 w-4" />
              Add Vehicle
            </Button>
          </Link>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-muted/50">
              <TableRow>
                <TableHead className="w-[100px]">ID</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Year</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {isCarsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-48" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-12" /></TableCell>
                    <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                    <TableCell><Skeleton className="h-6 w-20" /></TableCell>
                    <TableCell><Skeleton className="h-8 w-8 ml-auto" /></TableCell>
                  </TableRow>
                ))
              ) : cars?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                    No vehicles found in inventory.
                  </TableCell>
                </TableRow>
              ) : (
                cars?.map((car) => (
                  <TableRow key={car.id} className="hover:bg-muted/30">
                    <TableCell className="font-medium text-muted-foreground">#{car.id}</TableCell>
                    <TableCell>
                      <div className="font-medium text-foreground">{car.brand} {car.model}</div>
                      {car.featured && <span className="text-[10px] uppercase font-bold text-orange-600 bg-orange-100 px-1.5 py-0.5 rounded ml-2">Featured</span>}
                    </TableCell>
                    <TableCell>{car.year}</TableCell>
                    <TableCell className="font-medium">{formatPrice(car.price)}</TableCell>
                    <TableCell>
                      {car.available ? (
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800">Available</Badge>
                      ) : (
                        <Badge variant="outline" className="bg-destructive/10 text-destructive border-destructive/20">Sold</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>Actions</DropdownMenuLabel>
                          <DropdownMenuItem asChild>
                            <Link href={`/cars/${car.id}`} target="_blank" className="cursor-pointer">
                              View Public Page
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem asChild>
                            <Link href={`/admin/cars/${car.id}/edit`} className="cursor-pointer flex items-center">
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Details
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuSeparator />
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <DropdownMenuItem onSelect={(e) => { e.preventDefault(); setCarToDelete(car.id); }} className="text-destructive focus:bg-destructive/10 cursor-pointer flex items-center">
                                <Trash2 className="mr-2 h-4 w-4" />
                                Delete Vehicle
                              </DropdownMenuItem>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the {car.year} {car.brand} {car.model} from the inventory. This action cannot be undone.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel onClick={() => setCarToDelete(null)}>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
