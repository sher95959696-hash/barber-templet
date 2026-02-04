
import React, { useState, useRef, useEffect } from 'react';
import { Settings, Plus, Trash2, Edit2, User, Scissors, Calendar, Lock, LogOut, X, Check, Image as ImageIcon, Phone, MessageCircle, MapPin, Tag, Smartphone, Cloud, Sun, Moon } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { Barber, BarberService, Offer } from '../types';

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  const { theme } = useAppContext();
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-6 bg-black/95 backdrop-blur-xl">
      <div className={`w-full max-w-md rounded-[2.5rem] p-7 space-y-6 animate-in zoom-in-95 duration-200 border transition-all shadow-2xl ${theme === 'dark' ? 'bg-zinc-900 border-white/10' : 'bg-white border-slate-200'}`}>
        <div className="flex justify-between items-center border-b pb-4 transition-colors border-zinc-800 dark:border-white/5">
          <h3 className={`text-[12px] font-black uppercase italic tracking-widest ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{title}</h3>
          <button onClick={onClose} className="p-2 text-zinc-500 hover:text-red-500 transition-colors"><X size={20} /></button>
        </div>
        <div className="max-h-[70vh] overflow-y-auto no-scrollbar pr-1">{children}</div>
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
    <div className="space-y-2">
      <p className="text-[10px] font-black text-zinc-500 uppercase tracking-widest ml-1">{label}</p>
      <div className="flex items-center gap-4">
        <div className={`relative ${aspectRatio === 'wide' ? 'w-24 aspect-video' : 'w-16 h-16'} rounded-2xl overflow-hidden flex items-center justify-center border transition-all ${theme === 'dark' ? 'bg-zinc-800 border-white/10' : 'bg-slate-100 border-slate-200'}`}>
          {currentUrl ? <img src={currentUrl} className="w-full h-full object-cover" /> : <ImageIcon size={20} className="text-zinc-600" />}
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className={`flex-1 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${theme === 'dark' ? 'bg-zinc-800 border-white/5 text-zinc-400' : 'bg-slate-200 border-slate-300 text-slate-700 shadow-sm'}`}
        >
          {isUploading ? "Uploading..." : "Upload Pic"}
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

  // Add missing state hooks for form data and visibility
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState<Partial<BarberService>>({});

  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffForm, setStaffForm] = useState<Partial<Barber>>({});

  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerForm, setOfferForm] = useState<Partial<Offer>>({});

  // Update local edit state ONLY if global branding actually changes and we aren't in middle of editing
  useEffect(() => { 
    setEditBranding({ ...branding }); 
  }, [branding]);

  const handleUpdateBranding = async () => {
    try {
      await updateBranding(editBranding);
      alert("Changes Published Successfully!");
    } catch (e) {
      alert("Error updating: " + e);
    }
  };

  const saveService = async () => {
    if (!serviceForm.name || !serviceForm.price) return alert("Fill fields");
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
        <div className="w-20 h-20 bg-amber-500 rounded-3xl flex items-center justify-center mb-8 shadow-2xl">
          <Lock size={32} className="text-black" />
        </div>
        <h2 className={`text-xl font-black uppercase italic tracking-tighter mb-8 ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Admin Gate</h2>
        <form onSubmit={(e) => { e.preventDefault(); loginAdmin(passwordInput); }} className="w-full space-y-4 max-w-xs">
          <input 
            type="password" 
            placeholder="System Pin"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className={`w-full py-5 text-center text-xl outline-none font-bold rounded-2xl border transition-all ${theme === 'dark' ? 'bg-zinc-900 border-white/5 text-white' : 'bg-white border-slate-200 text-slate-900 shadow-xl'}`}
          />
          <button type="submit" className="w-full py-5 bg-amber-500 text-black font-black rounded-2xl uppercase text-[12px] tracking-widest shadow-xl">Authenticate</button>
        </form>
      </div>
    );
  }

  // Improved text visibility for input text
  const inputClass = `w-full p-4 rounded-xl outline-none font-bold text-base transition-all border ${theme === 'dark' ? 'bg-zinc-900 border-white/20 text-white placeholder:text-zinc-600 focus:border-amber-500' : 'bg-white border-slate-300 text-slate-900 placeholder:text-slate-400 focus:border-amber-600 shadow-sm'}`;
  const labelClass = `text-[10px] font-black uppercase tracking-widest ml-1 mb-1 ${theme === 'dark' ? 'text-zinc-500' : 'text-slate-500'}`;

  return (
    <div className="p-5 space-y-6 max-w-md mx-auto animate-in fade-in duration-300 pb-32">
      <header className="flex items-center justify-between px-2">
        <div className="space-y-1">
           <h2 className={`text-xl font-black italic uppercase tracking-tighter leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>Command Hub</h2>
           <p className="text-[9px] font-black text-amber-500 uppercase tracking-widest leading-none">Global Sync Active</p>
        </div>
        <div className="flex gap-2">
          <button onClick={toggleTheme} className={`p-3 rounded-xl border ${theme === 'dark' ? 'bg-zinc-900 border-white/5 text-amber-400' : 'bg-white border-slate-200 text-slate-600 shadow-md'}`}>
            {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <button onClick={logoutAdmin} className={`p-3 text-red-500 rounded-xl border ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-200 shadow-md'}`}><LogOut size={18} /></button>
        </div>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2 sticky top-0 z-50 -mx-4 px-4 no-scrollbar border-b border-zinc-800 dark:border-white/5 bg-opacity-95 backdrop-blur-md">
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
            className={`flex items-center gap-2 px-5 py-3 rounded-xl text-[9px] font-black uppercase tracking-widest border transition-all ${
              tab === t.id ? 'bg-amber-500 text-black border-amber-500 shadow-lg' : theme === 'dark' ? 'bg-zinc-900 text-zinc-500 border-white/5' : 'bg-white text-slate-400 border-slate-200 shadow-sm'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'bookings' && (
        <div className="space-y-4">
          {appointments.length === 0 && <p className={`text-center py-20 text-[10px] uppercase font-black tracking-widest text-zinc-600`}>No Appointments</p>}
          {appointments.map(apt => (
            <div key={apt.id} className={`p-5 rounded-3xl space-y-4 border shadow-xl ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-200'}`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className={`font-black text-sm uppercase italic leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{apt.customerName}</h4>
                  <p className="text-amber-500 text-[10px] font-black mt-2 leading-none">{apt.customerPhone}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => updateAppointment(apt.id, 'confirmed')} className={`p-2 rounded-xl ${apt.status === 'confirmed' ? 'bg-green-500 text-black' : 'bg-zinc-800 text-green-500'}`}><Check size={18} /></button>
                  <button onClick={() => updateAppointment(apt.id, 'cancelled')} className={`p-2 rounded-xl ${apt.status === 'cancelled' ? 'bg-red-500 text-black' : 'bg-zinc-800 text-red-500'}`}><X size={18} /></button>
                </div>
              </div>
              <div className="text-[10px] font-black flex justify-between border-t pt-4 uppercase italic border-zinc-800 dark:border-white/5">
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
              onUpload={(url) => setEditBranding({...editBranding, logoUrl: url})} 
              cloudName={editBranding.cloudinaryCloudName} 
              uploadPreset={editBranding.cloudinaryUploadPreset} 
            />
            <ImagePicker 
              label="Hero/Cinematic" 
              currentUrl={editBranding.heroImageUrl} 
              onUpload={(url) => setEditBranding({...editBranding, heroImageUrl: url})} 
              cloudName={editBranding.cloudinaryCloudName} 
              uploadPreset={editBranding.cloudinaryUploadPreset} 
              aspectRatio="wide" 
            />
          </div>

          <div className="space-y-6 border-t pt-8 border-zinc-800 dark:border-white/5">
            <div className="flex items-center gap-2 mb-4">
              <Cloud size={14} className="text-blue-400" />
              <p className="text-[10px] font-black text-blue-400 uppercase tracking-widest">Storage Backend</p>
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
              <p className={labelClass}>Shop Slogan</p>
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

          <button onClick={handleUpdateBranding} className="w-full py-5 bg-amber-500 text-black font-black rounded-[1.5rem] uppercase text-[12px] tracking-widest shadow-2xl active:scale-95 transition-all">Publish Live Changes</button>
        </div>
      )}

      {tab === 'services' && (
        <div className="space-y-4">
          <button onClick={() => { setServiceForm({ category: 'Haircut', duration: 30 }); setShowServiceForm(true); }} className={`w-full py-5 border-dashed text-[10px] font-black uppercase text-amber-500 flex items-center justify-center gap-3 rounded-2xl border ${theme === 'dark' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-500/30 shadow-md'}`}>
            <Plus size={18} /> New Menu Item
          </button>
          {services.map(s => (
            <div key={s.id} className={`p-3 rounded-2xl flex items-center justify-between border shadow-md ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-4">
                <img src={s.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-lg" />
                <div>
                   <p className={`font-black text-xs uppercase italic leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{s.name}</p>
                   <p className="text-amber-500 text-[10px] font-black mt-2 leading-none">{branding.currency} {s.price}</p>
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
          <button onClick={() => { setStaffForm({ available: true, rating: 5.0 }); setShowStaffForm(true); }} className={`w-full py-5 border-dashed text-[10px] font-black uppercase text-amber-500 flex items-center justify-center gap-3 rounded-2xl border ${theme === 'dark' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-500/30 shadow-md'}`}>
            <Plus size={18} /> Add Team Member
          </button>
          {barbers.map(b => (
            <div key={b.id} className={`p-3 rounded-2xl flex items-center justify-between border shadow-md ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-4">
                <img src={b.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-lg" />
                <div>
                   <p className={`font-black text-xs uppercase italic leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{b.name}</p>
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
          <button onClick={() => { setOfferForm({}); setShowOfferForm(true); }} className={`w-full py-5 border-dashed text-[10px] font-black uppercase text-amber-500 flex items-center justify-center gap-3 rounded-2xl border ${theme === 'dark' ? 'bg-amber-500/5 border-amber-500/20' : 'bg-amber-50 border-amber-500/30 shadow-md'}`}>
            <Plus size={18} /> Create New Deal
          </button>
          {offers.map(o => (
            <div key={o.id} className={`p-3 rounded-2xl flex items-center justify-between border shadow-md ${theme === 'dark' ? 'bg-zinc-900 border-white/5' : 'bg-white border-slate-200'}`}>
              <div className="flex items-center gap-4">
                <img src={o.imageUrl} className="w-12 h-12 rounded-xl object-cover shadow-lg" />
                <div>
                   <p className={`font-black text-xs uppercase italic leading-none ${theme === 'dark' ? 'text-white' : 'text-slate-900'}`}>{o.title}</p>
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

      {/* Register Service Modal */}
      <Modal isOpen={showServiceForm} onClose={() => setShowServiceForm(false)} title="Artisan Service">
        <div className="space-y-5">
          <ImagePicker label="Preview Pic" currentUrl={serviceForm.imageUrl || ''} onUpload={(url) => setServiceForm({...serviceForm, imageUrl: url})} cloudName={editBranding.cloudinaryCloudName} uploadPreset={editBranding.cloudinaryUploadPreset} />
          <div className="space-y-1">
            <p className={labelClass}>Service Name</p>
            <input placeholder="E.g. Buzz Cut" className={inputClass} value={serviceForm.name || ''} onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <p className={labelClass}>Price</p>
              <input type="number" placeholder="0" className={inputClass} value={serviceForm.price || ''} onChange={(e) => setServiceForm({...serviceForm, price: parseInt(e.target.value)})} />
            </div>
            <div className="space-y-1">
              <p className={labelClass}>Minutes</p>
              <input type="number" placeholder="30" className={inputClass} value={serviceForm.duration || ''} onChange={(e) => setServiceForm({...serviceForm, duration: parseInt(e.target.value)})} />
            </div>
          </div>
          <button onClick={saveService} className="w-full py-5 bg-amber-500 text-black font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl">Confirm & Sync</button>
        </div>
      </Modal>

      {/* Launch Promotion Modal */}
      <Modal isOpen={showOfferForm} onClose={() => setShowOfferForm(false)} title="Marketing Deal">
        <div className="space-y-5">
          <ImagePicker label="Promo Banner" currentUrl={offerForm.imageUrl || ''} onUpload={(url) => setOfferForm({...offerForm, imageUrl: url})} cloudName={editBranding.cloudinaryCloudName} uploadPreset={editBranding.cloudinaryUploadPreset} aspectRatio="wide" />
          <div className="space-y-1">
            <p className={labelClass}>Title</p>
            <input placeholder="Deal Caption" className={inputClass} value={offerForm.title || ''} onChange={(e) => setOfferForm({...offerForm, title: e.target.value})} />
          </div>
          <div className="space-y-1">
            <p className={labelClass}>Discount</p>
            <input placeholder="E.g. 20% Off" className={inputClass} value={offerForm.discount || ''} onChange={(e) => setOfferForm({...offerForm, discount: e.target.value})} />
          </div>
          <button onClick={saveOffer} className="w-full py-5 bg-amber-500 text-black font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl">Confirm Deal</button>
        </div>
      </Modal>

      {/* Staff Portfolio Modal */}
      <Modal isOpen={showStaffForm} onClose={() => setShowStaffForm(false)} title="Staff Portfolio">
        <div className="space-y-5">
          <ImagePicker label="Artisan Photo" currentUrl={staffForm.imageUrl || ''} onUpload={(url) => setStaffForm({...staffForm, imageUrl: url})} cloudName={editBranding.cloudinaryCloudName} uploadPreset={editBranding.cloudinaryUploadPreset} />
          <div className="space-y-1">
            <p className={labelClass}>Full Name</p>
            <input placeholder="Artisan Name" className={inputClass} value={staffForm.name || ''} onChange={(e) => setStaffForm({...staffForm, name: e.target.value})} />
          </div>
          <div className="space-y-1">
            <p className={labelClass}>Specialty</p>
            <input placeholder="E.g. Master Stylist" className={inputClass} value={staffForm.specialty || ''} onChange={(e) => setStaffForm({...staffForm, specialty: e.target.value})} />
          </div>
          <button onClick={saveStaff} className="w-full py-5 bg-amber-500 text-black font-black rounded-2xl uppercase text-[10px] tracking-widest shadow-xl">Update Roster</button>
        </div>
      </Modal>
    </div>
  );
};
