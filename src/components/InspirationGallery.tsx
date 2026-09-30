import React from 'react';
import { GarmentType, PrintMethod, CanvasLayer } from '../types/apparel';
import { Sparkles, ArrowRight, Shirt } from 'lucide-react';

interface TemplatePreset {
  id: string;
  title: string;
  subtitle: string;
  category: string;
  garmentType: GarmentType;
  baseColor: string;
  accentColor: string;
  printMethod: PrintMethod;
  layers: CanvasLayer[];
}

const TEMPLATE_PRESETS: TemplatePreset[] = [
  {
    id: 'tokyo-cyber',
    title: 'Tokyo Cyber 2026',
    subtitle: 'Futuristic Y2K Cyberpunk Aesthetic',
    category: 'Cyberpunk',
    garmentType: 'hoodie',
    baseColor: '#121214',
    accentColor: '#1d4ed8',
    printMethod: 'dtg',
    layers: [
      {
        id: 'layer-1',
        type: 'text',
        view: 'front',
        x: 25,
        y: 20,
        width: 200,
        height: 50,
        scale: 1,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
        text: 'TOKYO CYBER',
        fontFamily: "'Fira Code', monospace",
        color: '#38bdf8',
        fontSize: 32,
        letterSpacing: 4,
      },
      {
        id: 'layer-2',
        type: 'preset',
        view: 'front',
        x: 32,
        y: 40,
        width: 120,
        height: 120,
        scale: 1,
        rotation: 0,
        opacity: 1,
        zIndex: 2,
        src: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0 C50 35 65 50 100 50 C65 50 50 65 50 100 C50 65 35 50 0 50 C35 50 50 35 50 0 Z"/></svg>`,
        color: '#38bdf8',
      },
    ],
  },
  {
    id: 'vintage-botanical',
    title: 'Saint Atelier Rose',
    subtitle: 'Minimalist Botanical Fine Art',
    category: 'Minimalist',
    garmentType: 'sweatshirt',
    baseColor: '#f5f5f0',
    accentColor: '#27272a',
    printMethod: 'embroidery',
    layers: [
      {
        id: 'layer-1',
        type: 'preset',
        view: 'front',
        x: 35,
        y: 25,
        width: 120,
        height: 120,
        scale: 1,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
        src: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M50 85 C50 60 50 45 50 35" /><path d="M50 65 C40 60 30 62 25 55 C35 52 45 58 50 65" fill="currentColor" opacity="0.2"/><circle cx="50" cy="25" r="12" fill="none"/></svg>`,
        color: '#18181b',
      },
      {
        id: 'layer-2',
        type: 'text',
        view: 'front',
        x: 22,
        y: 65,
        width: 200,
        height: 50,
        scale: 1,
        rotation: 0,
        opacity: 1,
        zIndex: 2,
        text: 'MAISON BOTANIQUE',
        fontFamily: "'Cinzel', serif",
        color: '#18181b',
        fontSize: 24,
        letterSpacing: 3,
      },
    ],
  },
  {
    id: 'crown-skull',
    title: 'Gothic Crown & Skull',
    subtitle: 'Heavy Metal Vintage Washed Tee',
    category: 'Gothic',
    garmentType: 'tshirt',
    baseColor: '#27272a',
    accentColor: '#121214',
    printMethod: 'screenprint',
    layers: [
      {
        id: 'layer-1',
        type: 'text',
        view: 'front',
        x: 20,
        y: 18,
        width: 200,
        height: 50,
        scale: 1,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
        text: 'Saint Atelier',
        fontFamily: "'UnifrakturMaguntia', cursive",
        color: '#f8fafc',
        fontSize: 40,
        letterSpacing: 2,
      },
      {
        id: 'layer-2',
        type: 'preset',
        view: 'front',
        x: 32,
        y: 42,
        width: 120,
        height: 120,
        scale: 1,
        rotation: 0,
        opacity: 1,
        zIndex: 2,
        src: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M25 25 L35 38 L50 20 L65 38 L75 25 L70 42 L30 42 Z"/><path d="M32 46 C32 46 32 75 50 75 C68 75 68 46 68 46 Z"/><circle cx="43" cy="56" r="5" fill="#000"/><circle cx="57" cy="56" r="5" fill="#000"/></svg>`,
        color: '#f8fafc',
      },
    ],
  },
  {
    id: 'worldwide-supply',
    title: 'Worldwide Supply Snapback',
    subtitle: '3D Puff Embroidered Crest',
    category: 'Streetwear',
    garmentType: 'cap',
    baseColor: '#121214',
    accentColor: '#3b82f6',
    printMethod: 'embroidery',
    layers: [
      {
        id: 'layer-1',
        type: 'preset',
        view: 'front',
        x: 32,
        y: 30,
        width: 100,
        height: 100,
        scale: 1,
        rotation: 0,
        opacity: 1,
        zIndex: 1,
        src: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3"><circle cx="50" cy="50" r="42" /><line x1="50" y1="8" x2="50" y2="92" /><line x1="8" y1="50" x2="92" y2="50" /></svg>`,
        color: '#f8fafc',
      },
    ],
  },
];

interface InspirationGalleryProps {
  onLoadPreset: (
    garmentType: GarmentType,
    baseColor: string,
    accentColor: string,
    printMethod: PrintMethod,
    layers: CanvasLayer[]
  ) => void;
}

export const InspirationGallery: React.FC<InspirationGalleryProps> = ({ onLoadPreset }) => {
  return (
    <div className="flex-1 bg-zinc-950 p-6 lg:p-12 overflow-y-auto">
      <div className="max-w-5xl mx-auto space-y-8">
        <div>
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs mb-2">
            <Sparkles className="w-4 h-4 text-amber-400" />
            CURATED LOOKBOOK & PRESETS
          </div>
          <h2 className="text-2xl lg:text-3xl font-black text-white">Inspiration Lookbook</h2>
          <p className="text-xs text-zinc-400 mt-1">
            Pick a pre-designed streetwear concept and open it directly in the 2D Studio to customize text, colors, and layers.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {TEMPLATE_PRESETS.map((preset) => (
            <div
              key={preset.id}
              className="bg-zinc-900/80 border border-zinc-800 rounded-3xl p-6 flex flex-col justify-between hover:border-indigo-500/50 transition-all group"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] uppercase font-mono tracking-widest bg-indigo-950 text-indigo-300 border border-indigo-800 px-2.5 py-1 rounded-full">
                    {preset.category}
                  </span>
                  <span className="text-xs font-semibold text-zinc-400 capitalize">
                    {preset.garmentType.replace('-', ' ')}
                  </span>
                </div>

                <div>
                  <h3 className="text-xl font-bold text-white group-hover:text-indigo-400 transition-colors">
                    {preset.title}
                  </h3>
                  <p className="text-xs text-zinc-400 mt-1">{preset.subtitle}</p>
                </div>

                <div className="p-4 bg-zinc-950 rounded-2xl border border-zinc-800/80 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div
                      className="w-5 h-5 rounded-full border border-zinc-700"
                      style={{ backgroundColor: preset.baseColor }}
                    />
                    <span className="text-zinc-300 font-mono">{preset.baseColor}</span>
                  </div>
                  <span className="font-semibold text-indigo-300 uppercase font-mono text-[11px]">
                    Method: {preset.printMethod}
                  </span>
                </div>
              </div>

              <button
                onClick={() =>
                  onLoadPreset(
                    preset.garmentType,
                    preset.baseColor,
                    preset.accentColor,
                    preset.printMethod,
                    preset.layers
                  )
                }
                className="mt-6 w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-3 rounded-2xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all group-hover:scale-[1.02]"
              >
                <span>Customize in Studio</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
