export interface FabricTexturePreset {
  id: string;
  name: string;
  subtitle: string;
  svgPattern: string;
  defaultOpacity: number;
  category: string;
}

export const FABRIC_TEXTURES: FabricTexturePreset[] = [
  {
    id: 'none',
    name: 'Solid Color',
    subtitle: 'Flat solid color with crisp clean finish',
    svgPattern: '',
    defaultOpacity: 0,
    category: 'Solid',
  },
  {
    id: 'heather-cotton',
    name: 'Heathered Cotton',
    subtitle: 'Combed ring-spun cotton with fine heather flecks',
    svgPattern: `<pattern id="texture-heather-cotton" width="16" height="16" patternUnits="userSpaceOnUse">
      <line x1="0" y1="0" x2="16" y2="16" stroke="#ffffff" stroke-width="1" opacity="0.2"/>
      <line x1="16" y1="0" x2="0" y2="16" stroke="#000000" stroke-width="1" opacity="0.18"/>
      <circle cx="4" cy="8" r="1" fill="#ffffff" opacity="0.3"/>
      <circle cx="12" cy="4" r="1" fill="#000000" opacity="0.2"/>
    </pattern>`,
    defaultOpacity: 0.45,
    category: 'Cotton',
  },
  {
    id: 'heavy-fleece',
    name: 'Plush Heavy Fleece',
    subtitle: 'Thick cozy brushed interior fleece texture',
    svgPattern: `<pattern id="texture-heavy-fleece" width="20" height="20" patternUnits="userSpaceOnUse">
      <circle cx="5" cy="5" r="2.5" fill="#ffffff" opacity="0.22"/>
      <circle cx="15" cy="15" r="2.5" fill="#000000" opacity="0.2"/>
      <path d="M 0 10 Q 10 5 20 10" stroke="#ffffff" stroke-width="1" fill="none" opacity="0.18"/>
    </pattern>`,
    defaultOpacity: 0.5,
    category: 'Fleece',
  },
  {
    id: 'raw-denim',
    name: 'Raw Selvedge Denim',
    subtitle: 'Rigid 14 oz twill diagonal weave texture',
    svgPattern: `<pattern id="texture-raw-denim" width="12" height="12" patternUnits="userSpaceOnUse">
      <line x1="0" y1="12" x2="12" y2="0" stroke="#ffffff" stroke-width="2" opacity="0.28"/>
      <line x1="-3" y1="9" x2="9" y2="-3" stroke="#000000" stroke-width="1.5" opacity="0.22"/>
      <line x1="3" y1="15" x2="15" y2="3" stroke="#ffffff" stroke-width="1" opacity="0.18"/>
    </pattern>`,
    defaultOpacity: 0.55,
    category: 'Denim',
  },
  {
    id: 'acid-wash',
    name: 'Sun-Faded Acid Wash',
    subtitle: 'Vintage distressed mottled cloud wash',
    svgPattern: `<pattern id="texture-acid-wash" width="40" height="40" patternUnits="userSpaceOnUse">
      <circle cx="10" cy="10" r="8" fill="#ffffff" opacity="0.25"/>
      <circle cx="30" cy="28" r="10" fill="#000000" opacity="0.28"/>
      <ellipse cx="25" cy="12" rx="12" ry="6" fill="#ffffff" opacity="0.2"/>
    </pattern>`,
    defaultOpacity: 0.6,
    category: 'Wash',
  },
  {
    id: 'french-terry',
    name: 'Micro French Terry',
    subtitle: 'Luxury unbrushed looped back weave',
    svgPattern: `<pattern id="texture-french-terry" width="14" height="14" patternUnits="userSpaceOnUse">
      <circle cx="7" cy="7" r="3" fill="none" stroke="#ffffff" stroke-width="1.2" opacity="0.28"/>
      <circle cx="0" cy="0" r="3" fill="none" stroke="#000000" stroke-width="1.2" opacity="0.22"/>
    </pattern>`,
    defaultOpacity: 0.45,
    category: 'Terry',
  },
  {
    id: 'vintage-corduroy',
    name: 'Ribbed Corduroy',
    subtitle: 'Classic vertical ridge corduroy texture',
    svgPattern: `<pattern id="texture-vintage-corduroy" width="16" height="16" patternUnits="userSpaceOnUse">
      <rect x="0" y="0" width="8" height="16" fill="#ffffff" opacity="0.22"/>
      <rect x="8" y="0" width="8" height="16" fill="#000000" opacity="0.2"/>
    </pattern>`,
    defaultOpacity: 0.5,
    category: 'Corduroy',
  },
];
