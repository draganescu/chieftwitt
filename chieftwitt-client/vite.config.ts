import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    https: {
      key: readFileSync(resolve(__dirname, './.cert/key.pem')),
      cert: readFileSync(resolve(__dirname, './.cert/cert.pem')),
    },
    host: 'localhost',
  },
})
