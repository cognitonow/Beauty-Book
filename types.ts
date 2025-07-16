export interface Review {
  author: string;
  rating: number;
  comment: string;
}

export interface Service {
  name: string;
  price: number;
  duration: number; // in minutes
}

export interface SocialPost {
  id: number;
  imageUrl: string;
  caption: string;
}

export interface ProfessionalProfile {
  id: string;
  name: string;
  specialty: "Nail Artistry" | "Hair Colorist & Stylist" | "Lash & Brow Expert" | "Makeup Artist" | "Braid Specialist";
  bio: string;
  location: string;
  distance: number; // in km
  profileImage: string;
  availability: 'Available Now' | 'Unavailable';
  reviews: Review[];
  services: Service[];
  socialFeed: SocialPost[];
}

export interface McpServer {
  command: string;
  args: string[];
  env: Record<string, string>;
  cwd: string;
  timeout: number;
  trust: boolean;
}

export interface McpServers {
  [serverName: string]: McpServer;
}
