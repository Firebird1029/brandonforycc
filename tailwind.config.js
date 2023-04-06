/** @type {import('tailwindcss').Config} */
module.exports = {
	content: [
		"./app/**/*.{js,ts,jsx,tsx}",
		"./pages/**/*.{js,ts,jsx,tsx}",
		"./components/**/*.{js,ts,jsx,tsx}",

		// Or if using `src` directory:
		"./src/**/*.{js,ts,jsx,tsx}",
	],
	theme: {
		extend: {
			colors: {
				"title-blue1": "#062446",
				"title-blue2": "#00356B",
				"title-blue3": "#0038FF", // THIS IS SET AT 50% OPACITY IN THE LOGO
				"yee-yellow": "#FFDA56",
				"why-yee-green1": "#224225",
				"why-yee-green2": "#039A00", // THIS IS SET AT 50% OPACITY IN THE LOGO
			},
		},
	},
	plugins: [],
};
