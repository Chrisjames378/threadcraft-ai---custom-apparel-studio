import React from 'react';
import { CanvasLayer, GarmentView } from '../../types/apparel';
import { Layers as LayersIcon, Trash2, ArrowUp, ArrowDown, Lock, Unlock, FlipHorizontal, Copy, Eye, EyeOff } from 'lucide-react';

interface LayerManagerProps {
  currentView: GarmentView;
  layers: CanvasLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<CanvasLayer>) => void;
  onDeleteLayer: (id: string) => void;
  onDuplicateLayer: (id: string) => void;
  onReorderLayer: (id: string, direction: 'up' | 'down') => void;
}

export const LayerManager: React.FC<LayerManagerProps> = ({
  currentView,
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onDeleteLayer,
  onDuplicateLayer,
  onReorderLayer,
}) => {
  const viewLayers = layers
    .filter((l) => l.view === currentView)
    .sort((a, b) => b.zIndex - a.zIndex); // Highest Z on top

  if (viewLayers.length === 0) {
    return (
      <div className="p-8 text-center text-zinc-500 text-xs border border-dashed border-zinc-800 rounded-2xl">
        <LayersIcon className="w-8 h-8 mx-auto mb-2 opacity-40 text-zinc-400" />
        <p className="font-semibold text-zinc-400">No design layers on this view yet.</p>
        <p className="text-[11px] text-zinc-500 mt-1">Add text, graphics, or AI badges from the toolbar.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between mb-1">
        <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
          Active Canvas Layers ({viewLayers.length})
        </label>
      </div>

      <div className="space-y-2">
        {viewLayers.map((layer, idx) => {
          const isSelected = layer.id === selectedLayerId;

          return (
            <div
              key={layer.id}
              onClick={() => onSelectLayer(layer.id)}
              className={`p-3 rounded-xl border transition-all flex items-center justify-between cursor-pointer ${
                isSelected
                  ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md'
                  : 'bg-zinc-900/60 border-zinc-800/80 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-900'
              }`}
            >
              <div className="flex items-center gap-2.5 overflow-hidden">
                <span className="text-[10px] font-mono text-zinc-500 w-4">#{idx + 1}</span>

                <div className="truncate">
                  <span className="text-xs font-semibold block truncate">
                    {layer.type === 'text' && (layer.text || 'Text Layer')}
                    {layer.type === 'preset' && 'Preset Graphic Badge'}
                    {layer.type === 'image' && 'Uploaded Graphic'}
                  </span>
                  <span className="text-[10px] text-zinc-400 capitalize">
                    {layer.type} • Scale: {Math.round(layer.scale * 100)}%
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateLayer(layer.id, { flipX: !layer.flipX });
                  }}
                  title="Flip Horizontal"
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                >
                  <FlipHorizontal className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onUpdateLayer(layer.id, { locked: !layer.locked });
                  }}
                  title={layer.locked ? 'Unlock Layer' : 'Lock Layer'}
                  className={`p-1.5 rounded-lg ${
                    layer.locked ? 'text-amber-400 bg-amber-950/50' : 'text-zinc-400 hover:text-white hover:bg-zinc-800'
                  }`}
                >
                  {layer.locked ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDuplicateLayer(layer.id);
                  }}
                  title="Duplicate Layer"
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReorderLayer(layer.id, 'up');
                  }}
                  title="Bring Forward"
                  className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg"
                >
                  <ArrowUp className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onDeleteLayer(layer.id);
                  }}
                  title="Delete Layer"
                  className="p-1.5 text-zinc-400 hover:text-red-400 hover:bg-zinc-800 rounded-lg"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
