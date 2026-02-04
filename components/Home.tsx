
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Phone, MessageCircle, Star, Clock, MapPin, Scissors, Calendar, 
  Users, Award, ChevronRight, Zap, Crown, ArrowUpRight, Sparkles, Tag
} from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export const HomeScreen: React.FC = () => {
  const { branding, barbers, services, offers } = useAppContext();
  const navigate = useNavigate();

  const getWhatsAppLink = (num: string) => {
    const cleanNum = (num || "").replace(/\D/g, '');
    return `https://wa.me/${cleanNum}`;
  };

  return (
    <div className="space-y-3 animate-in fade-in duration-500 pb-28">
      
      {/* 1. SLIM HERO */}
      <section className="relative h-[280px] w-full overflow-hidden">
        <img src={branding.heroImageUrl} className="absolute inset-0 w-full h-full object-cover" alt="Hero" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-transparent to-[#020202]" />
        
        <div className="absolute top-4 inset-x-4 flex justify-between items-center z-30">
           <div className="flex items-center gap-2">
              <div className="w-7 h-7 glass-card rounded-lg flex items-center justify-center border-white/10 p-1">
                 <img src={branding.logoUrl} className="w-full h-full object-contain" alt="" />
              </div>
              <span className="text-[8px] font-black text-white uppercase italic tracking-tighter">{branding.shopName}</span>
           </div>
           <div className="px-2 py-0.5 glass-card rounded-full border-green-500/20 flex items-center gap-1">
             <div className="w-1 h-1 bg-green-500 rounded-full animate-pulse" />
             <span className="text-[5px] font-black text-white uppercase">Live</span>
           </div>
        </div>

        <div className="absolute bottom-4 inset-x-5 space-y-1.5 z-20">
          <h1 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">
            {branding.shopName.split(' ')[0]} <span className="text-amber-500">{branding.shopName.split(' ')[1] || ""}</span>
          </h1>
          <p className="text-zinc-400 text-[7px] font-bold uppercase tracking-[0.2em] leading-tight max-w-[180px]">
            {branding.shopSlogan}
          </p>
          <div className="flex gap-2 pt-1">
            <button onClick={() => navigate('/booking')} className="flex-1 py-2.5 bg-amber-500 text-black font-black rounded-lg active:scale-95 transition-all flex items-center justify-center gap-1.5 uppercase tracking-widest text-[7px]">
              Book Now <ArrowUpRight size={10} />
            </button>
            <button onClick={() => navigate('/services')} className="w-9 h-9 glass-card rounded-lg flex items-center justify-center text-white border-white/10">
              <Zap size={12} className="text-amber-500" />
            </button>
          </div>
        </div>
      </section>

      {/* 2. DENSE STATS */}
      <section className="px-4 -mt-8 relative z-30">
        <div className="glass-card rounded-xl p-2.5 grid grid-cols-3 gap-1 border-white/10 shadow-xl backdrop-blur-3xl">
           {(branding.stats || []).map((s, i) => (
             <div key={i} className="flex flex-col items-center text-center border-r border-white/5 last:border-0 py-0.5">
                <span className="text-[10px] font-black text-white italic tracking-tighter leading-none">{s.value}</span>
                <span className="text-[5px] font-black text-zinc-500 uppercase tracking-widest mt-1 leading-none">{s.label}</span>
             </div>
           ))}
        </div>
      </section>

      {/* 3. HORIZONTAL OFFERS */}
      {offers.length > 0 && (
        <section className="space-y-1.5">
          <div className="px-5 flex items-center justify-between">
             <h3 className="text-[7px] font-black text-white/40 uppercase tracking-[0.2em]">Active Deals</h3>
             <Tag size={8} className="text-amber-500" />
          </div>
          <div className="flex gap-2.5 overflow-x-auto px-4 pb-1 no-scrollbar snap-x">
            {offers.map(offer => (
              <div key={offer.id} className="min-w-[220px] h-24 relative rounded-xl overflow-hidden glass-card border-white/5 snap-center">
                <img src={offer.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-20" alt="" />
                <div className="absolute inset-0 p-3.5 flex flex-col justify-center">
                   <p className="text-[6px] font-black text-amber-500 uppercase tracking-widest leading-none">{offer.title}</p>
                   <h4 className="text-sm font-black text-white italic uppercase leading-tight mt-1">{offer.discount} DISCOUNT</h4>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* 4. COMPACT 2-COLUMN SERVICES */}
      <section className="px-4 space-y-2">
        <div className="flex items-center justify-between px-1">
           <h3 className="text-[7px] font-black text-white/40 uppercase tracking-[0.2em]">Select Service</h3>
           <button onClick={() => navigate('/services')} className="text-[6px] font-black text-amber-500 uppercase tracking-widest">View All</button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {services.slice(0, 4).map(service => (
            <div key={service.id} onClick={() => navigate('/booking', { state: { serviceId: service.id } })} className="glass-card rounded-xl p-2 space-y-1.5 border-white/5 active:scale-95 transition-all">
              <div className="h-16 w-full rounded-lg overflow-hidden bg-zinc-900">
                 <img src={service.imageUrl} className="w-full h-full object-cover" alt="" />
              </div>
              <div className="px-0.5">
                <h5 className="text-[7px] font-black text-white uppercase italic truncate leading-none">{service.name}</h5>
                <div className="flex justify-between items-center mt-1">
                  <span className="text-zinc-500 text-[5px] font-black uppercase leading-none">{service.duration}m</span>
                  <span className="text-amber-500 font-black text-[7px] italic leading-none">{branding.currency} {service.price}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 5. TINY TEAM ROW */}
      <section className="space-y-1.5">
         <div className="px-5">
            <h3 className="text-[7px] font-black text-white/40 uppercase tracking-[0.2em]">The Artisans</h3>
         </div>
         <div className="flex gap-3 overflow-x-auto px-4 pb-1 no-scrollbar">
            {barbers.map(barber => (
              <div key={barber.id} onClick={() => navigate('/barbers')} className="min-w-[50px] flex flex-col items-center gap-1 text-center">
                <div className="w-10 h-10 rounded-full p-0.5 border border-white/5 bg-zinc-900 overflow-hidden">
                    <img src={barber.imageUrl} className="w-full h-full rounded-full object-cover grayscale" alt="" />
                </div>
                <p className="text-[6px] font-black text-white uppercase italic truncate w-10 leading-none">{barber.name.split(' ')[0]}</p>
              </div>
            ))}
         </div>
      </section>

      {/* 6. STUDIO INFO HUB */}
      <section className="px-4 pb-4">
        <div className="glass-card rounded-xl border-white/5 overflow-hidden flex flex-col divide-y divide-white/5">
          <div className="p-2.5 flex items-center gap-2">
             <MapPin size={10} className="text-amber-500" />
             <p className="text-[7px] font-bold text-zinc-400 leading-tight italic truncate">{branding.address}</p>
          </div>
          <div className="p-2 bg-white/[0.02] flex gap-1.5">
            <a href={`tel:${branding.contactPhone}`} className="flex-1 py-2 bg-zinc-900 rounded-lg flex items-center justify-center gap-1 border border-white/5 active:scale-95 transition-all">
              <Phone size={8} className="text-amber-500" />
              <span className="text-[6px] font-black uppercase text-white tracking-widest">Call</span>
            </a>
            <a href={getWhatsAppLink(branding.whatsappNumber)} className="flex-1 py-2 bg-green-600/90 rounded-lg flex items-center justify-center gap-1 active:scale-95 transition-all">
              <MessageCircle size={8} className="text-white" />
              <span className="text-[6px] font-black uppercase text-white tracking-widest">WhatsApp</span>
            </a>
          </div>
        </div>
      </section>

    </div>
  );
};
