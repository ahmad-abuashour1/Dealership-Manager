import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSendContactMessage } from "@workspace/api-client-react";
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
import { Textarea } from "@/components/ui/textarea";
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().optional(),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export default function Contact() {
  const [location] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const defaultSubject = searchParams.get("subject") || "";
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      subject: defaultSubject,
      message: "",
    },
  });

  const sendMessage = useSendContactMessage();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await sendMessage.mutateAsync({ data: values });
      toast({
        title: "Message Sent",
        description: "We've received your inquiry and will get back to you shortly.",
        variant: "default",
      });
      form.reset({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send message. Please try again later.",
        variant: "destructive",
      });
    }
  }

  return (
    <div className="min-h-screen bg-muted/10 pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border py-16">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">Contact Sales</h1>
          <p className="text-lg text-muted-foreground">
            Our commercial vehicle experts are ready to help you build your fleet. Reach out with any questions about inventory, pricing, or financing.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          
          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-8">
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm space-y-8">
              <div>
                <h3 className="text-xl font-bold mb-6">Contact Information</h3>
                <div className="space-y-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                      <MapPin className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Location</h4>
                      <p className="text-muted-foreground mt-1 text-sm">
                        100 Industrial Parkway<br />
                        Metro Business District<br />
                        CA 94123
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                      <Phone className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Phone</h4>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Sales: +1 (800) 555-DEAL<br />
                        Service: +1 (800) 555-SERV
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                      <Mail className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Email</h4>
                      <p className="text-muted-foreground mt-1 text-sm">
                        sales@autodeal.com<br />
                        support@autodeal.com
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                      <Clock className="h-6 w-6" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">Hours</h4>
                      <p className="text-muted-foreground mt-1 text-sm">
                        Mon - Fri: 8:00 AM - 7:00 PM<br />
                        Sat: 9:00 AM - 5:00 PM<br />
                        Sun: Closed
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">Send an Inquiry</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} className="bg-muted/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input placeholder="john@company.com" type="email" {...field} className="bg-muted/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="phone"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Phone Number</FormLabel>
                          <FormControl>
                            <Input placeholder="(555) 123-4567" {...field} className="bg-muted/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Subject</FormLabel>
                          <FormControl>
                            <Input placeholder="Vehicle Inquiry" {...field} className="bg-muted/50" />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="message"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Message *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Tell us what you're looking for..." 
                            className="min-h-[150px] bg-muted/50 resize-y" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    size="lg" 
                    className="w-full md:w-auto px-8 gap-2 font-semibold"
                    disabled={sendMessage.isPending}
                  >
                    {sendMessage.isPending ? "Sending..." : (
                      <>
                        <Send className="h-4 w-4" />
                        Send Message
                      </>
                    )}
                  </Button>
                </form>
              </Form>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
