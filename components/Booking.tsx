
import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Calendar as CalendarIcon, Clock, User, ArrowLeft, Send, AlertTriangle, ChevronRight, Phone, User2 } from 'lucide-react';
import { useAppContext } from '../store/AppContext';

export const BookingScreen: React.FC = () => {
  const { services, barbers, branding, addAppointment, appointments } = useAppContext();
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
    
    // Persist user details for history tracking
    localStorage.setItem('user_name', name);
    localStorage.setItem('user_phone', phone);
    
    addAppointment(appointment);
    setStep(4);
  };

  const nextStep = () => { setError(''); setStep(s => s + 1); };
  const prevStep = () => setStep(s => s - 1);

  if (step === 4) {
    return (
      <div className="h-full flex flex-col items-center justify-center p-8 text-center animate-in zoom-in duration-500 bg-slate-950">
        <div className="w-28 h-28 bg-green-500/10 rounded-full flex items-center justify-center mb-8 border border-green-500/20 shadow-2xl">
          <CheckCircle size={56} className="text-green-500" />
        </div>
        <h2 className="text-3xl font-black text-white mb-3">Slot Reserved!</h2>
        <p className="text-slate-400 mb-10 leading-relaxed font-medium">
          Aapki booking request <span className="text-white font-bold">{selectedService?.name}</span> ke liye bhej di gayi hai. Aap history mein check kar sakte hain.
        </p>
        <button onClick={() => navigate('/history')} className="w-full py-5 rounded-3xl font-black text-black shadow-2xl bg-amber-500 active:scale-95 transition-all uppercase tracking-widest text-sm">Track My Appointment</button>
      </div>
    );
  }

  return (
    <div className="p-6 flex flex-col h-full space-y-8 pb-32">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {step > 1 && (
            <button onClick={prevStep} className="p-3 bg-slate-900 border border-slate-800 text-slate-400 rounded-2xl active:scale-90 transition-all">
              <ArrowLeft size={20} />
            </button>
          )}
          <h2 className="text-2xl font-black text-white tracking-tight">
            {step === 1 ? 'Choose Service' : step === 2 ? 'Select Stylist' : 'Final Details'}
          </h2>
        </div>
        <div className="flex gap-1.5">
          {[1, 2, 3].map(i => <div key={i} className={`h-1.5 w-6 rounded-full transition-all duration-500 ${i <= step ? 'bg-amber-500 shadow-lg shadow-amber-500/30' : 'bg-slate-800'}`} />)}
        </div>
      </div>

      {step === 1 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          <div className="space-y-3">
            {services.map(s => (
              <div 
                key={s.id} 
                onClick={() => setSelectedServiceId(s.id)} 
                className={`p-6 rounded-[2rem] border transition-all cursor-pointer flex justify-between items-center group ${selectedServiceId === s.id ? 'bg-amber-500/10 border-amber-500 shadow-xl' : 'bg-slate-900/50 border-slate-800'}`}
              >
                <div>
                  <p className={`font-black text-lg transition-colors ${selectedServiceId === s.id ? 'text-amber-500' : 'text-white'}`}>{s.name}</p>
                  <p className="text-slate-500 text-[10px] font-black uppercase tracking-widest mt-1">{s.duration} Minutes</p>
                </div>
                <span className="text-amber-500 font-black text-sm">{branding.currency} {s.price}</span>
              </div>
            ))}
          </div>
          <button disabled={!selectedServiceId} onClick={nextStep} className="w-full py-6 rounded-[2rem] font-black text-black bg-amber-500 disabled:opacity-20 shadow-2xl shadow-amber-500/20 flex items-center justify-center gap-3 uppercase tracking-widest text-sm">
            Continue <ChevronRight size={18} />
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          <div className="grid grid-cols-2 gap-4">
            {barbers.map(b => (
              <div 
                key={b.id} 
                onClick={() => setSelectedBarberId(b.id === selectedBarberId ? '' : b.id)} 
                className={`flex flex-col items-center p-5 rounded-[2.5rem] border transition-all cursor-pointer relative group ${selectedBarberId === b.id ? 'bg-amber-500/10 border-amber-500 shadow-xl' : 'bg-slate-900/50 border-slate-800'}`}
              >
                <div className="relative mb-4">
                  <img src={b.imageUrl} className="w-20 h-20 rounded-full object-cover shadow-2xl border-2 border-slate-800 group-hover:border-amber-500 transition-colors" />
                  {selectedBarberId === b.id && <div className="absolute -bottom-1 -right-1 bg-amber-500 text-black rounded-full p-1"><CheckCircle size={16} fill="black" /></div>}
                </div>
                <span className={`font-black text-center text-xs transition-colors ${selectedBarberId === b.id ? 'text-amber-500' : 'text-white'}`}>{b.name.split(' ')[0]}</span>
                <span className="text-slate-500 text-[8px] font-black uppercase tracking-widest mt-1">{b.specialty.split(' ')[0]}</span>
              </div>
            ))}
          </div>
          <button onClick={nextStep} className="w-full py-6 rounded-[2rem] font-black text-black bg-amber-500 shadow-2xl shadow-amber-500/20 uppercase tracking-widest text-sm">Final Step</button>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-6 animate-in slide-in-from-right-4 duration-500">
          <div className="space-y-4">
            <div className="p-1 bg-slate-900/50 rounded-3xl border border-slate-800 flex flex-col gap-px overflow-hidden">
               <div className="flex items-center gap-4 p-5">
                  <CalendarIcon size={20} className="text-amber-500" />
                  <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="bg-transparent flex-1 text-white font-bold outline-none" />
               </div>
               <div className="flex items-center gap-4 p-5 border-t border-slate-800">
                  <Clock size={20} className="text-amber-500" />
                  <select value={time} onChange={(e) => setTime(e.target.value)} className="bg-transparent flex-1 text-white font-bold outline-none appearance-none">
                    <option value="" className="bg-slate-900">Preferred Time</option>
                    {['09:00 AM','10:00 AM','11:00 AM','12:00 PM','02:00 PM','03:00 PM','04:00 PM','05:00 PM','06:00 PM','07:00 PM','08:00 PM'].map(t => (
                      <option key={t} value={t} className="bg-slate-900">{t}</option>
                    ))}
                  </select>
               </div>
               <div className="flex items-center gap-4 p-5 border-t border-slate-800">
                  <User2 size={20} className="text-amber-500" />
                  <input type="text" placeholder="Your Name" value={name} onChange={(e) => setName(e.target.value)} className="bg-transparent flex-1 text-white font-bold outline-none" />
               </div>
               <div className="flex items-center gap-4 p-5 border-t border-slate-800">
                  <Phone size={20} className="text-amber-500" />
                  <input type="tel" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} className="bg-transparent flex-1 text-white font-bold outline-none" />
               </div>
            </div>
          </div>
          {error && <div className="p-4 bg-red-500/10 text-red-500 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-2 border border-red-500/20"><AlertTriangle size={14} /> {error}</div>}
          <button disabled={!date || !time || !name || !phone} onClick={handleBook} className="w-full py-6 rounded-[2rem] font-black text-black bg-amber-500 shadow-2xl shadow-amber-500/40 disabled:opacity-20 uppercase tracking-[0.2em] text-sm">Confirm My Slot</button>
        </div>
      )}
    </div>
  );
};
