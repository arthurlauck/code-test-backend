import { NextFunction, Request, Response } from 'express';
import { TopicNotFoundException } from '../../domain/exceptions/TopicNotFound';

export const errorHandler = (
	err: Error,
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	if (err instanceof TopicNotFoundException) {
		res.status(404).json({ message: err.message });
		return;
	}

	console.error(err);
	res.status(500).json({ message: 'Internal server error' });
};
