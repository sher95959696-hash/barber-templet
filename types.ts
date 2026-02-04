
export interface BarberService {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number; // in minutes
  category: 'Haircut' | 'Beard' | 'Facial' | 'Combo';
  imageUrl?: string;
}

export interface Barber {
  id: string;
  name: string;
  specialty: string;
  experience: string;
  rating: number;
  imageUrl: string;
  available: boolean;
}

export interface Appointment {
  id: string;
  customerName: string;
  customerPhone: string;
  serviceId: string;
  barberId?: string;
  date: string;
  time: string;
  status: 'pending' | 'confirmed' | 'cancelled';
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  discount: string;
  expiryDate: string;
  imageUrl: string;
}

export interface GalleryImage {
  id: string;
  url: string;
  category: string;
}

export interface ShopStat {
  label: string;
  value: string;
}

export interface BrandingConfig {
  shopName: string;
  shopSlogan: string;
  logoUrl: string;
  heroImageUrl: string;
  primaryColor: string;
  secondaryColor: string;
  contactPhone: string;
  whatsappNumber: string;
  address: string;
  currency: string;
  adminPassword?: string;
  cloudinaryCloudName?: string;
  cloudinaryUploadPreset?: string;
  membershipTitle: string;
  membershipSubtext: string;
  stats: ShopStat[];
  operatingHours: {
    weekdays: string;
    weekends: string;
  };
}
