
import { BrandingConfig, BarberService, Barber, Offer } from './types';

export const DEFAULT_BRANDING: BrandingConfig = {
  shopName: "Elite Barbers", 
  shopSlogan: "The Standard of Modern Grooming", 
  logoUrl: "https://img.icons8.com/ios-filled/200/ffffff/barber.png",
  heroImageUrl: "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&q=80&w=800",
  primaryColor: "#D4AF37", 
  secondaryColor: "#020202", 
  contactPhone: "+92 300 1234567",
  whatsappNumber: "923001234567",
  address: "Premium Plaza, DHA Phase 5, Lahore",
  currency: "PKR",
  adminPassword: "1234",
  cloudinaryCloudName: "dorvstn81",
  cloudinaryUploadPreset: "ml_default",
  membershipTitle: "Elite Gold Member",
  membershipSubtext: "Premium Rewards Status",
  stats: [
    { label: "Verified Rating", value: "4.9" },
    { label: "Master Cuts", value: "2K+" },
    { label: "Awards Won", value: "12" }
  ],
  operatingHours: {
    weekdays: "10:00 AM - 11:00 PM",
    weekends: "11:00 AM - 09:00 PM"
  }
};

export const INITIAL_SERVICES: BarberService[] = [];
export const INITIAL_BARBERS: Barber[] = [];
export const INITIAL_OFFERS: Offer[] = [];
