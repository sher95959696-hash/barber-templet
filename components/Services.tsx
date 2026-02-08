
import React, { useState } from 'react';
import { Scissors, Zap, Heart, Sparkles, ChevronRight } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';

export const ServicesScreen: React.FC = () => {
  const { services, branding, theme } = useAppContext();
  const [filter, setFilter] = useState<string>('All');
  const navigate = useNavigate();

  const categories = ['All', 'Haircut', 'Beard', 'Facial', 'Combo'];

  const filteredServices = filter === 'All' 
    ? services 
    : services.filter(s => s.category === filter);

  return (
    <div className="p-4 space-y-6 pb-32">
      <div className="mb-2">
        <h2 className={`text-2xl font-black italic uppercase tracking-tighter transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Our Menu</h2>
        <p className={`text-sm font-medium transition-colors ${theme === 'dark' ? 'text-slate-500' : 'text-slate-500'}`}>Choose the best grooming experience for you.</p>
      </div>

      <div className={`flex gap-2 overflow-x-auto pb-2 sticky top-[52px] z-40 -mx-4 px-4 py-2 transition-colors ${theme === 'dark' ? 'bg-black/90 backdrop-blur-md' : 'bg-[#F8FAFC]/90 backdrop-blur-md'}`}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${
              filter === cat 
                ? 'bg-amber-500 text-black border-amber-500 shadow-lg scale-105' 
                : theme === 'dark' 
                  ? 'bg-zinc-900 text-zinc-500 border-white/5' 
                  : 'bg-white text-slate-400 border-slate-200'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredServices.map(service => (
          <div 
            key={service.id} 
            className={`p-4 rounded-[2rem] border transition-all group cursor-pointer flex gap-4 shadow-sm ${
              theme === 'dark' 
                ? 'bg-zinc-900/50 border-white/5 hover:border-white/10' 
                : 'bg-white border-slate-200/60 hover:border-amber-500/30 shadow-slate-200/20'
            }`}
            onClick={() => navigate('/booking', { state: { serviceId: service.id } })}
          >
            <div className={`w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0 transition-colors ${theme === 'dark' ? 'bg-zinc-800' : 'bg-slate-50'}`}>
              {service.imageUrl ? (
                <img src={service.imageUrl} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt={service.name} />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-amber-500">
                  <Scissors size={24} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              <div className="flex justify-between items-start mb-1">
                <h3 className={`font-black text-sm uppercase italic tracking-tight transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{service.name}</h3>
                <p className="text-amber-500 font-black text-xs italic whitespace-nowrap">{branding.currency} {service.price}</p>
              </div>
              <p className="text-[8px] uppercase text-zinc-500 font-black tracking-widest mb-1">{service.duration} mins</p>
              <p className={`text-[10px] line-clamp-2 leading-relaxed font-medium ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
