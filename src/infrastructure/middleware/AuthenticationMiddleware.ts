import { NextFunction, Request, Response } from 'express';
import { UserRole } from '../../domain/models/User';
import { AuthorizationFactory } from '../../domain/factories/AuthorizationFactory';
import { IAuthorization } from '../../domain/auth/IAuthorization';

declare module 'express-serve-static-core' {
	interface Request {
		user: IAuthorization;
	}
}

export const AuthenticationMiddleware = (
	req: Request,
	res: Response,
	next: NextFunction,
) => {
	const auth = req.headers['fake_auth'] as UserRole | undefined;
	const authFactory = new AuthorizationFactory();

	if (!auth) {
		// Set viewer as default
		req.user = authFactory.getAuthorization();
		next();
		return;
	}

	const authorization = authFactory.getAuthorization(auth);
	req.user = authorization;
	next();
};
