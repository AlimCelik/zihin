import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr' 

export default defineConfig({
  plugins: [
    react(), 
    svgr({ 
      svgrOptions: {
        // Bu ayar, 'ReactComponent'in çalışmasını %100 garantiler
        exportType: 'named', 
      }
    })
  ],
})