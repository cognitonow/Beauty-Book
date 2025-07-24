export interface Review {
  author: string;
  rating: number;
  comment: string;
}

export interface Service {
  name:string;
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

export interface Client {
  id: string;
  name: string;
  profileImage: string;
  role: 'client';
}

export interface Message {
  id: string;
  senderId: string; // 'client_1' or professional's ID
  senderName: string;
  text: string;
  timestamp: string; // ISO string for simplicity
}

export interface Booking {
  id: string;
  clientId: string;
  clientName: string;
  clientImage: string;
  professionalId: string;
  professionalName: string;
  professionalImage: string;
  service: Service;
  status: 'pending' | 'approved' | 'declined' | 'completed' | 'cancelled';
  messages: Message[];
  createdAt: string; // ISO string
  requestedDateTime?: string;
}

export interface Notification {
  id: string;
  userId: string; // The user to be notified
  type: 'booking_request' | 'booking_approved' | 'booking_declined' | 'new_message';
  message: string;
  bookingId: string;
  isRead: boolean;
  timestamp: string;
}

export interface ProfessionalProfile {
  id: string;
  name: string;
  email: string;
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
  role?: 'professional';
}