import type { Config } from 'tailwindcss'

const config: Config = {
	content: [
		'./src/pages/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/components/**/*.{js,ts,jsx,tsx,mdx}',
		'./src/app/**/*.{js,ts,jsx,tsx,mdx}'
	],
	theme: {
		extend: {
			colors: {
				bg: '#16171B',
        primary: '#00B275',
				secondary: '#E5A032',
        text: '#FFFFFF',
        card: '#202125'
			}
		}
	},
	plugins: []
}
export default config
