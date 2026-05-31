/* Bilingual translations — Arabic and English */

export type Language = "en" | "ar";

export const translations = {
  en: {
    // Navbar
    nav: {
      home: "Home",
      inventory: "Inventory",
      contact: "Contact",
      admin: "Admin",
    },
    // Hero
    hero: {
      badge: "Premium Commercial Fleet",
      title1: "Power Your Business.",
      title2: "Command The Road.",
      subtitle: "We provide the highest quality commercial utility vehicles, vans, and heavy-duty trucks built for serious buyers who demand reliability.",
      exploreBtn: "Explore Inventory",
      contactBtn: "Contact Sales",
    },
    // Stats
    stats: {
      totalVehicles: "Total Vehicles",
      available: "Available",
      featured: "Featured",
      brands: "Brands",
    },
    // Featured
    featured: {
      title: "Featured Vehicles",
      subtitle: "Handpicked from our premium inventory — built for performance, reliability, and serious work.",
      viewDetails: "View Details",
      viewAll: "View All Inventory",
    },
    // Why us
    why: {
      title: "Why Choose Al Saha?",
      subtitle: "Industry-leading service, unmatched selection, and competitive pricing.",
      quality: { title: "Verified Quality", desc: "Every vehicle passes a rigorous multi-point inspection before hitting our lot." },
      fast: { title: "Fast Delivery", desc: "Streamlined paperwork and logistics to get your fleet moving fast." },
      specs: { title: "Full Specs", desc: "Complete technical details on every vehicle so you can make informed decisions." },
      support: { title: "Ongoing Support", desc: "Dedicated after-sale service for every commercial vehicle we sell." },
    },
    // Inventory
    inventory: {
      title: "Our Inventory",
      subtitle: "Browse our full selection of commercial and utility vehicles.",
      searchPlaceholder: "Search by brand, model...",
      allBrands: "All Brands",
      availableOnly: "Available Only",
      noResults: "No vehicles match your search.",
      clearFilters: "Clear Filters",
      price: "Price",
      year: "Year",
      viewDetails: "View Details",
      available: "Available",
      sold: "Sold",
      featured: "Featured",
      mileage: "Mileage",
      km: "km",
    },
    // Car Detail
    detail: {
      back: "Back to Inventory",
      contactAbout: "Contact About This Vehicle",
      whatsapp: "Chat on WhatsApp",
      specs: "Specifications",
      description: "Description",
      engine: "Engine",
      transmission: "Transmission",
      fuel: "Fuel Type",
      seats: "Seats",
      color: "Color",
      mileage: "Mileage",
      year: "Year",
      status: "Status",
      available: "Available",
      sold: "Sold",
      price: "Price",
    },
    // Contact
    contact: {
      title: "Contact Us",
      subtitle: "Have a question about a vehicle? Ready to make a deal? Reach out to our sales team.",
      name: "Full Name",
      email: "Email Address",
      phone: "Phone Number",
      subject: "Subject",
      message: "Message",
      send: "Send Message",
      sending: "Sending...",
      success: "Message sent! We will get back to you soon.",
      error: "Failed to send message. Please try again.",
      namePlaceholder: "John Smith",
      emailPlaceholder: "john@example.com",
      phonePlaceholder: "+1 555 000 0000",
      subjectPlaceholder: "Inquiry about Kia Bongo 3",
      messagePlaceholder: "Tell us what you need...",
      info: {
        title: "Get In Touch",
        hours: "Business Hours",
        hoursValue: "Sun–Thu: 8am – 6pm",
        whatsapp: "WhatsApp",
      },
    },
    // Footer
    footer: {
      description: "Premium commercial vehicles for serious buyers. We provide the power, reliability, and service your business demands.",
      quickLinks: "Quick Links",
      viewInventory: "View Inventory",
      contactUs: "Contact Us",
      contactLocation: "Contact & Location",
      rights: "All rights reserved.",
      privacy: "Privacy Policy",
      terms: "Terms of Service",
    },
  },

  ar: {
    // Navbar
    nav: {
      home: "الرئيسية",
      inventory: "المخزون",
      contact: "تواصل معنا",
      admin: "الإدارة",
    },
    // Hero
    hero: {
      badge: "أسطول تجاري متميز",
      title1: "قوِّ أعمالك.",
      title2: "سيطر على الطريق.",
      subtitle: "نوفر أعلى جودة من المركبات التجارية والشاحنات الثقيلة المصممة للمشترين الجادين الذين يبحثون عن الموثوقية.",
      exploreBtn: "استعرض المخزون",
      contactBtn: "تواصل مع المبيعات",
    },
    // Stats
    stats: {
      totalVehicles: "إجمالي المركبات",
      available: "متاح",
      featured: "مميز",
      brands: "الماركات",
    },
    // Featured
    featured: {
      title: "المركبات المميزة",
      subtitle: "مختارة بعناية من مخزوننا المتميز — مصممة للأداء والموثوقية والعمل الجاد.",
      viewDetails: "عرض التفاصيل",
      viewAll: "عرض كل المخزون",
    },
    // Why us
    why: {
      title: "لماذا تختار الساحة؟",
      subtitle: "خدمة رائدة في الصناعة، تشكيلة لا مثيل لها، وأسعار تنافسية.",
      quality: { title: "جودة موثقة", desc: "كل مركبة تجتاز فحصاً دقيقاً متعدد النقاط قبل عرضها." },
      fast: { title: "توصيل سريع", desc: "إجراءات مبسطة ولوجستيات سريعة لتشغيل أسطولك في أقرب وقت." },
      specs: { title: "مواصفات كاملة", desc: "تفاصيل تقنية شاملة لكل مركبة لمساعدتك على اتخاذ قرارات مدروسة." },
      support: { title: "دعم مستمر", desc: "خدمة ما بعد البيع مخصصة لكل مركبة تجارية نبيعها." },
    },
    // Inventory
    inventory: {
      title: "مخزوننا",
      subtitle: "تصفح تشكيلتنا الكاملة من المركبات التجارية والمتعددة الاستخدامات.",
      searchPlaceholder: "ابحث بالماركة، الموديل...",
      allBrands: "جميع الماركات",
      availableOnly: "المتاح فقط",
      noResults: "لا توجد مركبات تطابق بحثك.",
      clearFilters: "مسح الفلاتر",
      price: "السعر",
      year: "السنة",
      viewDetails: "عرض التفاصيل",
      available: "متاح",
      sold: "مباع",
      featured: "مميز",
      mileage: "المسافة",
      km: "كم",
    },
    // Car Detail
    detail: {
      back: "العودة إلى المخزون",
      contactAbout: "تواصل بشأن هذه المركبة",
      whatsapp: "تواصل عبر واتساب",
      specs: "المواصفات",
      description: "الوصف",
      engine: "المحرك",
      transmission: "ناقل الحركة",
      fuel: "نوع الوقود",
      seats: "المقاعد",
      color: "اللون",
      mileage: "المسافة المقطوعة",
      year: "السنة",
      status: "الحالة",
      available: "متاح",
      sold: "مباع",
      price: "السعر",
    },
    // Contact
    contact: {
      title: "تواصل معنا",
      subtitle: "لديك سؤال عن مركبة؟ هل أنت مستعد للإتفاق؟ تواصل مع فريق المبيعات لدينا.",
      name: "الاسم الكامل",
      email: "البريد الإلكتروني",
      phone: "رقم الهاتف",
      subject: "الموضوع",
      message: "الرسالة",
      send: "إرسال الرسالة",
      sending: "جارٍ الإرسال...",
      success: "تم إرسال رسالتك! سنتواصل معك قريباً.",
      error: "فشل إرسال الرسالة. يرجى المحاولة مجدداً.",
      namePlaceholder: "محمد أحمد",
      emailPlaceholder: "example@email.com",
      phonePlaceholder: "07xxxxxxxx",
      subjectPlaceholder: "استفسار عن كيا بونغو 3",
      messagePlaceholder: "أخبرنا بما تحتاج...",
      info: {
        title: "تواصل معنا",
        hours: "ساعات العمل",
        hoursValue: "الأحد–الخميس: 8ص – 6م",
        whatsapp: "واتساب",
      },
    },
    // Footer
    footer: {
      description: "مركبات تجارية متميزة للمشترين الجادين. نوفر القوة والموثوقية والخدمة التي يتطلبها عملك.",
      quickLinks: "روابط سريعة",
      viewInventory: "عرض المخزون",
      contactUs: "تواصل معنا",
      contactLocation: "التواصل والموقع",
      rights: "جميع الحقوق محفوظة.",
      privacy: "سياسة الخصوصية",
      terms: "شروط الخدمة",
    },
  },
} as const;

export type Translations = typeof translations.en;
