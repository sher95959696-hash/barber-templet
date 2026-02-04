
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // 1. appId: Har client ke liye unique hona chahiye (e.g., com.clientname.barbershop)
  appId: 'com.barberpro.app', 
  
  // 2. appName: Ye wo naam hai jo phone pe icon ke niche nazar aayega
  appName: 'BarberPro', 
  
  webDir: 'dist',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"]
    }
  }
};

export default config;
