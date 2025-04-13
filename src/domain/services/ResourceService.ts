import { CreateResourceDTO } from '../dto/createResourceDTO';
import { ResourceNotFoundException } from '../exceptions/ResourceNotFound';
import { Resource } from '../models/Resource';
import IResourceRepository from '../repositories/IResourceRepository';
import { ITopicResourceMediator } from './TopicResourceMediator';

export interface IResourceService {
	getResourceById(id: string): Resource;
	getResourcesByTopicId(topicId: string): Resource[];
	createResource(createResourceDTO: CreateResourceDTO): Resource | null;
	updateResource(
		id: string,
		updateResourceDTO: Partial<CreateResourceDTO>,
	): Resource | null;
	deleteResource(id: string): void;
}

export class ResourceService implements IResourceService {
	constructor(
		private resourceRepo: IResourceRepository,
		private mediator: ITopicResourceMediator,
	) {}

	public getResourceById = (id: string): Resource => {
		const resource = this.resourceRepo.getResourceById(id);
		if (!resource) {
			throw new ResourceNotFoundException(id);
		}

		return resource;
	};

	public getResourcesByTopicId = (topicId: string): Resource[] => {
		const resources = this.resourceRepo.getResourcesByTopicId(topicId);
		if (!resources) {
			return [];
		}
		return resources;
	};

	public createResource = (
		createResourceDTO: CreateResourceDTO,
	): Resource => {
		// Check if the topic exists
		this.mediator.getTopicById(createResourceDTO.topicId);

		const resource = new Resource(
			crypto.randomUUID(),
			createResourceDTO.topicId,
			createResourceDTO.url,
			createResourceDTO.description,
			createResourceDTO.type,
			new Date(),
			new Date(),
		);

		this.resourceRepo.createResource(resource);
		return resource;
	};

	public updateResource = (
		id: string,
		updateResourceDTO: Partial<CreateResourceDTO>,
	): Resource => {
		const resource = this.getResourceById(id);

		if (updateResourceDTO.topicId) {
			// make sure the topic exists
			this.mediator.getTopicById(updateResourceDTO.topicId);
		}

		const updatedResource = new Resource(
			resource.id,
			updateResourceDTO.topicId || resource.topicId,
			updateResourceDTO.url || resource.url,
			updateResourceDTO.description || resource.description,
			updateResourceDTO.type || resource.type,
			resource.createdAt,
			new Date(),
		);

		this.resourceRepo.updateResource(updatedResource);
		return updatedResource;
	};

	public deleteResource = (id: string): void => {
		const resource = this.getResourceById(id);
		this.resourceRepo.deleteResource(resource);
	};
}
