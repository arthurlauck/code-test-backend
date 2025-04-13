import express, { Request, Response } from 'express';
import topicRoutes from '../../interfaces/http/routes/topicRoutes';
import resourceRoutes from '../../interfaces/http/routes/resourceRoutes';
import { AuthenticationMiddleware } from '../middleware/AuthenticationMiddleware';
import { errorHandler } from '../middleware/ErrorHandlerMiddleware';

const app = express();

app.use(express.json());
app.use(AuthenticationMiddleware);

app.use('/topic', topicRoutes);
app.use('/resource', resourceRoutes);

app.use((req: Request, res: Response) => {
	res.status(404).json({
		message: `Route not found`,
	});
});

app.use(errorHandler);

export default app;
