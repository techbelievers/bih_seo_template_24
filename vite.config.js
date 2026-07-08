import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { createHtmlPlugin } from 'vite-plugin-html';
import fs from 'fs';
import path from 'path';

// Read and parse SEO data from seodata.json (with fallback when fetch returns HTML/404)
function loadSeoData() {
  const defaultData = {
    success: true,
    data: {
      title: 'Default Title',
      meta_description: 'Default Description',
      keywords: '',
      og_title: '',
      og_description: '',
      og_image: '',
      og_type: 'website',
      favicon: '',
      status: 'Active',
      script_1: '',
      script_2: '',
      domain: '',
      lang: 'en',
      gtag_id: null,
      whatsapp_gtag_id: null,
      phone_conversation_number: null,
      phone_conversation_id: null,
    },
  };

  try {
    const filePath = path.resolve(process.cwd(), 'seodata.json');
    if (!fs.existsSync(filePath)) return defaultData;

    const content = fs.readFileSync(filePath, 'utf-8');
    if (content.trim().startsWith('<')) {
      console.warn('[vite] seodata.json contains HTML (likely 404/error page), using defaults');
      return defaultData;
    }

    const parsed = JSON.parse(content);
    return parsed?.data ? parsed : defaultData;
  } catch (e) {
    console.warn('[vite] Could not load seodata.json, using defaults:', e.message);
    return defaultData;
  }
}

const seoData = loadSeoData();

export default defineConfig({
  
  plugins: [
    react(),
    tailwindcss(),
    createHtmlPlugin({
      inject: {
        data: {
          title: seoData.data.title || 'Default Title',
          description: seoData.data.meta_description || 'Default Description',
          keywords: seoData.data.keywords || '',
          og_title: seoData.data.og_title || '',
          og_description: seoData.data.og_description || '',
          og_image: seoData.data.og_image || '',
          og_type: seoData.data.og_type || '',
          favicon: seoData.data.favicon || '',
          robots:
            seoData.data.status === 'Active' ? 'index, follow' : 'noindex, nofollow',
          script_1: seoData.data.script_1 ? JSON.stringify(JSON.parse(seoData.data.script_1), null, 2) : '{}',
          script_2: seoData.data.script_2 ? JSON.stringify(JSON.parse(seoData.data.script_2), null, 2) : '{}',
          domain: seoData.data.domain || '',
          h1_text :  seoData.data.title || 'Default Title',
          h2_text :  seoData.data.meta_description || 'Default Title',
          gtag_id :  seoData.data.gtag_id || null,
          whatsapp_gtag_id :  seoData.data.whatsapp_gtag_id || null,
          phone_conversation_number :  seoData.data.phone_conversation_number || null,
          phone_conversation_id :  seoData.data.phone_conversation_id || null,

        },
      },
    })
  ],
  define: {
  'import.meta.env.VITE_H1': JSON.stringify(seoData.data.title || ''),
  'import.meta.env.VITE_H2': JSON.stringify( seoData.data.meta_description || ''),
  },
  build: {
    target: 'es2019',
    rollupOptions: {
      output: {
        // Long-cached vendor chunk; page code stays tiny
        manualChunks: {
          vendor: ['react', 'react-dom', 'react-router-dom', 'react-helmet-async'],
        },
      },
    },
  },
});
