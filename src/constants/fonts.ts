export interface FontOption {
  id: string;
  name: string;
  family: string;
  category: 'Streetwear' | 'Y2K Cyber' | 'Gothic' | 'Vintage Script' | 'Minimalist' | 'Pixel' | 'Luxury Serif';
  sampleText: string;
}

export const FONT_OPTIONS: FontOption[] = [
  { id: 'bebas', name: 'Bebas Neue', family: "'Bebas Neue', sans-serif", category: 'Streetwear', sampleText: 'HEAVYWEIGHT' },
  { id: 'outfit', name: 'Outfit Heavy', family: "'Outfit', sans-serif", category: 'Streetwear', sampleText: 'STUDIO 2026' },
  { id: 'fira', name: 'Fira Code', family: "'Fira Code', monospace", category: 'Y2K Cyber', sampleText: '<CYBER_DEPT/>' },
  { id: 'gothic', name: 'Gothic Unifraktur', family: "'UnifrakturMaguntia', cursive", category: 'Gothic', sampleText: 'Saint Atelier' },
  { id: 'cinzel', name: 'Cinzel Roman', family: "'Cinzel', serif", category: 'Luxury Serif', sampleText: 'ARCHIVE V' },
  { id: 'pixel', name: 'Press Start 8-Bit', family: "'Press Start 2P', monospace", category: 'Pixel', sampleText: 'GAME OVER' },
  { id: 'playfair', name: 'Playfair Display', family: "'Playfair Display', serif", category: 'Vintage Script', sampleText: 'Maison Couture' },
  { id: 'marker', name: 'Permanent Marker', family: "'Permanent Marker', cursive", category: 'Streetwear', sampleText: 'SKATE OR DIE' },
  { id: 'inter', name: 'Inter Clean', family: "'Inter', sans-serif", category: 'Minimalist', sampleText: 'ESSENTIALS' },
];
