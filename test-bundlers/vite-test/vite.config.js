import { defineConfig } from 'vite';

export default defineConfig(({ mode }) => ({
  build: {
    // The 'vite build' command minifies by default. We need to explicitly
    // disable it for development mode to keep the debug messages.
    minify: mode === 'production',
  },
}));
