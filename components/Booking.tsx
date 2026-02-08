
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar as CalendarIcon, Clock, User, ArrowLeft, Send, AlertTriangle, ChevronRight, Phone, User2 } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export const BookingScreen: React.FC = () => {
  const { services, barbers, branding, addAppointment, appointments, theme } = useAppContext();
  const location = useLocation();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [selectedServiceId, setSelectedServiceId] = useState<string>(location.state?.serviceId || '');
  const [selectedBarberId, setSelectedBarberId] = useState<string>('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [name, setName] = useState(localStorage.getItem('user_name') || '');
  const [phone, setPhone] = useState(localStorage.getItem('user_phone') || '');
  const [error, setError] = useState('');

  const selectedService = services.find(s => s.id === selectedServiceId);

  const handleBook = () => {
    const appointment = {
      id: Math.random().toString(36).substr(2, 9),
      customerName: name,
      customerPhone: phone,
      serviceId: selectedServiceId,
      barberId: selectedBarberId,
      date,
      time,
      status: 'pending' as const
    };
    
    localStorage.setItem('user_name', name);
    localStorage.setItem('user_phone', phone);
    
    addAppointment(appointment);
    setStep(4);
  };

  const nextStep = () => { setError(''); setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);

  if (step === 4) {
    return (
      <div className={`h-full flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500 ${theme === 'dark' ? 'bg-[#020202]' : 'bg-[#F8FAFC]'}`}>
        <div className="w-24 h-24 bg-green-500/10 rounded-full flex items-center justify-center mb-6 border border-green-500/20 shadow-2xl shadow-green-500/10">
          <CheckCircle size={48} className="text-green-500" />
        </div>
        <h2 className={`text-2xl font-black uppercase italic tracking-tighter mb-2 transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Request Sent!</h2>
        <p className={`text-xs mb-8 leading-relaxed font-bold transition-colors ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`}>
          Aapki booking request <span className="text-amber-500">{selectedService?.name}</span> ke liye bhej di gayi hai.
        </p>
        <button onClick={() => navigate('/history')} className="w-full py-5 rounded-[2rem] font-black text-black shadow-xl bg-amber-500 active:scale-95 transition-all uppercase tracking-widest text-[11px]">Track My Appointment</button>
      </div>
    );
  }

  const btnClass = "w-full py-5 rounded-[2.5rem] font-black uppercase tracking-widest text-[12px] transition-all flex items-center justify-center gap-2 shadow-xl active:scale-95";

  return (
    <div className="p-5 flex flex-col h-full space-y-7 pb-32 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button onClick={prevStep} className={`p-3 rounded-xl border transition-all active:scale-90 ${theme === 'dark' ? 'bg-zinc-900 border-white/5 text-zinc-500' : 'bg-white border-slate-200 text-slate-400'}`}>
              <ArrowLeft size={18} />
            </button>
          )}
          <h2 className={`text-2xl font-black italic uppercase tracking-tighter transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
            {step === 1 ? 'Choose Service' : step === 2 ? 'Select Stylist' : 'Details'}
          </h2>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3].map(i => <div key={i} className={`h-1.5 w-6 rounded-full transition-all duration-500 ${i <= step ? 'bg-amber-500 shadow-md shadow-amber-500/30' : theme === 'dark' ? 'bg-zinc-800' : 'bg-slate-200'}`} />)}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          <div className="space-y-4">
            {services.map(s => (
              <div 
                key={s.id} 
                onClick={() => setSelectedServiceId(s.id)} 
                className={`p-6 rounded-[2.2rem] border transition-all cursor-pointer flex justify-between items-center group shadow-sm ${
                  selectedServiceId === s.id 
                    ? 'bg-amber-500/10 border-amber-500 shadow-xl shadow-amber-500/5 scale-[1.02]' 
                    : theme === 'dark' 
                      ? 'bg-zinc-900/40 border-white/5' 
                      : 'bg-white border-slate-200'
                }`}
              >
                <div>
                  <p className={`font-black text-base uppercase italic transition-colors ${selectedServiceId === s.id ? 'text-amber-500' : theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{s.name}</p>
                  <p className="text-zinc-500 text-[10px] font-black uppercase tracking-widest mt-1.5">{s.duration} Minutes Session</p>
                </div>
                <span className="text-amber-500 font-black text-sm italic">{branding.currency} {s.price}</span>
              </div>
            ))}
          </div>
          <div className="pt-4">
            <button 
              disabled={!selectedServiceId} 
              onClick={nextStep} 
              className={`${btnClass} ${!selectedServiceId ? 'bg-zinc-800 text-zinc-600 opacity-50' : 'bg-amber-500 text-black shadow-amber-500/30'}`}
            >
              Continue <ChevronRight size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          <div className="grid grid-cols-2 gap-4">
            {barbers.map(b => (
              <div 
                key={b.id} 
                onClick={() => setSelectedBarberId(b.id === selectedBarberId ? '' : b.id)} 
                className={`flex flex-col items-center p-6 rounded-[2.8rem] border transition-all cursor-pointer relative group shadow-sm ${
                  selectedBarberId === b.id 
                    ? 'bg-amber-500/10 border-amber-500 shadow-xl shadow-amber-500/5 scale-[1.02]' 
                    : theme === 'dark' 
                      ? 'bg-zinc-900/40 border-white/5' 
                      : 'bg-white border-slate-200'
                }`}
              >
                <div className="relative mb-4">
                  <img src={b.imageUrl} className={`w-20 h-20 rounded-full object-cover shadow-xl border-2 transition-all ${selectedBarberId === b.id ? 'border-amber-500 scale-110' : 'border-slate-100 dark:border-zinc-800'}`} />
                  {selectedBarberId === b.id && <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black rounded-full p-1 shadow-lg"><CheckCircle size={16} fill="black" /></div>}
                </div>
                <span className={`font-black text-center text-xs uppercase italic transition-colors ${selectedBarberId === b.id ? 'text-amber-500' : theme === 'dark' ? 'text-white' : 'text-slate-800'}`}>{b.name}</span>
                <span className="text-zinc-500 text-[8px] font-black uppercase tracking-widest mt-1.5">Master Stylist</span>
              </div>
            ))}
          </div>
          <div className="pt-4">
            <button 
              onClick={nextStep} 
              className={`${btnClass} bg-amber-500 text-black shadow-amber-500/30`}
            >
              Continue <ChevronRight size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          <div className={`p-1 rounded-[2.5rem] border overflow-hidden shadow-sm transition-colors ${theme === 'dark' ? 'bg-zinc-900/40 border-white/5 divide-white/5' : 'bg-white border-slate-200 divide-slate-100'}`}>
               <div className="flex items-center gap-4 p-5 transition-colors">
                  <CalendarIcon size={18} className="text-amber-500" />
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className={`bg-transparent flex-1 font-bold text-sm outline-none transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} />
               </div>
               <div className="flex items-center gap-4 p-5 border-t transition-colors">
                  <Clock size={18} className="text-amber-500" />
                  <select value={time} onChange={(e) => setTime(e.target.value)} className={`bg-transparent flex-1 font-bold text-sm outline-none appearance-none transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>
                    <option value="" className={theme === 'dark' ? 'bg-zinc-900' : 'bg-white'}>Preferred Time</option>
                    {['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM','07:00 PM','08:00 PM'].map(t => (
                      <option key={t} value={t} className={theme === 'dark' ? 'bg-zinc-900' : 'bg-white'}>{t}</option>
                    ))}
                  </select>
               </div>
               <div className="flex items-center gap-4 p-5 border-t transition-colors">
                  <User2 size={18} className="text-amber-500" />
                  <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className={`bg-transparent flex-1 font-bold text-sm outline-none transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} />
               </div>
               <div className="flex items-center gap-4 p-5 border-t transition-colors">
                  <Phone size={18} className="text-amber-500" />
                  <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className={`bg-transparent flex-1 font-bold text-sm outline-none transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`} />
               </div>
          </div>
          {error && <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center gap-2 border border-red-500/20"><AlertTriangle size={14} /> {error}</div>}
          <div className="pt-4">
            <button 
              disabled={!date || !time || !name || !phone} 
              onClick={handleBook} 
              className={`${btnClass} ${(!date || !time || !name || !phone) ? 'bg-zinc-800 text-zinc-600 opacity-50' : 'bg-amber-500 text-black shadow-amber-500/30'}`}
            >
              Confirm Appointment <ChevronRight size={18} strokeWidth={3} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
