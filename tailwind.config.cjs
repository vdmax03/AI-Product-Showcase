/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./index.html",
		"./index.tsx",
		"./App.tsx",
		"./components/**/*.{ts,tsx}",
		"./services/**/*.{ts,tsx}"
	],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", "ui-sans-serif", "system-ui", "Segoe UI", "Roboto", "Helvetica Neue", "Arial", "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"]
			}
		}
	},
	plugins: [],
};


