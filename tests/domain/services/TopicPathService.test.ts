import { TopicTreeFactory } from '../../../src/domain/factories/TopicTreeFactory';
import { TopicPathService } from '../../../src/domain/services/TopicPathService';
import { TopicTreeService } from '../../../src/domain/services/TopicTreeService';
import { buildTopicTreeFromObject } from '../../mocks/buildTopicTree';
import { createMockTopic } from '../../mocks/topic';

describe('TopicPathService', () => {
	let topicPathService: TopicPathService;
	let mockTopicService: any;
	let mockTopicTreeService: any;

	beforeEach(() => {
		mockTopicService = {
			getTopicById: jest.fn(),
		};

		mockTopicTreeService = {
			getTopicTree: jest.fn(),
		};

		topicPathService = new TopicPathService(
			mockTopicService,
			mockTopicTreeService,
		);
	});

	it('getTopicPath should return the correct path between two topics', () => {
		const fromTopic = createMockTopic({ id: '1', parentTopicId: '0' });
		const toTopic = createMockTopic({ id: '3', parentTopicId: '1' });

		mockTopicService.getTopicById
			.mockReturnValueOnce(fromTopic)
			.mockReturnValueOnce(toTopic)
			.mockReturnValueOnce(createMockTopic({ id: '0' }));

		const treeFromRoot = {
			id: '0',
			children: [
				{
					id: '1',
					children: [
						{
							id: '2',
							children: [],
						},
						{
							id: '3',
							children: [],
						},
					],
				},
			],
		};

		mockTopicTreeService.getTopicTree.mockReturnValue(treeFromRoot);

		const path = topicPathService.getTopicPath('1', '3');

		expect(path).toEqual(['1', '3']);
		expect(mockTopicService.getTopicById).toHaveBeenCalledTimes(3);
		expect(mockTopicTreeService.getTopicTree).toHaveBeenCalledWith('0');
	});

	it('getTopicPath travelling upwards and dowards should return the correct path', () => {
		mockTopicService.getTopicById
			.mockReturnValueOnce(() => {})
			.mockReturnValueOnce(() => {});

		const topicTreeFactory = new TopicTreeFactory();

		const treeObject = {
			id: '1',
			children: [
				{
					id: '2',
					children: [
						{
							id: '3',
							children: [
								{
									id: '4',
									children: [],
								},
							],
						},
					],
				},
				{
					id: '7',
					children: [
						{
							id: '8',
							children: [
								{
									id: '9',
									children: [],
								},
							],
						},
					],
				},
			],
		};

		const topicTree = buildTopicTreeFromObject(
			treeObject,
			topicTreeFactory,
		);

		// Mock the getRootParentTopic private method
		const getRootParentTopicSpy = jest.spyOn(
			topicPathService,
			// @ts-ignore - accessing private method for testing
			'getRootParentTopic',
		) as any;
		const rootTopic = createMockTopic({ id: '1' });
		getRootParentTopicSpy.mockReturnValue(rootTopic);

		mockTopicTreeService.getTopicTree.mockReturnValue(topicTree);
		const path = topicPathService.getTopicPath('8', '3');
		expect(path).toEqual(['8', '7', '1', '2', '3']);
	});

	it('path is not found, return empty result', () => {
		mockTopicService.getTopicById
			.mockReturnValueOnce(() => {})
			.mockReturnValueOnce(() => {});

		const topicTreeFactory = new TopicTreeFactory();

		const treeObject = {
			id: '1',
			children: [
				{
					id: '2',
					children: [
						{
							id: '3',
							children: [
								{
									id: '4',
									children: [],
								},
							],
						},
					],
				},
				{
					id: '7',
					children: [
						{
							id: '8',
							children: [
								{
									id: '9',
									children: [],
								},
							],
						},
					],
				},
			],
		};

		const topicTree = buildTopicTreeFromObject(
			treeObject,
			topicTreeFactory,
		);

		// Mock the getRootParentTopic private method
		const getRootParentTopicSpy = jest.spyOn(
			topicPathService,
			// @ts-ignore - accessing private method for testing
			'getRootParentTopic',
		) as any;
		const rootTopic = createMockTopic({ id: '1' });
		getRootParentTopicSpy.mockReturnValue(rootTopic);

		mockTopicTreeService.getTopicTree.mockReturnValue(topicTree);
		const path = topicPathService.getTopicPath('8', '10');
		expect(path).toEqual([]);
	});
});
