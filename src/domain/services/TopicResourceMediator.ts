import Topic from '../models/Topic';
import Resource from '../models/Resource';
import ITopicService from './TopicService';
import { IResourceService } from './ResourceService';

export interface ITopicResourceMediator {
	getTopicById(id: string): Topic;
	getTopicChildren(id: string): Topic[];
	getResourceById(id: string): Resource | null;
	getResourcesByTopicId(topicId: string): Resource[];
	deleteResource(id: string): void;
}

export class TopicResourceMediator implements ITopicResourceMediator {
	private topicService: ITopicService | null = null;
	private resourceService: IResourceService | null = null;

	public setTopicService(service: ITopicService) {
		this.topicService = service;
	}

	public setResourceService(service: IResourceService) {
		this.resourceService = service;
	}

	public getTopicById(id: string): Topic {
		if (!this.topicService) {
			throw new Error('TopicService not initialized in mediator');
		}
		return this.topicService.getTopicById(id);
	}

	public getTopicChildren(id: string): Topic[] {
		if (!this.topicService) {
			throw new Error('TopicService not initialized in mediator');
		}
		return this.topicService.getTopicChildren(id);
	}

	public getResourceById(id: string): Resource {
		if (!this.resourceService) {
			throw new Error('ResourceService not initialized in mediator');
		}
		return this.resourceService.getResourceById(id);
	}

	public getResourcesByTopicId(topicId: string): Resource[] {
		if (!this.resourceService) {
			throw new Error('ResourceService not initialized in mediator');
		}
		return this.resourceService.getResourcesByTopicId(topicId);
	}

	public deleteResource(id: string): void {
		if (!this.resourceService) {
			throw new Error('ResourceService not initialized in mediator');
		}
		this.resourceService.deleteResource(id);
	}
}
