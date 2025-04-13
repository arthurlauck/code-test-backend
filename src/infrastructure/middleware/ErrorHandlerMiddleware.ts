import { NextFunction, Request, Response } from 'express';
import { TopicNotFoundException } from '../../domain/exceptions/TopicNotFound';
import { ResourceNotFoundException } from '../../domain/exceptions/ResourceNotFound';

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	next: NextFunction, // next should be present to match the express middleware signature
) => {
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
