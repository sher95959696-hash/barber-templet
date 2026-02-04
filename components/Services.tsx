
import React, { useState } from 'react';
import { Scissors, Zap, Heart, Sparkles, ChevronRight } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';

export const ServicesScreen: React.FC = () => {
  const { services, branding } = useAppContext();
  const [filter, setFilter] = useState<string>('All');
  const navigate = useNavigate();

  const categories = ['All', 'Haircut', 'Beard', 'Facial', 'Combo'];

  const filteredServices = filter === 'All' 
    ? services 
    : services.filter(s => s.category === filter);

  return (
    <div className="p-4 space-y-6 pb-32">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white mb-2">Our Menu</h2>
        <p className="text-slate-400 text-sm">Choose the best grooming experience for you.</p>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-2 sticky top-[72px] z-40 bg-slate-950 -mx-4 px-4 py-2">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setFilter(cat)}
            className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all ${
              filter === cat ? 'bg-white text-slate-950 shadow-lg scale-105' : 'bg-slate-900 text-slate-400 border border-slate-800'
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
            className="p-4 bg-slate-900 rounded-3xl border border-slate-800 hover:border-slate-700 transition-colors group cursor-pointer flex gap-4"
            onClick={() => navigate('/booking', { state: { serviceId: service.id } })}
          >
            <div className="w-20 h-20 rounded-2xl overflow-hidden flex-shrink-0">
              {service.imageUrl ? (
                <img src={service.imageUrl} className="w-full h-full object-cover" alt={service.name} />
              ) : (
                <div className="w-full h-full bg-slate-800 flex items-center justify-center text-amber-400">
                  <Scissors size={24} />
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex justify-between items-start mb-1">
                <h3 className="text-white font-bold group-hover:text-amber-400 transition-colors truncate">{service.name}</h3>
                <p className="text-amber-400 font-black text-sm whitespace-nowrap">{branding.currency} {service.price}</p>
              </div>
              <p className="text-[10px] uppercase text-slate-500 font-bold tracking-widest mb-1">{service.duration} mins</p>
              <p className="text-[11px] text-slate-400 line-clamp-2 leading-relaxed">{service.description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
