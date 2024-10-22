import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  css: {
    devSourcemap: true, // Enable source maps for CSS
  },
});


// https://vitejs.dev/config/
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