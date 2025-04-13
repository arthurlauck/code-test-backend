import { TopicResourceMediator } from '../../../src/domain/services/TopicResourceMediator';
import { createMockTopic } from '../../mocks/topic';
import { createMockResource } from '../../mocks/resource';

describe('TopicResourceMediator', () => {
	let mediator: TopicResourceMediator;
	let mockTopicService: any;
	let mockResourceService: any;

	beforeEach(() => {
		mockTopicService = {
			getTopicById: jest.fn(),
			getTopicChildren: jest.fn(),
		};

		mockResourceService = {
			getResourceById: jest.fn(),
			getResourcesByTopicId: jest.fn(),
			deleteResource: jest.fn(),
		};

		mediator = new TopicResourceMediator();
		mediator.setTopicService(mockTopicService);
		mediator.setResourceService(mockResourceService);
	});

	describe('getTopicById', () => {
		it('should call topicService.getTopicById with correct id', () => {
			const mockTopic = createMockTopic();
			mockTopicService.getTopicById.mockReturnValue(mockTopic);

			const result = mediator.getTopicById(mockTopic.id);

			expect(mockTopicService.getTopicById).toHaveBeenCalledWith(
				mockTopic.id,
			);
			expect(result).toBe(mockTopic);
		});

		it('should throw error when topicService is not initialized', () => {
			const newMediator = new TopicResourceMediator();

			expect(() => {
				newMediator.getTopicById('1');
			}).toThrow('TopicService not initialized in mediator');
		});
	});

	describe('getTopicChildren', () => {
		it('should call topicService.getTopicChildren with correct id', () => {
			const mockChildren = [createMockTopic()];
			mockTopicService.getTopicChildren.mockReturnValue(mockChildren);

			const result = mediator.getTopicChildren('1');

			expect(mockTopicService.getTopicChildren).toHaveBeenCalledWith('1');
			expect(result).toBe(mockChildren);
		});

		it('should throw error when topicService is not initialized', () => {
			const newMediator = new TopicResourceMediator();

			expect(() => {
				newMediator.getTopicChildren('1');
			}).toThrow('TopicService not initialized in mediator');
		});
	});

	describe('getResourceById', () => {
		it('should call resourceService.getResourceById with correct id', () => {
			const mockResource = createMockResource();
			mockResourceService.getResourceById.mockReturnValue(mockResource);

			const result = mediator.getResourceById('1');

			expect(mockResourceService.getResourceById).toHaveBeenCalledWith(
				'1',
			);
			expect(result).toBe(mockResource);
		});

		it('should throw error when resourceService is not initialized', () => {
			const newMediator = new TopicResourceMediator();

			expect(() => {
				newMediator.getResourceById('1');
			}).toThrow('ResourceService not initialized in mediator');
		});
	});

	describe('getResourcesByTopicId', () => {
		it('should call resourceService.getResourcesByTopicId with correct id', () => {
			const mockResources = [createMockResource(), createMockResource()];
			mockResourceService.getResourcesByTopicId.mockReturnValue(
				mockResources,
			);

			const result = mediator.getResourcesByTopicId('topic-1');

			expect(
				mockResourceService.getResourcesByTopicId,
			).toHaveBeenCalledWith('topic-1');
			expect(result).toBe(mockResources);
		});

		it('should throw error when resourceService is not initialized', () => {
			const newMediator = new TopicResourceMediator();

			expect(() => {
				newMediator.getResourcesByTopicId('1');
			}).toThrow('ResourceService not initialized in mediator');
		});
	});

	describe('deleteResource', () => {
		it('should call resourceService.deleteResource with correct id', () => {
			mediator.deleteResource('1');

			expect(mockResourceService.deleteResource).toHaveBeenCalledWith(
				'1',
			);
		});

		it('should throw error when resourceService is not initialized', () => {
			const newMediator = new TopicResourceMediator();

			expect(() => {
				newMediator.deleteResource('1');
			}).toThrow('ResourceService not initialized in mediator');
		});
	});

	describe('service setters', () => {
		it('should set the topicService', () => {
			const newMediator = new TopicResourceMediator();
			newMediator.setTopicService(mockTopicService);

			// Now the method should work without throwing
			mockTopicService.getTopicById.mockReturnValue({});
			expect(() => {
				newMediator.getTopicById('1');
			}).not.toThrow();
		});

		it('should set the resourceService', () => {
			const newMediator = new TopicResourceMediator();
			newMediator.setResourceService(mockResourceService);

			// Now the method should work without throwing
			mockResourceService.getResourceById.mockReturnValue({});
			expect(() => {
				newMediator.getResourceById('1');
			}).not.toThrow();
		});
	});
});
