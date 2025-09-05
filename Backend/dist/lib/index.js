// Import the base ESLint config package
import baseConfig from '@sosocio/eslint-config';
import { defineConfig } from 'eslint/config';
// Create Backend-specific ESLint configuration
export default defineConfig({
    // Use baseConfig as a base and extend it
    extends: [
        ...baseConfig
    ]
});
