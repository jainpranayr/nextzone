/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		'./pages/**/*.{js,ts,jsx,tsx}',
		'./components/**/*.{js,ts,jsx,tsx}',
	],
	theme: {
		extend: {
			keyframes: {
				wiggle: {
					'0%': { transform: 'rotate(5deg)' },
					'25%': { transform: 'rotate(-5deg)' },
					'50%': { transform: 'rotate(5deg)' },
					'75%': { transform: 'rotate(-5deg)' },
					'100%': { transform: ' rotate(0deg)' },
				},
			},
			animation: {
				wiggle: 'wiggle 1s ease-in-out',
			},
		},
	},
	plugins: [
		require('@tailwindcss/typography'),
		require('@tailwindcss/aspect-ratio'),
		require('@tailwindcss/forms'),
		require('@tailwindcss/line-clamp'),
	],
}
