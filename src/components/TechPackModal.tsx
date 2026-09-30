import React from 'react';
import { GarmentConfig, CanvasLayer, PrintMethod, FabricType } from '../types/apparel';
import { X, Download, FileText, CheckCircle, ShieldCheck, Printer, Cpu } from 'lucide-react';

interface TechPackModalProps {
  isOpen: boolean;
  onClose: () => void;
  garment: GarmentConfig;
  color: string;
  accentColor: string;
  fabric: FabricType;
  layers: CanvasLayer[];
  printMethod: PrintMethod;
}

export const TechPackModal: React.FC<TechPackModalProps> = ({
  isOpen,
  onClose,
  garment,
  color,
  accentColor,
  fabric,
  layers,
  printMethod,
}) => {
  if (!isOpen) return null;

  const currentFabric = garment.fabricOptions.find((f) => f.id === fabric);

  const handleDownloadTechPackPDF = () => {
    alert('Exporting Factory Production Tech Pack PDF & Vector Files...');
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        {/* Modal Header */}
        <div className="p-6 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Factory Tech Pack Specification</h2>
              <p className="text-xs text-zinc-400 font-mono">SPEC-ID: #{Math.floor(100000 + Math.random() * 900000)}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6 max-h-[75vh] overflow-y-auto custom-scrollbar">
          {/* Garment Construction & Material Specifications */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Cpu className="w-4 h-4" />
              Garment & Fabric Construction
            </h3>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
                <span className="text-zinc-500 text-[10px] block">Apparel Silhouette</span>
                <span className="font-semibold text-white">{garment.name}</span>
              </div>

              <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
                <span className="text-zinc-500 text-[10px] block">Fabric Spec</span>
                <span className="font-semibold text-white">{currentFabric?.label || '100% Cotton'}</span>
              </div>

              <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
                <span className="text-zinc-500 text-[10px] block">GSM Weight</span>
                <span className="font-semibold text-indigo-300 font-mono">{currentFabric?.weight || '240 GSM'}</span>
              </div>

              <div className="bg-zinc-950 p-2.5 rounded-xl border border-zinc-800/80">
                <span className="text-zinc-500 text-[10px] block">Print Technique</span>
                <span className="font-semibold text-emerald-400 capitalize">{printMethod.replace('-', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Color Matrix */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider">Color Specification</h3>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="flex items-center gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <div className="w-8 h-8 rounded-lg border border-zinc-700 shadow-md" style={{ backgroundColor: color }} />
                <div>
                  <span className="text-zinc-400 text-[10px] block">Garment Base Hex</span>
                  <span className="font-mono font-bold text-white">{color.toUpperCase()}</span>
                </div>
              </div>

              <div className="flex items-center gap-3 bg-zinc-950 p-3 rounded-xl border border-zinc-800">
                <div className="w-8 h-8 rounded-lg border border-zinc-700 shadow-md" style={{ backgroundColor: accentColor }} />
                <div>
                  <span className="text-zinc-400 text-[10px] block">Trim / Ribbing Hex</span>
                  <span className="font-mono font-bold text-white">{accentColor.toUpperCase()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Design Print Layers Breakdown */}
          <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl p-4 space-y-3">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider flex items-center gap-2">
              <Printer className="w-4 h-4" />
              Artwork Placement & Layers ({layers.length})
            </h3>

            {layers.length === 0 ? (
              <p className="text-xs text-zinc-500 italic">No design layers added yet.</p>
            ) : (
              <div className="space-y-2">
                {layers.map((l, idx) => (
                  <div key={l.id} className="bg-zinc-950 p-3 rounded-xl border border-zinc-800 text-xs flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-0.5">
                        <span className="font-mono text-[10px] text-indigo-400">Layer #{idx + 1}</span>
                        <span className="font-semibold text-white capitalize">{l.type}</span>
                        <span className="text-[9px] uppercase font-mono bg-zinc-800 text-zinc-300 px-1.5 py-0.5 rounded">
                          {l.view} View
                        </span>
                      </div>
                      <p className="text-[11px] text-zinc-400 font-mono truncate max-w-sm">
                        {l.text ? `"${l.text}" (${l.fontFamily})` : 'Graphic Artwork Element'}
                      </p>
                    </div>

                    <div className="text-right text-[10px] font-mono text-zinc-400">
                      <div>Pos: X:{Math.round(l.x)}% Y:{Math.round(l.y)}%</div>
                      <div>Scale: {Math.round(l.scale * 100)}%</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-6 bg-zinc-900/90 border-t border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
            <CheckCircle className="w-4 h-4" />
            <span>Ready for Factory Manufacturing</span>
          </div>

          <button
            onClick={handleDownloadTechPackPDF}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Download className="w-4 h-4" />
            <span>Download Production Tech Pack</span>
          </button>
        </div>
      </div>
    </div>
  );
};
