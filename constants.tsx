
import { BrandingConfig, BarberService, Barber, Offer } from './types';

export const DEFAULT_BRANDING: BrandingConfig = {
  shopName: "", // Keeps it empty until DB loads
  shopSlogan: "", 
  logoUrl: "https://img.icons8.com/ios-filled/200/ffffff/barber.png",
  primaryColor: "#D4AF37", 
  secondaryColor: "#0A0A0B", 
  contactPhone: "+92 300 0000000",
  whatsappNumber: "923000000000",
  address: "Premium Plaza, DHA Phase 5, Lahore",
  currency: "PKR",
  adminPassword: "1234",
  cloudinaryCloudName: "dorvstn81",
  cloudinaryUploadPreset: "ml_default",
  operatingHours: {
    weekdays: "10:00 AM - 11:00 PM",
    weekends: "11:00 AM - 09:00 PM"
  }
};

export const INITIAL_SERVICES: BarberService[] = [];
export const INITIAL_BARBERS: Barber[] = [];
export const INITIAL_OFFERS: Offer[] = [];
