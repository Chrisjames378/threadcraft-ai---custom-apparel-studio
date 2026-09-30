import React, { useState } from 'react';
import { GarmentConfig, GarmentView, CanvasLayer, PrintMethod, DesignCritique, DesignIdea } from '../../types/apparel';
import { Sparkles, Wand2, RefreshCw, CheckCircle2, ShieldCheck, Lightbulb, AlertTriangle, Grid, Trash2 } from 'lucide-react';

interface AiStudioPanelProps {
  garment: GarmentConfig;
  currentView: GarmentView;
  color: string;
  layers: CanvasLayer[];
  printMethod: PrintMethod;
  onAddLayer: (layer: Partial<CanvasLayer>) => void;
  onApplyConcept: (color: string, text: string, fontStyle: string, graphicUrl?: string) => void;
  patternOverlay?: { url: string; scale: number; opacity: number } | null;
  onApplyPatternOverlay: (overlay: { url: string; scale: number; opacity: number } | null) => void;
}

const PRESET_PATTERNS = [
  { name: 'Y2K Cyber Grid', prompt: 'Y2K cyberpunk holographic grid texture with chrome sparkle stars', style: 'Y2K Cyber Grid' },
  { name: 'Japanese Sakura Waves', prompt: 'Japanese ukiyo-e wave pattern with pink cherry blossom sakura petals', style: 'Botanical Floral' },
  { name: 'Streetwear Camo', prompt: 'Urban streetwear camouflage pattern with tactical army green and black shapes', style: 'Streetwear Camo' },
  { name: 'Vintage Meadow Floral', prompt: 'Vintage cottagecore wildflower meadow line art floral texture', style: 'Botanical Floral' },
  { name: 'Retro 80s Memphis', prompt: 'Retro 80s Memphis geometric pattern with squiggles and pastel shapes', style: 'Abstract Geometry' },
];

export const AiStudioPanel: React.FC<AiStudioPanelProps> = ({
  garment,
  currentView,
  color,
  layers,
  printMethod,
  onAddLayer,
  onApplyConcept,
  patternOverlay,
  onApplyPatternOverlay,
}) => {
  const [activeTab, setActiveTab] = useState<'generator' | 'pattern' | 'ideas' | 'critique'>('generator');

  // Graphic Generator State
  const [prompt, setPrompt] = useState<string>('');
  const [style, setStyle] = useState<string>('Streetwear Vector Badge');
  const [palette, setPalette] = useState<string>('Monochrome & Gold');
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [genError, setGenError] = useState<string | null>(null);

  // Pattern Generator State
  const [patternPrompt, setPatternPrompt] = useState<string>('Y2K cyberpunk holographic grid texture with chrome sparkle stars');
  const [patternStyle, setPatternStyle] = useState<string>('Y2K Cyber Grid');
  const [patternScale, setPatternScale] = useState<number>(1.2);
  const [patternOpacity, setPatternOpacity] = useState<number>(0.85);
  const [isPatternGenerating, setIsPatternGenerating] = useState<boolean>(false);
  const [generatedPatternUrl, setGeneratedPatternUrl] = useState<string | null>(patternOverlay?.url || null);
  const [patternError, setPatternError] = useState<string | null>(null);

  // Ideas State
  const [themePrompt, setThemePrompt] = useState<string>('Tokyo Cyberpunk Streetwear');
  const [isIdeasLoading, setIsIdeasLoading] = useState<boolean>(false);
  const [ideas, setIdeas] = useState<DesignIdea[]>([]);

  // Critique State
  const [isCritiqueLoading, setIsCritiqueLoading] = useState<boolean>(false);
  const [critique, setCritique] = useState<DesignCritique | null>(null);

  // Generate Artwork Graphic
  const handleGenerateArtwork = async () => {
    if (!prompt.trim()) return;
    setIsGenerating(true);
    setGenError(null);

    try {
      const res = await fetch('/api/ai/generate-graphic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt, style, colorPalette: palette }),
      });
      const data = await res.json();

      if (data.success && data.imageUrl) {
        onAddLayer({
          type: 'image',
          view: currentView,
          x: 25,
          y: 25,
          width: 160,
          height: 160,
          scale: 1,
          rotation: 0,
          opacity: 1,
          zIndex: Date.now(),
          src: data.imageUrl,
        });
        setPrompt('');
      } else {
        setGenError(data.error || 'Failed to generate graphic.');
      }
    } catch (err: any) {
      console.error(err);
      setGenError('Error connecting to AI service.');
    } finally {
      setIsGenerating(false);
    }
  };

  // Generate Seamless Repeating Pattern
  const handleGeneratePattern = async (overridePrompt?: string) => {
    const textToUse = overridePrompt || patternPrompt;
    if (!textToUse.trim()) return;

    setIsPatternGenerating(true);
    setPatternError(null);

    try {
      const res = await fetch('/api/ai/generate-pattern', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: textToUse, patternStyle }),
      });
      const data = await res.json();

      if (data.success && data.imageUrl) {
        setGeneratedPatternUrl(data.imageUrl);
        onApplyPatternOverlay({
          url: data.imageUrl,
          scale: patternScale,
          opacity: patternOpacity,
        });
      } else {
        setPatternError(data.error || 'Failed to generate seamless pattern tile.');
      }
    } catch (err: any) {
      console.error(err);
      setPatternError('Error connecting to AI pattern service.');
    } finally {
      setIsPatternGenerating(false);
    }
  };

  // Generate Concept Ideas
  const handleFetchIdeas = async () => {
    setIsIdeasLoading(true);
    try {
      const res = await fetch('/api/ai/generate-ideas', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ theme: themePrompt, garmentType: garment.name }),
      });
      const data = await res.json();
      if (data.success && Array.isArray(data.ideas)) {
        setIdeas(data.ideas);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsIdeasLoading(false);
    }
  };

  // Run Design Critique
  const handleRunCritique = async () => {
    setIsCritiqueLoading(true);
    try {
      const res = await fetch('/api/ai/critique-design', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          garmentType: garment.name,
          color,
          layers,
          printMethod,
        }),
      });
      const data = await res.json();
      if (data.success && data.data) {
        setCritique(data.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsCritiqueLoading(false);
    }
  };

  return (
    <div className="space-y-5">
      {/* Tab Switcher */}
      <div className="flex bg-zinc-900 p-1 rounded-xl border border-zinc-800 gap-0.5">
        <button
          onClick={() => setActiveTab('generator')}
          className={`flex-1 py-1.5 px-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'generator'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Wand2 className="w-3.5 h-3.5" />
          <span>Badge</span>
        </button>

        <button
          onClick={() => setActiveTab('pattern')}
          className={`flex-1 py-1.5 px-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'pattern'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Grid className="w-3.5 h-3.5" />
          <span>Pattern</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('ideas');
            if (ideas.length === 0) handleFetchIdeas();
          }}
          className={`flex-1 py-1.5 px-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'ideas'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <Lightbulb className="w-3.5 h-3.5" />
          <span>Ideas</span>
        </button>

        <button
          onClick={() => {
            setActiveTab('critique');
            if (!critique) handleRunCritique();
          }}
          className={`flex-1 py-1.5 px-1.5 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1 transition-all ${
            activeTab === 'critique'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Critic</span>
        </button>
      </div>

      {/* TAB 1: AI Prompt Badge Generator */}
      {activeTab === 'generator' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Describe Your Graphic Badge
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g. Majestic golden dragon wrapped around a futuristic chrome star badge, minimalist line art style..."
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Artistic Style
              </label>
              <select
                value={style}
                onChange={(e) => setStyle(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
              >
                <option value="Streetwear Vector Badge">Streetwear Vector Badge</option>
                <option value="Y2K Cyber Emblem">Y2K Cyber Emblem</option>
                <option value="Minimalist Line Art">Minimalist Line Art</option>
                <option value="Vintage Retro Stamp">Vintage Retro Stamp</option>
                <option value="Heavy Metal Gothic Crest">Heavy Metal Gothic Crest</option>
                <option value="Anime Mascot Sticker">Anime Mascot Sticker</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Color Scheme
              </label>
              <select
                value={palette}
                onChange={(e) => setPalette(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
              >
                <option value="Monochrome & Gold">Monochrome & Gold</option>
                <option value="Neon Cyberpunk">Neon Cyberpunk</option>
                <option value="Vintage Pastel Earthy">Vintage Pastel Earthy</option>
                <option value="Acid Wash Wash Gradient">Acid Wash Gradient</option>
                <option value="Black & Crimson Red">Black & Crimson Red</option>
              </select>
            </div>
          </div>

          {genError && (
            <div className="p-2.5 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{genError}</span>
            </div>
          )}

          <button
            onClick={handleGenerateArtwork}
            disabled={isGenerating || !prompt.trim()}
            className="w-full bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
          >
            {isGenerating ? (
              <>
                <RefreshCw className="w-4 h-4 animate-spin text-white" />
                <span>Generating High-Res Artwork...</span>
              </>
            ) : (
              <>
                <Wand2 className="w-4 h-4" />
                <span>Generate & Stamp Artwork onto Canvas</span>
              </>
            )}
          </button>
        </div>
      )}

      {/* TAB 2: AI Seamless Repeating Pattern Tool */}
      {activeTab === 'pattern' && (
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider mb-2">
              Describe Seamless Textile Pattern
            </label>
            <textarea
              value={patternPrompt}
              onChange={(e) => setPatternPrompt(e.target.value)}
              placeholder="e.g. Japanese wave pattern with pink sakura petals, or Y2K holographic cyber grid..."
              rows={3}
              className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs text-white focus:outline-none focus:border-indigo-500 resize-none"
            />
          </div>

          {/* Quick Pattern Presets */}
          <div>
            <span className="text-[11px] text-zinc-400 font-semibold mb-1.5 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              Popular Textile Pattern Ideas
            </span>
            <div className="flex flex-wrap gap-1.5">
              {PRESET_PATTERNS.map((p) => (
                <button
                  key={p.name}
                  onClick={() => {
                    setPatternPrompt(p.prompt);
                    setPatternStyle(p.style);
                    handleGeneratePattern(p.prompt);
                  }}
                  className="bg-zinc-900 hover:bg-indigo-600 hover:text-white border border-zinc-800 text-zinc-300 px-2.5 py-1 rounded-lg text-xs font-mono transition-all"
                >
                  + {p.name}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Pattern Style
              </label>
              <select
                value={patternStyle}
                onChange={(e) => setPatternStyle(e.target.value)}
                className="w-full bg-zinc-900 border border-zinc-800 rounded-lg p-2 text-xs text-zinc-200 focus:outline-none"
              >
                <option value="Y2K Cyber Grid">Y2K Cyber Grid</option>
                <option value="Streetwear Camo">Streetwear Camo</option>
                <option value="Botanical Floral">Botanical Floral</option>
                <option value="Abstract Geometry">Abstract Geometry</option>
                <option value="Minimalist Line Art">Minimalist Line Art</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-zinc-400 mb-1">
                Tile Scale ({patternScale.toFixed(1)}x)
              </label>
              <input
                type="range"
                min="0.5"
                max="3"
                step="0.1"
                value={patternScale}
                onChange={(e) => {
                  const val = parseFloat(e.target.value);
                  setPatternScale(val);
                  if (patternOverlay && patternOverlay.url) {
                    onApplyPatternOverlay({
                      ...patternOverlay,
                      scale: val,
                    });
                  }
                }}
                className="w-full accent-indigo-500 mt-2"
              />
            </div>
          </div>

          {/* Opacity Slider */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-semibold text-zinc-400 mb-1">
              <span>Pattern Blend Opacity</span>
              <span className="font-mono text-zinc-200">{Math.round(patternOpacity * 100)}%</span>
            </div>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.05"
              value={patternOpacity}
              onChange={(e) => {
                const val = parseFloat(e.target.value);
                setPatternOpacity(val);
                if (patternOverlay && patternOverlay.url) {
                  onApplyPatternOverlay({
                    ...patternOverlay,
                    opacity: val,
                  });
                }
              }}
              className="w-full accent-indigo-500"
            />
          </div>

          {patternError && (
            <div className="p-2.5 bg-red-950/60 border border-red-800/80 rounded-xl text-red-300 text-xs flex items-start gap-2">
              <AlertTriangle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <span>{patternError}</span>
            </div>
          )}

          <div className="flex gap-2">
            <button
              onClick={() => handleGeneratePattern()}
              disabled={isPatternGenerating || !patternPrompt.trim()}
              className="flex-1 bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 hover:opacity-95 disabled:opacity-50 text-white font-semibold py-3 rounded-xl text-xs flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/25 transition-all"
            >
              {isPatternGenerating ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin text-white" />
                  <span>Generating Pattern Tile...</span>
                </>
              ) : (
                <>
                  <Grid className="w-4 h-4" />
                  <span>Generate Seamless Pattern</span>
                </>
              )}
            </button>

            {patternOverlay && (
              <button
                onClick={() => {
                  setGeneratedPatternUrl(null);
                  onApplyPatternOverlay(null);
                }}
                title="Remove Pattern Overlay"
                className="bg-red-950/80 hover:bg-red-900 border border-red-800 text-red-200 px-3.5 py-3 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span>Remove</span>
              </button>
            )}
          </div>

          {/* Active Pattern Tile Preview */}
          {generatedPatternUrl && (
            <div className="p-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl flex items-center gap-3">
              <img
                src={generatedPatternUrl}
                alt="Seamless Pattern Tile"
                className="w-14 h-14 rounded-xl object-cover border border-indigo-500/50 shadow-md"
              />
              <div className="flex-1 text-xs">
                <span className="font-bold text-white block">Tiled Pattern Applied!</span>
                <span className="text-[11px] text-zinc-400">Repeats seamlessly across all clothing surfaces.</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 3: AI Concept Ideas */}
      {activeTab === 'ideas' && (
        <div className="space-y-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={themePrompt}
              onChange={(e) => setThemePrompt(e.target.value)}
              placeholder="Enter theme e.g. Vintage Botanical..."
              className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-indigo-500"
            />
            <button
              onClick={handleFetchIdeas}
              disabled={isIdeasLoading}
              className="bg-indigo-600 hover:bg-indigo-500 text-white px-3 py-2 rounded-xl text-xs font-semibold flex items-center gap-1 shadow-md"
            >
              {isIdeasLoading ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />}
              Generate
            </button>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1 custom-scrollbar">
            {ideas.map((idea, idx) => (
              <div
                key={idx}
                className="p-3 bg-zinc-900/80 border border-zinc-800/80 rounded-xl hover:border-indigo-500/50 transition-all space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-white">{idea.title}</span>
                  <span className="text-[10px] uppercase tracking-wider font-mono bg-indigo-950 text-indigo-300 px-2 py-0.5 rounded border border-indigo-800/50">
                    {idea.styleCategory}
                  </span>
                </div>
                <p className="text-[11px] text-zinc-400">{idea.description}</p>
                <div className="flex items-center justify-between pt-2 border-t border-zinc-800/50">
                  <span className="text-[10px] font-mono text-zinc-400">"{idea.badgeText}"</span>
                  <button
                    onClick={() => onApplyConcept(idea.garmentColor, idea.badgeText, idea.fontStyle)}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white px-2.5 py-1 rounded-lg text-[10px] font-semibold"
                  >
                    Apply Concept
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: AI Design Critic */}
      {activeTab === 'critique' && (
        <div className="space-y-4">
          <button
            onClick={handleRunCritique}
            disabled={isCritiqueLoading}
            className="w-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-200 font-semibold py-2 rounded-xl text-xs flex items-center justify-center gap-2 transition-all"
          >
            {isCritiqueLoading ? (
              <RefreshCw className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400" />
            )}
            <span>Re-evaluate Print Viability</span>
          </button>

          {critique ? (
            <div className="space-y-3 bg-zinc-900/90 border border-zinc-800 rounded-2xl p-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-800">
                <div>
                  <span className="text-zinc-400 text-[10px] uppercase font-mono block">Design Score</span>
                  <span className="text-2xl font-black text-indigo-400">{critique.overallScore} / 100</span>
                </div>
                <div className="text-right">
                  <span className="text-zinc-400 text-[10px] uppercase font-mono block">Production Status</span>
                  <span className="font-semibold text-emerald-400">{critique.productionRating}</span>
                </div>
              </div>

              <div>
                <span className="font-semibold text-zinc-300 block mb-1">Color Contrast & Legibility</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">{critique.contrastCheck}</p>
              </div>

              <div>
                <span className="font-semibold text-zinc-300 block mb-1">Print Technique Evaluation</span>
                <p className="text-zinc-400 text-[11px] leading-relaxed">{critique.printMethodFit}</p>
              </div>

              <div>
                <span className="font-semibold text-zinc-300 block mb-1">Styling Advice</span>
                <ul className="space-y-1 text-[11px] text-zinc-400">
                  {critique.stylingTips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-400 shrink-0 mt-0.5" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ) : (
            <div className="p-6 text-center text-zinc-500 text-xs">
              Click the button above to run Gemini AI analysis on your apparel design.
            </div>
          )}
        </div>
      )}
    </div>
  );
};
