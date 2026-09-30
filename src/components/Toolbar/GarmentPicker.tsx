import React from 'react';
import { GARMENTS } from '../../constants/garments';
import { FABRIC_TEXTURES, FabricTexturePreset } from '../../constants/textures';
import { GarmentType, FabricType } from '../../types/apparel';
import { Check, Sparkles, Layers } from 'lucide-react';

interface GarmentPickerProps {
  selectedType: GarmentType;
  onSelectType: (type: GarmentType) => void;
  selectedColor: string;
  onSelectColor: (color: string) => void;
  selectedAccentColor: string;
  onSelectAccentColor: (color: string) => void;
  selectedFabric: FabricType;
  onSelectFabric: (fabric: FabricType) => void;
  textureOverlay?: { id: string; opacity: number } | null;
  onSelectTextureOverlay: (texture: { id: string; opacity: number } | null) => void;
}

export const GarmentPicker: React.FC<GarmentPickerProps> = ({
  selectedType,
  onSelectType,
  selectedColor,
  onSelectColor,
  selectedAccentColor,
  onSelectAccentColor,
  selectedFabric,
  onSelectFabric,
  textureOverlay = null,
  onSelectTextureOverlay,
}) => {
  const currentGarment = GARMENTS[selectedType];
  const activeTextureId = textureOverlay?.id || 'none';
  const activeTextureOpacity = textureOverlay?.opacity ?? 0.5;

  return (
    <div className="space-y-6">
      {/* Apparel Type Grid */}
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          Select Apparel Cut
        </label>
        <div className="grid grid-cols-2 gap-2">
          {Object.values(GARMENTS).map((garment) => {
            const isSelected = garment.id === selectedType;
            return (
              <button
                key={garment.id}
                onClick={() => onSelectType(garment.id as GarmentType)}
                className={`p-3 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                    : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-semibold text-sm">{garment.name}</span>
                    {isSelected && <Check className="w-4 h-4 text-indigo-400" />}
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-1">{garment.subtitle}</p>
                </div>
                <div className="mt-2 flex items-center justify-between text-xs pt-2 border-t border-zinc-800/50">
                  <span className="text-zinc-400">From</span>
                  <span className="font-mono font-semibold text-indigo-300">${garment.basePrice}</span>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* NEW: Fabric Texture Overlay Section */}
      <div className="p-4 bg-zinc-900/80 border border-zinc-800/90 rounded-2xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-white uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-400" />
            Fabric Texture & Surface Finish
          </label>
          <span className="text-[10px] font-mono bg-indigo-950 text-indigo-300 border border-indigo-800 px-2 py-0.5 rounded">
            {activeTextureId === 'none' ? 'Solid Color' : FABRIC_TEXTURES.find((t) => t.id === activeTextureId)?.name}
          </span>
        </div>

        <p className="text-[11px] text-zinc-400 leading-relaxed">
          Toggle between flat solid colors or realistic fabric weave textures (heathered cotton, fleece, raw denim, acid wash) overlaid on the garment.
        </p>

        {/* Texture Cards Grid */}
        <div className="grid grid-cols-2 gap-2 max-h-52 overflow-y-auto pr-1 custom-scrollbar">
          {FABRIC_TEXTURES.map((t) => {
            const isSelected = activeTextureId === t.id;
            return (
              <button
                key={t.id}
                onClick={() => {
                  if (t.id === 'none') {
                    onSelectTextureOverlay(null);
                  } else {
                    onSelectTextureOverlay({
                      id: t.id,
                      opacity: t.defaultOpacity,
                    });
                  }
                }}
                className={`p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-zinc-950/80 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-bold">{t.name}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-indigo-400" />}
                  </div>
                  <p className="text-[10px] text-zinc-500 line-clamp-1">{t.subtitle}</p>
                </div>
              </button>
            );
          })}
        </div>

        {/* Texture Intensity Slider */}
        {activeTextureId !== 'none' && (
          <div className="pt-2 border-t border-zinc-800/80 space-y-1">
            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400">
              <span>Texture Intensity / Opacity</span>
              <span className="font-mono text-zinc-200">{Math.round(activeTextureOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.2"
              max="1"
              step="0.05"
              value={activeTextureOpacity}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                onSelectTextureOverlay({
                  id: activeTextureId,
                  opacity: val,
                });
              }}
              className="w-full accent-indigo-500"
            />
          </div>
        )}
      </div>

      {/* Garment Base Color Palette */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Garment Base Color
          </label>
          <span className="text-xs font-mono text-zinc-300">{selectedColor}</span>
        </div>

        <div className="grid grid-cols-8 gap-2 mb-3">
          {currentGarment.colorPresets.map((c) => {
            const isSelected = c.hex.toLowerCase() === selectedColor.toLowerCase();
            return (
              <button
                key={c.hex}
                onClick={() => onSelectColor(c.hex)}
                title={c.name}
                className={`w-7 h-7 rounded-full border border-zinc-700 transition-transform flex items-center justify-center ${
                  isSelected ? 'scale-125 ring-2 ring-indigo-500 ring-offset-2 ring-offset-zinc-950' : 'hover:scale-110'
                }`}
                style={{ backgroundColor: c.hex }}
              >
                {isSelected && (
                  <Check className={`w-3.5 h-3.5 ${c.hex.toLowerCase() > '#888888' ? 'text-black' : 'text-white'}`} />
                )}
              </button>
            );
          })}
        </div>

        {/* Custom Hex Picker Input */}
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={selectedColor}
            onChange={(e) => onSelectColor(e.target.value)}
            className="w-8 h-8 rounded-lg bg-transparent border border-zinc-700 cursor-pointer p-0.5"
          />
          <input
            type="text"
            value={selectedColor}
            onChange={(e) => onSelectColor(e.target.value)}
            placeholder="#18181b"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Trim / Accent Color (Ribbing/Strings) */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Trim & Accent Color (Ribbing / Strings)
          </label>
          <span className="text-xs font-mono text-zinc-300">{selectedAccentColor}</span>
        </div>
        <div className="flex items-center gap-2">
          <input
            type="color"
            value={selectedAccentColor}
            onChange={(e) => onSelectAccentColor(e.target.value)}
            className="w-8 h-8 rounded-lg bg-transparent border border-zinc-700 cursor-pointer p-0.5"
          />
          <input
            type="text"
            value={selectedAccentColor}
            onChange={(e) => onSelectAccentColor(e.target.value)}
            placeholder="#18181b"
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500"
          />
        </div>
      </div>

      {/* Fabric Weight & Spec Selector */}
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          Fabric Construction & GSM Spec
        </label>
        <div className="space-y-2">
          {currentGarment.fabricOptions.map((f) => {
            const isSelected = f.id === selectedFabric;
            return (
              <button
                key={f.id}
                onClick={() => onSelectFabric(f.id as FabricType)}
                className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600/10 border-indigo-500 text-white'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold">{f.label}</span>
                  <span className="text-[10px] font-mono bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded">
                    {f.weight}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400 mt-1">{f.description}</p>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
