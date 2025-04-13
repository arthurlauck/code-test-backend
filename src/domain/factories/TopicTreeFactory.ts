import { TopicTree } from '../dto/topicTree';
import { Resource } from '../models/Resource';
import Topic from '../models/Topic';

export interface ITopicTreeFactory {
	buildTopicTree(topic: Topic, resources: Resource[]): TopicTree;
}

export class TopicTreeFactory implements ITopicTreeFactory {
	public buildTopicTree(topic: Topic, resources: Resource[] = []) {
		return new TopicTree(
			topic.id,
			topic.name,
			topic.content,
			topic.createdAt,
			topic.updatedAt,
			topic.version,
			topic.parentTopicId,
			resources,
		);
	}
}
