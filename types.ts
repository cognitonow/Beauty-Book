
export interface Service {
  name: string;
  price: number;
  duration: number; // in minutes
}

export interface SocialPost {
  id: string;
  imageUrl: string;
  caption: string;
}

export interface Review {
  author: string;
  rating: number; // out of 5
  comment: string;
}

export interface ProfessionalProfile {
  id: number;
  name: string;
  specialty: string;
  location: string;
  distance: number; // in km
  bio: string;
  services: Service[];
  socialFeed: SocialPost[];
  reviews: Review[];
  profileImage: string;
  availability: 'Available Now' | 'Unavailable';
}
