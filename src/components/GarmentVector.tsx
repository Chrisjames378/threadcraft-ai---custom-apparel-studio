import React from 'react';
import { GarmentType, GarmentView, FabricType } from '../types/apparel';
import { FABRIC_TEXTURES } from '../constants/textures';

interface GarmentVectorProps {
  type: GarmentType;
  view: GarmentView;
  color: string;
  accentColor?: string;
  fabric?: FabricType;
  className?: string;
  patternOverlay?: { url: string; scale: number; opacity: number } | null;
  textureOverlay?: { id: string; opacity: number } | null;
}

export const GarmentVector: React.FC<GarmentVectorProps> = ({
  type,
  view,
  color,
  accentColor = '#18181b',
  className = 'w-full h-full',
  patternOverlay = null,
  textureOverlay = null,
}) => {
  // SVG silhouette path definitions with detailed seams & shading
  const renderGraphic = () => {
    switch (type) {
      case 'tshirt':
        if (view === 'sleeve') {
          return (
            <g id="tshirt-sleeve">
              {/* Sleeve detail */}
              <path
                d="M 120 100 Q 200 80 380 100 L 410 320 Q 250 350 90 320 Z"
                fill={color}
                stroke="#000"
                strokeWidth="2"
                strokeOpacity="0.25"
              />
              <path
                d="M 90 320 Q 250 350 410 320 L 410 340 Q 250 370 90 340 Z"
                fill={accentColor}
                opacity="0.9"
              />
              {/* Cuff Seam */}
              <path d="M 90 310 Q 250 340 410 310" fill="none" stroke="#000" strokeWidth="2" strokeDasharray="4 4" opacity="0.3" />
            </g>
          );
        }
        return (
          <g id="tshirt-main">
            {/* T-Shirt Body */}
            <path
              d="M 170 110 
                 Q 250 145 330 110 
                 L 430 150 
                 L 395 240 
                 L 355 220 
                 L 355 460 
                 Q 250 475 145 460 
                 L 145 220 
                 L 105 240 
                 L 70 150 Z"
              fill={color}
              stroke="#000"
              strokeWidth="2"
              strokeOpacity="0.2"
            />
            {/* Collar Ribbing */}
            {view === 'front' ? (
              <path
                d="M 170 110 Q 250 165 330 110 Q 250 138 170 110 Z"
                fill={accentColor}
                stroke="#000"
                strokeWidth="1.5"
                opacity="0.85"
              />
            ) : (
              <path
                d="M 170 110 Q 250 128 330 110 Q 250 118 170 110 Z"
                fill={accentColor}
                stroke="#000"
                strokeWidth="1.5"
                opacity="0.85"
              />
            )}
            {/* Shoulder Seams */}
            <path d="M 170 110 L 105 140" stroke="#000" strokeWidth="2" opacity="0.2" />
            <path d="M 330 110 L 395 140" stroke="#000" strokeWidth="2" opacity="0.2" />
            {/* Sleeve Hem lines */}
            <path d="M 70 150 L 105 240" stroke="#000" strokeWidth="1.5" opacity="0.2" />
            <path d="M 430 150 L 395 240" stroke="#000" strokeWidth="1.5" opacity="0.2" />
            {/* Bottom Hem double stitch */}
            <path d="M 148 450 Q 250 465 352 450" stroke="#000" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
            <path d="M 148 454 Q 250 469 352 454" stroke="#000" strokeWidth="1" strokeDasharray="3 3" opacity="0.3" />
          </g>
        );

      case 'hoodie':
        if (view === 'sleeve') {
          return (
            <g id="hoodie-sleeve">
              <path
                d="M 100 80 Q 250 60 400 80 L 380 380 Q 250 400 120 380 Z"
                fill={color}
                stroke="#000"
                strokeWidth="2"
                strokeOpacity="0.25"
              />
              {/* Ribbed Cuff */}
              <rect x="120" y="380" width="260" height="40" rx="4" fill={accentColor} opacity="0.9" />
              <line x1="120" y1="380" x2="380" y2="380" stroke="#000" strokeWidth="2" opacity="0.3" />
            </g>
          );
        }
        return (
          <g id="hoodie-main">
            {/* Main Hoodie Silhouette */}
            <path
              d="M 160 110 
                 Q 250 130 340 110 
                 L 440 160 
                 L 395 270 
                 L 360 250 
                 L 360 440 
                 L 140 440 
                 L 140 250 
                 L 105 270 
                 L 60 160 Z"
              fill={color}
              stroke="#000"
              strokeWidth="2.5"
              strokeOpacity="0.25"
            />
            {/* Hood outline / Neck crossover */}
            {view === 'front' ? (
              <g id="hoodie-front-details">
                {/* Hood folds behind & around neck */}
                <path
                  d="M 160 110 Q 130 50 190 35 Q 250 25 310 35 Q 370 50 340 110 Q 250 145 160 110 Z"
                  fill={color}
                  stroke="#000"
                  strokeWidth="2"
                  filter="brightness(0.9)"
                />
                {/* Inner Hood lining dark shadow */}
                <path
                  d="M 190 60 Q 250 75 310 60 Q 250 135 190 60 Z"
                  fill="#000"
                  opacity="0.3"
                />
                {/* Drawstrings */}
                <path d="M 220 115 Q 215 160 210 210" stroke={accentColor} strokeWidth="4" strokeLinecap="round" />
                <path d="M 280 115 Q 285 160 290 210" stroke={accentColor} strokeWidth="4" strokeLinecap="round" />
                <circle cx="210" cy="210" r="3" fill="#94a3b8" />
                <circle cx="290" cy="210" r="3" fill="#94a3b8" />
                {/* Kangaroo Pocket */}
                <path
                  d="M 175 320 L 325 320 L 345 425 L 155 425 Z"
                  fill={color}
                  stroke="#000"
                  strokeWidth="2"
                  filter="brightness(0.96)"
                />
                {/* Pocket entrance seam */}
                <path d="M 175 320 L 155 425" stroke="#000" strokeWidth="2" opacity="0.3" />
                <path d="M 325 320 L 345 425" stroke="#000" strokeWidth="2" opacity="0.3" />
              </g>
            ) : (
              <g id="hoodie-back-details">
                {/* Back Hood draping down upper back */}
                <path
                  d="M 160 110 Q 250 50 340 110 Q 250 200 160 110 Z"
                  fill={color}
                  stroke="#000"
                  strokeWidth="2"
                  filter="brightness(0.88)"
                />
              </g>
            )}
            {/* Ribbed Bottom Hem */}
            <rect x="140" y="440" width="220" height="35" rx="2" fill={color} filter="brightness(0.85)" stroke="#000" strokeWidth="1.5" />
            <line x1="140" y1="440" x2="360" y2="440" stroke="#000" strokeWidth="2" opacity="0.25" />
          </g>
        );

      case 'sweatshirt':
        return (
          <g id="sweatshirt-main">
            <path
              d="M 165 110 Q 250 128 335 110 L 435 155 L 390 260 L 355 240 L 355 440 L 145 440 L 145 240 L 110 260 L 65 155 Z"
              fill={color}
              stroke="#000"
              strokeWidth="2"
              strokeOpacity="0.25"
            />
            {/* Crew Ribbed Collar with V-Stitch triangle */}
            <path d="M 165 110 Q 250 148 335 110 Q 250 125 165 110 Z" fill={accentColor} stroke="#000" strokeWidth="1.5" opacity="0.9" />
            {view === 'front' && (
              <polygon points="238,135 262,135 250,152" fill="none" stroke="#000" strokeWidth="1.5" opacity="0.4" />
            )}
            {/* Bottom Hem & Cuffs */}
            <rect x="145" y="440" width="210" height="32" fill={color} filter="brightness(0.85)" stroke="#000" strokeWidth="1.5" />
          </g>
        );

      case 'denim-jacket':
        return (
          <g id="denim-jacket-main">
            {/* Trucker Jacket Body */}
            <path
              d="M 160 110 L 340 110 L 420 160 L 380 270 L 350 250 L 350 450 L 150 450 L 150 250 L 120 270 L 80 160 Z"
              fill={color}
              stroke="#000"
              strokeWidth="2.5"
            />
            {/* Denim Collar */}
            <path d="M 160 110 L 210 145 L 250 125 L 290 145 L 340 110 Z" fill={accentColor} stroke="#000" strokeWidth="2" />
            {view === 'front' && (
              <g id="denim-details">
                {/* Center Button Placket */}
                <rect x="242" y="125" width="16" height="325" fill={color} filter="brightness(0.9)" stroke="#000" strokeWidth="1" />
                {[150, 200, 250, 300, 350, 400].map((y) => (
                  <circle key={y} cx="250" cy={y} r="4" fill="#d97706" stroke="#78350f" strokeWidth="1" />
                ))}
                {/* Chest Flap Pockets */}
                <rect x="170" y="200" width="55" height="50" fill={color} filter="brightness(0.95)" stroke="#000" strokeWidth="1.5" />
                <polygon points="170,200 225,200 225,190 197,180 170,190" fill={color} filter="brightness(0.85)" stroke="#000" strokeWidth="1.5" />
                <rect x="275" y="200" width="55" height="50" fill={color} filter="brightness(0.95)" stroke="#000" strokeWidth="1.5" />
                <polygon points="275,200 330,200 330,190 302,180 275,190" fill={color} filter="brightness(0.85)" stroke="#000" strokeWidth="1.5" />
                {/* Golden Contrast Stitches */}
                <path d="M 160 110 L 150 450" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8" />
                <path d="M 340 110 L 350 450" stroke="#d97706" strokeWidth="1.5" strokeDasharray="3 2" opacity="0.8" />
              </g>
            )}
          </g>
        );

      case 'cap':
        return (
          <g id="snapback-cap">
            {/* Crown Dome */}
            <path
              d="M 120 280 C 120 120 380 120 380 280 Z"
              fill={color}
              stroke="#000"
              strokeWidth="2.5"
            />
            {/* Front Panel Seam Line */}
            <line x1="250" y1="135" x2="250" y2="280" stroke="#000" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.4" />
            {/* Top Button */}
            <circle cx="250" cy="132" r="8" fill={accentColor} stroke="#000" strokeWidth="1.5" />
            {/* Eyelet Vent Holes */}
            <circle cx="180" cy="200" r="3" fill="#000" opacity="0.6" />
            <circle cx="320" cy="200" r="3" fill="#000" opacity="0.6" />
            {/* Visor / Brim */}
            {view === 'front' ? (
              <path
                d="M 100 280 Q 250 340 400 280 Q 250 260 100 280 Z"
                fill={accentColor}
                stroke="#000"
                strokeWidth="2"
              />
            ) : (
              <g id="snapback-back">
                {/* Arch cutout + Snap strap */}
                <path d="M 200 280 A 50 40 0 0 1 300 280 Z" fill="#fff" />
                <rect x="200" y="270" width="100" height="12" rx="3" fill="#18181b" />
                {[210, 225, 240, 255, 270, 285].map((x) => (
                  <circle key={x} cx={x} cy="276" r="2" fill="#e4e4e7" />
                ))}
              </g>
            )}
          </g>
        );

      case 'tote-bag':
        return (
          <g id="tote-bag-main">
            {/* Handles */}
            <path
              d="M 180 220 Q 180 80 250 80 Q 320 80 320 220"
              fill="none"
              stroke={accentColor}
              strokeWidth="20"
              strokeLinecap="round"
            />
            {/* Main Canvas Body */}
            <path
              d="M 120 210 L 380 210 L 360 470 L 140 470 Z"
              fill={color}
              stroke="#000"
              strokeWidth="2.5"
            />
            {/* Top Hem stitching */}
            <line x1="120" y1="230" x2="380" y2="230" stroke="#000" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.4" />
          </g>
        );

      case 'sweatpants':
        return (
          <g id="sweatpants-main">
            {/* Waistband */}
            <rect x="160" y="100" width="180" height="35" rx="4" fill={accentColor} stroke="#000" strokeWidth="2" />
            <path d="M 240 120 L 235 150 M 260 120 L 265 150" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
            {/* Pants Legs */}
            <path
              d="M 160 135 L 140 440 L 220 440 L 245 230 L 255 230 L 280 440 L 360 440 L 340 135 Z"
              fill={color}
              stroke="#000"
              strokeWidth="2.5"
            />
            {/* Ribbed Ankle Cuffs */}
            <rect x="140" y="440" width="80" height="25" rx="3" fill={accentColor} />
            <rect x="280" y="440" width="80" height="25" rx="3" fill={accentColor} />
          </g>
        );

      case 'crop-top':
        return (
          <g id="crop-top-main">
            <path
              d="M 170 120 Q 250 150 330 120 L 415 155 L 385 230 L 350 215 L 350 340 L 150 340 L 150 215 L 115 230 L 85 155 Z"
              fill={color}
              stroke="#000"
              strokeWidth="2"
            />
            <path d="M 170 120 Q 250 160 330 120 Q 250 138 170 120 Z" fill={accentColor} />
          </g>
        );

      case 'shorts':
        return (
          <g id="shorts-main">
            {/* Waistband with Drawstrings */}
            <rect x="150" y="140" width="200" height="32" rx="4" fill={accentColor} stroke="#000" strokeWidth="2" />
            <path d="M 240 160 L 235 190 M 260 160 L 265 190" stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" />
            {/* Shorts Body */}
            <path
              d="M 150 172 L 130 360 L 230 360 L 250 240 L 270 360 L 370 360 L 350 172 Z"
              fill={color}
              stroke="#000"
              strokeWidth="2.5"
            />
            {/* Side Pockets & Hem Stitch */}
            <path d="M 150 172 L 175 230 M 350 172 L 325 230" stroke="#000" strokeWidth="1.5" opacity="0.4" />
            <line x1="130" y1="350" x2="230" y2="350" stroke="#000" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
            <line x1="270" y1="350" x2="370" y2="350" stroke="#000" strokeWidth="1.5" strokeDasharray="3 3" opacity="0.3" />
          </g>
        );

      case 'pants':
        return (
          <g id="jeans-pants-main">
            {/* Denim Waistband & Belt Loops */}
            <rect x="155" y="100" width="190" height="35" rx="3" fill={accentColor} stroke="#000" strokeWidth="2" />
            {[170, 210, 290, 330].map((x) => (
              <rect key={x} x={x} y="98" width="8" height="38" fill={color} stroke="#000" strokeWidth="1" />
            ))}
            {/* Fly Zip / Button */}
            <path d="M 250 100 L 250 180 Q 250 200 230 200" stroke="#d97706" strokeWidth="2" fill="none" />
            <circle cx="250" cy="118" r="4" fill="#d97706" stroke="#78350f" />
            {/* Jeans Legs */}
            <path
              d="M 155 135 L 125 460 L 225 460 L 248 230 L 252 230 L 275 460 L 375 460 L 345 135 Z"
              fill={color}
              stroke="#000"
              strokeWidth="2.5"
            />
            {/* Contrast Golden Stitching & Pockets */}
            <path d="M 155 135 Q 200 170 230 135" stroke="#d97706" strokeWidth="1.5" fill="none" opacity="0.8" />
            <path d="M 345 135 Q 300 170 270 135" stroke="#d97706" strokeWidth="1.5" fill="none" opacity="0.8" />
          </g>
        );

      case 'shoes':
        return (
          <g id="sneakers-shoes-main">
            {/* Sole Base */}
            <path d="M 80 340 Q 250 370 420 340 L 410 380 Q 250 410 90 380 Z" fill="#f8fafc" stroke="#000" strokeWidth="2.5" />
            <line x1="80" y1="355" x2="420" y2="355" stroke="#000" strokeWidth="2" opacity="0.3" />
            {/* Canvas High-Top Upper */}
            <path
              d="M 180 140 
                 L 270 140 
                 L 310 240 
                 L 410 290 
                 L 420 340 
                 Q 250 370 80 340 
                 L 110 290 
                 L 180 140 Z"
              fill={color}
              stroke="#000"
              strokeWidth="2.5"
            />
            {/* Rubber Toe Cap */}
            <path d="M 310 280 Q 370 290 420 340 Q 250 370 80 340 Z" fill="#ffffff" stroke="#000" strokeWidth="2" />
            {/* Eyestay & White Laces */}
            <path d="M 210 160 L 280 270" stroke={accentColor} strokeWidth="12" strokeLinecap="round" opacity="0.9" />
            {[180, 200, 220, 240, 260].map((y, idx) => (
              <line key={y} x1={200 + idx * 12} y1={y} x2={220 + idx * 12} y2={y + 8} stroke="#ffffff" strokeWidth="4" strokeLinecap="round" />
            ))}
            {/* Round Ankle Patch */}
            <circle cx="160" cy="220" r="22" fill="#ffffff" stroke="#000" strokeWidth="2" />
            <polygon points="160,206 166,218 178,218 168,226 172,238 160,230 148,238 152,226 142,218 154,218" fill="#1d4ed8" />
          </g>
        );

      default:
        return null;
    }
  };

  return (
    <div className={`relative flex items-center justify-center ${className}`}>
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full drop-shadow-2xl overflow-visible transition-all duration-300"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Fabric Texture Pattern Definitions */}
          {textureOverlay && textureOverlay.id !== 'none' && (
            <>
              {FABRIC_TEXTURES.map((t) =>
                t.id === textureOverlay.id && t.svgPattern ? (
                  <g key={t.id} dangerouslySetInnerHTML={{ __html: t.svgPattern }} />
                ) : null
              )}
            </>
          )}

          {/* Tileable Seamless Pattern Overlay */}
          {patternOverlay && patternOverlay.url && (
            <pattern
              id="garment-tile-pattern"
              patternUnits="userSpaceOnUse"
              width={patternOverlay.scale * 120}
              height={patternOverlay.scale * 120}
            >
              <image
                href={patternOverlay.url}
                x="0"
                y="0"
                width={patternOverlay.scale * 120}
                height={patternOverlay.scale * 120}
                preserveAspectRatio="xMidYMid slice"
              />
            </pattern>
          )}

          {/* Soft Shadow Filter for depth */}
          <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceAlpha" stdDeviation="6" />
            <feOffset dx="0" dy="8" result="offsetblur" />
            <feComponentTransfer>
              <feFuncA type="linear" slope="0.3" />
            </feComponentTransfer>

            <feMerge>
              <feMergeNode />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Fabric Texture Shading Gradient */}
          <radialGradient id="fabric-shading" cx="50%" cy="30%" r="70%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.12" />
            <stop offset="60%" stopColor="#000000" stopOpacity="0.02" />
            <stop offset="100%" stopColor="#000000" stopOpacity="0.25" />
          </radialGradient>
        </defs>

        <g filter="url(#soft-shadow)">
          {renderGraphic()}

          {/* Realistic Fabric Texture Overlay */}
          {textureOverlay && textureOverlay.id !== 'none' && (
            <g
              fill={`url(#texture-${textureOverlay.id})`}
              style={{
                opacity: textureOverlay.opacity,
                mixBlendMode: 'overlay',
                pointerEvents: 'none',
              }}
            >
              {renderGraphic()}
            </g>
          )}

          {/* Seamless Pattern Tile Fill Overlay */}
          {patternOverlay && patternOverlay.url && (
            <g
              fill="url(#garment-tile-pattern)"
              style={{
                opacity: patternOverlay.opacity,
                mixBlendMode: 'overlay',
                pointerEvents: 'none',
              }}
            >
              {renderGraphic()}
            </g>
          )}

          {/* Overlay Realistic Wrinkles & Fabric Shading */}
          <rect x="0" y="0" width="500" height="500" fill="url(#fabric-shading)" style={{ mixBlendMode: 'multiply', pointerEvents: 'none' }} />
        </g>
      </svg>
    </div>
  );
};
