import React, { useState } from 'react';
import { FONT_OPTIONS } from '../../constants/fonts';
import { CanvasLayer, GarmentView } from '../../types/apparel';
import { Type, Plus, Sparkles, CheckCircle } from 'lucide-react';

interface TextEditorProps {
  currentView: GarmentView;
  selectedLayer: CanvasLayer | null;
  onAddLayer: (layer: Partial<CanvasLayer>) => void;
  onUpdateLayer: (id: string, updates: Partial<CanvasLayer>) => void;
}

const PRESET_TEXT_PHRASES = [
  'SAINT ATELIER',
  'ARCHIVE 2026',
  'CYBERNETIC',
  'TOKYO NIGHTS',
  'ESSENTIALS',
  'HEAVYWEIGHT',
  'FUTURE NOW',
  'NEON SOCIETY',
  'SKATE OR DIE',
  'LIMITED EDITION',
];

export const TextEditor: React.FC<TextEditorProps> = ({
  currentView,
  selectedLayer,
  onAddLayer,
  onUpdateLayer,
}) => {
  const [inputText, setInputText] = useState<string>('THREADCRAFT');
  const [selectedFont, setSelectedFont] = useState<string>(FONT_OPTIONS[0].family);
  const [textColor, setTextColor] = useState<string>('#ffffff');
  const [fontSize, setFontSize] = useState<number>(36);
  const [letterSpacing, setLetterSpacing] = useState<number>(2);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showNotification = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleAddText = (customText?: string) => {
    const textToAdd = customText || inputText;
    if (!textToAdd.trim()) return;

    onAddLayer({
      type: 'text',
      view: currentView,
      x: 30,
      y: 40,
      width: 200,
      height: 60,
      scale: 1,
      rotation: 0,
      opacity: 1,
      zIndex: Date.now(),
      text: textToAdd,
      fontFamily: selectedFont,
      color: textColor,
      fontSize: fontSize,
      letterSpacing: letterSpacing,
    });
    showNotification(`Stamped "${textToAdd}" onto ${currentView} view!`);
  };

  const isTextSelected = selectedLayer && selectedLayer.type === 'text';

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="bg-emerald-600/90 text-white font-bold text-xs p-2.5 rounded-xl border border-emerald-400 flex items-center justify-center gap-2 shadow-lg animate-in slide-in-from-top-2">
          <CheckCircle className="w-4 h-4 text-emerald-200" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Create New Typography */}
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          Add Custom Typography
        </label>

        <div className="flex gap-2 mb-3">
          <input
            type="text"
            value={inputText}
            onChange={(e) => {
              setInputText(e.target.value);
              if (isTextSelected) {
                onUpdateLayer(selectedLayer.id, { text: e.target.value });
              }
            }}
            placeholder="Enter custom slogan..."
            className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3.5 py-2.5 text-sm font-semibold text-white focus:outline-none focus:border-indigo-500"
          />
          <button
            onClick={() => handleAddText()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
          >
            <Plus className="w-4 h-4" />
            Put on Clothes
          </button>
        </div>

        {/* Preset Streetwear Phrases */}
        <div>
          <span className="text-[11px] text-zinc-400 flex items-center gap-1 mb-2 font-semibold">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Click Any Slogan to Instantly Put on Clothes:
          </span>
          <div className="flex flex-wrap gap-1.5">
            {PRESET_TEXT_PHRASES.map((phrase) => (
              <button
                key={phrase}
                onClick={() => handleAddText(phrase)}
                className="bg-zinc-900/90 hover:bg-indigo-600 hover:text-white border border-zinc-800 text-zinc-200 px-3 py-1.5 rounded-xl text-xs font-mono transition-all hover:scale-105 shadow-md flex items-center gap-1"
              >
                <span>+</span>
                <span>{phrase}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Font Style Selection */}
      <div>
        <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
          Font Style & Typeface
        </label>

        <div className="grid grid-cols-1 gap-2 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
          {FONT_OPTIONS.map((font) => {
            const isSelected = selectedFont === font.family;
            return (
              <button
                key={font.id}
                onClick={() => {
                  setSelectedFont(font.family);
                  if (isTextSelected) {
                    onUpdateLayer(selectedLayer.id, { fontFamily: font.family });
                  }
                }}
                className={`p-3 rounded-xl border text-left transition-all flex items-center justify-between ${
                  isSelected
                    ? 'bg-indigo-600/15 border-indigo-500 text-white shadow-md'
                    : 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:border-zinc-700 hover:text-zinc-200'
                }`}
              >
                <div>
                  <span className="text-[10px] uppercase font-mono text-indigo-400 block mb-0.5">
                    {font.category}
                  </span>
                  <span className="text-base font-bold" style={{ fontFamily: font.family }}>
                    {font.sampleText}
                  </span>
                </div>
                <span className="text-xs text-zinc-400 font-sans">{font.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Color, Size & Letter Spacing Controls */}
      <div className="space-y-4 pt-4 border-t border-zinc-800/80">
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Text Color
            </label>
            <span className="text-xs font-mono text-zinc-300">{textColor}</span>
          </div>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={textColor}
              onChange={(e) => {
                setTextColor(e.target.value);
                if (isTextSelected) {
                  onUpdateLayer(selectedLayer.id, { color: e.target.value });
                }
              }}
              className="w-8 h-8 rounded-lg bg-transparent border border-zinc-700 cursor-pointer p-0.5"
            />
            {['#ffffff', '#000000', '#f43f5e', '#3b82f6', '#10b981', '#f59e0b', '#8b5cf6'].map((hex) => (
              <button
                key={hex}
                onClick={() => {
                  setTextColor(hex);
                  if (isTextSelected) {
                    onUpdateLayer(selectedLayer.id, { color: hex });
                  }
                }}
                className="w-6 h-6 rounded-full border border-zinc-700 hover:scale-110 transition-transform"
                style={{ backgroundColor: hex }}
              />
            ))}
          </div>
        </div>

        {/* Font Size Slider */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Font Size
            </label>
            <span className="text-xs font-mono text-zinc-300">{fontSize}px</span>
          </div>
          <input
            type="range"
            min="16"
            max="80"
            value={fontSize}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setFontSize(val);
              if (isTextSelected) {
                onUpdateLayer(selectedLayer.id, { fontSize: val });
              }
            }}
            className="w-full accent-indigo-500"
          />
        </div>

        {/* Letter Spacing Slider */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider">
              Letter Spacing
            </label>
            <span className="text-xs font-mono text-zinc-300">{letterSpacing}px</span>
          </div>
          <input
            type="range"
            min="0"
            max="12"
            value={letterSpacing}
            onChange={(e) => {
              const val = parseInt(e.target.value);
              setLetterSpacing(val);
              if (isTextSelected) {
                onUpdateLayer(selectedLayer.id, { letterSpacing: val });
              }
            }}
            className="w-full accent-indigo-500"
          />
        </div>
      </div>
    </div>
  );
};
