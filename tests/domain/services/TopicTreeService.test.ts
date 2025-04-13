import { TopicTree } from '../../../src/domain/dto/topicTree';
import {
	ITopicTreeFactory,
	TopicTreeFactory,
} from '../../../src/domain/factories/TopicTreeFactory';
import { TopicTreeService } from '../../../src/domain/services/TopicTreeService';
import { ITopicResourceMediator } from '../../../src/domain/services/TopicResourceMediator';
import { createMockResource } from '../../mocks/resource';
import { createMockTopic } from '../../mocks/topic';

describe('TopicTreeService', () => {
	let topicTreeService: TopicTreeService;
	let mockMediator: jest.Mocked<ITopicResourceMediator>;
	let mockFactory: jest.Mocked<ITopicTreeFactory>;
	let mockTopic: any;
	let mockResources: any[];
	let mockTopicTree: jest.Mocked<TopicTree>;
	let factory: TopicTreeFactory;

	beforeEach(() => {
		mockTopic = createMockTopic();
		mockResources = [createMockResource(), createMockResource()];

		mockMediator = {
			getTopicById: jest.fn().mockReturnValue(mockTopic),
			getResourcesByTopicId: jest.fn().mockReturnValue(mockResources),
			getTopicChildren: jest.fn().mockReturnValue([]),
		} as unknown as jest.Mocked<ITopicResourceMediator>;

		factory = new TopicTreeFactory();

		topicTreeService = new TopicTreeService(mockMediator, factory);
	});

	it('should get a topic tree with no children', () => {
		const spy = jest.spyOn(factory, 'buildTopicTree');

		const result = topicTreeService.getTopicTree(mockTopic.id);

		expect(mockMediator.getTopicById).toHaveBeenCalledWith(mockTopic.id);
		expect(mockMediator.getResourcesByTopicId).toHaveBeenCalledWith(
			mockTopic.id,
		);
		expect(spy).toHaveBeenCalledWith(mockTopic, mockResources);
		expect(mockMediator.getTopicChildren).toHaveBeenCalledWith(
			mockTopic.id,
		);
		expect(result).toBeInstanceOf(TopicTree);
	});

	it('should get a topic tree with children', () => {
		const childTopic = createMockTopic({
			id: '2',
			parentTopicId: mockTopic.id,
		});
		const childResources = [
			createMockResource({ id: 'r3', description: 'Resource 3' }),
		];

		mockMediator.getTopicChildren.mockReturnValueOnce([childTopic]);
		mockMediator.getResourcesByTopicId.mockImplementation((id) => {
			if (id === '1') return mockResources;
			if (id === '2') return childResources;
			return [];
		});

		const result = topicTreeService.getTopicTree('1');

		expect(mockMediator.getTopicChildren).toHaveBeenCalledTimes(2);
		expect(result).toBeInstanceOf(TopicTree);
		expect(result.id).toBe(mockTopic.id);
		expect(result.children).toHaveLength(1);
		expect(result.children[0].id).toBe(childTopic.id);
	});

	it('should handle a topic with multiple children', () => {
		const childTopic1 = createMockTopic({ id: '2', name: 'Child Topic 1' });
		const childTopic2 = createMockTopic({ id: '3', name: 'Child Topic 2' });

		mockMediator.getTopicChildren.mockReturnValueOnce([
			childTopic1,
			childTopic2,
		]);

		const result = topicTreeService.getTopicTree('1');
		expect(result.id).toBe(mockTopic.id);
		expect(result.children).toHaveLength(2);
		expect(result.children[0].id).toBe(childTopic1.id);
		expect(result.children[1].id).toBe(childTopic2.id);
	});

	it('test json serialize with parent', () => {
		const topicTree = factory.buildTopicTree(createMockTopic());
		const childTopicTree = factory.buildTopicTree(createMockTopic());
		topicTree.pushChild(childTopicTree);
		const serialized = topicTree.toJSON();
		expect(serialized.parent).toBeUndefined();
	});
});
