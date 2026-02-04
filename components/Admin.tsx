
import React, { useState, useRef, useEffect } from 'react';
import { Settings, Plus, Trash2, Edit2, User, Scissors, Calendar, Lock, LogOut, X, Check, Clock, Image as ImageIcon, Phone, MessageCircle, MapPin, Tag, Upload, Loader2, Smartphone, Type, Sparkles, Cloud } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { Barber, BarberService, Offer } from '../types';

const Modal: React.FC<{ isOpen: boolean; onClose: () => void; title: string; children: React.ReactNode }> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-xl">
      <div className="w-full max-w-sm glass-card rounded-2xl p-5 space-y-5 animate-in zoom-in-95 duration-200 border-white/10">
        <div className="flex justify-between items-center border-b border-white/5 pb-3">
          <h3 className="text-[9px] font-black text-white uppercase italic tracking-widest">{title}</h3>
          <button onClick={onClose} className="p-1.5 text-zinc-500"><X size={16} /></button>
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
        alert("Upload Error: " + (data.error?.message || "Check your keys"));
      }
    } catch (err) { alert("Upload Failed"); } finally { setIsUploading(false); }
  };

  return (
    <div className="space-y-1.5">
      <p className="text-[7px] font-black text-zinc-500 uppercase tracking-widest ml-1">{label}</p>
      <div className="flex items-center gap-2.5">
        <div className={`relative ${aspectRatio === 'wide' ? 'w-16 aspect-video' : 'w-12 h-12'} rounded-lg overflow-hidden glass-card flex items-center justify-center border-white/10`}>
          {currentUrl ? <img src={currentUrl} className="w-full h-full object-cover" /> : <ImageIcon size={12} className="text-zinc-800" />}
        </div>
        <button 
          onClick={() => fileInputRef.current?.click()}
          className="flex-1 py-2 bg-zinc-900/50 rounded-lg text-[7px] font-black uppercase text-zinc-400 border border-white/5"
        >
          {isUploading ? "..." : "Upload Image"}
        </button>
        <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      </div>
    </div>
  );
};

export const AdminScreen: React.FC = () => {
  const { 
    branding, services, barbers, appointments, offers, isAdminAuthenticated, loginAdmin, logoutAdmin,
    updateBranding, updateService, deleteService, updateBarber, deleteBarber, updateAppointment, updateOffer, deleteOffer
  } = useAppContext();
  
  const [tab, setTab] = useState<'bookings' | 'branding' | 'services' | 'staff' | 'offers'>('bookings');
  const [passwordInput, setPasswordInput] = useState('');
  const [editBranding, setEditBranding] = useState(branding);

  // Forms State
  const [showServiceForm, setShowServiceForm] = useState(false);
  const [serviceForm, setServiceForm] = useState<Partial<BarberService>>({ category: 'Haircut', duration: 30 });
  const [showStaffForm, setShowStaffForm] = useState(false);
  const [staffForm, setStaffForm] = useState<Partial<Barber>>({ specialty: 'Master Stylist', available: true });
  const [showOfferForm, setShowOfferForm] = useState(false);
  const [offerForm, setOfferForm] = useState<Partial<Offer>>({});

  useEffect(() => { 
    // Clone to prevent circular references and maintain data integrity
    setEditBranding(JSON.parse(JSON.stringify(branding))); 
  }, [branding]);

  const handleUpdateBranding = async () => {
    const cleanData = JSON.parse(JSON.stringify(editBranding));
    await updateBranding(cleanData);
    alert("System Settings Updated!");
  };

  const saveService = async () => {
    if (!serviceForm.name || !serviceForm.price) return alert("Fill required fields");
    await updateService({ ...serviceForm, id: serviceForm.id || Math.random().toString(36).substr(2, 9) } as BarberService);
    setShowServiceForm(false);
  };

  const saveStaff = async () => {
    if (!staffForm.name) return alert("Fill name");
    await updateBarber({ ...staffForm, id: staffForm.id || Math.random().toString(36).substr(2, 9) } as Barber);
    setShowStaffForm(false);
  };

  const saveOffer = async () => {
    if (!offerForm.title || !offerForm.discount) return alert("Fill title and discount");
    await updateOffer({ ...offerForm, id: offerForm.id || Math.random().toString(36).substr(2, 9) } as Offer);
    setShowOfferForm(false);
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-8 bg-[#020202]">
        <div className="w-14 h-14 bg-amber-500 rounded-xl flex items-center justify-center mb-5 shadow-2xl">
          <Lock size={22} className="text-black" />
        </div>
        <h2 className="text-sm font-black text-white uppercase italic tracking-tighter mb-5">Admin Shield</h2>
        <form onSubmit={(e) => { e.preventDefault(); loginAdmin(passwordInput); }} className="w-full space-y-2.5 max-w-xs">
          <input 
            type="password" 
            placeholder="Security Pin"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
            className="w-full glass-card py-3.5 text-center text-white outline-none font-bold rounded-xl border-white/5 focus:border-amber-500/50 transition-all"
          />
          <button type="submit" className="w-full py-3.5 bg-amber-500 text-black font-black rounded-xl uppercase text-[8px] tracking-widest shadow-xl">Unlock Panel</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-3 space-y-4 max-w-md mx-auto animate-in fade-in duration-300 pb-24">
      <header className="flex items-center justify-between px-1">
        <div>
           <h2 className="text-sm font-black text-white italic uppercase tracking-tighter leading-none">Command Center</h2>
           <p className="text-[6px] font-black text-zinc-500 uppercase tracking-widest leading-none mt-1.5">Full System Access</p>
        </div>
        <button onClick={logoutAdmin} className="p-2 text-red-500 glass-card rounded-lg border-red-500/10 active:scale-90 transition-all"><LogOut size={14} /></button>
      </header>

      <div className="flex gap-1 overflow-x-auto pb-1.5 sticky top-0 bg-[#020202] z-50 -mx-3 px-3 no-scrollbar border-b border-white/5">
        {[
          { id: 'bookings', label: 'Queues', icon: <Calendar size={10} /> },
          { id: 'services', label: 'Menu', icon: <Scissors size={10} /> },
          { id: 'staff', label: 'Staff', icon: <User size={10} /> },
          { id: 'offers', label: 'Deals', icon: <Tag size={10} /> },
          { id: 'branding', label: 'Visuals', icon: <Smartphone size={10} /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-[6px] font-black uppercase tracking-widest border transition-all whitespace-nowrap ${
              tab === t.id ? 'bg-amber-500 text-black border-amber-500 shadow-lg' : 'bg-zinc-900 text-zinc-500 border-white/5'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'bookings' && (
        <div className="space-y-2">
          {appointments.length === 0 && <p className="text-center text-zinc-600 py-20 text-[7px] uppercase font-black tracking-widest">No Bookings Found</p>}
          {appointments.map(apt => (
            <div key={apt.id} className="p-3 glass-card rounded-xl space-y-2.5 border-white/5 shadow-md">
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="text-white font-black text-[9px] uppercase italic leading-none">{apt.customerName}</h4>
                  <p className="text-amber-500 text-[7px] font-bold mt-1.5 leading-none">{apt.customerPhone}</p>
                </div>
                <div className="flex gap-1">
                  <button onClick={() => updateAppointment(apt.id, 'confirmed')} className={`p-1.5 rounded-md ${apt.status === 'confirmed' ? 'bg-green-500 text-black' : 'bg-zinc-800 text-green-500'}`}><Check size={12} /></button>
                  <button onClick={() => updateAppointment(apt.id, 'cancelled')} className={`p-1.5 rounded-md ${apt.status === 'cancelled' ? 'bg-red-500 text-black' : 'bg-zinc-800 text-red-500'}`}><X size={12} /></button>
                </div>
              </div>
              <div className="text-[7px] font-black text-zinc-500 flex justify-between border-t border-white/5 pt-2 uppercase italic">
                <span>{services.find(s => s.id === apt.serviceId)?.name}</span>
                <span className="text-white">{apt.date} • {apt.time}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'services' && (
        <div className="space-y-2">
          <button onClick={() => { setServiceForm({ category: 'Haircut', duration: 30 }); setShowServiceForm(true); }} className="w-full py-3.5 glass-card border-dashed text-[7px] font-black uppercase text-amber-500 flex items-center justify-center gap-1.5 rounded-xl border-white/5 bg-amber-500/5">
            <Plus size={14} /> Add Service
          </button>
          {services.map(s => (
            <div key={s.id} className="p-2 glass-card rounded-xl flex items-center justify-between border-white/5 shadow-sm">
              <div className="flex items-center gap-3">
                <img src={s.imageUrl} className="w-8 h-8 rounded-lg object-cover" />
                <div>
                   <p className="text-white font-black text-[8px] uppercase italic leading-none">{s.name}</p>
                   <p className="text-amber-500 text-[7px] font-black mt-1 leading-none">{branding.currency} {s.price}</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                <button onClick={() => { setServiceForm(s); setShowServiceForm(true); }} className="p-2 text-zinc-500"><Edit2 size={12} /></button>
                <button onClick={() => deleteService(s.id)} className="p-2 text-red-500/30"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'staff' && (
        <div className="space-y-2">
          <button onClick={() => { setStaffForm({ specialty: 'Master Stylist', available: true }); setShowStaffForm(true); }} className="w-full py-3.5 glass-card border-dashed text-[7px] font-black uppercase text-blue-500 flex items-center justify-center gap-1.5 rounded-xl border-white/5 bg-blue-500/5">
            <Plus size={14} /> Add Staff
          </button>
          {barbers.map(b => (
            <div key={b.id} className="p-2 glass-card rounded-xl flex items-center justify-between border-white/5">
              <div className="flex items-center gap-3">
                <img src={b.imageUrl} className="w-8 h-8 rounded-lg object-cover grayscale" />
                <div>
                   <p className="text-white font-black text-[8px] uppercase italic leading-none">{b.name}</p>
                   <p className="text-zinc-500 text-[7px] font-bold mt-1 leading-none uppercase tracking-widest">{b.specialty}</p>
                </div>
              </div>
              <div className="flex gap-0.5">
                <button onClick={() => { setStaffForm(b); setShowStaffForm(true); }} className="p-2 text-zinc-500"><Edit2 size={12} /></button>
                <button onClick={() => deleteBarber(b.id)} className="p-2 text-red-500/30"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'offers' && (
        <div className="space-y-2">
          <button onClick={() => { setOfferForm({}); setShowOfferForm(true); }} className="w-full py-3.5 glass-card border-dashed text-[7px] font-black uppercase text-orange-500 flex items-center justify-center gap-1.5 rounded-xl border-white/5 bg-orange-500/5">
            <Plus size={14} /> Add Offer
          </button>
          {offers.map(o => (
            <div key={o.id} className="p-2 glass-card rounded-xl flex items-center justify-between border-white/5">
              <div className="flex items-center gap-3">
                <img src={o.imageUrl} className="w-8 h-8 rounded-lg object-cover" />
                <div><p className="text-white font-black text-[8px] uppercase italic">{o.title}</p><p className="text-amber-500 text-[7px] font-black mt-1">{o.discount}</p></div>
              </div>
              <div className="flex gap-0.5">
                <button onClick={() => { setOfferForm(o); setShowOfferForm(true); }} className="p-2 text-zinc-500"><Edit2 size={12} /></button>
                <button onClick={() => deleteOffer(o.id)} className="p-2 text-red-500/30"><Trash2 size={12} /></button>
              </div>
            </div>
          ))}
        </div>
      )}

      {tab === 'branding' && (
        <div className="space-y-6 pb-12 animate-in slide-in-from-bottom-2 duration-300">
          
          <div className="grid grid-cols-2 gap-3">
            <ImagePicker 
              label="App Logo" 
              currentUrl={editBranding.logoUrl} 
              onUpload={(url) => setEditBranding({...editBranding, logoUrl: url})} 
              cloudName={editBranding.cloudinaryCloudName} 
              uploadPreset={editBranding.cloudinaryUploadPreset} 
            />
            <ImagePicker 
              label="Hero Image" 
              currentUrl={editBranding.heroImageUrl} 
              onUpload={(url) => setEditBranding({...editBranding, heroImageUrl: url})} 
              cloudName={editBranding.cloudinaryCloudName} 
              uploadPreset={editBranding.cloudinaryUploadPreset} 
              aspectRatio="wide" 
            />
          </div>

          {/* 🛠 CLOUDINARY CONFIG SECTION */}
          <div className="space-y-2 border-t border-white/5 pt-4">
             <div className="flex items-center gap-2 mb-2">
                <Cloud size={10} className="text-blue-400" />
                <p className="text-[7px] font-black text-blue-400 uppercase tracking-widest">Cloud Infrastructure</p>
             </div>
             <div className="grid grid-cols-2 gap-2.5">
                <div className="space-y-1">
                  <p className="text-[6px] font-black text-zinc-500 uppercase ml-1">Cloud Name</p>
                  <input 
                    value={editBranding.cloudinaryCloudName || ''} 
                    onChange={(e) => setEditBranding({...editBranding, cloudinaryCloudName: e.target.value})} 
                    placeholder="Enter Cloud Name"
                    className="w-full glass-card p-3 rounded-lg text-white outline-none font-bold text-[8px] placeholder:text-zinc-800" 
                  />
                </div>
                <div className="space-y-1">
                  <p className="text-[6px] font-black text-zinc-500 uppercase ml-1">Upload Preset</p>
                  <input 
                    value={editBranding.cloudinaryUploadPreset || ''} 
                    onChange={(e) => setEditBranding({...editBranding, cloudinaryUploadPreset: e.target.value})} 
                    placeholder="Enter Preset"
                    className="w-full glass-card p-3 rounded-lg text-white outline-none font-bold text-[8px] placeholder:text-zinc-800" 
                  />
                </div>
             </div>
          </div>

          <div className="space-y-4 border-t border-white/5 pt-4">
            <div className="grid grid-cols-2 gap-2.5">
              <div className="space-y-1">
                <p className="text-[6px] font-black text-zinc-500 uppercase ml-1 tracking-widest">Shop Name</p>
                <input value={editBranding.shopName} onChange={(e) => setEditBranding({...editBranding, shopName: e.target.value})} className="w-full glass-card p-3 rounded-lg text-white outline-none font-bold text-[9px]" />
              </div>
              <div className="space-y-1">
                <p className="text-[6px] font-black text-zinc-500 uppercase ml-1 tracking-widest">Currency</p>
                <input value={editBranding.currency} onChange={(e) => setEditBranding({...editBranding, currency: e.target.value})} className="w-full glass-card p-3 rounded-lg text-white text-[9px]" />
              </div>
            </div>

            <div className="space-y-1">
              <p className="text-[6px] font-black text-zinc-500 uppercase ml-1 tracking-widest">Hero Slogan</p>
              <textarea value={editBranding.shopSlogan} onChange={(e) => setEditBranding({...editBranding, shopSlogan: e.target.value})} className="w-full glass-card p-3 rounded-lg text-white outline-none font-bold h-12 text-[9px]" />
            </div>

            <div className="space-y-2">
               <p className="text-[7px] font-black text-zinc-500 uppercase tracking-widest border-b border-white/5 pb-1">Stats Monitoring</p>
               <div className="grid grid-cols-3 gap-1.5">
                 {(editBranding.stats || []).map((s, i) => (
                   <div key={i} className="space-y-1 glass-card p-2 rounded-lg">
                      <input value={s.label} onChange={(e) => {
                        const ns = [...editBranding.stats]; ns[i].label = e.target.value; setEditBranding({...editBranding, stats: ns});
                      }} className="w-full bg-transparent text-[5px] text-zinc-500 uppercase font-black outline-none border-b border-white/5 mb-0.5" />
                      <input value={s.value} onChange={(e) => {
                        const ns = [...editBranding.stats]; ns[i].value = e.target.value; setEditBranding({...editBranding, stats: ns});
                      }} className="w-full bg-transparent text-[8px] text-white font-black outline-none" />
                   </div>
                 ))}
               </div>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
               <div className="space-y-1">
                 <p className="text-[6px] font-black text-zinc-500 uppercase ml-1">Office Phone</p>
                 <input value={editBranding.contactPhone} onChange={(e) => setEditBranding({...editBranding, contactPhone: e.target.value})} className="w-full glass-card p-3 rounded-lg text-white text-[9px]" />
               </div>
               <div className="space-y-1">
                 <p className="text-[6px] font-black text-zinc-500 uppercase ml-1">WhatsApp</p>
                 <input value={editBranding.whatsappNumber} onChange={(e) => setEditBranding({...editBranding, whatsappNumber: e.target.value})} className="w-full glass-card p-3 rounded-lg text-white text-[9px]" />
               </div>
            </div>
            
            <div className="space-y-1">
              <p className="text-[6px] font-black text-zinc-500 uppercase ml-1 tracking-widest">Shop Address</p>
              <input value={editBranding.address} onChange={(e) => setEditBranding({...editBranding, address: e.target.value})} className="w-full glass-card p-3 rounded-lg text-white outline-none font-bold text-[9px]" />
            </div>
          </div>

          <button onClick={handleUpdateBranding} className="w-full py-4 bg-amber-500 text-black font-black rounded-xl text-[8px] uppercase tracking-[0.25em] shadow-2xl shadow-amber-500/20 active:scale-95 transition-all">Publish Global Changes</button>
        </div>
      )}

      {/* FORM MODALS */}
      <Modal isOpen={showServiceForm} onClose={() => setShowServiceForm(false)} title="Menu Service">
        <div className="space-y-4">
          <ImagePicker 
            label="Service Photo" 
            currentUrl={serviceForm.imageUrl || ''} 
            onUpload={(url) => setServiceForm({...serviceForm, imageUrl: url})} 
            cloudName={editBranding.cloudinaryCloudName} 
            uploadPreset={editBranding.cloudinaryUploadPreset} 
          />
          <input placeholder="Service Name" className="w-full glass-card p-3 rounded-xl outline-none text-[9px]" value={serviceForm.name || ''} onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})} />
          <div className="grid grid-cols-2 gap-2.5">
            <input type="number" placeholder="Price" className="w-full glass-card p-3 rounded-xl outline-none text-[9px]" value={serviceForm.price || ''} onChange={(e) => setServiceForm({...serviceForm, price: parseInt(e.target.value)})} />
            <input type="number" placeholder="Mins" className="w-full glass-card p-3 rounded-xl outline-none text-[9px]" value={serviceForm.duration || ''} onChange={(e) => setServiceForm({...serviceForm, duration: parseInt(e.target.value)})} />
          </div>
          <button onClick={saveService} className="w-full py-3.5 bg-amber-500 text-black font-black rounded-xl uppercase text-[8px] tracking-widest shadow-lg">Confirm & Sync</button>
        </div>
      </Modal>

      <Modal isOpen={showOfferForm} onClose={() => setShowOfferForm(false)} title="New Deal">
        <div className="space-y-4">
          <ImagePicker 
            label="Deal Banner" 
            currentUrl={offerForm.imageUrl || ''} 
            onUpload={(url) => setOfferForm({...offerForm, imageUrl: url})} 
            cloudName={editBranding.cloudinaryCloudName} 
            uploadPreset={editBranding.cloudinaryUploadPreset} 
            aspectRatio="wide" 
          />
          <input placeholder="Title" className="w-full glass-card p-3 rounded-xl outline-none text-[9px]" value={offerForm.title || ''} onChange={(e) => setOfferForm({...offerForm, title: e.target.value})} />
          <input placeholder="Discount (e.g. 30%)" className="w-full glass-card p-3 rounded-xl outline-none text-[9px]" value={offerForm.discount || ''} onChange={(e) => setOfferForm({...offerForm, discount: e.target.value})} />
          <button onClick={saveOffer} className="w-full py-3.5 bg-amber-500 text-black font-black rounded-xl uppercase text-[8px] tracking-widest shadow-lg">Activate Offer</button>
        </div>
      </Modal>

      <Modal isOpen={showStaffForm} onClose={() => setShowStaffForm(false)} title="Artisan Profile">
        <div className="space-y-4">
          <ImagePicker 
            label="Portfolio Photo" 
            currentUrl={staffForm.imageUrl || ''} 
            onUpload={(url) => setStaffForm({...staffForm, imageUrl: url})} 
            cloudName={editBranding.cloudinaryCloudName} 
            uploadPreset={editBranding.cloudinaryUploadPreset} 
          />
          <input placeholder="Staff Name" className="w-full glass-card p-3 rounded-xl outline-none text-[9px]" value={staffForm.name || ''} onChange={(e) => setStaffForm({...staffForm, name: e.target.value})} />
          <input placeholder="Specialty" className="w-full glass-card p-3 rounded-xl outline-none text-[9px]" value={staffForm.specialty || ''} onChange={(e) => setStaffForm({...staffForm, specialty: e.target.value})} />
          <button onClick={saveStaff} className="w-full py-3.5 bg-amber-500 text-black font-black rounded-xl uppercase text-[8px] tracking-widest shadow-lg">Sync Roster</button>
        </div>
      </Modal>
    </div>
  );
};
