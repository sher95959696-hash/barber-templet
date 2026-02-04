
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Scissors, User, Calendar, Settings, Image, History } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { branding } = useAppContext();

  const navItems = [
    { path: '/', icon: <Home size={18} />, label: 'Home' },
    { path: '/services', icon: <Scissors size={18} />, label: 'Menu' },
    { path: '/booking', icon: <Calendar size={18} />, label: 'Book' },
    { path: '/history', icon: <History size={18} />, label: 'Trips' },
    { path: '/gallery', icon: <Image size={18} />, label: 'Looks' },
  ];

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col h-screen font-sans">
      {!isAdmin && (
        <header className="px-5 py-4 bg-black/80 backdrop-blur-xl border-b border-white/5 flex items-center justify-between sticky top-0 z-[100]">
          <div className="flex items-center gap-3">
             <div className="w-9 h-9 bg-zinc-900 border border-white/10 rounded-lg flex items-center justify-center p-1.5 shadow-xl">
               <img 
                 src={branding.logoUrl} 
                 alt="Logo" 
                 className="w-full h-full object-contain" 
                 onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://img.icons8.com/ios-filled/150/ffffff/barbershop.png";
                 }}
               />
             </div>
            <div>
              <h1 className="text-sm font-black tracking-tight text-white uppercase italic leading-none">
                {branding.shopName || "Elite Salon"}
              </h1>
              <p className="text-[6px] font-black text-amber-500 uppercase tracking-[0.4em] mt-1">Grooming HQ</p>
            </div>
          </div>
          <Link to="/admin" className="p-2 bg-zinc-900 border border-white/5 rounded-lg text-zinc-500 hover:text-amber-500 transition-all">
            <Settings size={14} />
          </Link>
        </header>
      )}

      <main className={`flex-1 overflow-y-auto no-scrollbar ${!isAdmin ? 'pb-24' : 'pb-6'}`}>
        {children}
      </main>

      {!isAdmin && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[92%] max-w-[400px] z-[100]">
          <nav className="bg-zinc-900/95 backdrop-blur-2xl border border-white/10 p-1.5 rounded-2xl flex justify-between items-center shadow-2xl">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`flex-1 flex flex-col items-center justify-center transition-all py-2.5 rounded-xl ${isActive ? 'bg-amber-500 text-black font-bold' : 'text-zinc-500'}`}
                >
                  {item.icon}
                  <span className="text-[7px] font-black uppercase mt-1 tracking-tight">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
};
