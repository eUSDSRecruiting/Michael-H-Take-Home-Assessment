import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';

export default {
  content: ['src/**/*.{ts,tsx}', 'app/**/*.{ts,tsx}', 'components/**/*.{ts,tsx}'],
  theme: {
    extend: {}
  },
  plugins: [forms]
} satisfies Config;
