import React from 'react';
import { GarmentDesign } from '../types/apparel';
import { X, FolderHeart, ArrowRight, Trash2, Calendar } from 'lucide-react';

interface SavedDesignsModalProps {
  isOpen: boolean;
  onClose: () => void;
  savedDesigns: GarmentDesign[];
  onLoadDesign: (design: GarmentDesign) => void;
  onDeleteDesign: (id: string) => void;
}

export const SavedDesignsModal: React.FC<SavedDesignsModalProps> = ({
  isOpen,
  onClose,
  savedDesigns,
  onLoadDesign,
  onDeleteDesign,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-zinc-950 border border-zinc-800 w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden my-8 animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="p-6 bg-zinc-900/80 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 flex items-center justify-center">
              <FolderHeart className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Your Saved Apparel Designs</h2>
              <p className="text-xs text-zinc-400">{savedDesigns.length} Saved Items</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-xl transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto custom-scrollbar">
          {savedDesigns.length === 0 ? (
            <div className="p-12 text-center text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-2xl space-y-2">
              <FolderHeart className="w-8 h-8 mx-auto opacity-40 text-zinc-400" />
              <p className="font-semibold text-zinc-400 text-sm">No saved designs yet.</p>
              <p className="text-zinc-500 max-w-xs mx-auto">
                Customize any garment in the studio and click "Save" in the top bar to save it to your local library!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {savedDesigns.map((d) => (
                <div
                  key={d.id}
                  className="bg-zinc-900/80 border border-zinc-800/90 rounded-2xl p-4 space-y-3 hover:border-indigo-500/50 transition-all flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm text-white truncate">{d.name}</span>
                      <button
                        onClick={() => onDeleteDesign(d.id)}
                        className="p-1 text-zinc-500 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="flex items-center gap-2 text-[11px] text-zinc-400">
                      <div className="w-3.5 h-3.5 rounded-full border border-zinc-700" style={{ backgroundColor: d.baseColor }} />
                      <span className="capitalize">{d.garmentType.replace('-', ' ')}</span>
                      <span>• {d.layers.length} Layers</span>
                    </div>

                    <div className="text-[10px] text-zinc-500 font-mono flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(d.createdAt).toLocaleDateString()}
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      onLoadDesign(d);
                      onClose();
                    }}
                    className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-1.5 transition-all shadow-md"
                  >
                    <span>Open in Studio</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
