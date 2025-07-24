import { ProfessionalProfile, SocialPost, Service, Client } from './types';

export const specialties = [
  "Nail Artistry",
  "Hair Colorist & Stylist",
  "Lash & Brow Expert",
  "Makeup Artist",
  "Braid Specialist",
  "Skincare & Facials",
  "Waxing Services",
  "Massage Therapy"
];

export const SERVICE_CATEGORIES = ['Nails', 'Hair', 'Lashes & Brows', 'Makeup', 'Skincare', 'Waxing', 'Massage'];

export const PREDEFINED_SERVICES: Service[] = [
    { name: 'Gel Manicure', price: 55, category: 'Nails' },
    { name: 'Classic Pedicure', price: 65, category: 'Nails' },
    { name: 'Balayage', price: 250, category: 'Hair' },
    { name: 'Haircut & Style', price: 85, category: 'Hair' },
    { name: 'Classic Lash Set', price: 120, category: 'Lashes & Brows' },
    { name: 'Brow Lamination', price: 80, category: 'Lashes & Brows' },
    { name: 'Event Makeup', price: 150, category: 'Makeup' },
    { name: 'Deep Cleansing Facial', price: 130, category: 'Skincare' },
];


export const DUBLIN_LOCATIONS = [
    "Dublin 1 (D01)",
    "Dublin 2 (D02)",
    "Dublin 3 (D03)",
    "Dublin 4 (D04)",
    "Dublin 5 (D05)",
    "Dublin 6 (D06)",
    "Dublin 6W (D6W)",
    "Dublin 7 (D07)",
    "Dublin 8 (D08)",
    "Dublin 9 (D09)",
    "Dublin 10 (D10)",
    "Dublin 11 (D11)",
    "Dublin 12 (D12)",
    "Dublin 13 (D13)",
    "Dublin 14 (D14)",
    "Dublin 15 (D15)",
    "Dublin 16 (D16)",
    "Dublin 17 (D17)",
    "Dublin 18 (D18)",
    "Dublin 20 (D20)",
    "Dublin 22 (D22)",
    "Dublin 24 (D24)",
    "County Dublin (Co. Dublin)"
];

export const MOCK_CLIENT: Client = {
    id: 'client_1',
    name: 'Alex Johnson',
    profileImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400',
    role: 'client'
};


export const EXTRA_SOCIAL_POSTS: SocialPost[] = [
    { id: 101, imageUrl: 'https://images.unsplash.com/photo-1522338140262-f46399516618?q=80&w=400', caption: 'Fresh set for a special occasion.' },
    { id: 102, imageUrl: 'https://images.unsplash.com/photo-1621294793836-3485e78a6e45?q=80&w=400', caption: 'Loved creating this dimensional color.' },
    { id: 103, imageUrl: 'https://images.unsplash.com/photo-1631242039945-f39b1a7d7b1a?q=80&w=400', caption: 'Wispy classics are always a good idea.' },
    { id: 104, imageUrl: 'https://images.unsplash.com/photo-1590151125212-32f22b826543?q=80&w=400', caption: 'Bridal trial success! So excited for the big day.' },
    { id: 105, imageUrl: 'https://images.unsplash.com/photo-1625997289454-1b913531c19b?q=80&w=400', caption: 'Protective styles for summer.' },
    { id: 106, imageUrl: 'https://images.unsplash.com/photo-1580242233157-3a13063b4690?q=80&w=400', caption: 'The power of a good haircut.' }
];

export const PROFILES: ProfessionalProfile[] = [
  {
    id: 'pro_1',
    name: 'Jasmine Lee',
    email: 'jasmine.lee@example.com',
    specialty: 'Nail Artistry',
    bio: 'Award-winning nail artist with a passion for intricate designs and healthy nails. From classic manicures to detailed gel-x art, I create tiny masterpieces. Based in downtown, ready to make your nail dreams come true!',
    location: 'Dublin 1 (D01)',
    profileImage: 'https://images.unsplash.com/photo-1522338242285-15a10404f263?q=80&w=800',
    availability: 'Available Now',
    profileEmbedUrl: 'https://www.tiktok.com/@vbeautypure/video/7343997426145332522',
    reviews: [
      { author: 'Chloe T.', rating: 5, comment: 'Jasmine is a true artist! My nails have never looked better.' },
      { author: 'Brenda M.', rating: 5, comment: 'Such a clean and professional setup. Loved the experience.' },
    ],
    services: [
      { name: 'Gel Manicure', price: 55, duration: 60, category: 'Nails' },
      { name: 'Nail Art (per nail)', price: 10, duration: 15, category: 'Nails' },
      { name: 'Gel-X Extensions', price: 90, duration: 120, category: 'Nails' },
    ],
    tiktokUrls: [
        'https://www.tiktok.com/@vbeautypure/video/7343997426145332522',
        'https://www.tiktok.com/@sansungnails/video/7354999954030431534',
        'https://www.tiktok.com/@nailartbyjen/video/7325519842571259179',
    ],
    instagramEmbedUrls: [
        'https://www.instagram.com/p/C2A9g2kRP3k/',
        'https://www.instagram.com/p/C8R8X-yS4AS/',
        'https://www.instagram.com/p/C5p1f2etxAq/'
    ],
    socials: {
        instagram: '@jasmine.nails',
        tiktok: '@jasminenailart',
    },
    isProfileComplete: true,
    travelPolicy: {
        locations: ['Dublin 1 (D01)', 'Dublin 2 (D02)', 'Dublin 7 (D07)'],
    }
  },
  {
    id: 'pro_2',
    name: 'Marco Reyes',
    email: 'marco.reyes@example.com',
    specialty: 'Hair Colorist & Stylist',
    bio: 'Expert in balayage, vivid colors, and precision cuts. I believe your hair is the ultimate accessory. With 10+ years of experience, I am here to help you achieve your hair goals in a relaxed, private studio setting.',
    location: 'Dublin 6 (D06)',
    profileImage: 'https://images.unsplash.com/photo-1599387791054-e4ab1848c668?q=80&w=800',
    availability: 'Available Now',
    profileEmbedUrl: 'https://www.instagram.com/p/C8R-5zcyvcc/',
    reviews: [
      { author: 'Alex D.', rating: 5, comment: 'Marco transformed my hair! The color is stunning.' },
      { author: 'Samantha P.', rating: 5, comment: 'Finally found a stylist who listens. Highly recommend!' },
    ],
    services: [
      { name: 'Balayage', price: 250, duration: 180, category: 'Hair' },
      { name: 'Haircut & Style', price: 85, duration: 60, category: 'Hair' },
      { name: 'Vivid Color Session', price: 300, duration: 240, category: 'Hair' },
    ],
    tiktokUrls: [
        'https://www.tiktok.com/@bradmondonyc/video/7345633519875149102',
        'https://www.tiktok.com/@urbanthesalon/video/7336398935395650862',
    ],
    instagramEmbedUrls: [
        'https://www.instagram.com/p/C8R-5zcyvcc/',
        'https://www.instagram.com/p/C8N1psESCbE/',
    ],
    socials: {
        instagram: '@marco.reyes.hair',
        tiktok: '@marcoreyeshair',
    },
    isProfileComplete: true,
  },
  {
    id: 'pro_3',
    name: 'Isabelle Chen',
    email: 'isabelle.chen@example.com',
    specialty: 'Lash & Brow Expert',
    bio: 'Certified in lash extensions, lifts, and brow lamination. My goal is to enhance your natural beauty and simplify your morning routine. Wake up feeling flawless!',
    location: 'Dublin 4 (D04)',
    profileImage: 'https://images.unsplash.com/photo-1532171888219-699799c43831?q=80&w=800',
    availability: 'Available Now',
    reviews: [
      { author: 'Megan R.', rating: 5, comment: 'My lashes look so natural yet full. Isabelle is amazing.' },
      { author: 'Jessica B.', rating: 5, comment: 'Obsessed with my laminated brows! Game changer.' },
    ],
    services: [
      { name: 'Classic Lash Set', price: 120, duration: 120, category: 'Lashes & Brows' },
      { name: 'Lash Lift & Tint', price: 95, duration: 75, category: 'Lashes & Brows' },
      { name: 'Brow Lamination', price: 80, duration: 60, category: 'Lashes & Brows' },
    ],
    tiktokUrls: [
        'https://www.tiktok.com/@cclashes/video/7331998993204202798'
    ],
    instagramEmbedUrls: [],
    isProfileComplete: false,
  },
    {
    id: 'pro_4',
    name: 'David Kim',
    email: 'david.kim@example.com',
    specialty: 'Makeup Artist',
    bio: "From natural glow to full glam for special events, I'm your artist. With a background in editorial and bridal makeup, I use top-tier products to create a look that lasts and photographs beautifully.",
    location: 'Dublin 2 (D02)',
    profileImage: 'https://images.unsplash.com/photo-1552058544-f2b08422138a?q=80&w=800',
    availability: 'Available Now',
    reviews: [
      { author: 'Olivia W.', rating: 5, comment: 'David did my wedding makeup and it was flawless all night!'},
      { author: 'Hannah S.', rating: 5, comment: 'Felt so confident after my session. He really knows how to highlight your features.' },
    ],
    services: [
      { name: 'Event Makeup', price: 150, duration: 90, category: 'Makeup' },
      { name: 'Bridal Makeup Trial', price: 100, duration: 90, category: 'Makeup' },
      { name: 'Makeup Lesson', price: 200, duration: 120, category: 'Makeup' },
    ],
    tiktokUrls: [
        'https://www.tiktok.com/@mikaylanogueira/video/7354492348332150059'
    ],
    instagramEmbedUrls: [
        'https://www.instagram.com/p/C8M3BF8xmO1/'
    ],
    isProfileComplete: true,
  },
];