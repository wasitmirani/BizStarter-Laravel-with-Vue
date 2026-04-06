import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import dynamicImport from 'vite-plugin-dynamic-import';

export default defineConfig({
  // resolve: {
  //   alias: {
  //     '@': path.resolve(__dirname, 'resources/ts/backend/Pages'), // Ensure path is correct
  //   },
  // },
  plugins: [
    vue(),
    dynamicImport({
      // Plugin options if needed to ensure dynamic import compatibility
      // Leave empty or add options as necessary
    }),
    laravel({
      input: [
        'resources/css/app.css',
        'resources/ts/Backend/app.ts',
        'resources/ts/Frontend/app.ts',
      ],
      refresh: true,
    }),
  ],
});
