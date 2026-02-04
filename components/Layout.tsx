
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Scissors, User, Calendar, Settings, Image, History } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { branding } = useAppContext();

  const navItems = [
    { path: '/', icon: <Home size={22} />, label: 'Home' },
    { path: '/services', icon: <Scissors size={22} />, label: 'Menu' },
    { path: '/booking', icon: <Calendar size={22} />, label: 'Book' },
    { path: '/history', icon: <History size={22} />, label: 'Trips' },
    { path: '/gallery', icon: <Image size={22} />, label: 'Looks' },
  ];

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className="flex flex-col h-screen font-sans">
      {!isAdmin && (
        <header className="px-6 py-6 bg-black/80 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between sticky top-0 z-[100]">
          <div className="flex items-center gap-4">
            <div className="relative">
               <div className="absolute -inset-2 bg-amber-500/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity"></div>
               <div className="relative w-12 h-12 bg-zinc-900 border border-white/10 rounded-xl flex items-center justify-center p-2 shadow-2xl">
                 <img 
                   src={branding.logoUrl} 
                   alt="Logo" 
                   className="w-full h-full object-contain" 
                   onError={(e) => {
                      (e.target as HTMLImageElement).src = "https://img.icons8.com/ios-filled/150/ffffff/barbershop.png";
                   }}
                 />
               </div>
            </div>
            <div>
              <h1 className="text-lg font-black tracking-tighter text-white uppercase italic leading-none">
                {branding.shopName}
              </h1>
              <p className="text-[7px] font-black text-amber-500 uppercase tracking-[0.5em] mt-1.5">Elite Grooming</p>
            </div>
          </div>
          <Link to="/admin" className="p-3 bg-zinc-900 border border-white/5 rounded-xl text-zinc-500 hover:text-amber-500 transition-all">
            <Settings size={18} />
          </Link>
        </header>
      )}

      <main className={`flex-1 overflow-y-auto no-scrollbar ${!isAdmin ? 'pb-32' : 'pb-10'}`}>
        {children}
      </main>

      {!isAdmin && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-[420px] z-[100]">
          <nav className="bg-zinc-900/90 backdrop-blur-2xl border border-white/5 p-2 rounded-[2.5rem] flex justify-between items-center shadow-2xl">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`flex flex-col items-center justify-center transition-all p-3 rounded-full ${isActive ? 'bg-amber-500 text-black shadow-lg shadow-amber-500/20' : 'text-zinc-500'}`}
                >
                  {item.icon}
                  {isActive && <span className="text-[6px] font-black uppercase mt-1 tracking-tighter">{item.label}</span>}
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
};
