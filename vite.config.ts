import { defineConfig } from 'vite';
import solidPlugin from 'vite-plugin-solid';

export default defineConfig({
  plugins: [solidPlugin()],
  build: {
    target: 'esnext',
    polyfillDynamicImport: false,
    lib: {
      entry: './src/index.tsx',
      name: 'SmartdialogWorkflowFrontend',
      fileName: 'smartdialog-workflow-frontend',
      formats: ['es'],
    },
  },
});
