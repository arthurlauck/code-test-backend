import { Request, Response } from 'express';
import { TopicNotFoundException } from '../../domain/exceptions/TopicNotFound';
import { ResourceNotFoundException } from '../../domain/exceptions/ResourceNotFound';

export const errorHandler = (err: Error, req: Request, res: Response) => {
	if (
		err instanceof TopicNotFoundException ||
		err instanceof ResourceNotFoundException
	) {
		res.status(404).json({ message: err.message });
		return;
	}

	console.error(err);
	res.status(500).json({ message: 'Internal server error' });
};
