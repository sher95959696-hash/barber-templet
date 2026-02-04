
import React from 'react';
import { Star, Award, ShieldCheck, ChevronRight, MessageSquare, Instagram } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';

export const BarbersScreen: React.FC = () => {
  const { barbers, branding } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="p-5 space-y-6 pb-32 animate-in fade-in duration-700">
      <div className="mb-2">
        <p className="text-amber-500 text-[9px] font-black uppercase tracking-[0.3em] mb-1">Elite Artisans</p>
        <h2 className="text-2xl font-black text-white italic uppercase tracking-tighter leading-none">The Master Team</h2>
      </div>

      <div className="space-y-4">
        {barbers.map(barber => (
          <div key={barber.id} className="glass-card rounded-[2.5rem] p-4 flex flex-col gap-4 group">
            <div className="flex gap-4">
              <div className="relative w-28 h-28 flex-shrink-0">
                <img src={barber.imageUrl} className="w-full h-full rounded-2xl object-cover grayscale group-hover:grayscale-0 transition-all duration-700" alt={barber.name} />
                <div className="absolute -bottom-2 -right-2 bg-amber-500 text-black px-2 py-1 rounded-lg flex items-center gap-1 shadow-lg">
                  <Star size={10} fill="black" />
                  <span className="text-[9px] font-black">{barber.rating}</span>
                </div>
              </div>
              
              <div className="flex-1 flex flex-col justify-center py-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-base font-black text-white uppercase italic tracking-tight">{barber.name}</h3>
                  <ShieldCheck size={14} className="text-blue-400" />
                </div>
                <p className="text-amber-500 text-[9px] font-black uppercase tracking-[0.2em] mt-1">{barber.specialty}</p>
                
                <div className="mt-3 flex gap-3">
                  <div className="flex items-center gap-1 text-zinc-500">
                    <Award size={10} />
                    <span className="text-[8px] font-black uppercase tracking-widest">{barber.experience} Exp</span>
                  </div>
                  <div className="flex items-center gap-1 text-zinc-500">
                    <MessageSquare size={10} />
                    <span className="text-[8px] font-black uppercase tracking-widest">English, Urdu</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
               <button 
                  onClick={() => navigate('/booking', { state: { barberId: barber.id } })}
                  className="flex-1 py-3.5 bg-amber-500 text-black rounded-2xl text-[9px] font-black uppercase tracking-[0.2em] shadow-xl active:scale-95 transition-all"
               >
                 Reserve Slot
               </button>
               <button className="w-12 h-12 glass-card rounded-2xl flex items-center justify-center text-zinc-400">
                 <Instagram size={18} />
               </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
