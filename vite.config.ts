import { defineConfig } from 'vite'
import Tov from './presets'

export default defineConfig({
	server: {
		port: 3007,
	},
	plugins: [Tov()],
})
