
import React, { useState, useEffect } from 'react';
import { Search, Calendar, Clock, CheckCircle, XCircle, AlertCircle, History, Scissors, User, LogOut, ChevronRight } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export const MyBookingsScreen: React.FC = () => {
  const { appointments, services, theme } = useAppContext();
  const [phoneInput, setPhoneInput] = useState(localStorage.getItem('user_phone') || '');
  const [isLogged, setIsLogged] = useState(!!localStorage.getItem('user_phone'));

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
      case 'confirmed': return { color: 'text-green-500', bg: 'bg-green-500/10', icon: <CheckCircle size={10} /> };
      case 'cancelled': return { color: 'text-red-500', bg: 'bg-red-500/10', icon: <XCircle size={10} /> };
      default: return { color: 'text-amber-500', bg: 'bg-amber-500/10', icon: <Clock size={10} /> };
    }
  };

  if (!isLogged) {
    return (
      <div className={`p-8 h-full flex flex-col justify-center animate-in fade-in zoom-in duration-500 ${theme === 'dark' ? 'bg-[#020202]' : 'bg-[#F8FAFC]'}`}>
        <div className="mb-10 text-center">
          <div className={`w-20 h-20 rounded-3xl flex items-center justify-center mx-auto mb-6 text-amber-500 shadow-xl border transition-colors ${theme === 'dark' ? 'bg-zinc-900 border-white/5 shadow-black/40' : 'bg-white border-slate-200 shadow-slate-200/50'}`}>
            <User size={36} />
          </div>
          <h2 className={`text-2xl font-black italic uppercase tracking-tighter transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Personal Portal</h2>
          <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-2">Access your grooming history</p>
        </div>

        <div className="space-y-4 max-w-sm mx-auto w-full">
          <input 
            type="tel"
            placeholder="Your Phone Number"
            value={phoneInput}
            onChange={(e) => setPhoneInput(e.target.value)}
            className={`w-full py-5 px-6 rounded-2xl font-bold outline-none border transition-all text-center placeholder:text-zinc-400 ${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white focus:border-amber-500' : 'bg-white border-slate-200 text-slate-900 shadow-xl shadow-slate-200/40 focus:border-amber-500'}`}
          />
          <button 
            onClick={handleAccess}
            className={`w-full py-5 font-black rounded-2xl shadow-xl uppercase tracking-widest text-[11px] active:scale-95 transition-all ${theme === 'dark' ? 'bg-amber-500 text-black shadow-amber-500/10' : 'bg-slate-900 text-white shadow-slate-900/20'}`}
          >
            Access Data
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-7 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-32">
      <div className="flex justify-between items-end">
        <div className="space-y-0.5">
          <p className="text-amber-500 text-[9px] font-black uppercase tracking-[0.3em]">History Feed</p>
          <h2 className={`text-2xl font-black italic uppercase tracking-tighter transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>My Trips</h2>
        </div>
        <button onClick={handleLogout} className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border transition-all text-[8px] font-black uppercase ${theme === 'dark' ? 'bg-zinc-900 border-white/5 text-zinc-500 hover:text-red-400' : 'bg-white border-slate-200 text-slate-400 hover:text-red-500 shadow-sm'}`}>
          <LogOut size={12} /> Exit
        </button>
      </div>

      <div className="space-y-4">
        {userAppointments.length === 0 ? (
          <div className="py-24 text-center space-y-4 opacity-40">
            <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto border transition-colors ${theme === 'dark' ? 'bg-zinc-900 border-white/5 text-zinc-600' : 'bg-white border-slate-200 text-slate-300 shadow-sm'}`}>
              <History size={24} />
            </div>
            <p className="text-[9px] font-black uppercase tracking-widest text-zinc-500">No records found</p>
          </div>
        ) : (
          userAppointments.map((apt, idx) => {
            const service = services.find(s => s.id === apt.serviceId);
            const status = getStatusInfo(apt.status);
            return (
              <div 
                key={apt.id} 
                className={`p-5 rounded-[2rem] border transition-all relative shadow-lg ${
                  theme === 'dark' 
                    ? 'bg-zinc-900/50 border-white/5 shadow-black/30' 
                    : 'bg-white border-slate-200/60 shadow-slate-200/30'
                }`}
                style={{ animationDelay: `${idx * 100}ms` }}
              >
                <div className="flex items-start justify-between mb-5">
                  <div className="flex items-center gap-3.5">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-amber-500 transition-colors border shadow-inner ${theme === 'dark' ? 'bg-black border-white/5' : 'bg-slate-50 border-slate-100'}`}>
                      <Scissors size={18} />
                    </div>
                    <div>
                      <h4 className={`font-black text-sm italic uppercase leading-none transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{service?.name || 'Session'}</h4>
                      <p className="text-zinc-500 text-[8px] font-black uppercase tracking-widest mt-1.5">ID: {apt.id.slice(0, 6).toUpperCase()}</p>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[7px] font-black uppercase tracking-widest flex items-center gap-1.5 shadow-sm transition-all ${status.bg} ${status.color}`}>
                    {status.icon} {apt.status}
                  </span>
                </div>

                <div className={`grid grid-cols-2 gap-4 pt-4 border-t transition-colors ${theme === 'dark' ? 'border-white/5' : 'border-slate-50'}`}>
                  <div className="space-y-1">
                    <p className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.2em]">Date</p>
                    <div className="flex items-center gap-2">
                      <Calendar size={12} className="text-amber-500" />
                      <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-600'}`}>{apt.date}</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <p className="text-[7px] font-black text-zinc-400 uppercase tracking-[0.2em]">Time</p>
                    <div className="flex items-center gap-2">
                      <Clock size={12} className="text-amber-500" />
                      <span className={`text-[10px] font-bold ${theme === 'dark' ? 'text-zinc-300' : 'text-slate-600'}`}>{apt.time}</span>
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
