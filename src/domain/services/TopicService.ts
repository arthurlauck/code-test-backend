import crypto from 'crypto';
import Topic from '../models/Topic';
import { CreateTopicDTO } from '../dto/createTopicDTO';
import { UpdateTopicDTO } from '../dto/updateTopicDTO';
import { TopicWithResource } from '../dto/topicWithResourceDTO';
import { ITopicRepository } from '../repositories/ITopicRepository';
import { ITopicResourceMediator } from './TopicResourceMediator';
import { TopicNotFoundException } from '../exceptions/TopicNotFound';

export default interface ITopicService {
	getTopicById(id: string): Topic | null;
	getTopicWithResourcesById(id: string): TopicWithResource | null;
	getTopicByVersion(id: string, version: number): Topic | null;
	getTopicPath(fromId: string, toId: string): string[];
	getTopicChildren(id: string): Topic[];
	createTopic(createTopicDTO: CreateTopicDTO): Topic;
	updateTopic(id: string, updateTopicDTO: UpdateTopicDTO): Topic | null;
	deleteTopic(id: string): void;
}

export default class TopicService implements ITopicService {
	constructor(
		private topicRepo: ITopicRepository,
		private topicResourceMediator: ITopicResourceMediator,
	) {}

	public getTopicById(id: string): Topic {
		const topic = this.topicRepo.getTopicById(id);
		if (!topic) {
			throw new TopicNotFoundException(id);
		}

		return topic;
	}

	public getTopicWithResourcesById(id: string): TopicWithResource | null {
		const topic = this.getTopicById(id);

		const resources = this.topicResourceMediator.getResourcesByTopicId(id);
		return {
			...topic,
			resources: resources,
		};
	}

	public getTopicByVersion = (id: string, version: number): Topic | null => {
		const topic = this.topicRepo.getTopicByVersion(id, version);
		if (!topic) {
			return null;
		}
		return topic;
	};

	public getTopicChildren(id: string): Topic[] {
		return this.topicRepo.getTopicChildren(id);
	}

	public createTopic = (createTopicDTO: CreateTopicDTO): Topic => {
		if (createTopicDTO.parentTopicId) {
			// check if the parent topic exists
			this.getTopicById(createTopicDTO.parentTopicId);
		}

		const topic = new Topic(
			crypto.randomUUID(),
			createTopicDTO.name,
			createTopicDTO.content,
			new Date(),
			new Date(),
			1,
			createTopicDTO.parentTopicId || null,
		);

		this.topicRepo.createTopic(topic);

		return topic;
	};

	public updateTopic = (
		id: string,
		updateTopicDTO: UpdateTopicDTO,
	): Topic | null => {
		const topic = this.topicRepo.getTopicById(id);
		if (!topic) {
			return null;
		}

		if (updateTopicDTO.parentTopicId) {
			const parentTopic = this.getTopicById(updateTopicDTO.parentTopicId);
			const hasCircularDependency = this.checkCircularDependency(
				parentTopic,
				topic.id,
			);
			if (hasCircularDependency) {
				throw new Error('Circular dependency detected');
			}
		}

		const updatedTopic = new Topic(
			topic.id,
			updateTopicDTO.name || topic.name,
			updateTopicDTO.content || topic.content,
			topic.createdAt,
			new Date(),
			topic.version + 1,
			updateTopicDTO.parentTopicId || topic.parentTopicId,
		);

		this.topicRepo.createTopic(updatedTopic);

		return updatedTopic;
	};

	// This will hardly delete the topic and set all its children to null, ignoring versioning
	// Also it will delete all the resources related to the topic
	public deleteTopic = (id: string): void => {
		const topic = this.getTopicById(id);

		// Should first delete all resources related to the topic
		const resources = this.topicResourceMediator.getResourcesByTopicId(id);
		for (const resource of resources) {
			this.topicResourceMediator.deleteResource(resource.id);
		}

		this.topicRepo.deleteTopic(topic);
	};

	private checkCircularDependency = (
		topic: Topic,
		compareId: string,
	): boolean => {
		if (topic.id === compareId) {
			return true;
		}
		if (topic.parentTopicId === null) {
			// ended looking for parent, so there is no circular dependency
			return false;
		}

		if (topic.parentTopicId === compareId) {
			return true;
		}

		const parentTopic = this.getTopicById(topic.parentTopicId);
		return this.checkCircularDependency(parentTopic, compareId);
	};

	private getRootParentTopic = (topic: Topic): Topic => {
		if (!topic.parentTopicId) {
			return topic;
		}

		const parent = this.getTopicById(topic.parentTopicId);
		return this.getRootParentTopic(parent);
	};
}
