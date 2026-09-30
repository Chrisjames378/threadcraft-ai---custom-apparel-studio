import React, { useState, useRef } from 'react';
import { GarmentConfig, CanvasLayer, PrintMethod } from '../types/apparel';
import { GarmentVector } from './GarmentVector';
import { Download, Camera, Sparkles, User, Sun, Building2, Trees } from 'lucide-react';

interface Mockup3DPreviewProps {
  garment: GarmentConfig;
  color: string;
  accentColor: string;
  layers: CanvasLayer[];
  printMethod: PrintMethod;
  onBackToStudio: () => void;
  patternOverlay?: { url: string; scale: number; opacity: number } | null;
  textureOverlay?: { id: string; opacity: number } | null;
}

const ENVIRONMENTS = [
  { id: 'studio', name: 'Clean Minimal Studio', icon: Sun, bg: 'from-zinc-900 via-zinc-950 to-zinc-900' },
  { id: 'urban', name: 'Urban Streetwear Alley', icon: Building2, bg: 'from-slate-900 via-zinc-900 to-indigo-950' },
  { id: 'nature', name: 'Botanical Park Lawn', icon: Trees, bg: 'from-emerald-950 via-zinc-950 to-teal-950' },
];

export const Mockup3DPreview: React.FC<Mockup3DPreviewProps> = ({
  garment,
  color,
  accentColor,
  layers,
  printMethod,
  onBackToStudio,
  patternOverlay = null,
  textureOverlay = null,
}) => {
  const [view, setView] = useState<'front' | 'back'>('front');
  const [modelType, setModelType] = useState<'unisex' | 'male' | 'female' | 'hanger'>('unisex');
  const [environment, setEnvironment] = useState<string>('studio');
  const previewRef = useRef<HTMLDivElement>(null);

  const viewLayers = layers.filter((l) => l.view === view);
  const activeBoundary = garment.printBoundaries[view];

  const currentEnv = ENVIRONMENTS.find((e) => e.id === environment) || ENVIRONMENTS[0];

  const handleDownloadSnapshot = () => {
    alert('Generating High-Res Mockup Snapshot PNG...');
  };

  return (
    <div className="flex-1 bg-zinc-950 p-4 lg:p-8 flex flex-col items-center justify-center min-h-[calc(100vh-4rem)]">
      {/* Top Options Bar */}
      <div className="w-full max-w-4xl flex flex-wrap items-center justify-between gap-4 mb-6 bg-zinc-900/90 backdrop-blur-xl p-3 px-5 rounded-2xl border border-zinc-800 shadow-xl">
        {/* View Switcher */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setView('front')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              view === 'front' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Front Angle
          </button>
          <button
            onClick={() => setView('back')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all ${
              view === 'back' ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Back Angle
          </button>
        </div>

        {/* Environment Backdrops */}
        <div className="flex items-center gap-1.5 bg-zinc-950/60 p-1 rounded-xl border border-zinc-800">
          {ENVIRONMENTS.map((e) => {
            const Icon = e.icon;
            const isSelected = e.id === environment;
            return (
              <button
                key={e.id}
                onClick={() => setEnvironment(e.id)}
                className={`p-2 rounded-lg text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isSelected ? 'bg-indigo-600 text-white shadow-md' : 'text-zinc-400 hover:text-white'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">{e.name}</span>
              </button>
            );
          })}
        </div>

        {/* Export Photo */}
        <button
          onClick={handleDownloadSnapshot}
          className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
        >
          <Camera className="w-4 h-4" />
          <span>Capture Mockup</span>
        </button>
      </div>

      {/* Main 3D Model Display Stage */}
      <div
        ref={previewRef}
        className={`relative w-full max-w-2xl h-[560px] rounded-3xl border border-zinc-800/80 shadow-2xl flex items-center justify-center overflow-hidden bg-gradient-to-b ${currentEnv.bg} transition-all duration-500`}
      >
        {/* Studio Lighting Spotlight Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.15),transparent_60%)] pointer-events-none" />

        {/* Mannequin / Model Silhouette Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
          <User className="w-96 h-96 text-white" />
        </div>

        {/* Garment Renderer */}
        <div className="relative w-[440px] h-[480px]">
          <GarmentVector
            type={garment.id}
            view={view}
            color={color}
            accentColor={accentColor}
            patternOverlay={patternOverlay}
            textureOverlay={textureOverlay}
            className="w-full h-full drop-shadow-[0_20px_50px_rgba(0,0,0,0.8)]"
          />

          {/* Render Active Layers */}
          {activeBoundary && (
            <div
              className="absolute pointer-events-none"
              style={{
                left: `${activeBoundary.x}%`,
                top: `${activeBoundary.y}%`,
                width: `${activeBoundary.width}%`,
                height: `${activeBoundary.height}%`,
              }}
            >
              {viewLayers.map((layer) => (
                <div
                  key={layer.id}
                  className="absolute"
                  style={{
                    left: `${layer.x}%`,
                    top: `${layer.y}%`,
                    transform: `rotate(${layer.rotation}deg) scale(${layer.scale}) scaleX(${
                      layer.flipX ? -1 : 1
                    }) scaleY(${layer.flipY ? -1 : 1})`,
                    opacity: layer.opacity,
                    zIndex: layer.zIndex,
                  }}
                >
                  {layer.type === 'text' && (
                    <span
                      className="whitespace-nowrap font-bold select-none leading-none inline-block drop-shadow-lg"
                      style={{
                        color: layer.color || '#ffffff',
                        fontFamily: layer.fontFamily || 'sans-serif',
                        fontSize: `${layer.fontSize || 32}px`,
                        letterSpacing: `${layer.letterSpacing || 0}px`,
                      }}
                    >
                      {layer.text}
                    </span>
                  )}

                  {layer.type === 'preset' && layer.src && (
                    <div
                      className="w-24 h-24 text-white drop-shadow-xl"
                      style={{ color: layer.color || '#ffffff' }}
                      dangerouslySetInnerHTML={{ __html: layer.src }}
                    />
                  )}

                  {layer.type === 'image' && layer.src && (
                    <img
                      src={layer.src}
                      alt="Graphic layer"
                      className="max-w-[180px] max-h-[180px] object-contain drop-shadow-2xl"
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
