import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// TLR: articoli divulgativi (src/content/tlr/*.md)
const tlr = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tlr' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    abstract: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    author: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

// Projects: lavori universitari, personali e professionali (src/content/projects/*.md)
const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    title: z.string(),
    summary: z.string(),
    date: z.coerce.date(),
    kind: z.enum(['University', 'Personal', 'Work']),
    stack: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    repo: z.string().url().optional(),      // link al codice (GitHub, ...)
    link: z.string().url().optional(),      // demo, paper, poster, ...
    tlr: z.string().optional(),             // slug di un articolo TLR collegato
    draft: z.boolean().default(false),
  }),
});

export const collections = { tlr, projects };
