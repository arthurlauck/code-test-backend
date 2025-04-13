import { TopicService } from '../../../src/domain/services/TopicService';
import { TopicNotFoundException } from '../../../src/domain/exceptions/TopicNotFound';
import { createMockTopic } from '../../mocks/topic';
import { createMockResource } from '../../mocks/resource';

describe('TopicService', () => {
	let topicService: TopicService;
	let mockTopicRepo: any;
	let mockTopicResourceMediator: any;

	const mockTopic = createMockTopic();
	const mockChildTopic = createMockTopic({ parentTopicId: mockTopic.id });

	const mockResources = [createMockResource()];

	beforeEach(() => {
		mockTopicRepo = {
			getTopicById: jest.fn(),
			getTopicByVersion: jest.fn(),
			getTopicChildren: jest.fn(),
			createTopic: jest.fn(),
			deleteTopic: jest.fn(),
		};

		mockTopicResourceMediator = {
			getResourcesByTopicId: jest.fn(),
			deleteResource: jest.fn(),
		};

		topicService = new TopicService(
			mockTopicRepo,
			mockTopicResourceMediator,
		);
	});

	describe('getTopicById', () => {
		it('should return a topic when it exists', () => {
			mockTopicRepo.getTopicById.mockReturnValue(mockTopic);

			const result = topicService.getTopicById('123');

			expect(result).toEqual(mockTopic);
			expect(mockTopicRepo.getTopicById).toHaveBeenCalledWith('123');
		});

		it('should throw TopicNotFoundException when topic does not exist', () => {
			mockTopicRepo.getTopicById.mockReturnValue(null);

			expect(() => {
				topicService.getTopicById('123');
			}).toThrow(TopicNotFoundException);
		});
	});

	describe('getTopicWithResourcesById', () => {
		it('should return topic with resources', () => {
			mockTopicRepo.getTopicById.mockReturnValue(mockTopic);
			mockTopicResourceMediator.getResourcesByTopicId.mockReturnValue(
				mockResources,
			);

			const result = topicService.getTopicWithResourcesById('123');

			expect(result).toEqual({
				...mockTopic,
				resources: mockResources,
			});
			expect(
				mockTopicResourceMediator.getResourcesByTopicId,
			).toHaveBeenCalledWith('123');
		});
	});

	describe('getTopicByVersion', () => {
		it('should return topic for specific version', () => {
			mockTopicRepo.getTopicByVersion.mockReturnValue(mockTopic);

			const result = topicService.getTopicByVersion('123', 1);

			expect(result).toEqual(mockTopic);
			expect(mockTopicRepo.getTopicByVersion).toHaveBeenCalledWith(
				'123',
				1,
			);
		});

		it('should throw when topic version does not exist', () => {
			mockTopicRepo.getTopicByVersion.mockReturnValue(null);
			expect(() => topicService.getTopicByVersion('123', 2)).toThrow(
				TopicNotFoundException,
			);
		});
	});

	describe('getTopicChildren', () => {
		it('should return topic children', () => {
			const children = [mockChildTopic];
			mockTopicRepo.getTopicChildren.mockReturnValue(children);

			const result = topicService.getTopicChildren('123');

			expect(result).toEqual(children);
			expect(mockTopicRepo.getTopicChildren).toHaveBeenCalledWith('123');
		});
	});

	describe('createTopic', () => {
		it('should create a topic with parent', () => {
			const createTopicDTO = {
				name: 'topic name',
				content: 'topic content',
				parentTopicId: '123',
			};

			mockTopicRepo.getTopicById.mockReturnValue(mockTopic);
			mockTopicRepo.createTopic.mockImplementation(() => {});

			const result = topicService.createTopic(createTopicDTO);

			expect(result).toBeDefined();
			expect(result.name).toBe('topic name');
			expect(result.content).toBe('topic content');
			expect(result.parentTopicId).toBe('123');
			expect(mockTopicRepo.getTopicById).toHaveBeenCalledWith('123');
		});
	});

	describe('updateTopic', () => {
		it('should update topic properties', () => {
			mockTopicRepo.getTopicById.mockReturnValue(mockTopic);

			const updateDTO = {
				name: 'Updated Topic',
				content: 'Updated Content',
			};

			const result = topicService.updateTopic('123', updateDTO);

			expect(result).toBeDefined();
			expect(result.name).toBe('Updated Topic');
			expect(result.content).toBe('Updated Content');
			expect(result.version).toBe(2);
			expect(mockTopicRepo.createTopic).toHaveBeenCalled();
		});

		it('should not have circular dependency without parent id', () => {
			mockTopicRepo.getTopicById
				.mockReturnValueOnce(mockChildTopic)
				.mockReturnValueOnce(createMockTopic({ id: '456' }));

			expect(() => {
				topicService.updateTopic('456', { parentTopicId: '456' });
			}).not.toThrow();
		});

		it('should throw error when circular dependency is detected', () => {
			mockTopicRepo.getTopicById
				.mockReturnValueOnce(mockChildTopic)
				.mockReturnValueOnce(mockChildTopic);

			expect(() => {
				topicService.updateTopic('456', { parentTopicId: '456' });
			}).toThrow('Circular dependency detected');
		});

		it('should have circular dependency matching parent id', () => {
			mockTopicRepo.getTopicById
				.mockReturnValueOnce(mockChildTopic)
				.mockReturnValueOnce(createMockTopic({ parentTopicId: '456' }));

			expect(() => {
				topicService.updateTopic('456', { parentTopicId: '456' });
			}).toThrow();
		});

		it('should not have circular dependency without parent id', () => {
			mockTopicRepo.getTopicById
				.mockReturnValueOnce(mockChildTopic)
				.mockReturnValueOnce(createMockTopic({ parentTopicId: '123' }))
				.mockReturnValueOnce(createMockTopic({ parentTopicId: '456' }));

			expect(() => {
				topicService.updateTopic('456', { parentTopicId: '456' });
			}).toThrow();
		});
	});

	describe('deleteTopic', () => {
		it('should delete topic and its resources', () => {
			mockTopicRepo.getTopicById.mockReturnValue(mockTopic);
			mockTopicResourceMediator.getResourcesByTopicId.mockReturnValue(
				mockResources,
			);

			topicService.deleteTopic('123');

			expect(
				mockTopicResourceMediator.deleteResource,
			).toHaveBeenCalledTimes(1);
			expect(
				mockTopicResourceMediator.deleteResource,
			).toHaveBeenCalledWith(mockResources[0].id);
			expect(mockTopicRepo.deleteTopic).toHaveBeenCalledWith(mockTopic);
		});
	});
});
