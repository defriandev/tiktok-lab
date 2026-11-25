import type { SiteConfig } from './site.config';

/**
 * DEMO Configuration B: Gadget review creator with Media Kit (Template 1 focus).
 * All entries are labeled [DEMO] and contain no TODO markers.
 */
export const siteConfig: SiteConfig = {
  site: {
    siteName: 'Rafi Tekno [DEMO]',
    title: 'Rafi Tekno [DEMO] | Link Resmi & Media Kit',
    description:
      '[DEMO] Kreator review gadget & aksesori harian di TikTok. Lihat media kit, portofolio, dan kontak kerja sama.',
    canonicalUrl: 'https://example.com',
    ogImage: '/images/demo-og.svg',
    locale: 'id_ID',
    pages: {
      home: {
        title: 'Rafi Tekno [DEMO] | Link Resmi & Media Kit',
        description: '[DEMO] Link-in-bio, media kit review gadget, dan panduan konten HP.',
        ogImage: '/images/demo-og.svg',
      },
      bio: {
        title: 'Rafi Mahendra [DEMO] (@rafi.tekno) | Link & Media Kit',
        description: '[DEMO] Media kit, rate card, dan portofolio kerja sama brand teknologi.',
        ogImage: '/images/demo-portfolio-1.svg',
      },
      produk: {
        title: 'Panduan Video Review Gadget [DEMO] | Rafi Tekno',
        description: '[DEMO] Bikin video review gadget tajam hanya pakai kamera HP.',
        ogImage: '/images/demo-og.svg',
      },
      privasi: {
        title: 'Kebijakan Privasi | Rafi Tekno [DEMO]',
        description: '[DEMO] Informasi pengelolaan data pengunjung dan analitik.',
        ogImage: '/images/demo-og.svg',
      },
      thankYou: {
        title: 'Terima Kasih | Rafi Tekno [DEMO]',
        description: '[DEMO] Konfirmasi pesanan panduan kreator.',
      },
      notFound: {
        title: 'Halaman Tidak Ditemukan | Rafi Tekno [DEMO]',
        description: '[DEMO] Halaman tidak ditemukan.',
      },
    },
  },
  tracking: {
    tiktokPixelId: '',
    ga4MeasurementId: '',
    eventsApiEndpoint: '/api/tiktok-events',
    requireConsent: false,
    consentBanner: {
      message:
        'Kami memakai cookie dan analitik sederhana untuk memahami tautan yang paling sering dikunjungi.',
      acceptLabel: 'Setuju',
      declineLabel: 'Tolak',
    },
  },
  whatsapp: {
    phoneNumber: '6281200002222',
    defaultMessage: 'Halo tim Rafi Tekno [DEMO], kami ingin berdiskusi tentang kerja sama brand.',
  },
  checkout: {
    enabled: false,
    provider: 'none',
  },
  linkInBio: {
    profile: {
      name: 'Rafi Mahendra [DEMO]',
      handle: '@rafi.tekno',
      bio: '[DEMO] Review jujur smartphone, TWS, dan setup meja kerja. Rata-rata 85K+ tayangan per video.',
      avatarUrl: '/images/demo-avatar.svg',
      location: 'Jakarta Selatan, Indonesia',
    },
    links: [
      {
        id: 'demo-gadget-ratecard',
        label: '[DEMO] Cek Rate Card & Portofolio Brand',
        url: '#mediakit-heading',
        badge: 'Untuk Brand',
        highlight: true,
      },
      {
        id: 'demo-gadget-inquiry',
        label: '[DEMO] Ajukan Kerja Sama Endorsement',
        url: '#inquiry-heading',
      },
      {
        id: 'demo-gadget-ebook',
        label: '[DEMO] Panduan Setup Konten HP (Template 2)',
        url: '/produk',
      },
    ],
    mediaKit: {
      sectionTitle: 'Media Kit & Statistik Audiens [DEMO]',
      stats: [
        { label: 'Pengikut TikTok', value: '[DEMO] 420K+' },
        { label: 'Rata-rata Tayangan', value: '[DEMO] 85K / video' },
        { label: 'Engagement Rate', value: '[DEMO] 7,4%' },
      ],
      demographicsTitle: 'Demografi Audiens [DEMO]',
      demographics: [
        { label: 'Pria 18–34 tahun', percentage: '[DEMO] 68%' },
        { label: 'Wanita 18–34 tahun', percentage: '[DEMO] 26%' },
        { label: 'Jabodetabek, Surabaya, Bandung', percentage: '[DEMO] 61%' },
      ],
      rateCardTitle: 'Paket Kerja Sama (Rate Card) [DEMO]',
      rateCard: [
        {
          service: '[DEMO] 1x Video Review Dedicated (60–90 detik)',
          deliverables: 'Unboxing, uji pemakaian nyata, 1x revisi, pin tautan bio 14 hari',
          price: '[DEMO] Rp 6.500.000',
        },
        {
          service: '[DEMO] Paket Peluncuran Produk (3x Video)',
          deliverables: 'Teaser + review utama + perbandingan, hak pakai iklan 30 hari',
          price: '[DEMO] Rp 16.500.000',
        },
      ],
    },
    portfolio: {
      sectionTitle: 'Portofolio Kerja Sama Brand [DEMO]',
      items: [
        {
          brandName: 'SuaraAudio ID [DEMO]',
          campaignTitle: 'Uji ANC TWS di KRL & Kafe',
          resultSummary: '[DEMO] 490K tayangan, 3.400+ klik tautan produk',
          imageUrl: '/images/demo-portfolio-1.svg',
        },
        {
          brandName: 'MejaKerja Studio [DEMO]',
          campaignTitle: 'Makeover Setup Meja Minimalis',
          resultSummary: '[DEMO] 275K tayangan, 5,8% CTR ke landing page',
          imageUrl: '/images/demo-portfolio-2.svg',
        },
      ],
    },
    inquiryForm: {
      sectionTitle: 'Ajukan Kerja Sama Brand [DEMO]',
      description: 'Isi ringkasan kampanye Anda. Tim manajemen kami membalas maksimal 1x24 jam kerja.',
      leadDestination: 'whatsapp',
      emailAddress: 'demo-gadget@example.com',
      leadEndpoint: '/api/lead',
      submitLabel: 'Kirim Brief Kerja Sama',
    },
  },
  digitalProduct: {
    hero: {
      badge: '[DEMO] Panduan Kreator',
      headline: 'Bikin Video Review Gadget Tajam Hanya Pakai Kamera HP [DEMO]',
      subheadline:
        '[DEMO] Panduan pencahayaan, sudut kamera, dan struktur skrip 60 detik yang mudah diikuti pemula.',
      mediaType: 'image',
      mediaUrl: '/images/demo-hero-9x16.svg',
      mediaAlt: 'Pratinjau Panduan Konten Gadget [DEMO]',
      ctaLabel: 'Lihat Penawaran',
    },
    socialProof: {
      soldCountText: '[DEMO] 350+ kreator pemula sudah mempraktikkan panduan ini',
      testimonials: [
        {
          name: 'Fajar Nugroho [DEMO]',
          role: 'Kreator Teknologi',
          quote:
            '[DEMO] Trik pencahayaan murahnya langsung bikin kualitas video jauh lebih bersih.',
        },
      ],
      screenshots: [
        {
          imageUrl: '/images/demo-proof-1.svg',
          alt: 'Tangkapan layar testimoni kreator [DEMO]',
        },
      ],
    },
    benefits: {
      sectionTitle: 'Materi yang Dipelajari [DEMO]',
      items: [
        {
          title: 'Checklist Setup Pencahayaan Hemat [DEMO]',
          description: 'Panduan menata 1–2 lampu meja agar produk terlihat profesional.',
        },
      ],
      whatsInsideTitle: 'Isi Paket [DEMO]',
      whatsInside: [
        '[DEMO] E-Book Panduan 45 Halaman (PDF)',
        '[DEMO] 10 Template Skrip Hook Video Review',
      ],
    },
    offer: {
      sectionTitle: 'Harga Spesial [DEMO]',
      productName: 'Panduan Video Review Gadget Pakai HP [DEMO]',
      originalPrice: 'Rp 249.000',
      promoPrice: 'Rp 129.000',
      priceNumeric: 129000,
      ctaLabel: 'Pesan via WhatsApp',
      faqs: [
        {
          question: '[DEMO] Apakah perlu kamera mirrorless?',
          answer: 'Tidak perlu, seluruh contoh di panduan direkam memakai smartphone.',
        },
      ],
    },
    leadForm: {
      enabled: true,
      sectionTitle: 'Tanya Detail Panduan [DEMO]',
      description: 'Tinggalkan nama dan kontak aktif Anda untuk info lebih lanjut.',
      leadDestination: 'whatsapp',
      emailAddress: 'demo-gadget@example.com',
      leadEndpoint: '/api/lead',
      submitLabel: 'Minta Info via WhatsApp',
    },
  },
};
