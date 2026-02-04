
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Scissors, User, Calendar, Settings, Image, History, Moon, Sun } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { branding, theme, toggleTheme } = useAppContext();

  const navItems = [
    { path: '/', icon: <Home size={20} />, label: 'Home' },
    { path: '/services', icon: <Scissors size={20} />, label: 'Menu' },
    { path: '/booking', icon: <Calendar size={20} />, label: 'Book' },
    { path: '/history', icon: <History size={20} />, label: 'Trips' },
    { path: '/gallery', icon: <Image size={20} />, label: 'Looks' },
  ];

  const isAdmin = location.pathname.startsWith('/admin');

  return (
    <div className={`flex flex-col h-screen font-sans transition-colors duration-500 ${theme === 'dark' ? 'bg-[#020202] text-white' : 'bg-slate-50 text-slate-900'}`}>
      <header className={`px-5 py-3 flex items-center justify-between sticky top-0 z-[100] transition-colors duration-500 ${theme === 'dark' ? 'bg-black/80 backdrop-blur-xl border-b border-white/5' : 'bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm'}`}>
        <div className="flex items-center gap-3">
           <div className={`w-9 h-9 rounded-xl flex items-center justify-center p-1.5 shadow-md border ${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-slate-200'}`}>
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
            <h1 className="text-sm font-black tracking-tight uppercase italic leading-none">
              {branding.shopName || "Elite Salon"}
            </h1>
            <p className="text-[7px] font-black text-amber-500 uppercase tracking-[0.4em] mt-1">HQ Command</p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <button 
            onClick={toggleTheme}
            className={`p-2 rounded-xl transition-all duration-300 flex items-center justify-center border ${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-amber-400' : 'bg-slate-100 border-slate-200 text-slate-600'}`}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          
          <Link to="/admin" className={`p-2 rounded-xl transition-all duration-300 border ${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-zinc-400 hover:text-amber-500' : 'bg-slate-100 border-slate-200 text-slate-500 hover:text-amber-600'}`}>
            <Settings size={16} />
          </Link>
        </div>
      </header>

      <main className={`flex-1 overflow-y-auto no-scrollbar ${!isAdmin ? 'pb-24' : 'pb-6'}`}>
        {children}
      </main>

      {!isAdmin && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 w-[90%] max-w-[440px] z-[100]">
          <nav className={`p-1.5 rounded-2xl flex justify-between items-center shadow-2xl border transition-all duration-500 ${theme === 'dark' ? 'bg-zinc-900/95 backdrop-blur-2xl border-white/10' : 'bg-white/95 backdrop-blur-2xl border-slate-200'}`}>
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <Link 
                  key={item.path} 
                  to={item.path} 
                  className={`flex-1 flex flex-col items-center justify-center transition-all py-2.5 rounded-xl gap-1 ${isActive ? 'bg-amber-500 text-black font-bold scale-105' : theme === 'dark' ? 'text-zinc-500 hover:text-white' : 'text-slate-400 hover:text-slate-900'}`}
                >
                  {item.icon}
                  <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      )}
    </div>
  );
};
