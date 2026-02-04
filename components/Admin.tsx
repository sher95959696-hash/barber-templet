
import React, { useState, useRef, useEffect } from 'react';
import { Settings, Plus, Trash2, Edit2, Layout as LayoutIcon, User, Scissors, Calendar, Save, ArrowLeft, Lock, LogOut, Eye, EyeOff, X, Check, Clock, Image as ImageIcon, Phone, MessageCircle, MapPin, TrendingUp, DollarSign, Tag, Upload, Loader2, Info, Bell, Wifi, WifiOff, Link } from 'lucide-react';
import { useAppContext } from '../store/AppContext';
import { isFirebaseConfigured } from '../firebase';
import { Barber, BarberService, Offer, GalleryImage } from '../types';

const ImagePicker: React.FC<{ 
  currentUrl: string; 
  onUpload: (url: string) => void;
  label: string;
  cloudName?: string;
  uploadPreset?: string;
}> = ({ currentUrl, onUpload, label, cloudName, uploadPreset }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [manualUrl, setManualUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!cloudName || !uploadPreset || uploadPreset.trim() === "" || uploadPreset.includes("YOUR_")) {
      alert("⚠️ SETUP ERROR\n\nPlease go to the 'Setup' tab and enter your Cloudinary Cloud Name and Unsigned Upload Preset first.");
      setShowUrlInput(true);
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.secure_url) {
        onUpload(data.secure_url);
      } else {
        const errorMsg = data.error?.message || "Check if your Cloudinary preset is 'Unsigned'.";
        alert(`❌ CLOUDINARY UPLOAD FAILED\n\nError: ${errorMsg}`);
        setShowUrlInput(true);
      }
    } catch (err: any) {
      alert("❌ NETWORK ERROR\n\nCould not reach Cloudinary.");
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  return (
    <div className="space-y-3 p-4 bg-zinc-900 rounded-2xl border border-white/5">
      <div className="flex justify-between items-center">
        <label className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">{label}</label>
        <button type="button" onClick={() => setShowUrlInput(!showUrlInput)} className="text-[10px] font-bold text-amber-500 flex items-center gap-1.5 hover:text-white transition-colors">
          <Link size={12} /> {showUrlInput ? "Back to Upload" : "Paste URL"}
        </button>
      </div>
      
      {showUrlInput ? (
        <div className="space-y-3">
          <div className="flex gap-2">
            <input 
              value={manualUrl} 
              onChange={(e) => setManualUrl(e.target.value)}
              placeholder="Paste direct image link..." 
              className="flex-1 bg-black border border-white/10 rounded-xl p-3 text-xs text-white outline-none focus:border-amber-500"
            />
            <button 
              type="button" 
              onClick={() => { if(manualUrl) { onUpload(manualUrl); setManualUrl(''); } setShowUrlInput(false); }}
              className="px-4 bg-amber-500 text-black rounded-xl text-[10px] font-black uppercase"
            >
              Apply
            </button>
          </div>
        </div>
      ) : (
        <div className="flex items-center gap-4">
          <div className="w-20 h-20 bg-black border border-white/10 rounded-2xl overflow-hidden flex-shrink-0 flex items-center justify-center relative shadow-lg">
            {currentUrl ? (
              <img src={currentUrl} className="w-full h-full object-cover" alt="Preview" />
            ) : (
              <ImageIcon size={24} className="text-zinc-700" />
            )}
            {isUploading && (
              <div className="absolute inset-0 bg-black/90 flex flex-col items-center justify-center gap-1">
                <Loader2 size={20} className="text-amber-500 animate-spin" />
              </div>
            )}
          </div>
          <div className="flex-1">
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()} 
              disabled={isUploading}
              className="w-full py-4 bg-black border border-white/10 rounded-xl text-[10px] font-black text-white uppercase tracking-widest hover:border-amber-500 transition-all flex items-center justify-center gap-2"
            >
              <Upload size={14} className="text-zinc-500" />
              {isUploading ? "Uploading..." : "Select File"}
            </button>
            <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
          </div>
        </div>
      )}
    </div>
  );
};

export const AdminScreen: React.FC = () => {
  const { 
    branding, services, barbers, appointments, gallery, offers, notifications, isDbConnected,
    isAdminAuthenticated, loginAdmin, logoutAdmin,
    updateBranding, updateService, deleteService, updateBarber, deleteBarber, updateAppointment, deleteOffer, updateOffer, addGalleryImage, deleteGalleryImage
  } = useAppContext();
  
  const [tab, setTab] = useState<'bookings' | 'branding' | 'services' | 'staff' | 'gallery' | 'offers'>('bookings');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [editBranding, setEditBranding] = useState(branding);

  useEffect(() => {
    setEditBranding(branding);
  }, [branding]);

  const [showServiceForm, setShowServiceForm] = useState(false);
  const [editingService, setEditingService] = useState<BarberService | null>(null);
  const [serviceImageUrl, setServiceImageUrl] = useState('');

  const [showOfferForm, setShowOfferForm] = useState(false);
  const [editingOffer, setEditingOffer] = useState<Offer | null>(null);
  const [offerImageUrl, setOfferImageUrl] = useState('');

  const [showStaffForm, setShowStaffForm] = useState(false);
  const [editingStaff, setEditingStaff] = useState<Barber | null>(null);
  const [staffImageUrl, setStaffImageUrl] = useState('');

  const handleSaveBranding = async () => {
    try {
      await updateBranding(editBranding);
      alert("✅ BRANDING UPDATED!");
    } catch (e) {
      alert("❌ FAILED TO SAVE");
    }
  };

  if (!isAdminAuthenticated) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-8 bg-[#050505]">
        <div className="w-24 h-24 bg-amber-500 rounded-[2rem] flex items-center justify-center mb-10 shadow-2xl">
          <Lock size={44} className="text-black" />
        </div>
        <h2 className="text-3xl font-black text-white mb-8 tracking-tighter uppercase italic">HQ ACCESS</h2>
        
        <form onSubmit={(e) => { e.preventDefault(); if (!loginAdmin(passwordInput)) setError('Invalid Passcode'); }} className="w-full space-y-4 max-w-sm">
          <div className="relative">
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="Admin Passcode"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full bg-zinc-900 border border-white/5 rounded-3xl py-5 px-6 text-white text-center focus:border-amber-500 outline-none font-bold"
            />
          </div>
          {error && <p className="text-red-500 text-[10px] font-black uppercase text-center">{error}</p>}
          <button type="submit" className="w-full py-5 bg-amber-500 text-black font-black rounded-3xl shadow-xl active:scale-95 uppercase tracking-widest">Login to Headquarters</button>
        </form>
      </div>
    );
  }

  return (
    <div className="p-4 space-y-6 pb-24 animate-in fade-in duration-500 max-w-md mx-auto">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-black text-white tracking-tight uppercase italic">Admin HQ</h2>
          <div className="flex items-center gap-1.5 mt-1">
             {isDbConnected ? (
               <div className="flex items-center gap-1 text-[8px] font-black text-green-500 uppercase tracking-widest"><Wifi size={10} /> Live Connection</div>
             ) : (
               <div className="flex items-center gap-1 text-[8px] font-black text-red-500 uppercase tracking-widest"><WifiOff size={10} /> Disconnected</div>
             )}
          </div>
        </div>
        <button onClick={logoutAdmin} className="p-3 text-red-500 bg-red-500/10 rounded-2xl"><LogOut size={20} /></button>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-4 sticky top-0 bg-[#020202]/95 backdrop-blur-md z-40 -mx-4 px-4 pt-2 no-scrollbar border-b border-white/5">
        {[
          { id: 'bookings', label: 'All Orders', icon: <Calendar size={14} /> },
          { id: 'services', label: 'Services', icon: <Scissors size={14} /> },
          { id: 'staff', label: 'Staff', icon: <User size={14} /> },
          { id: 'offers', label: 'Deals', icon: <Tag size={14} /> },
          { id: 'gallery', label: 'Gallery', icon: <ImageIcon size={14} /> },
          { id: 'branding', label: 'Setup', icon: <Settings size={14} /> },
        ].map(t => (
          <button
            key={t.id}
            onClick={() => setTab(t.id as any)}
            className={`flex items-center gap-2 px-5 py-3 rounded-2xl text-[9px] font-black transition-all whitespace-nowrap uppercase tracking-widest border ${
              tab === t.id ? 'bg-amber-500 text-black border-amber-500 shadow-xl' : 'bg-zinc-900 text-zinc-500 border-white/5'
            }`}
          >
            {t.icon} {t.label}
          </button>
        ))}
      </div>

      {tab === 'bookings' && (
        <div className="space-y-4">
           {appointments.length === 0 ? (
             <div className="p-20 text-center text-zinc-700 font-black uppercase text-xs tracking-widest">No Bookings Yet</div>
           ) : (
             appointments.map(apt => (
              <div key={apt.id} className="p-6 bg-zinc-900 rounded-[2.2rem] border border-white/5 space-y-4 shadow-xl">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="text-white font-black text-lg uppercase italic">{apt.customerName}</h4>
                    <p className="text-amber-500 text-xs font-bold">{apt.customerPhone}</p>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => updateAppointment(apt.id, 'confirmed')} className={`p-3 rounded-xl ${apt.status === 'confirmed' ? 'bg-green-500 text-white' : 'bg-zinc-800 text-green-500'}`}><Check size={18} /></button>
                    <button onClick={() => updateAppointment(apt.id, 'cancelled')} className={`p-3 rounded-xl ${apt.status === 'cancelled' ? 'bg-red-500 text-white' : 'bg-zinc-800 text-red-500'}`}><X size={18} /></button>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/5 flex justify-between items-center">
                  <div>
                    <p className="text-white font-bold text-xs">{services.find(s => s.id === apt.serviceId)?.name || 'Custom Grooming'}</p>
                    <p className="text-zinc-500 text-[10px] font-black uppercase tracking-tighter mt-1">{barbers.find(b => b.id === apt.barberId)?.name || 'Any Barber'}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-white font-bold text-[10px] uppercase">{apt.date}</p>
                    <p className="text-zinc-500 text-[9px] font-bold">{apt.time}</p>
                  </div>
                </div>
              </div>
            ))
           )}
        </div>
      )}

      {tab === 'branding' && (
        <div className="space-y-6">
          <ImagePicker 
            label="App Icon / Logo"
            currentUrl={editBranding.logoUrl}
            cloudName={branding.cloudinaryCloudName}
            uploadPreset={branding.cloudinaryUploadPreset}
            onUpload={(url) => setEditBranding({...editBranding, logoUrl: url})}
          />
          <div className="space-y-4">
             <div className="space-y-2">
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest ml-1">App Business Name</p>
                <input value={editBranding.shopName} onChange={(e) => setEditBranding({...editBranding, shopName: e.target.value})} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-white font-bold focus:border-amber-500 outline-none transition-all" placeholder="Enter Shop Name" />
                <p className="text-[7px] text-zinc-600 ml-1 italic">This name appears during the app start animation.</p>
             </div>
             <div className="space-y-2">
                <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest ml-1">Marketing Slogan</p>
                <input value={editBranding.shopSlogan} onChange={(e) => setEditBranding({...editBranding, shopSlogan: e.target.value})} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-white font-bold focus:border-amber-500 outline-none transition-all" placeholder="Enter App Slogan" />
                <p className="text-[7px] text-zinc-600 ml-1 italic">Short sentence below the name in the splash screen.</p>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest ml-1">Currency Symbol</p>
                  <input value={editBranding.currency} onChange={(e) => setEditBranding({...editBranding, currency: e.target.value})} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-white focus:border-amber-500 outline-none" placeholder="PKR" />
                </div>
                <div className="space-y-2">
                  <p className="text-[8px] font-black text-zinc-500 uppercase tracking-widest ml-1">Admin Passcode</p>
                  <input value={editBranding.adminPassword} onChange={(e) => setEditBranding({...editBranding, adminPassword: e.target.value})} className="w-full bg-zinc-900 border border-white/5 rounded-2xl p-4 text-white focus:border-amber-500 outline-none" placeholder="1234" />
                </div>
             </div>
          </div>
          <div className="p-5 bg-zinc-900 border border-white/5 rounded-2xl space-y-4">
            <h4 className="text-[10px] font-black text-amber-500 uppercase tracking-[0.2em]">Cloudinary Integration</h4>
            <input value={editBranding.cloudinaryCloudName} onChange={(e) => setEditBranding({...editBranding, cloudinaryCloudName: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white text-xs" placeholder="Cloud Name" />
            <input value={editBranding.cloudinaryUploadPreset} onChange={(e) => setEditBranding({...editBranding, cloudinaryUploadPreset: e.target.value})} className="w-full bg-black border border-white/10 rounded-xl p-3 text-white text-xs" placeholder="Upload Preset (Unsigned)" />
          </div>
          <button onClick={handleSaveBranding} className="w-full py-5 bg-amber-500 text-black font-black rounded-[2rem] shadow-xl uppercase tracking-widest text-xs active:scale-95 transition-all">Update App Branding</button>
        </div>
      )}

      {(tab === 'services' || tab === 'staff' || tab === 'offers' || tab === 'gallery') && (
        <div className="space-y-4">
          {tab !== 'gallery' && (
             <button 
               onClick={() => {
                 if (tab === 'services') { setEditingService(null); setServiceImageUrl(''); setShowServiceForm(true); }
                 if (tab === 'staff') { setEditingStaff(null); setStaffImageUrl(''); setShowStaffForm(true); }
                 if (tab === 'offers') { setEditingOffer(null); setOfferImageUrl(''); setShowOfferForm(true); }
               }}
               className="w-full py-6 bg-zinc-900 border-2 border-white/5 border-dashed rounded-[2.2rem] text-zinc-500 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-3"
             >
               <Plus size={20} /> Add New Entry
             </button>
          )}
           
           <div className="space-y-3">
             {tab === 'services' && services.map(s => (
               <div key={s.id} className="p-4 bg-zinc-900 border border-white/5 rounded-3xl flex items-center justify-between shadow-xl">
                 <div className="flex items-center gap-4">
                    <img src={s.imageUrl} className="w-16 h-16 rounded-2xl object-cover border border-white/5" alt="" />
                    <div><p className="text-white font-black text-sm italic uppercase">{s.name}</p><p className="text-amber-500 text-[10px] font-black uppercase">{branding.currency} {s.price}</p></div>
                 </div>
                 <div className="flex gap-1">
                    <button onClick={() => { setEditingService(s); setServiceImageUrl(s.imageUrl || ''); setShowServiceForm(true); }} className="p-2.5 text-zinc-500"><Edit2 size={18} /></button>
                    <button onClick={() => deleteService(s.id)} className="p-2.5 text-red-500/50"><Trash2 size={18} /></button>
                 </div>
               </div>
             ))}

             {tab === 'gallery' && (
                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-4">
                    {gallery.map(img => (
                      <div key={img.id} className="relative aspect-square rounded-[2rem] overflow-hidden border border-white/5 shadow-2xl group">
                        <img src={img.url} className="w-full h-full object-cover" alt="" />
                        <button onClick={() => deleteGalleryImage(img.id)} className="absolute top-3 right-3 p-3 bg-red-500 text-white rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={14} /></button>
                      </div>
                    ))}
                  </div>
                  <ImagePicker 
                    currentUrl=""
                    label="Portfolio Upload"
                    cloudName={branding.cloudinaryCloudName}
                    uploadPreset={branding.cloudinaryUploadPreset}
                    onUpload={async (url) => {
                       await addGalleryImage(url);
                       alert("✅ Portfolio look added!");
                    }}
                  />
                </div>
             )}
           </div>
        </div>
      )}
    </div>
  );
};
