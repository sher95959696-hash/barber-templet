
import React from 'react';
import { useAppContext } from '../store/AppContext';

export const GalleryScreen: React.FC = () => {
  const { gallery } = useAppContext();

  return (
    <div className="p-4 space-y-6 pb-32">
      <div className="mb-2">
        <h2 className="text-2xl font-bold text-white mb-2">The Gallery</h2>
        <p className="text-slate-400 text-sm">A glimpse of excellence and our fine aesthetics.</p>
      </div>

      {gallery.length === 0 ? (
        <div className="p-12 text-center bg-slate-900 rounded-[2rem] border border-slate-800">
           <p className="text-slate-500">Coming soon...</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          {gallery.map((img, idx) => (
            <div key={img.id} className={`relative rounded-3xl overflow-hidden shadow-lg border border-slate-800 ${idx % 3 === 0 ? 'row-span-2 h-[320px]' : 'h-[155px]'}`}>
              <img src={img.url} className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" alt="Gallery" />
              <div className="absolute bottom-3 left-3 px-3 py-1 bg-black/50 backdrop-blur-md rounded-full text-[10px] font-black uppercase text-white tracking-widest">
                {img.category}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
