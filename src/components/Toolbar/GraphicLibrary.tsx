import React, { useRef, useState } from 'react';
import { PRESET_GRAPHICS } from '../../constants/graphics';
import { CanvasLayer, GarmentView } from '../../types/apparel';
import { Upload, Sparkles, CheckCircle, MousePointerClick } from 'lucide-react';

interface GraphicLibraryProps {
  currentView: GarmentView;
  onAddLayer: (layer: Partial<CanvasLayer>) => void;
}

const CATEGORIES = ['All', 'Y2K Cyber', 'Streetwear Logos', 'Stickers & Icons', 'Botanical', 'Gothic & Skull'];

export const GraphicLibrary: React.FC<GraphicLibraryProps> = ({
  currentView,
  onAddLayer,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleSelectPreset = (graphic: (typeof PRESET_GRAPHICS)[0]) => {
    onAddLayer({
      type: 'preset',
      view: currentView,
      x: 35,
      y: 35,
      width: 120,
      height: 120,
      scale: 1,
      rotation: 0,
      opacity: 1,
      zIndex: Date.now(),
      src: graphic.svgContent,
      color: '#ffffff',
    });
    showNotification(`Stamped "${graphic.name}" onto ${currentView} view!`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        onAddLayer({
          type: 'image',
          view: currentView,
          x: 30,
          y: 30,
          width: 140,
          height: 140,
          scale: 1,
          rotation: 0,
          opacity: 1,
          zIndex: Date.now(),
          src: result,
        });
        showNotification(`Uploaded logo stamped onto ${currentView} view!`);
      }
    };
    reader.readAsDataURL(file);
  };

  const filteredGraphics =
    selectedCategory === 'All'
      ? PRESET_GRAPHICS
      : PRESET_GRAPHICS.filter((g) => g.category.includes(selectedCategory));

  return (
    <div className="space-y-5">
      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="bg-emerald-600/90 text-white font-bold text-xs p-2.5 rounded-xl border border-emerald-400 flex items-center justify-center gap-2 shadow-lg animate-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Upload Custom Image */}
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          Upload Custom Artwork / Logo
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/svg+xml, image/webp"
          onChange={handleFileUpload}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full border-2 border-dashed border-zinc-800 hover:border-indigo-500 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-300 hover:text-white p-4 rounded-2xl flex flex-col items-center justify-center gap-1.5 transition-all group shadow-md"
        >
          <div className="p-2.5 bg-zinc-800 group-hover:bg-indigo-600/20 text-indigo-400 rounded-xl transition-colors">
            <Upload className="w-4 h-4" />
          </div>
          <span className="text-xs font-bold">Click to Upload PNG / SVG Logo</span>
          <span className="text-[10px] text-zinc-400">Instantly places your uploaded image onto clothes</span>
        </button>
      </div>

      {/* Category Filter Pills */}
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          Click Any Graphic to Stamp onto Clothes
        </label>

        <div className="flex gap-1.5 overflow-x-auto pb-2 custom-scrollbar">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full text-[11px] font-semibold whitespace-nowrap transition-all ${
                selectedCategory === cat
                  ? 'bg-indigo-600 text-white shadow-md'
                  : 'bg-zinc-900 text-zinc-400 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Preset Graphic Badges Grid */}
      <div className="grid grid-cols-2 gap-2.5 max-h-80 overflow-y-auto pr-1 custom-scrollbar">
        {filteredGraphics.map((graphic) => (
          <button
            key={graphic.id}
            onClick={() => handleSelectPreset(graphic)}
            className="p-3 rounded-2xl bg-zinc-900/90 hover:bg-zinc-800 border border-zinc-800/90 hover:border-indigo-500/80 flex flex-col items-center gap-2 transition-all hover:scale-[1.03] group shadow-md"
          >
            <div
              className="w-16 h-16 text-zinc-200 group-hover:text-indigo-400 transition-colors flex items-center justify-center p-1"
              dangerouslySetInnerHTML={{ __html: graphic.svgContent }}
            />
            <div className="text-center w-full">
              <span className="text-xs font-bold text-white block line-clamp-1">
                {graphic.name}
              </span>
              <span className="text-[9px] uppercase font-mono text-indigo-400 flex items-center justify-center gap-1 mt-0.5">
                <MousePointerClick className="w-3 h-3 text-indigo-400" />
                Click to Stamp
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
