import type { SiteConfig } from './site.config';

/**
 * DEMO Configuration A: Education creator selling a Notion template (Template 2 focus).
 * All entries are labeled [DEMO] and contain no TODO markers.
 */
export const siteConfig: SiteConfig = {
  site: {
    siteName: 'Nadia Belajar [DEMO]',
    title: 'Nadia Belajar [DEMO] | Template Notion Produktivitas',
    description:
      '[DEMO] Atur jadwal kuliah, tugas, dan catatan harian lebih rapi dengan Template Notion siap pakai.',
    canonicalUrl: 'https://example.com',
    ogImage: '/images/demo-og.svg',
    locale: 'id_ID',
    pages: {
      home: {
        title: 'Nadia Belajar [DEMO] | Landing Page Resmi',
        description: '[DEMO] Pilih halaman Link-in-Bio atau Template Notion Produktivitas.',
        ogImage: '/images/demo-og.svg',
      },
      bio: {
        title: 'Nadia Pratama [DEMO] (@nadia.belajar) | Link & Media Kit',
        description: '[DEMO] Tips belajar efektif, media kit kreator edukasi, dan kerja sama brand.',
        ogImage: '/images/demo-portfolio-1.svg',
      },
      produk: {
        title: 'Template Notion Sistem Belajar [DEMO] | Nadia Belajar',
        description: '[DEMO] Rapikan jadwal kuliah, tugas, dan target harian dalam 10 menit.',
        ogImage: '/images/demo-og.svg',
      },
      privasi: {
        title: 'Kebijakan Privasi | Nadia Belajar [DEMO]',
        description: '[DEMO] Informasi pengelolaan data pengunjung dan analitik.',
        ogImage: '/images/demo-og.svg',
      },
      thankYou: {
        title: 'Terima Kasih | Nadia Belajar [DEMO]',
        description: '[DEMO] Konfirmasi pesanan Template Notion.',
      },
      notFound: {
        title: 'Halaman Tidak Ditemukan | Nadia Belajar [DEMO]',
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
        'Kami memakai cookie dan analitik sederhana untuk memahami halaman yang paling membantu Anda.',
      acceptLabel: 'Setuju',
      declineLabel: 'Tolak',
    },
  },
  whatsapp: {
    phoneNumber: '6281100001111',
    defaultMessage: 'Halo Kak Nadia [DEMO], saya tertarik dengan Template Notion Produktivitas.',
  },
  checkout: {
    enabled: false,
    provider: 'none',
  },
  linkInBio: {
    profile: {
      name: 'Nadia Pratama [DEMO]',
      handle: '@nadia.belajar',
      bio: '[DEMO] Berbagi tips belajar efektif, manajemen waktu, dan template Notion untuk mahasiswa & pekerja muda.',
      avatarUrl: '/images/demo-avatar.svg',
      location: 'Bandung, Indonesia',
    },
    links: [
      {
        id: 'demo-edu-notion',
        label: '[DEMO] Template Notion Sistem Belajar (Diskon 50%)',
        url: '/produk',
        badge: 'Terlaris',
        highlight: true,
      },
      {
        id: 'demo-edu-wa',
        label: '[DEMO] Tanya & Pesan via WhatsApp',
        url: 'https://wa.me/6281100001111',
      },
      {
        id: 'demo-edu-tiktok',
        label: '[DEMO] Video Tips Belajar di TikTok',
        url: 'https://www.tiktok.com',
      },
    ],
    mediaKit: {
      sectionTitle: 'Media Kit Kreator [DEMO]',
      stats: [
        { label: 'Pengikut TikTok', value: '[DEMO] 185K' },
        { label: 'Rata-rata Tayangan', value: '[DEMO] 52K / video' },
        { label: 'Engagement Rate', value: '[DEMO] 7,1%' },
      ],
      demographicsTitle: 'Demografi Audiens [DEMO]',
      demographics: [
        { label: 'Mahasiswa & Fresh Grad (18–24 th)', percentage: '[DEMO] 62%' },
        { label: 'Pekerja Muda (25–34 th)', percentage: '[DEMO] 31%' },
        { label: 'Pulau Jawa & Kota Besar', percentage: '[DEMO] 74%' },
      ],
      rateCardTitle: 'Paket Kerja Sama [DEMO]',
      rateCard: [
        {
          service: '[DEMO] 1x Video Edukasi Produk',
          deliverables: 'Riset topik, skrip storytelling, 1x revisi, pin di bio 7 hari',
          price: '[DEMO] Rp 4.000.000',
        },
      ],
    },
    portfolio: {
      sectionTitle: 'Portofolio Kampanye [DEMO]',
      items: [
        {
          brandName: 'RuangCatat App [DEMO]',
          campaignTitle: 'Tutorial Catatan Kuliah Digital',
          resultSummary: '[DEMO] 310K tayangan, 1.850 klik tautan bio',
          imageUrl: '/images/demo-portfolio-1.svg',
        },
      ],
    },
    inquiryForm: {
      sectionTitle: 'Ajukan Kerja Sama Brand [DEMO]',
      description: 'Kirim detail singkat kampanye Anda. Tim kami siap merespons dalam 1x24 jam kerja.',
      leadDestination: 'whatsapp',
      emailAddress: 'demo-edukasi@example.com',
      leadEndpoint: '/api/lead',
      submitLabel: 'Kirim Permintaan Kerja Sama',
    },
  },
  digitalProduct: {
    hero: {
      badge: '[DEMO] Paket Favorit Mahasiswa',
      headline: 'Rapikan Jadwal Kuliah, Tugas, dan Target Harian dalam 10 Menit [DEMO]',
      subheadline:
        '[DEMO] Template Notion siap pakai lengkap dengan video panduan Bahasa Indonesia agar langsung bisa digunakan hari ini.',
      mediaType: 'image',
      mediaUrl: '/images/demo-hero-9x16.svg',
      mediaAlt: 'Pratinjau Template Notion Sistem Belajar [DEMO]',
      ctaLabel: 'Ambil Template Sekarang',
    },
    socialProof: {
      soldCountText: '[DEMO] 1.200+ mahasiswa dan pekerja muda sudah memakai template ini',
      testimonials: [
        {
          name: 'Alya Putri [DEMO]',
          role: 'Mahasiswi Semester 6',
          quote:
            '[DEMO] Sebelumnya tugas sering keteteran, sekarang semua deadline dan jadwal ujian rapi di satu halaman.',
        },
        {
          name: 'Bagas Wicaksono [DEMO]',
          role: 'Junior Product Analyst',
          quote:
            '[DEMO] Panduannya singkat dan mudah diikuti bahkan untuk yang baru pertama kali buka Notion.',
        },
      ],
      screenshots: [
        {
          imageUrl: '/images/demo-proof-1.svg',
          alt: 'Tangkapan layar testimoni pengguna Template Notion [DEMO]',
        },
      ],
    },
    benefits: {
      sectionTitle: 'Kenapa Template Ini Membantu [DEMO]',
      items: [
        {
          title: 'Siap Pakai Tanpa Atur dari Nol [DEMO]',
          description:
            'Cukup duplikat ke akun Notion gratis Anda dan langsung isi mata kuliah atau daftar kerja.',
        },
        {
          title: 'Tampilan Nyaman di HP dan Laptop [DEMO]',
          description:
            'Dirancang agar tetap enak dibaca saat mengecek tugas cepat dari smartphone.',
        },
      ],
      whatsInsideTitle: 'Yang Anda Dapatkan di Dalam Paket [DEMO]',
      whatsInside: [
        '[DEMO] Dashboard Harian & Pelacak Deadline Tugas',
        '[DEMO] Bank Catatan Kuliah dengan Filter Topik',
        '[DEMO] Pelacak Kebiasaan Belajar Mingguan',
        '[DEMO] Video Panduan Setup 8 Menit (Bahasa Indonesia)',
      ],
    },
    offer: {
      sectionTitle: 'Penawaran Spesial [DEMO]',
      productName: 'Template Notion Sistem Belajar & Produktivitas [DEMO]',
      originalPrice: 'Rp 199.000',
      promoPrice: 'Rp 99.000',
      priceNumeric: 99000,
      ctaLabel: 'Pesan via WhatsApp Sekarang',
      faqs: [
        {
          question: '[DEMO] Apakah perlu berlangganan Notion berbayar?',
          answer: 'Tidak perlu. Seluruh fitur template berjalan lancar di akun Notion gratis.',
        },
        {
          question: '[DEMO] Bagaimana cara mendapatkan tautan template setelah bayar?',
          answer: 'Tautan duplikat dan video panduan dikirim langsung ke WhatsApp atau email Anda.',
        },
      ],
    },
    leadForm: {
      enabled: true,
      sectionTitle: 'Minta Pratinjau atau Tanya Dulu [DEMO]',
      description: 'Isi nama dan kontak aktif Anda, kami akan kirimkan detail isi template.',
      leadDestination: 'whatsapp',
      emailAddress: 'demo-edukasi@example.com',
      leadEndpoint: '/api/lead',
      submitLabel: 'Kirim Permintaan Info',
    },
  },
};
