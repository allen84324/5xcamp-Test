import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	plugins: [vue()],
	server: {
		cors: true,
		proxy: {
			'/api': {
				target: 'https://bank.5xcamp.us',
				changeOrigin: true,
				secure: false,
				pathRewrite: (path) => path.replace(/^\/api/, ''),
			},
		},
	},
})
