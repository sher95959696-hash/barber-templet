
import React, { useState, useRef, useEffect } from 'react';
import { Settings, Plus, Trash2, Edit2, User, Scissors, Calendar, Lock, LogOut, X, Check, Image as ImageIcon, Phone, MessageCircle, MapPin, Tag, Smartphone, Cloud, Sun, Moon, ChevronDown } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { Barber, BarberService, Offer } from '../types';

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  const { theme } = useAppContext();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/90 backdrop-blur-md">
      <div className={`w-full max-w-sm rounded-[2.5rem] p-7 space-y-6 animate-in zoom-in-95 duration-200 border shadow-2xl transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-slate-200 shadow-slate-200'}`}>
        <div className="flex justify-between items-center border-b pb-4 border-slate-100 dark:border-white/5">
          <h3 className={`text-[11px] font-black uppercase italic tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-red-500"><X size={20} /></button>
        </div>
        <div className="max-h-[60vh] overflow-y-auto no-scrollbar pr-1">{children}</div>
      </div>
    </div>
  );
};

const ImagePicker: React.FC<{ 
  currentUrl: string; 
  onUpload: (url: string) => void;
  label: string;
  cloudName?: string;
  uploadPreset?: string;
  aspectRatio?: 'square' | 'wide';
}> = ({ currentUrl, onUpload, label, cloudName, uploadPreset, aspectRatio = 'square' }) => {
  const { theme } = useAppContext();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!cloudName || !uploadPreset || uploadPreset.trim() === "") {
      const url = prompt("Cloudinary keys missing. Please paste a direct Image URL:");
      if (url) onUpload(url);
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const res = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, { method: 'POST', body: formData });
      const data = await res.json();
      if (data.secure_url) {
        onUpload(data.secure_url);
      } else {
        alert("Upload Error: " + (data.error?.message || "Check keys"));
      }
    } catch (err) { alert("Upload Failed"); } finally { setIsUploading(false); }
  };

  return (
    <div className="space-y-1.5">
      <p className="text-[9px] font-black text-zinc-500 uppercase tracking-widest ml-1">{label}</p>
      <div className="flex items-center gap-3.5">
        <div className={`relative ${aspectRatio === 'wide' ? 'w-20 aspect-video' : 'w-14 h-14'} rounded-xl overflow-hidden flex items-center justify-center border transition-all ${theme === 'dark' ? 'bg-zinc-800 border-white/10' : 'bg-slate-50 border-slate-200'}`}>
          {currentUrl ? <img src={currentUrl} className="w-full h-full object-cover" /> : <ImageIcon size={18} className="text-zinc-400" />}
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 py-2.5 rounded-xl text-[9px] font-black uppercase tracking-widest border shadow-sm transition-all ${theme === 'dark' ? 'bg-zinc-800 border-white/5 text-zinc-400' : 'bg-white border-slate-200 text-slate-800 shadow-sm hover:bg-slate-50'}`}
        >
          {isUploading ? "Syncing..." : "Update"}
        </button>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      </div>
    </div>
  );
};

export const AdminScreen: React.FC = () => {
  const { 
    branding, services, barbers, appointments, offers, isAdminAuthenticated, theme, toggleTheme, loginAdmin, logoutAdmin,
    updateBranding, updateService, deleteService, updateBarber, deleteBarber, updateAppointment, updateOffer, deleteOffer
  } = useAppContext();
  
  const [tab, setTab] = useState<'bookings' | 'branding' | 'services' | 'staff' | 'offers'>('bookings');
  const [passwordInput, setPasswordInput] = useState('');
  const [editBranding, setEditBranding] = useState({ ...branding });

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState<Partial<BarberService>>({});
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffForm, setStaffForm] = useState<Partial<Barber>>({});
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerForm, setOfferForm] = useState<Partial<Offer>>({});

  useEffect(() => { 
    setEditBranding({ ...branding }); 
  }, [branding]);

  const handleUpdateBranding = async () => {
    try {
      await updateBranding(editBranding);
      alert("System Published Successfully!");
    } catch (e) {
      alert("Update failed: " + e);
    }
  };

  const saveService = async () => {
    if (!serviceForm.name || !serviceForm.price || !serviceForm.category) return alert("Please fill all required fields");
    await updateService({ ...serviceForm, id: serviceForm.id || Math.random().toString(36).substr(2, 9) } as BarberService);
    setShowServiceForm(false);
  };

  const saveStaff = async () => {
    if (!staffForm.name) return alert("Fill name");
    await updateBarber({ ...staffForm, id: staffForm.id || Math.random().toString(36).substr(2, 9) } as Barber);
    setShowStaffForm(false);
  };

  const saveOffer = async () => {
    if (!offerForm.title || !offerForm.discount) return alert("Fill fields");
    await updateOffer({ ...offerForm, id: offerForm.id || Math.random().toString(36).substr(2, 9) } as Offer);
    setShowOfferForm(false);
  };

  if (!isAdminAuthenticated) {
    return (
      <div className={`min-h-full flex flex-col items-center justify-center p-10 transition-colors duration-500 ${theme === 'dark' ? 'bg-[#020202]' : 'bg-slate-50'}`}>
        <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center mb-8 shadow-xl shadow-amber-500/20">
          <Lock size={32} className="text-black" />
        </div>
        <h2 className={`text-xl font-black uppercase italic tracking-tighter mb-8 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Security Gate</h2>
        <form onSubmit={(e) => { e.preventDefault(); loginAdmin(passwordInput); }} className="w-full space-y-4 max-w-xs">
          <input 
            type="password" 
            placeholder="System Pin"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className={`w-full py-5 text-center text-xl outline-none font-bold rounded-2xl border transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/10 text-white' : 'bg-white border-slate-300 text-slate-900 shadow-xl shadow-slate-200/50'}`}
          />
          <button type="submit" className="w-full py-5 bg-amber-500 text-black font-black rounded-2xl uppercase text-[12px] tracking-widest shadow-xl">Unlock Terminal</button>
        </form>
      </div>
    );
  }

  const inputClass = `w-full p-4 rounded-xl outline-none font-bold text-[15px] transition-all border ${theme === 'dark' ? 'bg-zinc-900 border-white/20 text-white placeholder:text-zinc-600 focus:border-amber-500' : 'bg-white border-slate-200 text-slate-900 placeholder:text-slate-400 focus:border-amber-500 shadow-sm'}`;
  const labelClass = `text-[9px] font-black uppercase tracking-widest ml-1 mb-1 transition-colors ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`;

  return (
    <div className="p-5 space-y-7 max-w-md mx-auto animate-in fade-in duration-300 pb-32">
      <header className="flex items-center justify-between px-2">
        <div className="space-y-0.5">
           <h2 className={`text-xl font-black italic uppercase tracking-tighter leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Command Hub</h2>
           <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest leading-none">Global Sync Active</p>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleTheme} className={`p-2.5 rounded-xl border transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/5 text-amber-400' : 'bg-white border-slate-200 text-slate-500 shadow-sm'}`}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={logoutAdmin} className={`p-2.5 text-red-500 rounded-xl border transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-200 shadow-sm'}`}><LogOut size={18} /></button>
        </div>
      </header>

      <div className="flex gap-2.5 overflow-x-auto pb-2 sticky top-0 z-50 -mx-4 px-4 no-scrollbar border-b transition-colors border-slate-100 dark:border-white/5 bg-opacity-95 backdrop-blur-md">
        {[
          { id: 'bookings', label: 'Queues', icon: <Calendar size={14} /> },
          { id: 'services', label: 'Menu', icon: <Scissors size={14} /> },
          { id: 'staff', label: 'Team', icon: <User size={14} /> },
          { id: 'offers', label: 'Deals', icon: <Tag size={14} /> },
          { id: 'branding', label: 'Setup', icon: <Smartphone size={14} /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-2 px-4 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
              tab === t.id ? 'bg-amber-500 text-black border-amber-500 shadow-lg scale-105' : theme === 'dark' ? 'bg-zinc-900 text-zinc-500 border-white/5' : 'bg-white text-slate-400 border-slate-200'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'bookings' && (
        <div className="space-y-4">
          {appointments.length === 0 && <p className="text-center py-20 text-[10px] uppercase font-black tracking-widest text-zinc-400">No appointments</p>}
          {appointments.map(apt => (
            <div key={apt.id} className={`p-5 rounded-3xl space-y-4 border transition-all shadow-lg ${theme === 'dark' ? 'bg-zinc-900 border-white/5 shadow-black/30' : 'bg-white border-slate-100 shadow-slate-200/40'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className={`font-black text-sm uppercase italic leading-none transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{apt.customerName}</h4>
                  <p className="text-amber-500 text-[10px] font-black mt-2 leading-none">{apt.customerPhone}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateAppointment(apt.id, 'confirmed')} className={`p-2.5 rounded-xl transition-all ${apt.status === 'confirmed' ? 'bg-green-500 text-black shadow-lg shadow-green-500/20' : 'bg-slate-100 text-green-500 dark:bg-zinc-800'}`}><Check size={18} /></button>
                  <button onClick={() => updateAppointment(apt.id, 'cancelled')} className={`p-2.5 rounded-xl transition-all ${apt.status === 'cancelled' ? 'bg-red-500 text-black shadow-lg shadow-red-500/20' : 'bg-slate-100 text-red-500 dark:bg-zinc-800'}`}><X size={18} /></button>
                </div>
              </div>
              <div className="text-[10px] font-black flex justify-between border-t pt-4 uppercase italic transition-colors border-slate-50 dark:border-white/5">
                <span className="text-zinc-500">{services.find(s => s.id === apt.serviceId)?.name}</span>
                <span className={theme === 'dark' ? 'text-white' : 'text-slate-800'}>{apt.date} • {apt.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'branding' && (
        <div className="space-y-8 pb-12">
          <div className="grid grid-cols-2 gap-4">
            <ImagePicker 
              label="App Logo" 
              currentUrl={editBranding.logoUrl} 
              onUpload={(url) => setEditBranding(prev => ({...prev, logoUrl: url}))} 
              cloudName={editBranding.cloudinaryCloudName} 
              uploadPreset={editBranding.cloudinaryUploadPreset} 
            />
            <ImagePicker 
              label="Hero Cinematic" 
              currentUrl={editBranding.heroImageUrl} 
              onUpload={(url) => setEditBranding(prev => ({...prev, heroImageUrl: url}))} 
              cloudName={editBranding.cloudinaryCloudName} 
              uploadPreset={editBranding.cloudinaryUploadPreset} 
              aspectRatio="wide" 
            />
          </div>

          <div className="space-y-6 border-t pt-8 border-slate-100 dark:border-white/5">
            <div className="flex items-center gap-2 mb-2">
              <Cloud size={14} className="text-blue-500" />
              <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">Storage System</p>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className={labelClass}>Cloud Name</p>
                <input value={editBranding.cloudinaryCloudName || ''} onChange={(e) => setEditBranding({...editBranding, cloudinaryCloudName: e.target.value})} className={inputClass} placeholder="Enter Name" />
              </div>
              <div className="space-y-1">
                <p className={labelClass}>Preset</p>
                <input value={editBranding.cloudinaryUploadPreset || ''} onChange={(e) => setEditBranding({...editBranding, cloudinaryUploadPreset: e.target.value})} className={inputClass} placeholder="Enter Preset" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1">
                <p className={labelClass}>Shop Name</p>
                <input value={editBranding.shopName} onChange={(e) => setEditBranding({...editBranding, shopName: e.target.value})} className={inputClass} />
              </div>
              <div className="space-y-1">
                <p className={labelClass}>Currency</p>
                <input value={editBranding.currency} onChange={(e) => setEditBranding({...editBranding, currency: e.target.value})} className={inputClass} />
              </div>
            </div>

            <div className="space-y-1">
              <p className={labelClass}>Hero Slogan</p>
              <textarea value={editBranding.shopSlogan} onChange={(e) => setEditBranding({...editBranding, shopSlogan: e.target.value})} className={`${inputClass} h-24 resize-none`} />
            </div>

            <div className="grid grid-cols-2 gap-4">
               <div className="space-y-1">
                 <p className={labelClass}>Contact Phone</p>
                 <input value={editBranding.contactPhone} onChange={(e) => setEditBranding({...editBranding, contactPhone: e.target.value})} className={inputClass} />
               </div>
               <div className="space-y-1">
                 <p className={labelClass}>WhatsApp Link</p>
                 <input value={editBranding.whatsappNumber} onChange={(e) => setEditBranding({...editBranding, whatsappNumber: e.target.value})} className={inputClass} />
               </div>
            </div>
            
            <div className="space-y-1">
              <p className={labelClass}>Studio Address</p>
              <input value={editBranding.address} onChange={(e) => setEditBranding({...editBranding, address: e.target.value})} className={inputClass} />
            </div>
          </div>

          <button onClick={handleUpdateBranding} className="w-full py-5 bg-slate-900 text-white font-black rounded-2xl uppercase text-[11px] tracking-widest shadow-xl active:scale-95 transition-all">Publish Live System</button>
        </div>
      )}

      {tab === 'services' && (
        <div className="space-y-4">
          <button onClick={() => { setServiceForm({ category: 'Haircut', duration: 30 }); setShowServiceForm(true); }} className={`w-full py-5 border-dashed text-[10px] font-black uppercase text-amber-600 flex items-center justify-center gap-3 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-500/30'}`}>
            <Plus size={18} /> New Menu Item
          </button>
          {services.map(s => (
            <div key={s.id} className={`p-3 rounded-2xl flex items-center justify-between border shadow-sm transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="flex items-center gap-4">
                <img src={s.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-md" />
                <div>
                   <p className={`font-black text-xs uppercase italic leading-none transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{s.name}</p>
                   <p className="text-amber-500 text-[10px] font-black mt-2 leading-none">{branding.currency} {s.price} • <span className="text-zinc-400 italic lowercase">{s.category}</span></p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setServiceForm(s); setShowServiceForm(true); }} className="p-3 text-zinc-500 hover:text-amber-500"><Edit2 size={16} /></button>
                <button onClick={() => deleteService(s.id)} className="p-3 text-red-500/30 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'staff' && (
        <div className="space-y-4">
          <button onClick={() => { setStaffForm({ available: true, rating: 5.0 }); setShowStaffForm(true); }} className={`w-full py-5 border-dashed text-[10px] font-black uppercase text-amber-600 flex items-center justify-center gap-3 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-500/30'}`}>
            <Plus size={18} /> Add Team Member
          </button>
          {barbers.map(b => (
            <div key={b.id} className={`p-3 rounded-2xl flex items-center justify-between border shadow-sm transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="flex items-center gap-4">
                <img src={b.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-md" />
                <div>
                   <p className={`font-black text-xs uppercase italic leading-none transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{b.name}</p>
                   <p className="text-amber-500 text-[10px] font-black mt-2 leading-none">{b.specialty}</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setStaffForm(b); setShowStaffForm(true); }} className="p-3 text-zinc-500 hover:text-amber-500"><Edit2 size={16} /></button>
                <button onClick={() => deleteBarber(b.id)} className="p-3 text-red-500/30 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'offers' && (
        <div className="space-y-4">
          <button onClick={() => { setOfferForm({}); setShowOfferForm(true); }} className={`w-full py-5 border-dashed text-[10px] font-black uppercase text-amber-600 flex items-center justify-center gap-3 rounded-2xl border transition-all ${theme === 'dark' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-500/30'}`}>
            <Plus size={18} /> Create New Deal
          </button>
          {offers.map(o => (
            <div key={o.id} className={`p-3 rounded-2xl flex items-center justify-between border shadow-sm transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-100 shadow-sm'}`}>
              <div className="flex items-center gap-4">
                <img src={o.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-md" />
                <div>
                   <p className={`font-black text-xs uppercase italic leading-none transition-colors ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{o.title}</p>
                   <p className="text-amber-500 text-[10px] font-black mt-2 leading-none">{o.discount} Off</p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => { setOfferForm(o); setShowOfferForm(true); }} className="p-3 text-zinc-500 hover:text-amber-500"><Edit2 size={16} /></button>
                <button onClick={() => deleteOffer(o.id)} className="p-3 text-red-500/30 hover:text-red-600"><Trash2 size={16} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Modal isOpen={showServiceForm} onClose={() => setShowServiceForm(false)} title="Register Service">
        <div className="space-y-5">
          <ImagePicker label="Preview Pic" currentUrl={serviceForm.imageUrl || ''} onUpload={(url) => setServiceForm(prev => ({...prev, imageUrl: url}))} cloudName={editBranding.cloudinaryCloudName} uploadPreset={editBranding.cloudinaryUploadPreset} />
          
          <div className="space-y-1">
            <p className={labelClass}>Category</p>
            <div className="relative">
              <select 
                className={`${inputClass} appearance-none cursor-pointer pr-10`}
                value={serviceForm.category || 'Haircut'} 
                onChange={(e) => setServiceForm({...serviceForm, category: e.target.value as any})}
              >
                <option value="Haircut">Haircut</option>
                <option value="Beard">Beard</option>
                <option value="Facial">Facial</option>
                <option value="Combo">Combo</option>
              </select>
              <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-zinc-400">
                <ChevronDown size={18} />
              </div>
            </div>
          </div>

          <div className="space-y-1">
            <p className={labelClass}>Service Name</p>
            <input placeholder="E.g. Buzz Cut" className={inputClass} value={serviceForm.name || ''} onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})} />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className={labelClass}>Price ({branding.currency})</p>
              <input type="number" placeholder="0" className={inputClass} value={serviceForm.price || ''} onChange={(e) => setServiceForm({...serviceForm, price: parseInt(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <p className={labelClass}>Minutes</p>
              <input type="number" placeholder="30" className={inputClass} value={serviceForm.duration || ''} onChange={(e) => setServiceForm({...serviceForm, duration: parseInt(e.target.value)})} />
            </div>
          </div>
          <button onClick={saveService} className={`w-full py-5 font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl transition-all ${theme === 'dark' ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white'}`}>Confirm & Sync</button>
        </div>
      </Modal>

      <Modal isOpen={showOfferForm} onClose={() => setShowOfferForm(false)} title="Marketing Deal">
        <div className="space-y-5">
          <ImagePicker label="Promo Banner" currentUrl={offerForm.imageUrl || ''} onUpload={(url) => setOfferForm(prev => ({...prev, imageUrl: url}))} cloudName={editBranding.cloudinaryCloudName} uploadPreset={editBranding.cloudinaryUploadPreset} aspectRatio="wide" />
          <div className="space-y-1">
            <p className={labelClass}>Title</p>
            <input placeholder="Deal Caption" className={inputClass} value={offerForm.title || ''} onChange={(e) => setOfferForm({...offerForm, title: e.target.value})} />
          </div>
          <div className="space-y-1">
            <p className={labelClass}>Discount</p>
            <input placeholder="E.g. 20% Off" className={inputClass} value={offerForm.discount || ''} onChange={(e) => setOfferForm({...offerForm, discount: e.target.value})} />
          </div>
          <button onClick={saveOffer} className={`w-full py-5 font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl transition-all ${theme === 'dark' ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white'}`}>Activate Promotion</button>
        </div>
      </Modal>

      <Modal isOpen={showStaffForm} onClose={() => setShowStaffForm(false)} title="Staff Portfolio">
        <div className="space-y-5">
          <ImagePicker label="Artisan Photo" currentUrl={staffForm.imageUrl || ''} onUpload={(url) => setStaffForm(prev => ({...prev, imageUrl: url}))} cloudName={editBranding.cloudinaryCloudName} uploadPreset={editBranding.cloudinaryUploadPreset} />
          <div className="space-y-1">
            <p className={labelClass}>Full Name</p>
            <input placeholder="Artisan Name" className={inputClass} value={staffForm.name || ''} onChange={(e) => setStaffForm({...staffForm, name: e.target.value})} />
          </div>
          <div className="space-y-1">
            <p className={labelClass}>Specialty</p>
            <input placeholder="E.g. Master Stylist" className={inputClass} value={staffForm.specialty || ''} onChange={(e) => setStaffForm({...staffForm, specialty: e.target.value})} />
          </div>
          <button onClick={saveStaff} className={`w-full py-5 font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl transition-all ${theme === 'dark' ? 'bg-amber-500 text-black' : 'bg-slate-900 text-white'}`}>Update Roster</button>
        </div>
      </Modal>
    </div>
  );
};
