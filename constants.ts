
import { ProfessionalProfile } from './types';

export const PROFILES: ProfessionalProfile[] = [
  {
    id: 1,
    name: 'Chloe Monet',
    specialty: 'Nail Artistry',
    location: 'Downtown, Los Angeles',
    distance: 2.5,
    bio: 'Award-winning nail artist with 10+ years of experience in gel, acrylic, and intricate hand-painted designs. My studio is a clean, relaxing space where creativity flows. I only use high-quality, vegan products.',
    profileImage: 'https://picsum.photos/id/1027/800/1200',
    availability: 'Available Now',
    services: [
      { name: 'Classic Manicure', price: 40, duration: 45 },
      { name: 'Gel-X Extensions', price: 95, duration: 120 },
      { name: 'Intricate Nail Art (per nail)', price: 15, duration: 20 },
      { name: 'Builder Gel Overlay', price: 70, duration: 90 },
    ],
    socialFeed: [
      { id: 's1-1', imageUrl: 'https://picsum.photos/id/10/400/400', caption: 'Chrome dreams ✨' },
      { id: 's1-2', imageUrl: 'https://picsum.photos/id/22/400/400', caption: 'Pastel perfection' },
      { id: 's1-3', imageUrl: 'https://picsum.photos/id/25/400/400', caption: 'A little sparkle never hurt nobody' },
    ],
    reviews: [
      { author: 'Jessica L.', rating: 5, comment: 'Chloe is a true artist! My nails have never looked better.' },
      { author: 'Samantha P.', rating: 5, comment: 'The best nail tech in LA, hands down. Her studio is so cute too!' },
    ],
  },
  {
    id: 2,
    name: 'Marco Reyes',
    specialty: 'Hair Colorist & Stylist',
    location: 'Beverly Hills, CA',
    distance: 8.1,
    bio: 'Specializing in balayage, vivid colors, and precision cuts. I believe your hair is your best accessory. Let\'s work together to create a look that expresses your unique personality.',
    profileImage: 'https://picsum.photos/id/1005/800/1200',
    availability: 'Unavailable',
    services: [
      { name: 'Balayage', price: 350, duration: 240 },
      { name: 'Full Highlights', price: 280, duration: 210 },
      { name: 'Haircut & Style', price: 120, duration: 75 },
    ],
    socialFeed: [
      { id: 's2-1', imageUrl: 'https://picsum.photos/id/1011/400/400', caption: 'From brunette to fiery copper' },
      { id: 's2-2', imageUrl: 'https://picsum.photos/id/1025/400/400', caption: 'Lived-in blonde is always in.' },
      { id: 's2-3', imageUrl: 'https://picsum.photos/id/103/400/400', caption: 'Sharp bobs and curtain bangs' },
    ],
    reviews: [
      { author: 'Emily R.', rating: 5, comment: 'Marco transformed my hair! He listened to exactly what I wanted and exceeded my expectations.' },
    ],
  },
  {
    id: 3,
    name: 'Aisha Khan',
    specialty: 'Lash & Brow Expert',
    location: 'Silver Lake, Los Angeles',
    distance: 4.2,
    bio: 'Certified in classic, hybrid, and volume lash extensions, as well as brow lamination and tinting. My goal is to enhance your natural beauty and simplify your morning routine!',
    profileImage: 'https://picsum.photos/id/1012/800/1200',
    availability: 'Available Now',
    services: [
      { name: 'Volume Lash Full Set', price: 250, duration: 150 },
      { name: 'Brow Lamination & Tint', price: 110, duration: 60 },
      { name: 'Lash Lift & Tint', price: 95, duration: 75 },
    ],
    socialFeed: [
      { id: 's3-1', imageUrl: 'https://picsum.photos/id/201/400/400', caption: 'Fluffy volumes for this beauty' },
      { id: 's3-2', imageUrl: 'https://picsum.photos/id/211/400/400', caption: 'The power of a good brow lami!' },
      { id: 's3-3', imageUrl: 'https://picsum.photos/id/212/400/400', caption: 'Natural but noticeable.' },
    ],
    reviews: [
      { author: 'Maria G.', rating: 5, comment: 'Aisha is the lash queen! My lashes are always perfect and last so long.' },
    ],
  },
  {
    id: 4,
    name: 'Jasmine Lee',
    specialty: 'Makeup Artist',
    location: 'Hollywood, CA',
    distance: 6.8,
    bio: 'Professional makeup artist specializing in bridal, editorial, and red carpet looks. Let me help you feel confident and beautiful for your special occasion.',
    profileImage: 'https://picsum.photos/id/1013/800/1200',
    availability: 'Available Now',
    services: [
        { name: 'Full Glam Makeup', price: 150, duration: 90 },
        { name: 'Bridal Makeup Trial', price: 100, duration: 120 },
        { name: 'Natural "No-Makeup" Look', price: 80, duration: 60 },
    ],
    socialFeed: [
        { id: 's4-1', imageUrl: 'https://picsum.photos/id/301/400/400', caption: 'Soft glam for a wedding guest' },
        { id: 's4-2', imageUrl: 'https://picsum.photos/id/302/400/400', caption: 'Smokey eye perfection' },
        { id: 's4-3', imageUrl: 'https://picsum.photos/id/304/400/400', caption: 'Glowing, dewy skin is always in.' },
    ],
    reviews: [
        { author: 'Olivia B.', rating: 5, comment: 'Jasmine did my wedding makeup and it was flawless! It lasted all night.' },
    ],
  },
  {
    id: 5,
    name: 'Simone Adebayo',
    specialty: 'Braid Specialist',
    location: 'Inglewood, CA',
    distance: 12.3,
    bio: 'Expert in a wide range of braiding styles including knotless, box braids, cornrows, and twists. I focus on protective styling to promote healthy hair growth.',
    profileImage: 'https://picsum.photos/id/1014/800/1200',
    availability: 'Unavailable',
    services: [
        { name: 'Medium Knotless Box Braids', price: 280, duration: 360 },
        { name: 'Stitch Cornrows (6-8)', price: 90, duration: 120 },
        { name: 'Passion Twists', price: 250, duration: 300 },
    ],
    socialFeed: [
        { id: 's5-1', imageUrl: 'https://picsum.photos/id/401/400/400', caption: 'Classic box braids are timeless.' },
        { id: 's5-2', imageUrl: 'https://picsum.photos/id/402/400/400', caption: 'Clean parts are my specialty.' },
        { id: 's5-3', imageUrl: 'https://picsum.photos/id/404/400/400', caption: 'Beautiful passion twists for the summer.' },
    ],
    reviews: [
        { author: 'Keisha M.', rating: 5, comment: 'Simone is fast, professional, and my braids are always neat and beautiful.' },
    ],
  },
];
