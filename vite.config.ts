import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      build: {
        rollupOptions: {
          input: {
            main: path.resolve(__dirname, 'index.html'),
            datafall: path.resolve(__dirname, 'datafall.html'),
            entity_collab: path.resolve(__dirname, 'entity_collab.html'),
            extractivist_realism: path.resolve(__dirname, 'extractivist_realism.html'),
            paintdelic: path.resolve(__dirname, 'paintdelic.html'),
            ravecat: path.resolve(__dirname, 'ravecat.html'),
            word_arp: path.resolve(__dirname, 'word_arp.html')
          }
        }
      },
      plugins: [react(), tailwindcss()],
      define: {
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
