import { z, defineCollection } from 'astro:content';

const profilesCollection = defineCollection({
  type: 'content', // v2.5.0 and later
  schema: z.object({
    title: z.string(),
    date: z.date().optional(),
    tags: z.array(z.string()).optional(),
    coverImage: z.string().optional(),
  })
});

const timelineCollection = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    date: z.date().optional(),
    coverImage: z.string().optional()
  })
});

export const collections = {
  'profiles': profilesCollection,
  'timeline': timelineCollection
};
