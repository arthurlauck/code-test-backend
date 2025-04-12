import express from 'express';
import { container } from '../../../infrastructure/di/container';
import { AuthorizationMiddleware } from '../../../infrastructure/middleware/AuthorizationMiddleware';
import { Action } from '../../../domain/auth/IAuthorization';

const router = express.Router();
const resourceController = container.resourceController;

router.get(
	'/:id',
	AuthorizationMiddleware(Action.READ),
	resourceController.getResource,
);
router.post(
	'/',
	AuthorizationMiddleware(Action.WRITE),
	resourceController.createResource,
);
router.put(
	'/:id',
	AuthorizationMiddleware(Action.WRITE),
	resourceController.updateResource,
);
router.delete(
	'/:id',
	AuthorizationMiddleware(Action.WRITE),
	resourceController.deleteResource,
);

export default router;
