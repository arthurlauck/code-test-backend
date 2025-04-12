import { defineConfig } from 'eslint/config';
import js from '@eslint/js';
import globals from 'globals';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier/flat';

export default defineConfig([
	{
		files: ['src/**/*.{js,mjs,cjs,ts}'],
		plugins: { js },
		extends: ['js/recommended'],
	},
	{
		files: ['src/**/*.{js,mjs,cjs,ts}'],
		languageOptions: { globals: globals.browser },
	},
	{
		files: ['src/**/*.{js,mjs,cjs,ts}'],
		extends: [tseslint.configs.recommended],
	},
	eslintConfigPrettier,
]);
