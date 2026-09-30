export interface PresetGraphic {
  id: string;
  name: string;
  category: 'Y2K Cyber' | 'Streetwear Logos' | 'Minimalist' | 'Vintage Crests' | 'Botanical' | 'Gothic & Skull' | 'Stickers & Icons';
  svgContent: string;
  defaultColor?: string;
}

export const PRESET_GRAPHICS: PresetGraphic[] = [
  {
    id: 'cyber-star-four',
    name: 'Y2K Sparkle Star',
    category: 'Y2K Cyber',
    svgContent: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M50 0 C50 35 65 50 100 50 C65 50 50 65 50 100 C50 65 35 50 0 50 C35 50 50 35 50 0 Z"/></svg>`,
  },
  {
    id: 'cyber-bar-code',
    name: 'Cyber Barcode Stamp',
    category: 'Y2K Cyber',
    svgContent: `<svg viewBox="0 0 120 60" fill="currentColor">
      <rect x="0" y="0" width="6" height="50" />
      <rect x="10" y="0" width="3" height="50" />
      <rect x="16" y="0" width="10" height="50" />
      <rect x="30" y="0" width="4" height="50" />
      <rect x="38" y="0" width="12" height="50" />
      <rect x="54" y="0" width="3" height="50" />
      <rect x="61" y="0" width="8" height="50" />
      <rect x="73" y="0" width="14" height="50" />
      <rect x="91" y="0" width="5" height="50" />
      <rect x="100" y="0" width="10" height="50" />
      <rect x="114" y="0" width="6" height="50" />
      <text x="60" y="58" font-size="8" font-family="monospace" text-anchor="middle" letter-spacing="2">THREAD-2026-X</text>
    </svg>`,
  },
  {
    id: 'lightning-bolt',
    name: 'Electric Lightning Bolt',
    category: 'Stickers & Icons',
    svgContent: `<svg viewBox="0 0 100 100" fill="currentColor"><path d="M55 5 L15 55 L45 55 L35 95 L85 45 L55 45 Z"/></svg>`,
  },
  {
    id: 'cyber-butterfly',
    name: 'Cybernetic Butterfly',
    category: 'Y2K Cyber',
    svgContent: `<svg viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 40 C30 10 0 10 10 50 C20 70 45 60 50 50 C55 60 80 70 90 50 C100 10 70 10 50 40 Z" />
      <path d="M50 55 C35 65 15 85 30 95 C45 100 48 70 50 60 C52 70 55 100 70 95 C85 85 65 65 50 55 Z" opacity="0.8" />
      <ellipse cx="50" cy="50" rx="3" ry="25" fill="#000" />
    </svg>`,
  },
  {
    id: 'heart-flame',
    name: 'Flame Heart Badge',
    category: 'Stickers & Icons',
    svgContent: `<svg viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 90 C10 65 0 35 25 15 C40 3 50 20 50 20 C50 20 60 3 75 15 C100 35 90 65 50 90 Z" />
      <path d="M50 10 C50 10 42 22 45 32 C38 25 35 15 35 15 C35 30 25 40 32 55 C22 45 25 35 25 35 C20 50 30 65 50 70 C70 65 80 50 75 35 C75 35 78 45 68 55 C75 40 65 30 65 15 C65 15 62 25 55 32 C58 22 50 10 50 10 Z" fill="#000" opacity="0.3" />
    </svg>`,
  },
  {
    id: 'vintage-panther',
    name: 'Roaring Panther Badge',
    category: 'Streetwear Logos',
    svgContent: `<svg viewBox="0 0 100 100" fill="currentColor">
      <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" stroke-width="4"/>
      <circle cx="50" cy="50" r="40" fill="none" stroke="currentColor" stroke-width="1.5" stroke-dasharray="3 3"/>
      <path d="M30 40 L40 25 L50 35 L60 25 L70 40 L65 60 L50 75 L35 60 Z" />
      <circle cx="42" cy="45" r="3" fill="#fff"/>
      <circle cx="58" cy="45" r="3" fill="#fff"/>
      <polygon points="50,55 45,63 55,63" fill="#fff"/>
    </svg>`,
  },
  {
    id: 'gothic-skull-crown',
    name: 'Crown & Skull',
    category: 'Gothic & Skull',
    svgContent: `<svg viewBox="0 0 100 100" fill="currentColor">
      <path d="M25 25 L35 38 L50 20 L65 38 L75 25 L70 42 L30 42 Z"/>
      <path d="M32 46 C32 46 32 75 50 75 C68 75 68 46 68 46 Z"/>
      <circle cx="43" cy="56" r="5" fill="#000"/>
      <circle cx="57" cy="56" r="5" fill="#000"/>
      <path d="M48 64 L50 62 L52 64 L50 67 Z" fill="#000"/>
      <rect x="42" y="70" width="3" height="8" fill="#000"/>
      <rect x="48" y="70" width="4" height="8" fill="#000"/>
      <rect x="55" y="70" width="3" height="8" fill="#000"/>
    </svg>`,
  },
  {
    id: 'botanical-rose-line',
    name: 'Minimal Wildflower Rose',
    category: 'Botanical',
    svgContent: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
      <path d="M50 85 C50 60 50 45 50 35" />
      <path d="M50 65 C40 60 30 62 25 55 C35 52 45 58 50 65" fill="currentColor" opacity="0.2"/>
      <path d="M50 50 C60 45 70 47 75 40 C65 37 55 43 50 50" fill="currentColor" opacity="0.2"/>
      <circle cx="50" cy="25" r="12" fill="none"/>
      <path d="M45 20 C50 15 55 20 50 28 C45 28 42 22 45 20 Z" fill="currentColor"/>
    </svg>`,
  },
  {
    id: 'streetwear-globe-stamp',
    name: 'Worldwide Supply Globe',
    category: 'Streetwear Logos',
    svgContent: `<svg viewBox="0 0 100 100" fill="none" stroke="currentColor" stroke-width="3">
      <circle cx="50" cy="50" r="42" />
      <ellipse cx="50" cy="50" rx="42" ry="18" />
      <line x1="50" y1="8" x2="50" y2="92" />
      <line x1="8" y1="50" x2="92" y2="50" />
      <path d="M18 28 Q50 40 82 28" />
      <path d="M18 72 Q50 60 82 72" />
    </svg>`,
  },
  {
    id: 'minimalist-arch-sun',
    name: 'Arch & Rising Sun',
    category: 'Minimalist',
    svgContent: `<svg viewBox="0 0 100 100" fill="currentColor">
      <path d="M20 80 A30 30 0 0 1 80 80 Z" />
      <line x1="50" y1="45" x2="50" y2="25" stroke="currentColor" stroke-width="4"/>
      <line x1="30" y1="52" x2="18" y2="38" stroke="currentColor" stroke-width="4"/>
      <line x1="70" y1="52" x2="82" y2="38" stroke="currentColor" stroke-width="4"/>
      <rect x="15" y="82" width="70" height="4" />
    </svg>`,
  },
  {
    id: 'anime-flame-mascot',
    name: 'Cyber Flame Emblem',
    category: 'Y2K Cyber',
    svgContent: `<svg viewBox="0 0 100 100" fill="currentColor">
      <path d="M50 5 C50 5 65 25 65 45 C65 55 60 62 55 68 C70 65 80 50 80 35 C80 70 60 90 50 90 C40 90 20 70 20 35 C20 50 30 65 45 68 C40 62 35 55 35 45 C35 25 50 5 50 5 Z"/>
    </svg>`,
  },
  {
    id: 'royal-crown-stamp',
    name: 'Royal Crown Emblem',
    category: 'Vintage Crests',
    svgContent: `<svg viewBox="0 0 100 100" fill="currentColor">
      <path d="M15 75 L10 30 L32 50 L50 20 L68 50 L90 30 L85 75 Z" />
      <rect x="15" y="78" width="70" height="8" rx="2" fill="currentColor" />
      <circle cx="10" cy="26" r="4" fill="currentColor" />
      <circle cx="50" cy="14" r="5" fill="currentColor" />
      <circle cx="90" cy="26" r="4" fill="currentColor" />
    </svg>`,
  },
];
