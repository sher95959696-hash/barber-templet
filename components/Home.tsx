
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, MessageCircle, MapPin, Zap, Crown, ArrowUpRight, Tag, Star, Scissors, User as UserIcon, ChevronRight
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
    <div className="space-y-10 animate-in fade-in duration-500 pb-32">
      
      {/* 1. PREMIUM HERO */}
      <section className="relative h-[420px] w-full overflow-hidden">
        <img src={branding.heroImageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Hero" />
        <div className={`absolute inset-0 bg-gradient-to-b ${theme === 'dark' ? 'from-black/70 via-black/20 to-[#020202]' : 'from-black/40 via-transparent to-[#F8FAFC]'}`} />
        
        <div className="absolute top-4 inset-x-5 flex justify-between items-center z-30">
           <div className="flex items-center gap-2.5">
              <div className={`w-9 h-9 rounded-xl flex items-center justify-center border shadow-lg p-1.5 transition-all ${theme === 'dark' ? 'bg-black/40 border-white/10 backdrop-blur-md' : 'bg-white/90 border-slate-200'}`}>
                 <img src={branding.logoUrl} className="w-full h-full object-contain" alt="" />
              </div>
              <span className={`text-[11px] font-black uppercase italic tracking-[0.25em] ${theme === 'dark' ? 'text-white' : 'text-white drop-shadow-md'}`}>{branding.shopName}</span>
           </div>
           <div className={`px-3 py-1.5 rounded-full border flex items-center gap-2 ${theme === 'dark' ? 'bg-black/40 border-green-500/20 backdrop-blur-md' : 'bg-white/90 border-green-500/30 shadow-sm'}`}>
             <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
             <span className={`text-[9px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-white' : 'text-green-700'}`}>Online</span>
           </div>
        </div>

        <div className="absolute bottom-10 inset-x-6 space-y-4 z-20">
          <div className="inline-flex items-center gap-2 px-3.5 py-2 bg-amber-500 rounded-2xl shadow-xl shadow-amber-500/30">
             <Crown size={12} className="text-black" />
             <span className="text-[10px] font-black text-black uppercase tracking-widest">Elite Standard</span>
          </div>
          <h1 className="text-4xl font-black text-white italic uppercase tracking-tighter leading-none drop-shadow-2xl">
            {branding.shopName.split(' ')[0]} <span className="text-amber-500">{branding.shopName.split(' ').slice(1).join(' ')}</span>
          </h1>
          <p className="text-zinc-100 text-[12px] font-bold uppercase tracking-[0.2em] leading-relaxed max-w-[300px]">
            {branding.shopSlogan}
          </p>
          <div className="flex gap-4 pt-2">
            <button onClick={() => navigate('/booking')} className="w-full py-5 bg-amber-500 text-black font-black rounded-[2.5rem] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-[12px] shadow-2xl shadow-amber-500/40">
              Book Your Seat <ChevronRight size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      </section>

      {/* 2. STATS */}
      <section className="px-6 -mt-12 relative z-30">
        <div className={`rounded-[2.5rem] p-5 grid grid-cols-3 gap-4 border transition-all duration-500 ${theme === 'dark' ? 'bg-zinc-900/95 border-white/10 backdrop-blur-2xl shadow-2xl' : 'bg-white border-slate-200 shadow-xl shadow-slate-200/50'}`}>
           {(branding.stats || []).map((s, i) => (
             <div key={i} className={`flex flex-col items-center text-center border-r last:border-0 py-1 ${theme === 'dark' ? 'border-white/5' : 'border-slate-100'}`}>
                <span className={`text-lg font-black italic tracking-tighter leading-none transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{s.value}</span>
                <span className={`text-[8px] font-black uppercase tracking-[0.15em] mt-2 leading-none ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-400'}`}>{s.label}</span>
             </div>
           ))}
        </div>
      </section>

      {/* 3. OFFERS */}
      {offers.length > 0 && (
        <section className="space-y-4">
          <div className="px-8 flex items-center justify-between">
             <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${theme === 'dark' ? 'text-white/30' : 'text-slate-500'}`}>Seasonal Deals</h3>
             <Tag size={12} className="text-amber-500" />
          </div>
          <div className="flex gap-4 overflow-x-auto px-6 pb-2 no-scrollbar snap-x">
            {offers.map(offer => (
              <div key={offer.id} className={`min-w-[300px] h-40 relative rounded-[3rem] overflow-hidden border snap-center shadow-lg transition-all duration-500 ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-200 shadow-slate-200/40'}`}>
                <img src={offer.imageUrl} className="absolute inset-0 w-full h-full object-cover" alt="" />
                <div className="absolute inset-0 bg-black/40" />
                <div className="absolute inset-0 p-8 flex flex-col justify-center bg-gradient-to-r from-black/90 via-black/30 to-transparent">
                   <p className="text-[10px] font-black text-amber-500 uppercase tracking-widest leading-none mb-2">{offer.title}</p>
                   <h4 className="text-2xl font-black text-white italic uppercase leading-tight">{offer.discount} OFF</h4>
                   <button onClick={() => navigate('/booking')} className="mt-4 w-fit px-6 py-3 bg-amber-500 text-black text-[10px] font-black uppercase rounded-2xl shadow-lg active:scale-95 transition-all">Claim Offer</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. SERVICES - 2 PER ROW, IMMERSIVE & 50% LARGER */}
      <section className="px-6 space-y-6">
        <div className="flex items-center justify-between px-2">
           <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${theme === 'dark' ? 'text-white/30' : 'text-slate-500'}`}>Featured Menu</h3>
           <button onClick={() => navigate('/services')} className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em] hover:underline decoration-amber-500/30">View All</button>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {services.slice(0, 4).map(service => (
            <div 
              key={service.id} 
              onClick={() => navigate('/booking', { state: { serviceId: service.id } })} 
              className={`h-64 rounded-[2.5rem] relative overflow-hidden transition-all active:scale-[0.96] shadow-xl group border ${theme === 'dark' ? 'border-white/5' : 'border-slate-200'}`}
            >
              <img src={service.imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-[1.2s]" alt="" />
              <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none transition-colors duration-500 ${
                theme === 'dark' ? 'from-black/95 via-black/40 to-transparent' : 'from-white/95 via-white/20 to-transparent'
              }`} />
              <div className="absolute bottom-0 inset-x-0 p-5">
                 <h5 className={`text-[13px] font-black uppercase italic leading-none tracking-tighter truncate ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{service.name}</h5>
                 <div className="flex items-center justify-between mt-2.5">
                    <span className="text-amber-500 font-black text-xs italic">{branding.currency} {service.price}</span>
                    <span className={`text-[8px] font-black uppercase tracking-widest ${theme === 'dark' ? 'text-zinc-500/80' : 'text-slate-500'}`}>{service.duration}M</span>
                 </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TEAM - MAGAZINE STYLE, LARGER & IMMERSIVE */}
      <section className="space-y-6">
         <div className="px-8">
            <h3 className={`text-[10px] font-black uppercase tracking-[0.3em] transition-colors ${theme === 'dark' ? 'text-white/30' : 'text-slate-500'}`}>Master Artisans</h3>
         </div>
         <div className="flex gap-5 overflow-x-auto px-6 pb-6 no-scrollbar snap-x">
            {barbers.map(barber => (
              <div 
                key={barber.id} 
                onClick={() => navigate('/barbers')} 
                className="min-w-[190px] h-72 relative rounded-[3rem] overflow-hidden snap-center group border shadow-xl"
                style={{ borderColor: theme === 'dark' ? 'rgba(255,255,255,0.05)' : 'rgba(0,0,0,0.05)' }}
              >
                <img src={barber.imageUrl} className="absolute inset-0 w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt="" />
                <div className={`absolute inset-0 bg-gradient-to-t pointer-events-none ${
                  theme === 'dark' ? 'from-black/95 via-black/40 to-transparent' : 'from-white/95 via-white/20 to-transparent'
                }`} />
                <div className="absolute bottom-0 inset-x-0 p-6">
                  <div className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full mb-2.5 shadow-sm ${theme === 'dark' ? 'bg-amber-500/10 border border-amber-500/20 text-amber-500' : 'bg-amber-50 border border-amber-500/20 text-amber-600'}`}>
                    <Star size={9} fill="currentColor" />
                    <span className="text-[9px] font-black">{barber.rating}</span>
                  </div>
                  <h4 className={`text-base font-black uppercase italic leading-none tracking-tighter ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{barber.name}</h4>
                  <p className="text-amber-500 text-[8px] font-black uppercase tracking-[0.2em] mt-1.5">{barber.specialty}</p>
                </div>
              </div>
            ))}
         </div>
      </section>

      {/* 6. STUDIO INFO */}
      <section className="px-6 pb-12">
        <div className={`rounded-[3rem] border overflow-hidden flex flex-col divide-y transition-all duration-500 shadow-2xl ${theme === 'dark' ? 'bg-zinc-900 border-white/5 divide-white/5' : 'bg-white border-slate-200/60 divide-slate-100 shadow-slate-200/40'}`}>
          <div className="p-7 flex items-center gap-5">
             <div className={`w-14 h-14 rounded-[1.5rem] flex items-center justify-center border transition-all ${theme === 'dark' ? 'bg-amber-500/10 border-amber-500/20 text-amber-500 shadow-lg' : 'bg-amber-50 border-amber-500/20 text-amber-600 shadow-md'}`}>
                <MapPin size={24} />
             </div>
             <div>
               <p className={`text-[11px] font-bold leading-relaxed italic transition-colors ${theme === 'dark' ? 'text-zinc-400' : 'text-slate-600'}`}>{branding.address}</p>
               <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest mt-1">Our Elite Studio</p>
             </div>
          </div>
          <div className={`p-5 flex gap-4 transition-colors ${theme === 'dark' ? 'bg-white/[0.01]' : 'bg-slate-50/50'}`}>
            <a href={`tel:${branding.contactPhone}`} className={`flex-1 py-5 rounded-[1.5rem] flex items-center justify-center gap-3 border transition-all active:scale-95 shadow-sm ${theme === 'dark' ? 'bg-zinc-900 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-800 hover:bg-slate-100'}`}>
              <Phone size={18} className="text-amber-500" />
              <span className="text-[11px] font-black uppercase tracking-widest">Connect</span>
            </a>
            <a href={getWhatsAppLink(branding.whatsappNumber)} className="flex-1 py-5 bg-green-600 rounded-[1.5rem] flex items-center justify-center gap-3 active:scale-95 transition-all shadow-xl shadow-green-600/20">
              <MessageCircle size={18} className="text-white" />
              <span className="text-[11px] font-black uppercase text-white tracking-widest">WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
