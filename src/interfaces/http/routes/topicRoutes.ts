import express from 'express';
import { container } from '../../../infrastructure/di/container';
import { AuthorizationMiddleware } from '../../../infrastructure/middleware/AuthorizationMiddleware';
import { Action } from '../../../domain/auth/IAuthorization';

const topicController = container.topicController;

const router = express.Router();

router.get(
	'/:id',
	AuthorizationMiddleware(Action.READ),
	topicController.getTopic,
);
router.get(
	'/:id/version/:version',
	AuthorizationMiddleware(Action.READ),
	topicController.getTopicByVersion,
);
router.get(
	'/:id/tree',
	AuthorizationMiddleware(Action.READ),
	topicController.getTopicTree,
);
router.get(
	'/path/:fromId/:toId',
	AuthorizationMiddleware(Action.READ),
	topicController.getTopicPath,
);
router.post(
	'/',
	AuthorizationMiddleware(Action.WRITE),
	topicController.createTopic,
);
router.put(
	'/:id',
	AuthorizationMiddleware(Action.WRITE),
	topicController.updateTopic,
);
router.delete(
	'/:id',
	AuthorizationMiddleware(Action.WRITE),
	topicController.deleteTopic,
);

export default router;
