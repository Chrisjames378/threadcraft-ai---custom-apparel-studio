import React, { useState, useEffect, useRef } from 'react';
import { GARMENTS } from './constants/garments';
import { GarmentType, GarmentView, FabricType, PrintMethod, CanvasLayer, GarmentDesign } from './types/apparel';
import { Navbar } from './components/Navbar';
import { CanvasArea } from './components/CanvasArea';
import { GarmentPicker } from './components/Toolbar/GarmentPicker';
import { TextEditor } from './components/Toolbar/TextEditor';
import { GraphicLibrary } from './components/Toolbar/GraphicLibrary';
import { DrawingTool, BrushMode } from './components/Toolbar/DrawingTool';
import { AiStudioPanel } from './components/Toolbar/AiStudioPanel';
import { LayerManager } from './components/Toolbar/LayerManager';
import { PrintMethodPicker } from './components/Toolbar/PrintMethodPicker';
import { Mockup3DPreview } from './components/Mockup3DPreview';
import { TechPackModal } from './components/TechPackModal';
import { OrderSummaryModal } from './components/OrderSummaryModal';
import { InspirationGallery } from './components/InspirationGallery';
import { SavedDesignsModal } from './components/SavedDesignsModal';
import { GeminiChatbot } from './components/GeminiChatbot';
import { Shirt, Type, Image as ImageIcon, Sparkles, Layers, Printer, Wand2, Pencil } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'studio' | 'mockup' | 'gallery' | 'saved'>('studio');
  const [activeToolbar, setActiveToolbar] = useState<'garment' | 'text' | 'graphics' | 'draw' | 'ai' | 'layers' | 'print'>('garment');

  // Garment Config State
  const [selectedGarmentType, setSelectedGarmentType] = useState<GarmentType>('tshirt');
  const [currentView, setCurrentView] = useState<GarmentView>('front');
  const [baseColor, setBaseColor] = useState<string>('#121214');
  const [accentColor, setAccentColor] = useState<string>('#18181b');
  const [selectedFabric, setSelectedFabric] = useState<FabricType>('cotton-100');
  const [selectedPrintMethod, setSelectedPrintMethod] = useState<PrintMethod>('dtg');

  // Drawing Freehand Canvas State
  const drawCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const strokeHistoryRef = useRef<ImageData[]>([]);
  const [isDrawModeActive, setIsDrawModeActive] = useState<boolean>(false);
  const [brushMode, setBrushMode] = useState<BrushMode>('pen');
  const [brushColor, setBrushColor] = useState<string>('#ffffff');
  const [brushSize, setBrushSize] = useState<number>(6);
  const [hasDrawingContent, setHasDrawingContent] = useState<boolean>(false);
  const [isAiEnhancing, setIsAiEnhancing] = useState<boolean>(false);

  // Seamless Tiled Pattern Overlay & Fabric Texture State
  const [patternOverlay, setPatternOverlay] = useState<{ url: string; scale: number; opacity: number } | null>(null);
  const [textureOverlay, setTextureOverlay] = useState<{ id: string; opacity: number } | null>(null);

  // Canvas Layers State
  const [layers, setLayers] = useState<CanvasLayer[]>([
    {
      id: 'default-text-1',
      type: 'text',
      view: 'front',
      x: 28,
      y: 35,
      width: 200,
      height: 60,
      scale: 1,
      rotation: 0,
      opacity: 1,
      zIndex: 1,
      text: 'THREADCRAFT',
      fontFamily: "'Bebas Neue', sans-serif",
      color: '#ffffff',
      fontSize: 42,
      letterSpacing: 2,
    },
  ]);
  const [selectedLayerId, setSelectedLayerId] = useState<string | null>('default-text-1');

  // Modals State
  const [isTechPackOpen, setIsTechPackOpen] = useState<boolean>(false);
  const [isCheckoutOpen, setIsCheckoutOpen] = useState<boolean>(false);

  // Saved Designs State
  const [savedDesigns, setSavedDesigns] = useState<GarmentDesign[]>(() => {
    try {
      const saved = localStorage.getItem('threadcraft_saved_designs');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('threadcraft_saved_designs', JSON.stringify(savedDesigns));
    } catch (e) {
      console.error(e);
    }
  }, [savedDesigns]);

  const currentGarment = GARMENTS[selectedGarmentType];

  // Drawing Actions
  const handleClearDrawing = () => {
    const canvas = drawCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        setHasDrawingContent(false);
        strokeHistoryRef.current = [];
      }
    }
  };

  const handleUndoDrawing = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas || strokeHistoryRef.current.length === 0) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const previousState = strokeHistoryRef.current.pop();
    if (previousState) {
      ctx.putImageData(previousState, 0, 0);
    } else {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      setHasDrawingContent(false);
    }
  };

  const handleSaveDrawingAsLayer = () => {
    const canvas = drawCanvasRef.current;
    if (!canvas) return;

    const dataUrl = canvas.toDataURL('image/png');
    handleAddLayer({
      type: 'drawing',
      view: currentView,
      x: 20,
      y: 20,
      width: 180,
      height: 180,
      scale: 1,
      rotation: 0,
      opacity: 1,
      zIndex: Date.now(),
      src: dataUrl,
    });

    handleClearDrawing();
    setIsDrawModeActive(false);
  };

  const handleAiEnhanceDrawing = async (promptText: string) => {
    setIsAiEnhancing(true);
    try {
      const res = await fetch('/api/ai/generate-graphic', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt: promptText || 'Streetwear graphic doodle badge artwork',
          style: 'Streetwear Vector Badge',
          colorPalette: 'Vibrant Neon',
        }),
      });
      const data = await res.json();
      if (data.success && data.imageUrl) {
        handleAddLayer({
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
        handleClearDrawing();
        setIsDrawModeActive(false);
      } else {
        alert('Failed to generate AI artwork. Please try another prompt.');
      }
    } catch (e) {
      console.error(e);
      alert('Error connecting to AI service.');
    } finally {
      setIsAiEnhancing(false);
    }
  };

  // Layer Actions
  const handleAddLayer = (newLayer: Partial<CanvasLayer>) => {
    const createdLayer: CanvasLayer = {
      id: `layer-${Date.now()}`,
      type: newLayer.type || 'text',
      view: newLayer.view || currentView,
      x: newLayer.x ?? 30,
      y: newLayer.y ?? 30,
      width: newLayer.width || 120,
      height: newLayer.height || 120,
      scale: newLayer.scale ?? 1,
      rotation: newLayer.rotation ?? 0,
      opacity: newLayer.opacity ?? 1,
      zIndex: Date.now(),
      text: newLayer.text,
      fontFamily: newLayer.fontFamily,
      color: newLayer.color,
      fontSize: newLayer.fontSize,
      letterSpacing: newLayer.letterSpacing,
      src: newLayer.src,
      flipX: newLayer.flipX || false,
      flipY: newLayer.flipY || false,
    };

    setLayers((prev) => [...prev, createdLayer]);
    setSelectedLayerId(createdLayer.id);
  };

  const handleUpdateLayer = (id: string, updates: Partial<CanvasLayer>) => {
    setLayers((prev) => prev.map((l) => (l.id === id ? { ...l, ...updates } : l)));
  };

  const handleDeleteLayer = (id: string) => {
    setLayers((prev) => prev.filter((l) => l.id !== id));
    if (selectedLayerId === id) setSelectedLayerId(null);
  };

  const handleDuplicateLayer = (id: string) => {
    const layer = layers.find((l) => l.id === id);
    if (!layer) return;

    const dup: CanvasLayer = {
      ...layer,
      id: `layer-${Date.now()}`,
      x: Math.min(80, layer.x + 5),
      y: Math.min(80, layer.y + 5),
      zIndex: Date.now(),
    };

    setLayers((prev) => [...prev, dup]);
    setSelectedLayerId(dup.id);
  };

  const handleReorderLayer = (id: string, direction: 'up' | 'down') => {
    setLayers((prev) => {
      const idx = prev.findIndex((l) => l.id === id);
      if (idx === -1) return prev;
      const targetIdx = direction === 'up' ? idx + 1 : idx - 1;
      if (targetIdx < 0 || targetIdx >= prev.length) return prev;

      const newLayers = [...prev];
      const tempZ = newLayers[idx].zIndex;
      newLayers[idx].zIndex = newLayers[targetIdx].zIndex;
      newLayers[targetIdx].zIndex = tempZ;

      return newLayers;
    });
  };

  // Concept Application
  const handleApplyConcept = (
    color: string,
    text: string,
    fontStyle: string,
    graphicUrl?: string
  ) => {
    setBaseColor(color);

    const textLayer: CanvasLayer = {
      id: `layer-${Date.now()}`,
      type: 'text',
      view: 'front',
      x: 25,
      y: 25,
      width: 200,
      height: 60,
      scale: 1,
      rotation: 0,
      opacity: 1,
      zIndex: Date.now(),
      text,
      fontFamily: fontStyle || "'Bebas Neue', sans-serif",
      color: '#ffffff',
      fontSize: 38,
      letterSpacing: 2,
    };

    setLayers([textLayer]);
    setSelectedLayerId(textLayer.id);
    setActiveTab('studio');
  };

  // Save Design
  const handleSaveCurrentDesign = () => {
    const newDesign: GarmentDesign = {
      id: `design-${Date.now()}`,
      name: `${currentGarment.name} Custom`,
      garmentType: selectedGarmentType,
      baseColor,
      accentColor,
      fabric: selectedFabric,
      printMethod: selectedPrintMethod,
      layers: [...layers],
      createdAt: Date.now(),
      size: 'L',
      quantity: 1,
    };

    setSavedDesigns((prev) => [newDesign, ...prev]);
    alert('Design saved to your library!');
  };

  const handleLoadDesign = (design: GarmentDesign) => {
    setSelectedGarmentType(design.garmentType);
    setBaseColor(design.baseColor);
    setAccentColor(design.accentColor || '#18181b');
    setSelectedFabric(design.fabric);
    setSelectedPrintMethod(design.printMethod);
    setLayers(design.layers);
    setActiveTab('studio');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Navigation Bar */}
      <Navbar
        garment={currentGarment}
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        onOpenTechPack={() => setIsTechPackOpen(true)}
        onOpenCheckout={() => setIsCheckoutOpen(true)}
        onSaveDesign={handleSaveCurrentDesign}
        savedCount={savedDesigns.length}
      />

      {/* Main Studio View */}
      {activeTab === 'studio' && (
        <main className="flex-1 flex flex-col lg:flex-row overflow-hidden">
          {/* Left Studio Sidebar Controls */}
          <aside className="w-full lg:w-96 bg-zinc-950 border-r border-zinc-800/80 flex flex-col shrink-0">
            {/* Tool Category Selector Bar */}
            <div className="flex bg-zinc-900/90 p-1.5 border-b border-zinc-800/80 gap-1 overflow-x-auto custom-scrollbar">
              {[
                { id: 'garment', label: 'Cut & Color', icon: Shirt },
                { id: 'text', label: 'Text', icon: Type },
                { id: 'graphics', label: 'Graphics', icon: ImageIcon },
                { id: 'draw', label: 'Draw & Paint', icon: Pencil },
                { id: 'ai', label: 'AI Studio', icon: Wand2 },
                { id: 'layers', label: `Layers (${layers.filter((l) => l.view === currentView).length})`, icon: Layers },
                { id: 'print', label: 'Print Method', icon: Printer },
              ].map((tool) => {
                const Icon = tool.icon;
                const isSelected = activeToolbar === tool.id;

                return (
                  <button
                    key={tool.id}
                    onClick={() => {
                      setActiveToolbar(tool.id as any);
                      if (tool.id === 'draw') {
                        setIsDrawModeActive(true);
                      } else {
                        setIsDrawModeActive(false);
                      }
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-semibold flex items-center gap-1.5 shrink-0 transition-all ${
                      isSelected
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                        : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tool.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Selected Tool Panel Container */}
            <div className="p-5 flex-1 overflow-y-auto max-h-[calc(100vh-8.5rem)] custom-scrollbar">
              {activeToolbar === 'garment' && (
                <GarmentPicker
                  selectedType={selectedGarmentType}
                  onSelectType={(type) => {
                    setSelectedGarmentType(type);
                    setBaseColor(GARMENTS[type].defaultColor);
                  }}
                  selectedColor={baseColor}
                  onSelectColor={setBaseColor}
                  selectedAccentColor={accentColor}
                  onSelectAccentColor={setAccentColor}
                  selectedFabric={selectedFabric}
                  onSelectFabric={setSelectedFabric}
                  textureOverlay={textureOverlay}
                  onSelectTextureOverlay={setTextureOverlay}
                />
              )}

              {activeToolbar === 'text' && (
                <TextEditor
                  currentView={currentView}
                  selectedLayer={layers.find((l) => l.id === selectedLayerId) || null}
                  onAddLayer={handleAddLayer}
                  onUpdateLayer={handleUpdateLayer}
                />
              )}

              {activeToolbar === 'graphics' && (
                <GraphicLibrary currentView={currentView} onAddLayer={handleAddLayer} />
              )}

              {activeToolbar === 'draw' && (
                <DrawingTool
                  isDrawModeActive={isDrawModeActive}
                  onToggleDrawMode={setIsDrawModeActive}
                  brushMode={brushMode}
                  onChangeBrushMode={setBrushMode}
                  brushColor={brushColor}
                  onChangeBrushColor={setBrushColor}
                  brushSize={brushSize}
                  onChangeBrushSize={setBrushSize}
                  onClearDrawing={handleClearDrawing}
                  onUndoDrawing={handleUndoDrawing}
                  onSaveDrawingAsLayer={handleSaveDrawingAsLayer}
                  onAiEnhanceDrawing={handleAiEnhanceDrawing}
                  hasDrawingContent={hasDrawingContent}
                  isAiEnhancing={isAiEnhancing}
                />
              )}

              {activeToolbar === 'ai' && (
                <AiStudioPanel
                  garment={currentGarment}
                  currentView={currentView}
                  color={baseColor}
                  layers={layers}
                  printMethod={selectedPrintMethod}
                  onAddLayer={handleAddLayer}
                  onApplyConcept={handleApplyConcept}
                  patternOverlay={patternOverlay}
                  onApplyPatternOverlay={setPatternOverlay}
                />
              )}

              {activeToolbar === 'layers' && (
                <LayerManager
                  currentView={currentView}
                  layers={layers}
                  selectedLayerId={selectedLayerId}
                  onSelectLayer={setSelectedLayerId}
                  onUpdateLayer={handleUpdateLayer}
                  onDeleteLayer={handleDeleteLayer}
                  onDuplicateLayer={handleDuplicateLayer}
                  onReorderLayer={handleReorderLayer}
                />
              )}

              {activeToolbar === 'print' && (
                <PrintMethodPicker
                  selectedMethod={selectedPrintMethod}
                  onSelectMethod={setSelectedPrintMethod}
                />
              )}
            </div>
          </aside>

          {/* Middle Interactive Apparel Canvas */}
          <CanvasArea
            garment={currentGarment}
            currentView={currentView}
            onViewChange={setCurrentView}
            color={baseColor}
            accentColor={accentColor}
            layers={layers}
            selectedLayerId={selectedLayerId}
            onSelectLayer={setSelectedLayerId}
            onUpdateLayer={handleUpdateLayer}
            onDeleteLayer={handleDeleteLayer}
            printMethod={selectedPrintMethod}
            isDrawModeActive={isDrawModeActive}
            brushMode={brushMode}
            brushColor={brushColor}
            brushSize={brushSize}
            drawCanvasRef={drawCanvasRef}
            onDrawingChange={() => setHasDrawingContent(true)}
            strokeHistoryRef={strokeHistoryRef}
            patternOverlay={patternOverlay}
            textureOverlay={textureOverlay}
          />
        </main>
      )}

      {/* 3D Mockup Preview Mode */}
      {activeTab === 'mockup' && (
        <Mockup3DPreview
          garment={currentGarment}
          color={baseColor}
          accentColor={accentColor}
          layers={layers}
          printMethod={selectedPrintMethod}
          onBackToStudio={() => setActiveTab('studio')}
          patternOverlay={patternOverlay}
          textureOverlay={textureOverlay}
        />
      )}

      {/* Inspiration Lookbook Gallery */}
      {activeTab === 'gallery' && (
        <InspirationGallery
          onLoadPreset={(garmentType, color, accent, method, presetLayers) => {
            setSelectedGarmentType(garmentType);
            setBaseColor(color);
            setAccentColor(accent);
            setSelectedPrintMethod(method);
            setLayers(presetLayers);
            setActiveTab('studio');
          }}
        />
      )}

      {/* Saved Designs Gallery */}
      {activeTab === 'saved' && (
        <SavedDesignsModal
          isOpen={true}
          onClose={() => setActiveTab('studio')}
          savedDesigns={savedDesigns}
          onLoadDesign={handleLoadDesign}
          onDeleteDesign={(id) => setSavedDesigns((prev) => prev.filter((d) => d.id !== id))}
        />
      )}

      {/* Floating Gemini Chatbot Assistant */}
      <GeminiChatbot
        garment={currentGarment}
        color={baseColor}
        layers={layers}
        printMethod={selectedPrintMethod}
      />

      {/* Factory Tech Pack Modal */}
      <TechPackModal
        isOpen={isTechPackOpen}
        onClose={() => setIsTechPackOpen(false)}
        garment={currentGarment}
        color={baseColor}
        accentColor={accentColor}
        fabric={selectedFabric}
        layers={layers}
        printMethod={selectedPrintMethod}
      />

      {/* Order & Checkout Modal */}
      {isCheckoutOpen && (
        <OrderSummaryModal
          isOpen={isCheckoutOpen}
          onClose={() => setIsCheckoutOpen(false)}
          garment={currentGarment}
          color={baseColor}
          printMethod={selectedPrintMethod}
          layersCount={layers.length}
        />
      )}
    </div>
  );
}
