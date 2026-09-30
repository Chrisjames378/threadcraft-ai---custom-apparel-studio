import React from 'react';
import { PrintMethod } from '../../types/apparel';
import { Sparkles, Layers, Printer, Award } from 'lucide-react';

interface PrintMethodPickerProps {
  selectedMethod: PrintMethod;
  onSelectMethod: (method: PrintMethod) => void;
}

const METHODS: { id: PrintMethod; label: string; desc: string; icon: any; priceAdjust: string }[] = [
  {
    id: 'dtg',
    label: 'DTG Digital Print',
    desc: 'High-definition full color printing directly into cotton fibers. Best for photographs & gradients.',
    icon: Printer,
    priceAdjust: 'Standard',
  },
  {
    id: 'screenprint',
    label: 'Screen Printing (1-4 Colors)',
    desc: 'Vibrant opaque ink layer with high durability. Best for bold graphic logos and bulk orders.',
    icon: Layers,
    priceAdjust: '+$2 / item',
  },
  {
    id: 'embroidery',
    label: 'High-Density Puff Embroidery',
    desc: '3D raised thread stitching with premium textured feel. Supreme luxury look for badges and hats.',
    icon: Award,
    priceAdjust: '+$6 / item',
  },
  {
    id: 'vinyl-foil',
    label: 'Metallic Vinyl & Holographic Foil',
    desc: 'Reflective metallic chrome or holographic shimmer finish that catches the light.',
    icon: Sparkles,
    priceAdjust: '+$4 / item',
  },
];

export const PrintMethodPicker: React.FC<PrintMethodPickerProps> = ({
  selectedMethod,
  onSelectMethod,
}) => {
  return (
    <div className="space-y-4">
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-1">
          Production Print Technique
        </label>
        <p className="text-[11px] text-zinc-400 mb-3">
          Choose how your custom graphics and typography will be manufactured.
        </p>
      </div>

      <div className="space-y-2">
        {METHODS.map((m) => {
          const Icon = m.icon;
          const isSelected = m.id === selectedMethod;

          return (
            <button
              key={m.id}
              onClick={() => onSelectMethod(m.id)}
              className={`w-full p-3.5 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-indigo-600/10 border-indigo-500 text-white shadow-lg shadow-indigo-500/10'
                  : 'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <div className="flex items-center gap-2">
                  <div className={`p-1.5 rounded-lg ${isSelected ? 'bg-indigo-600 text-white' : 'bg-zinc-800 text-zinc-400'}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-semibold">{m.label}</span>
                </div>
                <span className="text-[10px] font-mono bg-zinc-800 text-indigo-300 px-2 py-0.5 rounded">
                  {m.priceAdjust}
                </span>
              </div>
              <p className="text-[11px] text-zinc-400 ml-8 leading-relaxed">{m.desc}</p>
            </button>
          );
        })}
      </div>
    </div>
  );
};
