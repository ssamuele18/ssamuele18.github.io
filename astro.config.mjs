import { defineConfig } from 'astro/config';
import { unified } from '@astrojs/markdown-remark';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

// Se pubblichi su https://USERNAME.github.io/ (repo chiamata USERNAME.github.io)
// lascia base '/'. Se la repo ha un altro nome, metti base: '/nome-repo'.
export default defineConfig({
  site: 'https://ssamuele18.github.io',
  base: '/',
  markdown: {
    processor: unified({
      remarkPlugins: [remarkMath],
      rehypePlugins: [rehypeKatex],
    }),
    shikiConfig: { theme: 'github-dark' },
  },
});
