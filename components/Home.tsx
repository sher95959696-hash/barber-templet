
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, MessageCircle, MapPin, Zap, Crown, ArrowUpRight, Tag
} from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export const HomeScreen: React.FC = () => {
  const { branding, barbers, services, offers, theme } = useAppContext();
  const navigate = useNavigate();

  const getWhatsAppLink = (num: string) => {
    const cleanNum = (num || "").replace(/\D/g, '');
    return `https://wa.me/${cleanNum}`;
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500 pb-28">
      
      {/* 1. PREMIUM HERO */}
      <section className="relative h-[360px] w-full overflow-hidden">
        <img src={branding.heroImageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Hero" />
        <div className={`absolute inset-0 bg-gradient-to-b ${theme === 'dark' ? 'from-black/70 via-transparent to-[#020202]' : 'from-black/40 via-transparent to-slate-50'}`} />
        
        <div className="absolute top-4 inset-x-5 flex justify-between items-center z-30">
           <div className="flex items-center gap-3">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shadow-xl p-1.5 ${theme === 'dark' ? 'glass-card border-white/10' : 'bg-white border-slate-200'}`}>
                 <img src={branding.logoUrl} className="w-full h-full object-contain" alt="" />
              </div>
              <span className={`text-[10px] font-black uppercase italic tracking-widest ${theme === 'dark' ? 'text-white' : 'text-white drop-shadow-md'}`}>{branding.shopName}</span>
           </div>
           <div className={`px-3 py-1 glass-card rounded-full border flex items-center gap-2 ${theme === 'dark' ? 'border-green-500/20' : 'bg-white border-green-500/30'}`}>
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
             <span className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-green-700'}`}>Live</span>
           </div>
        </div>

        <div className="absolute bottom-6 inset-x-6 space-y-2.5 z-20">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-amber-500 rounded-lg">
             <Crown size={12} className="text-black" />
             <span className="text-[9px] font-black text-black uppercase tracking-widest">Master Studio</span>
          </div>
          <h1 className="text-3xl font-black text-white italic uppercase tracking-tighter leading-none drop-shadow-2xl">
            {branding.shopName.split(' ')[0]} <span className="text-amber-500">{branding.shopName.split(' ')[1] || ""}</span>
          </h1>
          <p className="text-zinc-200 text-[11px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[260px]">
            {branding.shopSlogan}
          </p>
          <div className="flex gap-3 pt-2">
            <button onClick={() => navigate('/booking')} className="flex-1 py-3.5 bg-amber-500 text-black font-black rounded-2xl active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[10px] shadow-xl">
              Book Seat <ArrowUpRight size={14} />
            </button>
            <button onClick={() => navigate('/services')} className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${theme === 'dark' ? 'glass-card border-white/10 text-amber-500' : 'bg-white border-slate-200 text-amber-600 shadow-md'}`}>
              <Zap size={18} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATS */}
      <section className="px-6 -mt-10 relative z-30">
        <div className={`rounded-2xl p-4 grid grid-cols-3 gap-3 border shadow-xl backdrop-blur-3xl transition-all duration-500 ${theme === 'dark' ? 'bg-zinc-900/90 border-white/10' : 'bg-white/90 border-slate-200'}`}>
           {(branding.stats || []).map((s, i) => (
             <div key={i} className={`flex flex-col items-center text-center border-r last:border-0 py-1 ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                <span className={`text-base font-black italic tracking-tighter leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{s.value}</span>
                <span className="text-[9px] font-black text-zinc-500 uppercase tracking-widest mt-1.5 leading-none">{s.label}</span>
             </div>
           ))}
        </div>
      </section>

      {/* 3. OFFERS - Headings Choti Kro */}
      {offers.length > 0 && (
        <section className="space-y-3">
          <div className="px-8 flex items-center justify-between">
             <h3 className={`text-[9px] font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>Active Deals</h3>
             <Tag size={12} className="text-amber-500" />
          </div>
          <div className="flex gap-4 overflow-x-auto px-6 pb-2 no-scrollbar snap-x">
            {offers.map(offer => (
              <div key={offer.id} className={`min-w-[280px] h-36 relative rounded-2xl overflow-hidden border snap-center shadow-xl transition-all duration-500 ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-200'}`}>
                <img src={offer.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-50" alt="" />
                <div className="absolute inset-0 p-6 flex flex-col justify-center bg-gradient-to-r from-black/80 to-transparent">
                   <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest leading-none">{offer.title}</p>
                   <h4 className="text-xl font-black text-white italic uppercase leading-tight mt-2">{offer.discount} OFF</h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. SERVICES - Headings Choti Kro */}
      <section className="px-6 space-y-3">
        <div className="flex items-center justify-between px-2">
           <h3 className={`text-[9px] font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>Top Services</h3>
           <button onClick={() => navigate('/services')} className="text-[9px] font-black text-amber-500 uppercase tracking-widest hover:underline">View Menu</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {services.slice(0, 4).map(service => (
            <div key={service.id} onClick={() => navigate('/booking', { state: { serviceId: service.id } })} className={`rounded-2xl p-3 space-y-3 border transition-all active:scale-95 shadow-md ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-200'}`}>
              <div className="h-24 w-full rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-800">
                 <img src={service.imageUrl} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="px-1">
                <h5 className={`text-[10px] font-black uppercase italic truncate leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{service.name}</h5>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-zinc-500 text-[8px] font-black uppercase">{service.duration}m</span>
                  <span className="text-amber-500 font-black text-[10px] italic">{branding.currency} {service.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TEAM */}
      <section className="space-y-3">
         <div className="px-8">
            <h3 className={`text-[9px] font-black uppercase tracking-[0.3em] ${theme === 'dark' ? 'text-white/40' : 'text-slate-400'}`}>The Artisans</h3>
         </div>
         <div className="flex gap-5 overflow-x-auto px-6 pb-2 no-scrollbar">
            {barbers.map(barber => (
              <div key={barber.id} onClick={() => navigate('/barbers')} className="min-w-[80px] flex flex-col items-center gap-3 text-center group cursor-pointer">
                <div className={`w-16 h-16 rounded-full p-1 border-2 transition-all group-hover:border-amber-500 shadow-xl ${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-slate-200'}`}>
                    <img src={barber.imageUrl} className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0" alt="" />
                </div>
                <p className={`text-[9px] font-black uppercase italic truncate w-20 ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{barber.name.split(' ')[0]}</p>
              </div>
            ))}
         </div>
      </section>

      {/* 6. STUDIO INFO */}
      <section className="px-6 pb-8">
        <div className={`rounded-2xl border overflow-hidden flex flex-col divide-y shadow-2xl transition-all duration-500 ${theme === 'dark' ? 'bg-zinc-900 border-white/5 divide-white/5' : 'bg-white border-slate-200 divide-slate-100'}`}>
          <div className="p-4 flex items-center gap-4">
             <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500 border border-amber-500/20">
                <MapPin size={18} />
             </div>
             <p className={`text-[10px] font-bold leading-relaxed italic ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-600'}`}>{branding.address}</p>
          </div>
          <div className={`p-3 flex gap-3 ${theme === 'dark' ? 'bg-white/[0.02]' : 'bg-slate-50'}`}>
            <a href={`tel:${branding.contactPhone}`} className={`flex-1 py-3.5 rounded-xl flex items-center justify-center gap-2 border transition-all active:scale-95 shadow-md ${theme === 'dark' ? 'bg-zinc-900 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-800'}`}>
              <Phone size={14} className="text-amber-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Call</span>
            </a>
            <a href={getWhatsAppLink(branding.whatsappNumber)} className="flex-1 py-3.5 bg-green-600 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all shadow-md">
              <MessageCircle size={14} className="text-white" />
              <span className="text-[10px] font-black uppercase text-white tracking-widest">Chat</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
