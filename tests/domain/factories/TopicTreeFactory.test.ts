import { TopicTree } from '../../../src/domain/dto/topicTree';
import { TopicTreeFactory } from '../../../src/domain/factories/TopicTreeFactory';
import { createMockResource } from '../../mocks/resource';
import { createMockTopic } from '../../mocks/topic';

describe('TopicTreeFactory', () => {
	it('should build a TopicTree with the correct properties', () => {
		const topic = createMockTopic();
		const resources = [createMockResource(), createMockResource()];
		const topicTreeFactory = new TopicTreeFactory();
		const tree = topicTreeFactory.buildTopicTree(topic, resources);
		expect(tree).toBeInstanceOf(TopicTree);
		expect(tree.id).toBe(topic.id);
		expect(tree.name).toBe(topic.name);
		expect(tree.content).toBe(topic.content);
		expect(tree.createdAt).toBe(topic.createdAt);
		expect(tree.updatedAt).toBe(topic.updatedAt);
		expect(tree.version).toBe(topic.version);
		expect(tree.parentTopicId).toBe(topic.parentTopicId);
		expect(tree.resources).toHaveLength(2);
		expect(tree.resources).toEqual(resources);
	});
});
