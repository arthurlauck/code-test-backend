import { Request, Response } from 'express';
import { CreateResourceDTO } from '../../../domain/dto/createResourceDTO';
import { UpdateResourceDTO } from '../../../domain/dto/updateResourceDTO';
import { IResourceService } from '../../../domain/services/ResourceService';
import {
	createResourceSchema,
	updateResourceSchema,
} from '../validators/resourceSchema';

export default class ResourceController {
	constructor(private resourceService: IResourceService) {}

	public getResource = (req: Request, res: Response) => {
		const id = req.params.id;
		const resource = this.resourceService.getResourceById(id!);
		res.status(200).json(resource);
	};

	public createResource = (req: Request, res: Response) => {
		const validator = createResourceSchema.safeParse(req.body);
		if (!validator.success) {
			res.status(422).json({
				error: 'Validation error',
				message: validator.error.format(),
			});
			return;
		}

		const createResourceDTO: CreateResourceDTO = req.body;
		const resource = this.resourceService.createResource(createResourceDTO);
		res.status(201).json(resource);
	};

	public updateResource = (req: Request, res: Response) => {
		const validator = updateResourceSchema.safeParse(req.body);
		if (!validator.success) {
			res.status(422).json({
				error: 'Validation error',
				message: validator.error.format(),
			});
			return;
		}

		const id = req.params.id as string;
		const updateResourceDTO: UpdateResourceDTO = req.body;
		const resource = this.resourceService.updateResource(
			id,
			updateResourceDTO,
		);
		res.status(200).json(resource);
	};

	public deleteResource = (req: Request, res: Response) => {
		const id = req.params.id as string;
		this.resourceService.deleteResource(id);
		res.status(204).send();
	};
}
