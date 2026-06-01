import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSendContactMessage } from "@workspace/api-client-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import {
  Form, FormControl, FormField, FormItem, FormLabel, FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Phone, Mail, Clock, Send, MapPin } from "lucide-react";
import { useLanguage } from "@/contexts/LanguageContext";

const WHATSAPP_NUMBER = "962787929281";
const FACEBOOK_URL = "https://www.facebook.com/share/18Nk4Pe6bY/?mibextid=wwXIfr";
const MAPS_URL = "https://www.google.com/maps/search/حراج+طبربور+عمان+الأردن";

function FacebookIcon({ className }: { className?: string }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className={className}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  );
}

export default function Contact() {
  const { t } = useLanguage();
  const { toast } = useToast();
  const defaultSubject = typeof window !== "undefined"
    ? new URLSearchParams(window.location.search).get("subject") || ""
    : "";

  const formSchema = z.object({
    name: z.string().min(2, t.contact.name),
    email: z.string().email(t.contact.email),
    phone: z.string().optional(),
    subject: z.string().optional(),
    message: z.string().min(10, t.contact.message),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: { name: "", email: "", phone: "", subject: defaultSubject, message: "" },
  });

  const sendMessage = useSendContactMessage();

  async function onSubmit(values: z.infer<typeof formSchema>) {
    try {
      await sendMessage.mutateAsync({ data: values });
      toast({ title: t.contact.send, description: t.contact.success });
      form.reset({ name: "", email: "", phone: "", subject: "", message: "" });
    } catch {
      toast({ title: "Error", description: t.contact.error, variant: "destructive" });
    }
  }

  return (
    <div className="min-h-screen bg-muted/10 pb-24">
      {/* Header */}
      <div className="bg-card border-b border-border py-16">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">{t.contact.title}</h1>
          <p className="text-lg text-muted-foreground">{t.contact.subtitle}</p>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">

          {/* Contact Info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm space-y-6">
              <h3 className="text-xl font-bold">{t.contact.info.title}</h3>

              {/* WhatsApp */}
              <a
                href={`https://wa.me/${WHATSAPP_NUMBER}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
                data-testid="link-whatsapp-contact"
              >
                <div className="bg-[#25D366]/10 p-3 rounded-full text-[#25D366] shrink-0 group-hover:bg-[#25D366]/20 transition-colors">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                  </svg>
                </div>
                <div>
                  <h4 className="font-semibold text-foreground group-hover:text-[#25D366] transition-colors">{t.contact.info.whatsapp}</h4>
                  <p className="text-muted-foreground mt-1 text-sm" dir="ltr">{WHATSAPP_NUMBER}</p>
                </div>
              </a>

              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                  <Phone className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{t.contact.phone}</h4>
                  <p className="text-muted-foreground mt-1 text-sm" dir="ltr">{WHATSAPP_NUMBER}</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                  <Mail className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{t.contact.email}</h4>
                  <p className="text-muted-foreground mt-1 text-sm">aabuashour3@gmail.com</p>
                </div>
              </div>

              {/* Facebook */}
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
              >
                <div className="bg-[#1877F2]/10 p-3 rounded-full text-[#1877F2] shrink-0 group-hover:bg-[#1877F2]/20 transition-colors">
                  <FacebookIcon className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground group-hover:text-[#1877F2] transition-colors">Facebook</h4>
                  <p className="text-muted-foreground mt-1 text-sm">معرض الساحة</p>
                </div>
              </a>

              {/* Location */}
              <a
                href={MAPS_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-start gap-4 group"
              >
                <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0 group-hover:bg-primary/20 transition-colors">
                  <MapPin className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                    {t.location.title}
                  </h4>
                  <p className="text-muted-foreground mt-1 text-sm">حراج طبربور، عمان، الأردن</p>
                </div>
              </a>

              {/* Hours */}
              <div className="flex items-start gap-4">
                <div className="bg-primary/10 p-3 rounded-full text-primary shrink-0">
                  <Clock className="h-6 w-6" />
                </div>
                <div>
                  <h4 className="font-semibold text-foreground">{t.contact.info.hours}</h4>
                  <p className="text-muted-foreground mt-1 text-sm">{t.contact.info.hoursValue}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-2">
            <div className="bg-card border border-border rounded-xl p-8 shadow-sm">
              <h2 className="text-2xl font-bold mb-6">{t.contact.title}</h2>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="name" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.contact.name} *</FormLabel>
                        <FormControl>
                          <Input placeholder={t.contact.namePlaceholder} {...field} className="bg-muted/50" data-testid="input-name" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="email" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.contact.email} *</FormLabel>
                        <FormControl>
                          <Input placeholder={t.contact.emailPlaceholder} type="email" {...field} className="bg-muted/50" data-testid="input-email" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <FormField control={form.control} name="phone" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.contact.phone}</FormLabel>
                        <FormControl>
                          <Input placeholder={t.contact.phonePlaceholder} {...field} className="bg-muted/50" data-testid="input-phone" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="subject" render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t.contact.subject}</FormLabel>
                        <FormControl>
                          <Input placeholder={t.contact.subjectPlaceholder} {...field} className="bg-muted/50" data-testid="input-subject" />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                  </div>

                  <FormField control={form.control} name="message" render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t.contact.message} *</FormLabel>
                      <FormControl>
                        <Textarea placeholder={t.contact.messagePlaceholder} className="min-h-[150px] bg-muted/50 resize-y" {...field} data-testid="textarea-message" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )} />

                  <Button type="submit" size="lg" className="w-full md:w-auto px-8 gap-2 font-semibold" disabled={sendMessage.isPending} data-testid="button-send">
                    {sendMessage.isPending ? t.contact.sending : (
                      <><Send className="h-4 w-4" />{t.contact.send}</>
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
