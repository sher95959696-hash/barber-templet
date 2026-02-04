
import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  onSnapshot, 
  query, 
  setDoc,
  getDoc,
  orderBy,
  limit,
  Timestamp
} from 'firebase/firestore';
import { db, requestForToken, isFirebaseConfigured } from '../firebase';
import { BarberService, Barber, Appointment, Offer, BrandingConfig, GalleryImage } from '../types';
import { DEFAULT_BRANDING, INITIAL_SERVICES, INITIAL_BARBERS, INITIAL_OFFERS } from '../constants';

interface AppNotification {
  id: string;
  title: string;
  body: string;
  timestamp: any;
  type: 'booking' | 'offer' | 'system';
  read: boolean;
}

interface AppState {
  branding: BrandingConfig;
  services: BarberService[];
  barbers: Barber[];
  offers: Offer[];
  appointments: Appointment[];
  gallery: GalleryImage[];
  notifications: AppNotification[];
  isDbConnected: boolean;
  isAdminAuthenticated: boolean;
  loginAdmin: (password: string) => boolean;
  logoutAdmin: () => void;
  updateBranding: (b: BrandingConfig) => Promise<void>;
  addAppointment: (a: Appointment) => Promise<void>;
  updateAppointment: (id: string, status: 'confirmed' | 'cancelled') => Promise<void>;
  updateService: (s: BarberService) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  updateBarber: (b: Barber) => Promise<void>;
  deleteBarber: (id: string) => Promise<void>;
  updateOffer: (o: Offer) => Promise<void>;
  deleteOffer: (id: string) => Promise<void>;
  addGalleryImage: (url: string) => Promise<void>;
  deleteGalleryImage: (id: string) => Promise<void>;
  markNotificationRead: (id: string) => Promise<void>;
}

const AppContext = createContext<AppState | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [branding, setBranding] = useState<BrandingConfig>(DEFAULT_BRANDING);
  const [services, setServices] = useState<BarberService[]>([]);
  const [barbers, setBarbers] = useState<Barber[]>([]);
  const [offers, setOffers] = useState<Offer[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [notifications, setNotifications] = useState<AppNotification[]>([]);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);
  const [isDbConnected, setIsDbConnected] = useState(false);

  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const seedIfEmpty = async () => {
      const brandRef = doc(db, "config", "branding");
      const brandSnap = await getDoc(brandRef);
      if (!brandSnap.exists()) {
        await setDoc(brandRef, DEFAULT_BRANDING);
      }
    };
    seedIfEmpty();

    const unsubBranding = onSnapshot(doc(db, "config", "branding"), (doc) => {
      if (doc.exists()) {
        setBranding(doc.data() as BrandingConfig);
        setIsDbConnected(true);
      }
    }, (err) => setIsDbConnected(false));

    const unsubServices = onSnapshot(collection(db, "services"), (snap) => {
      setServices(snap.docs.map(d => ({ id: d.id, ...d.data() } as BarberService)));
    });

    const unsubBarbers = onSnapshot(collection(db, "barbers"), (snap) => {
      setBarbers(snap.docs.map(d => ({ id: d.id, ...d.data() } as Barber)));
    });

    const unsubOffers = onSnapshot(collection(db, "offers"), (snap) => {
      setOffers(snap.docs.map(d => ({ id: d.id, ...d.data() } as Offer)));
    });

    const unsubApts = onSnapshot(query(collection(db, "appointments"), orderBy("date", "desc"), limit(50)), (snap) => {
      setAppointments(snap.docs.map(d => ({ id: d.id, ...d.data() } as Appointment)));
    });

    const unsubGallery = onSnapshot(collection(db, "gallery"), (snap) => {
      setGallery(snap.docs.map(d => ({ id: d.id, ...d.data() } as GalleryImage)));
    });

    const unsubNotes = onSnapshot(query(collection(db, "notifications"), orderBy("timestamp", "desc"), limit(20)), (snap) => {
      setNotifications(snap.docs.map(d => ({ id: d.id, ...d.data() } as AppNotification)));
    });

    requestForToken().then(token => {
      if (token) setDoc(doc(db, "fcm_tokens", token), { lastActive: Timestamp.now() }, { merge: true });
    });

    return () => {
      unsubBranding(); unsubServices(); unsubBarbers(); unsubOffers(); unsubApts(); unsubGallery(); unsubNotes();
    };
  }, []);

  const loginAdmin = (password: string) => {
    if (password === (branding.adminPassword || "1234")) {
      setIsAdminAuthenticated(true);
      return true;
    }
    return false;
  };

  const logoutAdmin = () => setIsAdminAuthenticated(false);

  const updateBranding = async (b: BrandingConfig) => {
    await setDoc(doc(db, "config", "branding"), b);
  };
  
  const addAppointment = async (a: Appointment) => { 
    const { id, ...data } = a;
    await addDoc(collection(db, "appointments"), data);
    await addDoc(collection(db, "notifications"), {
      title: "New Booking! 📅",
      body: `${a.customerName} for ${a.date}`,
      timestamp: Timestamp.now(),
      type: 'booking',
      read: false
    });
  };

  const updateAppointment = async (id: string, status: 'confirmed' | 'cancelled') => {
    await updateDoc(doc(db, "appointments", id), { status });
  };

  const updateService = async (s: BarberService) => { 
    const { id, ...data } = s;
    if (id.length > 15) await setDoc(doc(db, "services", id), data);
    else await addDoc(collection(db, "services"), data);
  };

  const deleteService = async (id: string) => await deleteDoc(doc(db, "services", id));

  const updateBarber = async (b: Barber) => { 
    const { id, ...data } = b;
    if (id.length > 15) await setDoc(doc(db, "barbers", id), data);
    else await addDoc(collection(db, "barbers"), data);
  };

  const deleteBarber = async (id: string) => await deleteDoc(doc(db, "barbers", id));

  const updateOffer = async (o: Offer) => { 
    const { id, ...data } = o;
    if (id.length > 15) await setDoc(doc(db, "offers", id), data);
    else await addDoc(collection(db, "offers"), data);
  };

  const deleteOffer = async (id: string) => await deleteDoc(doc(db, "offers", id));

  const addGalleryImage = async (url: string) => {
    await addDoc(collection(db, "gallery"), {
      url,
      category: 'Look',
      timestamp: Timestamp.now()
    });
  };

  const deleteGalleryImage = async (id: string) => await deleteDoc(doc(db, "gallery", id));

  const markNotificationRead = async (id: string) => {
    await updateDoc(doc(db, "notifications", id), { read: true });
  };

  return (
    <AppContext.Provider value={{ 
      branding, services, barbers, offers, appointments, gallery, notifications, isDbConnected,
      isAdminAuthenticated, loginAdmin, logoutAdmin,
      updateBranding, addAppointment, updateAppointment, updateService, deleteService, updateBarber, deleteBarber, updateOffer, deleteOffer,
      addGalleryImage, deleteGalleryImage, markNotificationRead
    }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
};
