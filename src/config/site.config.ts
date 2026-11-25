/**
 * Centralized site configuration (F-10).
 * Clients customize all copy, links, prices, images, and feature flags here
 * without modifying Astro/UI components.
 */

export interface BrandLink {
  id: string;
  label: string;
  url: string;
  badge?: string;
  highlight?: boolean;
}

export interface MediaKitStat {
  label: string;
  value: string;
}

export interface AudienceDemographic {
  label: string;
  percentage: string;
}

export interface RateCardItem {
  service: string;
  deliverables: string;
  price: string;
}

export interface PortfolioItem {
  brandName: string;
  campaignTitle: string;
  resultSummary: string;
  imageUrl: string;
  linkUrl?: string;
}

export interface TestimonialItem {
  name: string;
  role: string;
  quote: string;
  avatarUrl?: string;
}

export interface ProductBenefit {
  title: string;
  description: string;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface SiteConfig {
  site: {
    title: string;
    description: string;
    canonicalUrl: string;
    ogImage: string;
    locale: string;
  };
  tracking: {
    /** Public TikTok Pixel ID (set TODO until client provides it). */
    tiktokPixelId: string;
    /** Public GA4 Measurement ID (set TODO until client provides it). */
    ga4MeasurementId: string;
    /** Serverless endpoint for TikTok Events API deduplication. */
    eventsApiEndpoint: string;
    /** T-06: When true, tracking scripts activate only after user consent. */
    requireConsent: boolean;
    consentBanner: {
      message: string;
      acceptLabel: string;
      declineLabel: string;
    };
  };
  whatsapp: {
    /** Format: 6281234567890 without '+' or spaces */
    phoneNumber: string;
    defaultMessage: string;
  };
  checkout: {
    /** F-07: Optional checkout feature toggle */
    enabled: boolean;
    provider: 'midtrans' | 'xendit' | 'none';
  };
  linkInBio: {
    profile: {
      name: string;
      handle: string;
      bio: string;
      avatarUrl: string;
      location: string;
    };
    links: BrandLink[];
    mediaKit: {
      sectionTitle: string;
      stats: MediaKitStat[];
      demographicsTitle: string;
      demographics: AudienceDemographic[];
      rateCardTitle: string;
      rateCard: RateCardItem[];
    };
    portfolio: {
      sectionTitle: string;
      items: PortfolioItem[];
    };
    inquiryForm: {
      sectionTitle: string;
      description: string;
      leadDestination: 'whatsapp' | 'email' | 'webhook';
      emailAddress: string;
      leadEndpoint: string;
      submitLabel: string;
    };
  };
  digitalProduct: {
    hero: {
      badge: string;
      headline: string;
      subheadline: string;
      mediaType: 'image' | 'video';
      mediaUrl: string;
      mediaAlt: string;
      ctaLabel: string;
    };
    socialProof: {
      soldCountText: string;
      testimonials: TestimonialItem[];
      screenshots: {
        imageUrl: string;
        alt: string;
      }[];
    };
    benefits: {
      sectionTitle: string;
      items: ProductBenefit[];
      whatsInsideTitle: string;
      whatsInside: string[];
    };
    offer: {
      sectionTitle: string;
      productName: string;
      originalPrice: string;
      promoPrice: string;
      priceNumeric: number;
      ctaLabel: string;
      faqs: FaqItem[];
    };
    leadForm: {
      enabled: boolean;
      sectionTitle: string;
      description: string;
      leadDestination: 'whatsapp' | 'email' | 'webhook';
      emailAddress: string;
      leadEndpoint: string;
      submitLabel: string;
    };
  };
}

export const siteConfig: SiteConfig = {
  site: {
    title: 'TODO: Nama Kreator | Landing Page Resmi',
    description: 'TODO: Deskripsi singkat kreator dan penawaran utama untuk bio dan SEO.',
    canonicalUrl: 'https://example.com',
    ogImage: '/og-default.webp',
    locale: 'id_ID',
  },
  tracking: {
    tiktokPixelId: 'TODO_TIKTOK_PIXEL_ID',
    ga4MeasurementId: 'TODO_GA4_MEASUREMENT_ID',
    eventsApiEndpoint: '/api/tiktok-events',
    requireConsent: false,
    consentBanner: {
      message: 'Kami menggunakan cookie dan analitik untuk mengukur performa tautan serta meningkatkan pengalaman Anda.',
      acceptLabel: 'Setuju',
      declineLabel: 'Tolak',
    },
  },
  whatsapp: {
    phoneNumber: '6280000000000', // TODO: Ganti dengan nomor WhatsApp aktif kreator
    defaultMessage: 'Halo, saya tertarik dengan penawaran dari halaman TikTok Anda.',
  },
  checkout: {
    enabled: false,
    provider: 'none',
  },
  linkInBio: {
    profile: {
      name: 'TODO: Nama Kreator',
      handle: '@todokreator',
      bio: 'TODO: Kreator konten edukasi & gaya hidup di TikTok. Kerja sama brand & produk pilihan di bawah.',
      avatarUrl: '/images/avatar-placeholder.webp', // TODO: Ganti dengan foto profil WebP/AVIF
      location: 'Jakarta, Indonesia',
    },
    links: [
      {
        id: 'link-produk-utama',
        label: 'TODO: Produk Digital Unggulan',
        url: '/produk',
        badge: 'Terlaris',
        highlight: true,
      },
      {
        id: 'link-whatsapp',
        label: 'TODO: Konsultasi & Pemesanan via WhatsApp',
        url: 'https://wa.me/6280000000000',
      },
      {
        id: 'link-tiktok',
        label: 'TODO: Kunjungi Profil TikTok',
        url: 'https://www.tiktok.com/@todokreator',
      },
    ],
    mediaKit: {
      sectionTitle: 'Media Kit & Statistik Audiens',
      stats: [
        { label: 'Pengikut TikTok', value: 'TODO: 150K+' },
        { label: 'Rata-rata Tayangan', value: 'TODO: 45K / video' },
        { label: 'Engagement Rate', value: 'TODO: 6,8%' },
      ],
      demographicsTitle: 'Demografi Audiens',
      demographics: [
        { label: 'Usia 18–24 tahun', percentage: 'TODO: 48%' },
        { label: 'Usia 25–34 tahun', percentage: 'TODO: 37%' },
        { label: 'Domisili Jabodetabek & Kota Besar', percentage: 'TODO: 65%' },
      ],
      rateCardTitle: 'Paket Kerja Sama (Rate Card)',
      rateCard: [
        {
          service: 'TODO: 1x Video TikTok Dedicated',
          deliverables: 'Konsep, produksi, 1x revisi, tayang di feed + link bio',
          price: 'TODO: Rp 3.500.000',
        },
        {
          service: 'TODO: Paket Bundling 3x Video',
          deliverables: '3 video campaign + hak penggunaan konten 30 hari',
          price: 'TODO: Rp 9.000.000',
        },
      ],
    },
    portfolio: {
      sectionTitle: 'Portofolio Kerja Sama Brand',
      items: [
        {
          brandName: 'TODO: Nama Brand A',
          campaignTitle: 'Kampanye Peluncuran Produk',
          resultSummary: 'TODO: 240K tayangan, 1.200+ klik tautan',
          imageUrl: '/images/portfolio-1.webp',
        },
        {
          brandName: 'TODO: Nama Brand B',
          campaignTitle: 'Review & Tutorial Penggunaan',
          resultSummary: 'TODO: 180K tayangan, 4,9% CTR',
          imageUrl: '/images/portfolio-2.webp',
        },
      ],
    },
    inquiryForm: {
      sectionTitle: 'Ajukan Kerja Sama Brand',
      description: 'Isi detail singkat kampanye Anda. Tim kami akan merespons maksimal 1x24 jam kerja.',
      leadDestination: 'whatsapp',
      emailAddress: 'TODO_EMAIL@example.com',
      leadEndpoint: '/api/lead',
      submitLabel: 'Kirim Permintaan Kerja Sama',
    },
  },
  digitalProduct: {
    hero: {
      badge: 'TODO: Edisi Terbatas',
      headline: 'TODO: Headline Manfaat Utama Produk Digital Anda',
      subheadline: 'TODO: Jelaskan hasil nyata yang didapatkan pembeli dalam satu kalimat ringkas.',
      mediaType: 'image',
      mediaUrl: '/images/hero-9x16.webp', // TODO: Visual vertikal 9:16
      mediaAlt: 'TODO: Pratinjau produk digital',
      ctaLabel: 'Dapatkan Sekarang',
    },
    socialProof: {
      soldCountText: 'TODO: 500+ kreator dan pembeli sudah bergabung',
      testimonials: [
        {
          name: 'TODO: Rina S.',
          role: 'Pembeli Terverifikasi',
          quote: 'TODO: Materinya langsung bisa dipraktikkan hari ini juga.',
        },
        {
          name: 'TODO: Dimas P.',
          role: 'Kreator Pemula',
          quote: 'TODO: Sangat membantu merapikan alur jualan dari TikTok.',
        },
      ],
      screenshots: [
        {
          imageUrl: '/images/proof-1.webp',
          alt: 'TODO: Tangkapan layar testimoni pembeli',
        },
      ],
    },
    benefits: {
      sectionTitle: 'Apa yang Anda Dapatkan',
      items: [
        {
          title: 'TODO: Manfaat 1',
          description: 'TODO: Penjelasan singkat manfaat pertama untuk pembeli.',
        },
        {
          title: 'TODO: Manfaat 2',
          description: 'TODO: Penjelasan singkat manfaat kedua untuk pembeli.',
        },
      ],
      whatsInsideTitle: 'Isi Paket Produk',
      whatsInside: [
        'TODO: Modul 1 — Panduan langkah demi langkah',
        'TODO: Modul 2 — Template siap pakai',
        'TODO: Bonus — Checklist implementasi',
      ],
    },
    offer: {
      sectionTitle: 'Penawaran Spesial Hari Ini',
      productName: 'TODO: Nama Produk Digital',
      originalPrice: 'TODO: Rp 299.000',
      promoPrice: 'TODO: Rp 149.000',
      priceNumeric: 149000,
      ctaLabel: 'Pesan via WhatsApp Sekarang',
      faqs: [
        {
          question: 'TODO: Bagaimana cara mengakses produk setelah pembayaran?',
          answer: 'TODO: Tautan akses dikirim otomatis melalui WhatsApp atau email setelah konfirmasi.',
        },
        {
          question: 'TODO: Apakah cocok untuk pemula?',
          answer: 'TODO: Ya, disusun dengan langkah praktis dari dasar.',
        },
      ],
    },
    leadForm: {
      enabled: true,
      sectionTitle: 'Minta Info atau Daftar Sekarang',
      description: 'Masukkan nama dan nomor WhatsApp aktif Anda untuk menerima detail penawaran.',
      leadDestination: 'whatsapp',
      emailAddress: 'TODO_EMAIL@example.com',
      leadEndpoint: '/api/lead',
      submitLabel: 'Kirim Data',
    },
  },
};
