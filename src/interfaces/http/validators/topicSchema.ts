import { z } from 'zod';

export const createTopicSchema = z.object({
	name: z.string().min(1).max(100),
	content: z.string().min(1).max(1000),
	parentTopicId: z.string().optional(),
});

export const updateTopicSchema = z.object({
	name: z.string().min(1).max(100).optional(),
	content: z.string().min(1).max(1000).optional(),
	parentTopicId: z.string().optional(),
});
