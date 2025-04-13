import { TopicTree } from '../../src/domain/dto/topicTree';
import { TopicTreeFactory } from '../../src/domain/factories/TopicTreeFactory';
import { createMockTopic } from './topic';

export const buildTopicTreeFromObject = (
	obj: any,
	topicTreeFactory: TopicTreeFactory,
): TopicTree => {
	// Create the current topic
	const topic = createMockTopic({ id: obj.id });
	const topicTree = topicTreeFactory.buildTopicTree(topic);

	// Process children recursively
	if (obj.children && obj.children.length > 0) {
		for (const childObj of obj.children) {
			const childTree = buildTopicTreeFromObject(
				childObj,
				topicTreeFactory,
			);
			topicTree.pushChild(childTree);
		}
	}

	return topicTree;
};
