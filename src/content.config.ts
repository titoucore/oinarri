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

// Les mini-quiz sont des fichiers YAML qui portent le même chemin que leur cours :
// src/content/quiz/<parcours>/<numero>-<slug>.yaml
// Trois types de question : qcm, vf (vrai/faux), ouverte (auto-évaluation).
const question = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('qcm'),
    question: z.string(),
    choix: z.array(z.string()).min(2),
    reponse: z.number().int().min(0),
    explication: z.string(),
  }),
  z.object({
    type: z.literal('vf'),
    affirmation: z.string(),
    reponse: z.boolean(),
    explication: z.string(),
  }),
  z.object({
    type: z.literal('ouverte'),
    question: z.string(),
    modele: z.string(),
  }),
]);

const quiz = defineCollection({
  loader: glob({ base: './src/content/quiz', pattern: '**/*.yaml' }),
  schema: z.object({
    essentiel: z.array(question).default([]),
    approfondir: z.array(question).default([]),
    expert: z.array(question).default([]),
  }),
});

export const collections = { cours, quiz };
