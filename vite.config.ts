import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  // URL pública do site (usada nas tags Open Graph, que precisam de URL absoluta).
  const siteUrl = (env.VITE_SITE_URL || 'https://exemplo.org').replace(/\/$/, '');

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'inject-site-url',
        transformIndexHtml: (html) => html.replaceAll('__SITE_URL__', siteUrl),
      },
    ],
    server: {
      port: 5173,
      // Dentro do Docker (principalmente no Windows/macOS) os eventos de arquivo
      // nem sempre chegam ao container; o polling garante o hot reload.
      watch: env.WATCH_POLLING === 'true' ? { usePolling: true, interval: 300 } : undefined,
    },
  };
});
