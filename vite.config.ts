import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        embed: './chat-embed.html'
      },
      output: {
        entryFileNames: (chunkInfo) => {
          if (chunkInfo.name.includes('embed')) {
            return 'assets/embed.[hash].js';
          }
          return 'assets/[name].[hash].js';
        }
      }
    }
  }
})
