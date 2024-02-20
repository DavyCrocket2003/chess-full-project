import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  // server: {
  //   host: '0.0.0.0',
  //   proxy: {
  //     '/socket.io/': {
  //       target: 'http:localhost:8181',
  //       changeOrigin: true,
  //       secure: false,
  //       ws: true,
  //     }
  //   }
  // },
  plugins: [react()],
})
