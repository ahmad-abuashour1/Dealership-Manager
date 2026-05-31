import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useAdminLogin } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Car, Lock } from "lucide-react";

const formSchema = z.object({
  username: z.string().min(1, "Username is required"),
  password: z.string().min(1, "Password is required"),
});

export default function AdminLogin() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "",
    },
  });

  const loginMutation = useAdminLogin();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      const res = await loginMutation.mutateAsync({ data: values });
      localStorage.setItem("adminToken", res.token);
      
      toast({
        title: "Login Successful",
        description: "Welcome to the AutoDeal Admin Panel.",
      });
      
      setLocation("/admin");
    } catch (error) {
      toast({
        title: "Login Failed",
        description: "Invalid username or password.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-sidebar flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl shadow-2xl p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-primary" />
        
        <div className="flex flex-col items-center justify-center mb-8 text-center space-y-4">
          <div className="h-16 w-16 bg-primary/10 text-primary rounded-full flex items-center justify-center">
            <Car className="h-8 w-8" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-foreground">Admin Portal</h1>
            <p className="text-muted-foreground text-sm mt-1">Sign in to manage inventory</p>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="admin" {...field} className="bg-muted/50" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input type="password" placeholder="••••••••" {...field} className="bg-muted/50 pl-10" />
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button 
              type="submit" 
              className="w-full h-12 text-base font-bold shadow-lg"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? "Authenticating..." : "Secure Login"}
            </Button>
          </form>
        </Form>
      </div>
    </div>
  );
}
