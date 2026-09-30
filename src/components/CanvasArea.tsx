import React, { useRef, useState, useEffect } from 'react';
import { GarmentConfig, GarmentView, CanvasLayer, PrintMethod } from '../types/apparel';
import { GarmentVector } from './GarmentVector';
import { BrushMode } from './Toolbar/DrawingTool';
import { RotateCw, Trash2, ZoomIn, ZoomOut, Grid, Move, ShieldAlert, Sparkles, Pencil } from 'lucide-react';

interface CanvasAreaProps {
  garment: GarmentConfig;
  currentView: GarmentView;
  onViewChange: (view: GarmentView) => void;
  color: string;
  accentColor: string;
  layers: CanvasLayer[];
  selectedLayerId: string | null;
  onSelectLayer: (id: string | null) => void;
  onUpdateLayer: (id: string, updates: Partial<CanvasLayer>) => void;
  onDeleteLayer: (id: string) => void;
  printMethod: PrintMethod;
  // Drawing Props
  isDrawModeActive: boolean;
  brushMode: BrushMode;
  brushColor: string;
  brushSize: number;
  drawCanvasRef: React.RefObject<HTMLCanvasElement | null>;
  onDrawingChange?: () => void;
  strokeHistoryRef?: React.MutableRefObject<ImageData[]>;
  patternOverlay?: { url: string; scale: number; opacity: number } | null;
  textureOverlay?: { id: string; opacity: number } | null;
}

export const CanvasArea: React.FC<CanvasAreaProps> = ({
  garment,
  currentView,
  onViewChange,
  color,
  accentColor,
  layers,
  selectedLayerId,
  onSelectLayer,
  onUpdateLayer,
  onDeleteLayer,
  printMethod,
  isDrawModeActive,
  brushMode,
  brushColor,
  brushSize,
  drawCanvasRef,
  onDrawingChange,
  strokeHistoryRef,
  patternOverlay = null,
  textureOverlay = null,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const boundaryRef = useRef<HTMLDivElement>(null);
  const [zoom, setZoom] = useState<number>(1);
  const [showGrid, setShowGrid] = useState<boolean>(false);
  const [showBoundary, setShowBoundary] = useState<boolean>(true);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isPainting, setIsPainting] = useState<boolean>(false);

  const [dragStart, setDragStart] = useState<{ x: number; y: number; layerX: number; layerY: number }>({
    x: 0,
    y: 0,
    layerX: 0,
    layerY: 0,
  });

  const activeBoundary = garment.printBoundaries[currentView];
  const viewLayers = layers.filter((l) => l.view === currentView);
  const selectedLayer = layers.find((l) => l.id === selectedLayerId);

  // Keyboard shortcut listener: Delete or Backspace key removes selected layer!
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!selectedLayerId) return;
      // Do not trigger if typing inside an input or textarea
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === 'Delete' || e.key === 'Backspace') {
        e.preventDefault();
        onDeleteLayer(selectedLayerId);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedLayerId, onDeleteLayer]);

  // Initialize Drawing Canvas Resolution
  useEffect(() => {
    const canvas = drawCanvasRef.current;
    if (canvas) {
      if (canvas.width !== 300 || canvas.height !== 350) {
        canvas.width = 300;
        canvas.height = 350;
      }
    }
  }, [drawCanvasRef, currentView]);

  // Dragging logic for layers
  const handleMouseDown = (e: React.MouseEvent, layer: CanvasLayer) => {
    if (isDrawModeActive) return;
    e.stopPropagation();
    onSelectLayer(layer.id);
    if (layer.locked) return;

    setIsDragging(true);
    setDragStart({
      x: e.clientX,
      y: e.clientY,
      layerX: layer.x,
      layerY: layer.y,
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDragging || !selectedLayer || !boundaryRef.current || isDrawModeActive) return;

    const boundaryRect = boundaryRef.current.getBoundingClientRect();
    const deltaX = ((e.clientX - dragStart.x) / boundaryRect.width) * 100;
    const deltaY = ((e.clientY - dragStart.y) / boundaryRect.height) * 100;

    let newX = Math.max(0, Math.min(90, dragStart.layerX + deltaX));
    let newY = Math.max(0, Math.min(90, dragStart.layerY + deltaY));

    onUpdateLayer(selectedLayer.id, { x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Freehand Drawing Canvas Events (Pointer events for Touch & Mouse)
  const startDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawModeActive) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Save snapshot before stroke for Undo
    if (strokeHistoryRef) {
      const snapshot = ctx.getImageData(0, 0, canvas.width, canvas.height);
      strokeHistoryRef.current.push(snapshot);
    }

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    setIsPainting(true);
    ctx.beginPath();
    ctx.moveTo(x, y);

    if (brushMode === 'spray') {
      paintSpray(ctx, x, y);
    }
  };

  const paintDrawing = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawModeActive || !isPainting) return;
    const canvas = drawCanvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left) * (canvas.width / rect.width);
    const y = (e.clientY - rect.top) * (canvas.height / rect.height);

    if (brushMode === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.beginPath();
      ctx.arc(x, y, brushSize, 0, Math.PI * 2);
      ctx.fill();
    } else if (brushMode === 'spray') {
      paintSpray(ctx, x, y);
    } else if (brushMode === 'neon') {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowColor = brushColor;
      ctx.shadowBlur = 12;
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.strokeStyle = brushColor;
      ctx.lineWidth = brushSize;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.shadowBlur = 0;
      ctx.lineTo(x, y);
      ctx.stroke();
    }

    if (onDrawingChange) onDrawingChange();
  };

  const stopDrawing = () => {
    setIsPainting(false);
    const canvas = drawCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.beginPath();
    }
  };

  const paintSpray = (ctx: CanvasRenderingContext2D, x: number, y: number) => {
    ctx.globalCompositeOperation = 'source-over';
    ctx.fillStyle = brushColor;
    ctx.shadowBlur = 0;
    const density = brushSize * 4;
    for (let i = 0; i < density; i++) {
      const offsetX = (Math.random() - 0.5) * brushSize * 2;
      const offsetY = (Math.random() - 0.5) * brushSize * 2;
      if (offsetX * offsetX + offsetY * offsetY <= brushSize * brushSize) {
        ctx.fillRect(x + offsetX, y + offsetY, 1.5, 1.5);
      }
    }
  };

  return (
    <div
      className="relative flex-1 bg-zinc-950 flex flex-col items-center justify-center p-4 min-h-[600px] overflow-hidden select-none border-b lg:border-b-0 lg:border-r border-zinc-800/80"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={() => onSelectLayer(null)}
    >
      {/* Background Studio Light Grid */}
      <div
        className={`absolute inset-0 pointer-events-none transition-opacity duration-300 ${
          showGrid ? 'opacity-30' : 'opacity-10'
        }`}
        style={{
          backgroundImage: `radial-gradient(#ffffff 1px, transparent 1px)`,
          backgroundSize: '24px 24px',
        }}
      />

      {/* Top View Selector Bar */}
      <div className="absolute top-4 z-20 flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-full border border-zinc-800 shadow-xl">
        {garment.availableViews.map((view) => (
          <button
            key={view}
            onClick={(e) => {
              e.stopPropagation();
              onViewChange(view);
            }}
            className={`px-3.5 py-1.2 text-xs font-semibold rounded-full capitalize transition-all ${
              currentView === view
                ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60'
            }`}
          >
            {view === 'sleeve' ? 'Sleeve Emblem' : `${view} View`}
          </button>
        ))}
      </div>

      {/* View Options & Zoom Controls */}
      <div className="absolute top-4 right-4 z-20 flex items-center gap-1.5 bg-zinc-900/90 backdrop-blur-md p-1.5 rounded-xl border border-zinc-800 shadow-lg">
        {/* Prominent Quick Remove Button when an element is selected */}
        {selectedLayer && (
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDeleteLayer(selectedLayer.id);
            }}
            className="px-2.5 py-1.5 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-lg flex items-center gap-1 shadow-md transition-all animate-in fade-in"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Remove Selected</span>
          </button>
        )}

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowGrid(!showGrid);
          }}
          title="Toggle Grid Lines"
          className={`p-2 rounded-lg text-xs font-medium transition-colors ${
            showGrid ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30' : 'text-zinc-400 hover:bg-zinc-800'
          }`}
        >
          <Grid className="w-4 h-4" />
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowBoundary(!showBoundary);
          }}
          title="Toggle Print Boundary"
          className={`p-2 rounded-lg text-xs font-medium transition-colors ${
            showBoundary ? 'bg-indigo-600/30 text-indigo-300 border border-indigo-500/30' : 'text-zinc-400 hover:bg-zinc-800'
          }`}
        >
          <ShieldAlert className="w-4 h-4" />
        </button>

        <div className="w-px h-5 bg-zinc-800 my-auto" />

        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom((z) => Math.max(0.8, z - 0.15));
          }}
          title="Zoom Out"
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ZoomOut className="w-4 h-4" />
        </button>
        <span className="text-xs font-mono text-zinc-400 px-1 w-10 text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            setZoom((z) => Math.min(1.8, z + 0.15));
          }}
          title="Zoom In"
          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
        >
          <ZoomIn className="w-4 h-4" />
        </button>
      </div>

      {/* Drawing Active Indicator Banner */}
      {isDrawModeActive && (
        <div className="absolute top-16 z-20 bg-emerald-600/90 text-white font-bold text-xs px-4 py-1.5 rounded-full shadow-lg border border-emerald-400/50 flex items-center gap-2 animate-pulse">
          <Pencil className="w-3.5 h-3.5" />
          <span>DRAWING CANVAS ACTIVE — Touch/Click & drag anywhere on the printable box!</span>
        </div>
      )}

      {/* Main Interactive Apparel Container */}
      <div
        ref={containerRef}
        className="relative w-[480px] h-[520px] max-w-full flex items-center justify-center transition-transform duration-200"
        style={{ transform: `scale(${zoom})` }}
      >
        {/* Vector Garment Silhouette */}
        <GarmentVector
          type={garment.id}
          view={currentView}
          color={color}
          accentColor={accentColor}
          patternOverlay={patternOverlay}
          textureOverlay={textureOverlay}
          className="w-full h-full"
        />

        {/* Printable Area Boundary & Layer Workspace */}
        {activeBoundary && (
          <div
            ref={boundaryRef}
            className={`absolute transition-all ${
              showBoundary
                ? 'border-2 border-dashed border-indigo-400/60 bg-indigo-500/5'
                : 'border border-transparent'
            }`}
            style={{
              left: `${activeBoundary.x}%`,
              top: `${activeBoundary.y}%`,
              width: `${activeBoundary.width}%`,
              height: `${activeBoundary.height}%`,
            }}
          >
            {/* Printable Label */}
            {showBoundary && (
              <div className="absolute -top-6 left-0 right-0 flex justify-center pointer-events-none">
                <span className="text-[10px] uppercase tracking-wider font-mono bg-indigo-950/90 text-indigo-300 px-2 py-0.5 rounded border border-indigo-700/50 shadow-md">
                  {activeBoundary.label}
                </span>
              </div>
            )}

            {/* Interactive Drawing HTML5 Overlay Canvas */}
            <canvas
              ref={drawCanvasRef}
              onPointerDown={startDrawing}
              onPointerMove={paintDrawing}
              onPointerUp={stopDrawing}
              onPointerLeave={stopDrawing}
              className={`absolute inset-0 w-full h-full z-20 touch-none ${
                isDrawModeActive ? 'cursor-crosshair pointer-events-auto ring-2 ring-emerald-400 rounded' : 'pointer-events-none'
              }`}
            />

            {/* Render Layers inside Boundary */}
            {viewLayers.map((layer) => {
              const isSelected = layer.id === selectedLayerId;

              return (
                <div
                  key={layer.id}
                  onClick={(e) => {
                    if (isDrawModeActive) return;
                    e.stopPropagation();
                    onSelectLayer(layer.id);
                  }}
                  onMouseDown={(e) => handleMouseDown(e, layer)}
                  className={`absolute group transition-shadow ${
                    isDrawModeActive ? 'pointer-events-none' : 'cursor-grab active:cursor-grabbing'
                  } ${
                    isSelected && !isDrawModeActive
                      ? 'ring-2 ring-indigo-500 ring-offset-2 ring-offset-zinc-950 rounded z-30 shadow-2xl'
                      : 'hover:ring-1 hover:ring-indigo-400/50'
                  }`}
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
                  {/* Layer Content */}
                  <div
                    className="relative flex items-center justify-center p-1"
                    style={{
                      filter:
                        printMethod === 'embroidery'
                          ? 'drop-shadow(1px 2px 0px rgba(0,0,0,0.4)) contrast(1.15)'
                          : printMethod === 'vinyl-foil'
                          ? 'drop-shadow(0px 0px 4px rgba(251,191,36,0.5))'
                          : undefined,
                    }}
                  >
                    {layer.type === 'text' && (
                      <span
                        className="whitespace-nowrap font-bold select-none leading-none inline-block drop-shadow-md"
                        style={{
                          color: layer.color || '#ffffff',
                          fontFamily: layer.fontFamily || 'sans-serif',
                          fontSize: `${layer.fontSize || 32}px`,
                          letterSpacing: `${layer.letterSpacing || 0}px`,
                        }}
                      >
                        {layer.text || 'YOUR TEXT'}
                      </span>
                    )}

                    {layer.type === 'preset' && layer.src && (
                      <div
                        className="w-24 h-24 text-white drop-shadow-md flex items-center justify-center"
                        style={{ color: layer.color || '#ffffff' }}
                        dangerouslySetInnerHTML={{ __html: layer.src }}
                      />
                    )}

                    {(layer.type === 'image' || layer.type === 'drawing') && layer.src && (
                      <img
                        src={layer.src}
                        alt="Custom graphic artwork"
                        className="max-w-[200px] max-h-[200px] object-contain drop-shadow-lg"
                        draggable={false}
                      />
                    )}
                  </div>

                  {/* Handles Overlay for Selected Layer */}
                  {isSelected && !isDrawModeActive && (
                    <div className="absolute -inset-3 pointer-events-none border-2 border-indigo-400 rounded shadow-xl">
                      {/* Big Red Delete Button Handle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          e.preventDefault();
                          onDeleteLayer(layer.id);
                        }}
                        title="Delete Graphic (or press Delete key)"
                        className="pointer-events-auto absolute -top-4 -right-4 w-7 h-7 bg-red-600 hover:bg-red-500 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-125 border-2 border-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      {/* Rotate Handle */}
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onUpdateLayer(layer.id, {
                            rotation: (layer.rotation + 45) % 360,
                          });
                        }}
                        title="Rotate 45°"
                        className="pointer-events-auto absolute -bottom-4 -right-4 w-7 h-7 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full flex items-center justify-center shadow-2xl transition-transform hover:scale-125 border-2 border-white"
                      >
                        <RotateCw className="w-4 h-4" />
                      </button>

                      {/* Drag Move Handle indicator */}
                      <div className="pointer-events-none absolute -bottom-4 -left-4 w-7 h-7 bg-zinc-800 text-zinc-300 rounded-full flex items-center justify-center shadow-md border border-zinc-700">
                        <Move className="w-4 h-4" />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Bottom Print Technique Status Bar */}
      <div className="absolute bottom-4 left-4 z-20 flex items-center gap-2 bg-zinc-900/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-zinc-800 text-xs text-zinc-300">
        <Sparkles className="w-4 h-4 text-amber-400" />
        <span className="font-medium">Method:</span>
        <span className="font-semibold text-white capitalize">{printMethod.replace('-', ' ')}</span>
      </div>
    </div>
  );
};
