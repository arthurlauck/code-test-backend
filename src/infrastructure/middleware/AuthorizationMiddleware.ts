import { NextFunction, Request, Response } from 'express';
import { Action } from '../../domain/auth/IAuthorization';

export const AuthorizationMiddleware =
	(action: Action) => (req: Request, res: Response, next: NextFunction) => {
		const isAuthorized = req.user.isAuthorized(action);
		if (!isAuthorized) {
			res.status(403).json({ message: 'Not allowed' });
			return;
		}

		next();
	};
