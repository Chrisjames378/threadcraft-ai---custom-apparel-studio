import express from 'express';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = process.env.PORT ? parseInt(process.env.PORT) : 3000;

  app.use(express.json({ limit: '15mb' }));

  const ai = new GoogleGenAI({
    apiKey: process.env.GEMINI_API_KEY || '',
    httpOptions: {
      headers: {
        'User-Agent': 'aistudio-build',
      },
    },
  });

  // AI Chatbot Assistant Endpoint
  app.post('/api/ai/chat', async (req, res) => {
    try {
      const { messages = [], garmentContext = {} } = req.body;

      const systemInstruction = `You are ThreadBot, the premier AI Fashion Director, Master Garment Printer, and Streetwear Brand Consultant inside ThreadCraft AI Custom Apparel Studio.
Your role:
- Provide friendly, expert design advice on apparel customizing (t-shirts, hoodies, jackets, caps, tote bags, sweatpants).
- Advise on color harmony, font pairings, print techniques (DTG, Screen Print, Puff Embroidery, Foil), fabric choices, and street culture trends.
- Keep responses concise (2-4 sentences or short bullet points), inspiring, and stylish.
- Current Garment Context: ${JSON.stringify(garmentContext)}.`;

      const formattedPrompt = messages
        .map((m: any) => `${m.role === 'user' ? 'User' : 'ThreadBot'}: ${m.content}`)
        .join('\n') + '\nThreadBot:';

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: formattedPrompt,
        config: {
          systemInstruction,
        },
      });

      const reply = response.text || "I'm here to help you design your ideal custom clothing piece!";
      return res.json({ success: true, reply });
    } catch (err: any) {
      console.error('Chatbot error:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to generate chat response.' });
    }
  });

  // AI Seamless Repeating Pattern Generator Endpoint
  app.post('/api/ai/generate-pattern', async (req, res) => {
    try {
      const { prompt, patternStyle = 'Streetwear Camo', colorPalette = 'Vibrant' } = req.body;
      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
      }

      const fullPrompt = `Seamless tileable repeating pattern tile, textile print texture design for apparel fabric. Style: ${patternStyle}. Color palette: ${colorPalette}. Subject: ${prompt}. Flat 2D vector repeat pattern tile, seamless edge-to-edge tileable surface texture, suitable for allover clothing print, no garment mockup, strictly flat repeat pattern tile.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: fullPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
          },
        },
      });

      let imageUrl: string | null = null;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const mime = part.inlineData.mimeType || 'image/png';
            imageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (imageUrl) {
        return res.json({ success: true, imageUrl });
      } else {
        return res.status(500).json({ success: false, error: 'Model did not return pattern tile' });
      }
    } catch (err: any) {
      console.error('Error generating pattern tile:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to generate pattern' });
    }
  });

  // AI Graphic Generator Endpoint
  app.post('/api/ai/generate-graphic', async (req, res) => {
    try {
      const { prompt, style = 'streetwear', colorPalette = 'vibrant' } = req.body;
      if (!prompt) {
        return res.status(400).json({ success: false, error: 'Prompt is required' });
      }

      const fullPrompt = `Isolated design graphic badge, vector illustration, sticker design or t-shirt print logo artwork. Style: ${style}. Color palette: ${colorPalette}. Subject: ${prompt}. Clean sharp outline on solid white background, high contrast, graphic vector artwork suitable for garment printing, no mockup shirt, strictly isolated artwork subject.`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.1-flash-lite-image',
        contents: {
          parts: [{ text: fullPrompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: '1:1',
          },
        },
      });

      let imageUrl: string | null = null;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const mime = part.inlineData.mimeType || 'image/png';
            imageUrl = `data:${mime};base64,${part.inlineData.data}`;
            break;
          }
        }
      }

      if (imageUrl) {
        return res.json({ success: true, imageUrl });
      } else {
        return res.status(500).json({ success: false, error: 'Model did not return image data' });
      }
    } catch (err: any) {
      console.error('Error generating graphic:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to generate artwork' });
    }
  });

  // AI Design Critique Endpoint
  app.post('/api/ai/critique-design', async (req, res) => {
    try {
      const { garmentType, color, layers = [], printMethod } = req.body;
      const prompt = `You are an expert fashion director and master garment printer.
Analyze this garment design specification:
- Garment Type: ${garmentType}
- Base Color: ${color}
- Print Technique: ${printMethod}
- Design Elements Count: ${layers.length}
- Elements Summary: ${JSON.stringify(
        layers.map((l: any) => ({
          type: l.type,
          text: l.text || undefined,
          fontFamily: l.fontFamily || undefined,
          color: l.color || undefined,
          sizeScale: l.scale || undefined,
        }))
      )}

Provide a concise critique and production report in valid JSON format with keys:
- overallScore: number (0 to 100)
- productionRating: string ("Excellent", "Good", "Moderate", or "Requires Tweaks")
- contrastCheck: string (e.g. "High contrast, text easily readable against base color")
- printMethodFit: string (e.g. "DTG printing is ideal for this detailed artwork")
- aestheticFeedback: string (1-2 sentences on balance, vibe, and positioning)
- stylingTips: array of 3 bullet points with fashion styling recommendations`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const data = JSON.parse(response.text || '{}');
      return res.json({ success: true, data });
    } catch (err: any) {
      console.error('Error critiquing design:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to critique design' });
    }
  });

  // AI Design Ideas Generator Endpoint
  app.post('/api/ai/generate-ideas', async (req, res) => {
    try {
      const { theme = 'Urban Cyberpunk', garmentType = 'Hoodie' } = req.body;
      const prompt = `Generate 4 distinct creative streetwear / custom apparel design concepts for a ${garmentType} based on the theme "${theme}".
Return a JSON array of objects, where each object has:
- title: string (cool short name)
- description: string (1 sentence summary)
- garmentColor: string (hex color code e.g. "#18181b")
- graphicPrompt: string (detailed prompt to feed into AI image generator)
- badgeText: string (slogan or graphic text e.g. "FUTURE IS NOW")
- fontStyle: string ("Bebas Neue", "Cinzel", "Press Start 2P", "UnifrakturMaguntia", "Fira Code", or "Outfit")
- styleCategory: string ("Y2K Cyber", "Minimalist Vintage", "Heavy Metal Gothic", "Japanese Graphic", "Botanical Line Art")`;

      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json',
        },
      });

      const ideas = JSON.parse(response.text || '[]');
      return res.json({ success: true, ideas });
    } catch (err: any) {
      console.error('Error generating ideas:', err);
      return res.status(500).json({ success: false, error: err.message || 'Failed to generate ideas' });
    }
  });

  // Vite Integration in Development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'custom',
    });
    app.use(vite.middlewares);
    app.use('*', async (req, res, next) => {
      try {
        const url = req.originalUrl;
        const templatePath = path.resolve(__dirname, 'index.html');
        let template = fs.readFileSync(templatePath, 'utf-8');
        template = await vite.transformIndexHtml(url, template);
        res.status(200).set({ 'Content-Type': 'text/html' }).end(template);
      } catch (e: any) {
        vite.ssrFixStacktrace(e);
        next(e);
      }
    });
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`ThreadCraft AI server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
