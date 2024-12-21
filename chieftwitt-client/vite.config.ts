import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync } from 'fs'
import { resolve } from 'path'
import { fileURLToPath } from 'url'
import type { ServerOptions } from 'vite'

const __dirname = fileURLToPath(new URL('.', import.meta.url))

// https://vitejs.dev/config/
export default defineConfig(({ command }) => {
  const serverConfig: ServerOptions = {
    host: 'localhost',
  }

  // Only add HTTPS configuration in development mode
  if (command === 'serve') {
    serverConfig.https = {
      key: readFileSync(resolve(__dirname, './.cert/key.pem')),
      cert: readFileSync(resolve(__dirname, './.cert/cert.pem')),
    }
  }

  return {
    plugins: [react()],
    server: serverConfig
  }
})
