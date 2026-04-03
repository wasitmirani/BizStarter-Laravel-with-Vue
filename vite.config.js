import { defineConfig } from 'vite';
// import path from 'path'; // Import path module
import vue from '@vitejs/plugin-vue';
import laravel from 'laravel-vite-plugin';
import dynamicImport from 'vite-plugin-dynamic-import'; // Uncomment if needed

export default defineConfig({
//   resolve: {
//     alias: {
//       '@': path.resolve(__dirname, 'resources/ts/backend/Pages'), // Ensure path is correct
//     },
//   },
  plugins: [
    vue(),
    dynamicImport(), // Uncomment if using dynamic imports
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
