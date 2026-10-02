import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Tous les cours sont des fichiers Markdown rangés par parcours :
// src/content/<parcours>/<numero>-<slug>.md
const cours = defineCollection({
  loader: glob({ base: './src/content', pattern: '**/*.md' }),
  schema: z.object({
    titre: z.string(),
    description: z.string(),
    parcours: z.string(),
    ordre: z.number(),
    niveau: z.string(),
    verifie_le: z.coerce.date(),
  }),
});

export const collections = { cours };
