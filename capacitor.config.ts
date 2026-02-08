
import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  // UNIQUE App ID for the client
  appId: 'com.barberpro.elite', 
  
  // Name displayed under the icon
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
