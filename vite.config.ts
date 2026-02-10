
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, '.', '');
  return {
    plugins: [react()],
    define: {
      // Safely expose API_KEY
      'process.env.API_KEY': JSON.stringify(env.API_KEY),
      // Prevent crash when code accesses other process.env props, but don't expose system envs
      'process.env': {} 
    }
  }
})
