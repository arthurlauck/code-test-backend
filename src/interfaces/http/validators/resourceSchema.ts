import { z } from 'zod';

export const createResourceSchema = z.object({
	topicId: z.string(),
	url: z.string().url(),
	description: z.string().min(1).max(1000),
	type: z.enum(['video', 'article', 'pdf']),
});

export const updateResourceSchema = z.object({
	topicId: z.string().optional(),
	url: z.string().url().optional(),
	description: z.string().min(1).max(1000).optional(),
	type: z.enum(['video', 'article', 'pdf']).optional(),
});
