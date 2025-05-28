export interface Certification {
  title: string;
  year: string;
}

export interface Education {
  title: string;
  year: string;
}

export interface Review {
  name: string;
  date: string;
  rating: number;
  content: string;
  avatar?: string;
}

export interface Doctor {
  id: number;
  name: string;
  specialty: string;
  image: string;
  rating: number;
  reviewCount: number;
  experience: string;
  patients: string;
  shortReview: string;
  bio: string;
  certifications: Certification[];
  education: Education[];
  reviews: Review[];
}

