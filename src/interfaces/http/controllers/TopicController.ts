import { Request, Response } from 'express';
import { CreateTopicDTO } from '../../../domain/dto/createTopicDTO';
import { UpdateTopicDTO } from '../../../domain/dto/updateTopicDTO';
import { ITopicService } from '../../../domain/services/TopicService';
import { ITopicTreeService } from '../../../domain/services/TopicTreeService';
import { ITopicPathService } from '../../../domain/services/TopicPathService';
import {
	createTopicSchema,
	updateTopicSchema,
} from '../validators/topicSchema';

export class TopicController {
	constructor(
		private topicService: ITopicService,
		private topicTreeService: ITopicTreeService,
		private topicPathService: ITopicPathService,
	) {}

	public getTopic = (req: Request, res: Response) => {
		const id = req.params.id as string;
		const topic = this.topicService.getTopicWithResourcesById(id);
		res.status(200).json(topic);
	};

	public getTopicByVersion = (req: Request, res: Response) => {
		const id: string | undefined = req.params.id;
		const version: number = parseInt(req.params.version!);
		const topic = this.topicService.getTopicByVersion(id!, version);
		res.status(200).json(topic);
	};

	public getTopicTree = (req: Request, res: Response) => {
		const id: string | undefined = req.params.id;
		const topicTree = this.topicTreeService.getTopicTree(id!);

		res.status(200).json(topicTree);
	};

	public getTopicPath = (req: Request, res: Response) => {
		const fromId = req.params.fromId as string;
		const toId = req.params.toId as string;
		const path = this.topicPathService.getTopicPath(fromId, toId);
		res.status(200).json(path);
	};

	public createTopic = (req: Request, res: Response) => {
		const validator = createTopicSchema.safeParse(req.body);
		if (!validator.success) {
			res.status(422).json({
				error: 'Validation error',
				message: validator.error.format(),
			});
			return;
		}

		const createTopicDTO: CreateTopicDTO = req.body;
		const topic = this.topicService.createTopic(createTopicDTO);
		res.status(201).json(topic);
	};

	public updateTopic = (req: Request, res: Response) => {
		const validator = updateTopicSchema.safeParse(req.body);
		if (!validator.success) {
			res.status(422).json({
				error: 'Validation error',
				message: validator.error.format(),
			});
			return;
		}

		const id = req.params.id as string;
		const updateTopicDTO: UpdateTopicDTO = req.body;
		const topic = this.topicService.updateTopic(id, updateTopicDTO);
		res.status(200).json(topic);
	};

	public deleteTopic = (req: Request, res: Response) => {
		const id: string | undefined = req.params.id;
		this.topicService.deleteTopic(id!);
		res.status(204).send();
	};
}
