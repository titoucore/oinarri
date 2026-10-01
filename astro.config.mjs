import { defineConfig } from 'astro/config';

export default defineConfig({
  site: 'https://oinarri.etika.eus',
  output: 'static',
  build: { format: 'directory' },
});
