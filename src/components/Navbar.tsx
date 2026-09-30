import React from 'react';
import { GarmentConfig, GarmentDesign } from '../types/apparel';
import { Shirt, Eye, Download, ShoppingBag, FolderHeart, Sparkles } from 'lucide-react';

interface NavbarProps {
  garment: GarmentConfig;
  activeTab: 'studio' | 'mockup' | 'gallery' | 'saved';
  onSelectTab: (tab: 'studio' | 'mockup' | 'gallery' | 'saved') => void;
  onOpenTechPack: () => void;
  onOpenCheckout: () => void;
  onSaveDesign: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  garment,
  activeTab,
  onSelectTab,
  onOpenTechPack,
  onOpenCheckout,
  onSaveDesign,
  savedCount,
}) => {
  return (
    <header className="h-16 bg-zinc-950/90 backdrop-blur-xl border-b border-zinc-800/90 px-4 lg:px-8 flex items-center justify-between sticky top-0 z-40">
      {/* Brand Logo */}
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 via-purple-600 to-indigo-600 p-0.5 shadow-lg shadow-indigo-600/30">
          <div className="w-full h-full bg-zinc-950 rounded-[14px] flex items-center justify-center text-indigo-400">
            <Shirt className="w-5 h-5" />
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-base font-black tracking-tight text-white font-sans">
              THREADCRAFT<span className="text-indigo-500">.AI</span>
            </h1>
            <span className="text-[9px] uppercase font-mono tracking-widest bg-indigo-950 text-indigo-300 border border-indigo-800/80 px-2 py-0.5 rounded-full">
              STUDIO
            </span>
          </div>
          <p className="text-[10px] text-zinc-400 hidden sm:block">Custom Apparel Design Lab</p>
        </div>
      </div>

      {/* Main Navigation Tabs */}
      <div className="hidden md:flex items-center bg-zinc-900 p-1 rounded-2xl border border-zinc-800/80">
        <button
          onClick={() => onSelectTab('studio')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'studio'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Shirt className="w-3.5 h-3.5" />
          <span>Design Studio</span>
        </button>

        <button
          onClick={() => onSelectTab('mockup')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'mockup'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>3D Mockup</span>
        </button>

        <button
          onClick={() => onSelectTab('gallery')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'gallery'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Inspiration</span>
        </button>

        <button
          onClick={() => onSelectTab('saved')}
          className={`px-4 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
            activeTab === 'saved'
              ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <FolderHeart className="w-3.5 h-3.5" />
          <span>Saved ({savedCount})</span>
        </button>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2">
        <button
          onClick={onSaveDesign}
          title="Save Design to Library"
          className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold hidden sm:flex items-center gap-1.5 transition-colors"
        >
          <FolderHeart className="w-3.5 h-3.5" />
          <span>Save</span>
        </button>

        <button
          onClick={onOpenTechPack}
          className="bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-indigo-400" />
          <span className="hidden sm:inline">Tech Pack</span>
        </button>

        <button
          onClick={onOpenCheckout}
          className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:opacity-95 text-white px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Order From ${garment.basePrice}</span>
        </button>
      </div>
    </header>
  );
};
