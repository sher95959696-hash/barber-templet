
import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from 'react-router-dom';
import { AppProvider, useAppContext } from './store/AppContext';
import { Layout } from './components/Layout';
import { HomeScreen } from './components/Home';
import { ServicesScreen } from './components/Services';
import { BookingScreen } from './components/Booking';
import { BarbersScreen } from './components/Barbers';
import { AdminScreen } from './components/Admin';
import { GalleryScreen } from './components/Gallery';
import { MyBookingsScreen } from './components/MyBookings';

const Splash: React.FC<{ onComplete: () => void }> = ({ onComplete }) => {
  const { branding, isDbConnected } = useAppContext();
  const [isVisible, setIsVisible] = useState(true);
  const [showContent, setShowContent] = useState(false);
  
  useEffect(() => {
    // Show text content only after DB is connected and data is ready
    if (isDbConnected && branding.shopName) {
      const timer = setTimeout(() => setShowContent(true), 500);
      return () => clearTimeout(timer);
    }
  }, [isDbConnected, branding.shopName]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 800);
    }, 4500); 
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[1000] bg-[#020202] flex flex-col items-center justify-center transition-all duration-1000 ease-in-out ${!isVisible ? 'opacity-0 scale-150 blur-3xl' : 'opacity-100'}`}>
      <div className="relative group flex flex-col items-center">
        {/* Soft Ambient Glow */}
        <div className="absolute -inset-40 bg-amber-500/10 blur-[150px] rounded-full animate-pulse pointer-events-none" />
        
        {/* Logo Animation */}
        <div className="relative w-32 h-32 flex items-center justify-center p-4 animate-in zoom-in-50 fade-in duration-[1500ms]">
          <img 
            src={branding.logoUrl} 
            alt="App Logo" 
            className="w-full h-full object-contain drop-shadow-[0_0_30px_rgba(251,191,36,0.3)]" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://img.icons8.com/ios-filled/150/ffffff/barber.png";
            }}
          />
        </div>

        {/* Dynamic Text Section - Shows ONLY when DB data is available */}
        <div className={`mt-10 text-center px-10 transition-all duration-1000 transform ${showContent ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
          <h1 className="text-3xl font-black text-white tracking-tighter uppercase italic drop-shadow-2xl">
            {branding.shopName}
          </h1>
          
          <div className="h-[1.5px] w-12 bg-gradient-to-r from-transparent via-amber-500/50 to-transparent mx-auto my-4" />
          
          <p className="text-slate-500 text-[9px] font-black uppercase tracking-[0.5em] leading-relaxed">
            {branding.shopSlogan}
          </p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="absolute bottom-20 w-32 h-[1px] bg-white/5 rounded-full overflow-hidden">
        <div className="h-full bg-amber-500/50 w-full animate-[progress_4s_linear]" />
      </div>
      
      <style>{`
        @keyframes progress {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(0%); }
        }
      `}</style>
    </div>
  );
};

const App: React.FC = () => {
  const [loading, setLoading] = useState(true);

  return (
    <AppProvider>
      <Router>
        {loading && <Splash onComplete={() => setLoading(false)} />}
        <Layout>
          <Routes>
            <Route path="/" element={<HomeScreen />} />
            <Route path="/services" element={<ServicesScreen />} />
            <Route path="/booking" element={<BookingScreen />} />
            <Route path="/barbers" element={<BarbersScreen />} />
            <Route path="/gallery" element={<GalleryScreen />} />
            <Route path="/history" element={<MyBookingsScreen />} />
            <Route path="/admin" element={<AdminScreen />} />
          </Routes>
        </Layout>
      </Router>
    </AppProvider>
  );
};

export default App;
