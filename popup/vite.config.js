import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
    plugins: [react()],
    build: {
        outDir: 'dist',
        rollupOptions: {
            input: {
                main: 'index.template.html'
            }
        },
        assetsDir: 'assets'
    },
    base: './'
})