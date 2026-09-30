export type GarmentType =
  | 'tshirt'
  | 'hoodie'
  | 'sweatshirt'
  | 'denim-jacket'
  | 'cap'
  | 'tote-bag'
  | 'sweatpants'
  | 'crop-top'
  | 'shorts'
  | 'pants'
  | 'shoes';

export type GarmentView = 'front' | 'back' | 'sleeve';

export type FabricType =
  | 'cotton-100'
  | 'heavyweight-wash'
  | 'fleece-fleece'
  | 'denim-raw'
  | 'recycled-poly'
  | 'french-terry';

export type PrintMethod =
  | 'dtg'
  | 'screenprint'
  | 'embroidery'
  | 'vinyl-foil';

export type LayerType = 'text' | 'image' | 'preset' | 'shape' | 'drawing';

export interface CanvasLayer {
  id: string;
  type: LayerType;
  view: GarmentView;
  x: number; // percentage (0 to 100) relative to print boundary
  y: number; // percentage (0 to 100) relative to print boundary
  width: number; // px or percentage
  height: number; // px or percentage
  scale: number;
  rotation: number;
  opacity: number;
  zIndex: number;
  text?: string;
  color?: string;
  fontFamily?: string;
  fontSize?: number;
  letterSpacing?: number;
  curved?: boolean;
  src?: string;
  flipX?: boolean;
  flipY?: boolean;
  locked?: boolean;
}

export interface GarmentColorOption {
  name: string;
  hex: string;
  category?: string;
}

export interface GarmentConfig {
  id: GarmentType;
  name: string;
  subtitle: string;
  basePrice: number;
  availableViews: GarmentView[];
  defaultColor: string;
  fabricOptions: { id: FabricType; label: string; weight: string; description: string }[];
  colorPresets: GarmentColorOption[];
  printBoundaries: {
    [key in GarmentView]?: {
      x: number; // % from garment left
      y: number; // % from garment top
      width: number; // % width of print box
      height: number; // % height of print box
      label: string;
    };
  };
}

export interface GarmentDesign {
  id: string;
  name: string;
  garmentType: GarmentType;
  baseColor: string;
  accentColor: string;
  fabric: FabricType;
  printMethod: PrintMethod;
  layers: CanvasLayer[];
  createdAt: number;
  size: string;
  quantity: number;
  thumbnail?: string;
}

export interface DesignCritique {
  overallScore: number;
  productionRating: string;
  contrastCheck: string;
  printMethodFit: string;
  aestheticFeedback: string;
  stylingTips: string[];
}

export interface DesignIdea {
  title: string;
  description: string;
  garmentColor: string;
  graphicPrompt: string;
  badgeText: string;
  fontStyle: string;
  styleCategory: string;
}
