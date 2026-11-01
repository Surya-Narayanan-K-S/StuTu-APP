import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      include: /\.(jsx|js)$/,
    }),
    {
      name: 'apk-mime-type',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          if (req.url?.endsWith('.apk')) {
            res.setHeader('Content-Type', 'application/vnd.android.package-archive');
            res.setHeader('Content-Disposition', 'attachment; filename="EEE-SREC-Portal.apk"');
          }
          next();
        });
      }
    }
  ],
  oxc: {
    include: /\.(m?ts|[jt]sx?)$/,
    exclude: /node_modules/,
  },
  rolldownOptions: {
    moduleTypes: {
      '.js': 'jsx',
    },
  },
});
