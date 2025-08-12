
import { defineCollection, z } from 'astro:content';


import { glob, } from 'astro/loaders';


const post = defineCollection({
    loader: glob({ base: "./src/content/post/", pattern: "**/*.{md,mdx}" }),

    schema: z.object({
        title: z.string(),
        description: z.string(),
        date: z.string(),
    }),

});


export const collections = { post };