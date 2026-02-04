
import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, CheckCircle, XCircle, AlertCircle, History, Scissors, User, LogOut, ChevronRight } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export const MyBookingsScreen: React.FC = () => {
  const { appointments, services } = useAppContext();
  const [phoneInput, setPhoneInput] = useState(localStorage.getItem('user_phone') || '');
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem('user_phone'));

  // Strictly filter for the current user's phone number
  const userAppointments = appointments.filter(a => 
    a.customerPhone.replace(/\D/g, '') === phoneInput.replace(/\D/g, '') && phoneInput.length >= 7
  ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const handleAccess = () => {
    if (phoneInput.length >= 7) {
      localStorage.setItem('user_phone', phoneInput);
      setIsLogged(true);
    } else {
      alert("Please enter a valid phone number.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user_phone');
    setPhoneInput('');
    setIsLogged(false);
  };

  const getStatusInfo = (status: string) => {
    switch(status) {
      case 'confirmed': return { color: 'text-green-400', bg: 'bg-green-400/10', icon: <CheckCircle size={12} /> };
      case 'cancelled': return { color: 'text-red-400', bg: 'bg-red-400/10', icon: <XCircle size={12} /> };
      default: return { color: 'text-amber-400', bg: 'bg-amber-400/10', icon: <Clock size={12} /> };
    }
  };

  if (!isLogged) {
    return (
      <div className="p-8 h-full flex flex-col justify-center animate-in fade-in zoom-in duration-500">
        <div className="mb-10 text-center">
          <div className="w-24 h-24 bg-zinc-900 border border-white/5 rounded-full flex items-center justify-center mx-auto mb-6 text-amber-500 shadow-2xl">
            <User size={48} />
          </div>
          <h2 className="text-3xl font-black text-white tracking-tighter italic uppercase">Personal Portal</h2>
          <p className="text-zinc-500 text-sm mt-2 font-medium">Track your personal grooming history.</p>
        </div>

        <div className="space-y-4 max-w-sm mx-auto w-full">
          <div className="relative">
            <input 
              type="tel"
              placeholder="Your Phone Number"
              value={phoneInput}
              onChange={(e) => setPhoneInput(e.target.value)}
              className="w-full bg-zinc-900 border border-white/10 rounded-2xl py-5 px-6 text-white font-bold outline-none focus:border-amber-500 transition-all text-center placeholder:text-zinc-600"
            />
          </div>
          <button 
            onClick={handleAccess}
            className="w-full py-5 bg-amber-500 text-black font-black rounded-2xl shadow-xl shadow-amber-500/20 uppercase tracking-widest text-sm active:scale-95 transition-all"
          >
            Access My Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex justify-between items-end">
        <div className="space-y-1">
          <p className="text-amber-500 text-[10px] font-black uppercase tracking-[0.3em]">Client Dashboard</p>
          <h2 className="text-3xl font-black text-white tracking-tight italic uppercase">My History</h2>
        </div>
        <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 bg-zinc-900 border border-white/5 text-zinc-500 rounded-xl hover:text-red-400 transition-colors text-[10px] font-black uppercase">
          <LogOut size={14} /> Exit
        </button>
      </div>

      <div className="space-y-4">
        {userAppointments.length === 0 ? (
          <div className="py-24 text-center space-y-4">
            <div className="w-20 h-20 bg-zinc-900 rounded-full flex items-center justify-center mx-auto border border-white/5 opacity-40">
              <History size={32} className="text-zinc-500" />
            </div>
            <p className="text-xs font-bold uppercase tracking-widest text-zinc-600">No appointments found</p>
          </div>
        ) : (
          userAppointments.map((apt, idx) => {
            const service = services.find(s => s.id === apt.serviceId);
            const status = getStatusInfo(apt.status);
            return (
              <div 
                key={apt.id} 
                className="p-6 bg-zinc-900/50 rounded-[2.2rem] border border-white/5 shadow-2xl animate-in slide-in-from-right-4 relative group"
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-black border border-amber-500/20 rounded-xl flex items-center justify-center text-amber-500 shadow-inner">
                      <Scissors size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-black text-base italic uppercase leading-none">{service?.name || 'Grooming Session'}</h4>
                      <p className="text-zinc-600 text-[9px] font-black uppercase tracking-widest mt-2">Ticket: {apt.id.slice(0, 8).toUpperCase()}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1.5 rounded-full text-[8px] font-black uppercase tracking-widest flex items-center gap-1.5 ${status.bg} ${status.color}`}>
                    {status.icon} {apt.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-4 pt-5 border-t border-white/5">
                  <div className="space-y-1">
                    <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">Date</p>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Calendar size={14} className="text-amber-500" />
                      <span className="text-xs font-bold">{apt.date}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[7px] font-black text-zinc-600 uppercase tracking-widest">Time</p>
                    <div className="flex items-center gap-2 text-zinc-300">
                      <Clock size={14} className="text-amber-500" />
                      <span className="text-xs font-bold">{apt.time}</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
