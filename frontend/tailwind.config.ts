import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
      colors: {
        'main-color': '#242D3C',
        'gray-color': '#707070',
        // 'trello-color': '#0079B2',
        'trello-color': '#4b6794',
        'light-blue': '#AEC5F0',
      },
      fontSize: {
        default: '24px',
        smaller: '20px',
        mini: '10px',
      },
      backgroundColor: {
        'gray-bg': '#EEEEEE',
        test: '#3D4D66',
      },
    },
  },
  plugins: [],
};
export default config;
