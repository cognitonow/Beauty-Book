export interface Review {
  author: string;
  rating: number;
  comment: string;
}

export interface Service {
  name: string;
  price: number;
  duration?: number; // in minutes
  category?: string;
}

export interface SocialPost {
  id: number;
  imageUrl: string;
  caption: string;
}

export interface TravelPolicy {
  locations: string[];
}

export interface ProfessionalProfile {
  id: string;
  name: string;
  specialty: "Nail Artistry" | "Hair Colorist & Stylist" | "Lash & Brow Expert" | "Makeup Artist" | "Braid Specialist";
  bio: string;
  location: string;
  profileImage: string;
  availability: 'Available Now' | 'Unavailable';
  reviews: Review[];
  services: Service[];
  predefinedServices?: string[];
  tiktokUrls?: string[];
  instagramEmbedUrls?: string[];
  instagramFeed?: SocialPost[];
  socials?: {
    instagram?: string;
    tiktok?: string;
    twitter?: string;
    linkedin?: string;
    github?: string;
    website?: string;
  }
  travelPolicy?: TravelPolicy;
  isProfileComplete?: boolean;
  profileEmbedUrl?: string;
}