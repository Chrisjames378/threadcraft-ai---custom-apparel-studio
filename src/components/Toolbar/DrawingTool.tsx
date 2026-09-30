import React, { useState } from 'react';
import { Palette, Brush, Eraser, Sparkles, Check, Trash2, Layers, Pencil, Wand2, RefreshCw, RotateCcw } from 'lucide-react';

export type BrushMode = 'pen' | 'spray' | 'neon' | 'eraser';

interface DrawingToolProps {
  isDrawModeActive: boolean;
  onToggleDrawMode: (active: boolean) => void;
  brushMode: BrushMode;
  onChangeBrushMode: (mode: BrushMode) => void;
  brushColor: string;
  onChangeBrushColor: (color: string) => void;
  brushSize: number;
  onChangeBrushSize: (size: number) => void;
  onClearDrawing: () => void;
  onUndoDrawing: () => void;
  onSaveDrawingAsLayer: () => void;
  onAiEnhanceDrawing: (promptText: string) => Promise<void>;
  hasDrawingContent: boolean;
  isAiEnhancing: boolean;
}

const COLOR_PALETTE = [
  '#f43f5e', // Hot Pink
  '#fbbf24', // Cyber Yellow
  '#34d399', // Acid Mint
  '#38bdf8', // Neon Sky Blue
  '#a78bfa', // Electric Violet
  '#ffffff', // Pure White
  '#18181b', // Deep Onyx
  '#f97316', // Coral Orange
  '#10b981', // Emerald
  '#ec4899', // Magenta
  '#06b6d4', // Cyan
  '#eab308', // Gold
];

export const DrawingTool: React.FC<DrawingToolProps> = ({
  isDrawModeActive,
  onToggleDrawMode,
  brushMode,
  onChangeBrushMode,
  brushColor,
  onChangeBrushColor,
  brushSize,
  onChangeBrushSize,
  onClearDrawing,
  onUndoDrawing,
  onSaveDrawingAsLayer,
  onAiEnhanceDrawing,
  hasDrawingContent,
  isAiEnhancing,
}) => {
  const [aiPrompt, setAiPrompt] = useState<string>('Streetwear doodle badge');

  return (
    <div className="space-y-6">
      {/* Activate Drawing Mode Button */}
      <div>
        <button
          onClick={() => onToggleDrawMode(!isDrawModeActive)}
          className={`w-full py-3.5 px-4 rounded-2xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all shadow-lg ${
            isDrawModeActive
              ? 'bg-emerald-600 hover:bg-emerald-500 text-white ring-2 ring-emerald-400 ring-offset-2 ring-offset-zinc-950 shadow-emerald-600/30'
              : 'bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 text-white shadow-indigo-600/30 hover:scale-[1.02]'
          }`}
        >
          <Pencil className="w-4 h-4" />
          <span>{isDrawModeActive ? 'Drawing Canvas Active (Click Garment)' : 'Start Drawing on Garment'}</span>
        </button>
        <p className="text-[10px] text-zinc-400 text-center mt-1.5">
          {isDrawModeActive
            ? 'Click & drag anywhere on the garment canvas to draw freehand doodles, graphics, or signatures!'
            : 'Draw freehand doodles or ask AI to turn your rough sketch into a high-res graphic badge.'}
        </p>
      </div>

      {/* AI Sketch Enhancer & Vectorizer */}
      <div className="p-3.5 bg-gradient-to-br from-indigo-950/60 to-purple-950/60 border border-indigo-800/60 rounded-2xl space-y-2.5">
        <div className="flex items-center gap-1.5 text-xs font-bold text-indigo-300">
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>AI Sketch & Doodle Vectorizer</span>
        </div>
        <p className="text-[11px] text-zinc-400 leading-relaxed">
          Draw a rough doodle on the shirt, or type what you want to draw. Gemini AI will convert it into a polished vector graphic!
        </p>

        <input
          type="text"
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          placeholder="Describe your drawing e.g. Neon Cyber Dragon..."
          className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
        />

        <button
          onClick={() => onAiEnhanceDrawing(aiPrompt)}
          disabled={isAiEnhancing || (!hasDrawingContent && !aiPrompt.trim())}
          className="w-full bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md transition-all"
        >
          {isAiEnhancing ? (
            <>
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
              <span>AI Polishing Your Sketch...</span>
            </>
          ) : (
            <>
              <Wand2 className="w-3.5 h-3.5 text-amber-300" />
              <span>Convert Sketch to AI Graphic Badge</span>
            </>
          )}
        </button>
      </div>

      {/* Brush Type Selector */}
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          Brush Style
        </label>
        <div className="grid grid-cols-2 gap-2">
          {[
            { id: 'pen', label: 'Smooth Pen', desc: 'Crisp solid stroke', icon: Pencil },
            { id: 'spray', label: 'Graffiti Spray', desc: 'Streetwear mist effect', icon: Brush },
            { id: 'neon', label: 'Neon Glow', desc: 'Glowing marker', icon: Sparkles },
            { id: 'eraser', label: 'Eraser', desc: 'Remove strokes', icon: Eraser },
          ].map((b) => {
            const Icon = b.icon;
            const isSelected = brushMode === b.id;
            return (
              <button
                key={b.id}
                onClick={() => onChangeBrushMode(b.id as BrushMode)}
                className={`p-3 rounded-xl border text-left transition-all ${
                  isSelected
                    ? 'bg-indigo-600/20 border-indigo-500 text-white shadow-md'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div className="flex items-center gap-2 mb-1">
                  <Icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-zinc-500'}`} />
                  <span className="text-xs font-semibold">{b.label}</span>
                </div>
                <p className="text-[10px] text-zinc-500">{b.desc}</p>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color Palette & Custom Color Picker */}
      {brushMode !== 'eraser' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Draw Color
            </label>
            <span className="text-xs font-mono text-zinc-300">{brushColor}</span>
          </div>

          <div className="grid grid-cols-6 gap-2">
            {COLOR_PALETTE.map((hex) => {
              const isSelected = brushColor.toLowerCase() === hex.toLowerCase();
              return (
                <button
                  key={hex}
                  onClick={() => onChangeBrushColor(hex)}
                  className={`w-8 h-8 rounded-full border border-zinc-700 transition-transform flex items-center justify-center ${
                    isSelected ? 'scale-125 ring-2 ring-indigo-500 ring-offset-2 ring-offset-zinc-950' : 'hover:scale-110'
                  }`}
                  style={{ backgroundColor: hex }}
                >
                  {isSelected && (
                    <Check className={`w-3.5 h-3.5 ${hex.toLowerCase() > '#888888' ? 'text-black' : 'text-white'}`} />
                  )}
                </button>
              );
            })}
          </div>

          {/* Full Custom Hex Picker */}
          <div className="flex items-center gap-2 pt-1">
            <input
              type="color"
              value={brushColor}
              onChange={(e) => onChangeBrushColor(e.target.value)}
              className="w-8 h-8 rounded-lg bg-transparent border border-zinc-700 cursor-pointer p-0.5"
            />
            <input
              type="text"
              value={brushColor}
              onChange={(e) => onChangeBrushColor(e.target.value)}
              placeholder="#ffffff"
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-xs font-mono text-zinc-200 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>
      )}

      {/* Brush Size Slider */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
            Brush Stroke Size
          </label>
          <span className="text-xs font-mono text-zinc-300">{brushSize}px</span>
        </div>
        <input
          type="range"
          min="2"
          max="40"
          value={brushSize}
          onChange={(e) => onChangeBrushSize(parseInt(e.target.value))}
          className="w-full accent-indigo-500"
        />
      </div>

      {/* Drawing Actions */}
      <div className="pt-3 border-t border-zinc-800/80 flex gap-2">
        <button
          onClick={onUndoDrawing}
          disabled={!hasDrawingContent}
          title="Undo last stroke"
          className="bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 border border-zinc-800 text-zinc-300 px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
        >
          <RotateCcw className="w-3.5 h-3.5" />
          Undo
        </button>

        <button
          onClick={onClearDrawing}
          disabled={!hasDrawingContent}
          className="bg-zinc-900 hover:bg-zinc-800 disabled:opacity-40 border border-zinc-800 text-zinc-300 px-3 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-1 transition-colors"
        >
          <Trash2 className="w-3.5 h-3.5" />
          Clear
        </button>

        <button
          onClick={onSaveDrawingAsLayer}
          disabled={!hasDrawingContent}
          className="flex-1 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md transition-all"
        >
          <Layers className="w-3.5 h-3.5" />
          Stamp on Clothes
        </button>
      </div>
    </div>
  );
};
