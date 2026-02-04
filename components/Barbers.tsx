
import React from 'react';
import { Star, Award, ShieldCheck } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { useNavigate } from 'react-router-dom';

export const BarbersScreen: React.FC = () => {
  const { barbers, branding } = useAppContext();
  const navigate = useNavigate();

  return (
    <div className="p-4 space-y-6">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white mb-2">Our Professionals</h2>
        <p className="text-slate-400 text-sm">The best hands in the city at your service.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {barbers.map(barber => (
          <div key={barber.id} className="bg-slate-900 rounded-[2.5rem] overflow-hidden border border-slate-800 p-2 shadow-xl group">
            <div className="flex flex-col md:flex-row gap-4 p-4">
              <div className="relative">
                <img src={barber.imageUrl} className="w-full md:w-32 h-48 md:h-32 rounded-3xl object-cover shadow-2xl" alt={barber.name} />
                <div className="absolute bottom-2 right-2 bg-slate-950/80 p-1.5 rounded-xl border border-slate-800 backdrop-blur-sm">
                  <div className="flex items-center gap-1">
                    <Star className="text-yellow-400 fill-yellow-400" size={14} />
                    <span className="text-white text-xs font-bold">{barber.rating}</span>
                  </div>
                </div>
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-xl font-bold text-white">{barber.name}</h3>
                  <ShieldCheck size={16} className="text-blue-400" />
                </div>
                <p className="text-amber-400 text-sm font-black uppercase tracking-widest mb-3">{barber.specialty}</p>
                
                <div className="flex gap-4 mb-4">
                  <div className="flex items-center gap-1.5 text-slate-400">
                    <Award size={14} />
                    <span className="text-xs font-medium">{barber.experience} Exp</span>
                  </div>
                </div>

                <button 
                  onClick={() => navigate('/booking')}
                  className="w-full py-3 rounded-2xl font-bold text-sm bg-slate-800 text-white hover:bg-slate-700 transition-colors active:scale-95 group-hover:bg-amber-400 group-hover:text-black"
                >
                  Book with {barber.name.split(' ')[0]}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
