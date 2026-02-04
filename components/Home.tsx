
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, MessageCircle, Star, Clock, MapPin, Scissors, Calendar, Users, Award, ChevronRight, Tag } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export const HomeScreen: React.FC = () => {
  const { branding, barbers, services, offers } = useAppContext();
  const navigate = useNavigate();

  const getWhatsAppLink = (num: string) => {
    const cleanNum = num.replace(/\D/g, '');
    return `https://wa.me/${cleanNum}`;
  };

  const quickActions = [
    { label: 'Book Now', icon: <Calendar size={20} />, path: '/booking' },
    { label: 'Our Team', icon: <Users size={20} />, path: '/barbers' },
    { label: 'Services', icon: <Scissors size={20} />, path: '/services' },
    { label: 'Portfolio', icon: <Award size={20} />, path: '/gallery' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Premium Hero Section */}
      <div className="relative h-[420px] w-full overflow-hidden">
        <img 
          src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&q=80&w=800" 
          className="absolute inset-0 w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-[3s]" 
          alt="Barber Shop" 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950/20 via-slate-950/60 to-slate-950" />
        
        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <div className="space-y-2 mb-6">
            <span className="px-3 py-1 bg-amber-400 text-black text-[10px] font-black uppercase tracking-[0.2em] rounded-full">
              Premium Grooming
            </span>
            <h2 className="text-5xl font-black text-white leading-[1.1] tracking-tight">
              Book Your <br />
              <span className="text-amber-400">Style.</span>
            </h2>
            <p className="text-slate-300 text-sm font-medium max-w-[240px] leading-relaxed">
              Experience the finest grooming services in {branding.address.split(',')[1] || 'the city'}.
            </p>
          </div>
          
          <button 
            onClick={() => navigate('/booking')}
            className="w-full py-5 bg-amber-400 text-black font-black rounded-2xl shadow-[0_20px_40px_rgba(251,191,36,0.3)] active:scale-95 transition-all flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
          >
            Book Appointment <ChevronRight size={18} />
          </button>
        </div>
      </div>

      {/* Quick Actions Grid */}
      <div className="px-4">
        <div className="grid grid-cols-4 gap-3">
          {quickActions.map((action, idx) => (
            <button 
              key={idx}
              onClick={() => navigate(action.path)}
              className="flex flex-col items-center gap-2 p-4 bg-slate-900/50 backdrop-blur-xl border border-slate-800 rounded-3xl active:scale-90 transition-all"
            >
              <div className="p-2 bg-amber-400/10 text-amber-400 rounded-xl">
                {action.icon}
              </div>
              <span className="text-[10px] font-bold text-slate-300 uppercase tracking-tighter">{action.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Dynamic Offers Slider */}
      {offers.length > 0 && (
        <section className="space-y-4">
          <div className="flex justify-between items-center px-6">
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
              <Tag size={20} className="text-amber-400" /> Exclusive Offers
            </h3>
          </div>
          <div className="flex gap-4 overflow-x-auto px-6 pb-2 snap-x no-scrollbar">
            {offers.map(offer => (
              <div 
                key={offer.id} 
                className="min-w-[280px] h-40 relative rounded-[2rem] overflow-hidden snap-center bg-slate-900 border border-slate-800 group"
              >
                <img src={offer.imageUrl} className="absolute inset-0 w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-700" alt={offer.title} />
                <div className="absolute inset-0 bg-gradient-to-r from-slate-950 to-transparent p-6 flex flex-col justify-center">
                  <span className="text-amber-400 font-black text-2xl leading-none mb-1">{offer.discount}</span>
                  <h4 className="text-white font-bold text-lg mb-1">{offer.title}</h4>
                  <p className="text-slate-400 text-xs font-medium max-w-[150px] line-clamp-2">{offer.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Popular Services Section */}
      <section className="px-6 space-y-4">
        <h3 className="text-xl font-black text-white tracking-tight">Popular Services</h3>
        <div className="grid grid-cols-2 gap-4">
          {services.slice(0, 4).map(service => (
            <div 
              key={service.id} 
              onClick={() => navigate('/booking', { state: { serviceId: service.id } })}
              className="group relative h-48 bg-slate-900 border border-slate-800 rounded-[2rem] overflow-hidden active:scale-95 transition-all cursor-pointer"
            >
              {service.imageUrl ? (
                <img src={service.imageUrl} className="absolute inset-0 w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={service.name} />
              ) : (
                <div className="absolute inset-0 bg-slate-800 flex items-center justify-center text-amber-400">
                  <Scissors size={32} />
                </div>
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4">
                <div className="flex justify-between items-end">
                  <div className="min-w-0">
                    <h4 className="text-white font-bold text-sm truncate">{service.name}</h4>
                    <p className="text-slate-400 text-[10px] font-medium">{service.duration} mins</p>
                  </div>
                  <span className="text-amber-400 font-black text-xs whitespace-nowrap">
                    {branding.currency} {service.price}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Featured Barbers Slider */}
      <section className="space-y-4">
        <div className="flex justify-between items-center px-6">
          <h3 className="text-xl font-black text-white tracking-tight">Top Stylists</h3>
          <button onClick={() => navigate('/barbers')} className="text-xs font-bold text-amber-400 flex items-center gap-1">
            View All <ChevronRight size={14} />
          </button>
        </div>
        <div className="flex gap-4 overflow-x-auto px-6 pb-4 snap-x no-scrollbar">
          {barbers.map(barber => (
            <div 
              key={barber.id} 
              className="min-w-[200px] bg-slate-900 rounded-[2.5rem] border border-slate-800 p-3 snap-center group cursor-pointer"
              onClick={() => navigate('/booking')}
            >
              <div className="relative mb-3">
                <img src={barber.imageUrl} className="w-full h-40 rounded-[2rem] object-cover" alt={barber.name} />
                <div className="absolute top-3 right-3 bg-slate-950/80 backdrop-blur-md px-2 py-1 rounded-xl flex items-center gap-1">
                  <Star className="text-amber-400 fill-amber-400" size={12} />
                  <span className="text-white text-[10px] font-bold">{barber.rating}</span>
                </div>
              </div>
              <div className="px-2 space-y-1">
                <h4 className="text-white font-bold text-sm leading-tight group-hover:text-amber-400 transition-colors">{barber.name}</h4>
                <p className="text-slate-500 text-[10px] font-bold uppercase tracking-widest">{barber.specialty}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Contact Quick Info */}
      <section className="px-6 space-y-4">
        <div className="flex gap-4">
          <a 
            href={`tel:${branding.contactPhone}`}
            className="flex-1 p-5 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center gap-2 hover:border-slate-600 transition-colors"
          >
            <Phone className="text-amber-400" size={20} />
            <span className="text-[10px] font-black uppercase text-slate-300">Call Now</span>
          </a>
          <a 
            href={getWhatsAppLink(branding.whatsappNumber)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex-1 p-5 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center gap-2 hover:border-slate-600 transition-colors"
          >
            <MessageCircle className="text-green-400" size={20} />
            <span className="text-[10px] font-black uppercase text-slate-300">WhatsApp</span>
          </a>
          <div 
            onClick={() => window.open(`https://www.google.com/maps?q=${encodeURIComponent(branding.address)}`)}
            className="flex-1 p-5 bg-slate-900 border border-slate-800 rounded-3xl flex flex-col items-center gap-2 hover:border-slate-600 transition-colors cursor-pointer"
          >
            <MapPin className="text-red-400" size={20} />
            <span className="text-[10px] font-black uppercase text-slate-300">Locate</span>
          </div>
        </div>
      </section>
    </div>
  );
};
