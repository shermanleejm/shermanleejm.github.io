import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import viteTsconfigPaths from 'vite-tsconfig-paths';
import svgrPlugin from 'vite-plugin-svgr';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react({
    include: "**/*.tsx"
  }), viteTsconfigPaths(), svgrPlugin()],
  server: {
    port: 3000,
    watch: {
      ignored: ['!**/node_modules/@mui/**']
    }
  },
  build: {
    outDir: 'build',
  },
});
