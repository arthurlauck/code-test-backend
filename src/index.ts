import express, { Request, Response } from 'express';
import config from './infrastructure/config/config';
import topicRoutes from './interfaces/http/routes/topicRoutes';
import resourceRoutes from './interfaces/http/routes/resourceRoutes';
import { AuthenticationMiddleware } from './infrastructure/middleware/AuthenticationMiddleware';
import { errorHandler } from './infrastructure/middleware/ErrorHandlerMiddleware';

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

app.listen(config.port, () => {
	console.log(`Server running on port ${config.port}`);
});
