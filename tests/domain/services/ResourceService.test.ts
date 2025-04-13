import { ResourceService } from '../../../src/domain/services/ResourceService';
import { Resource, ResourceType } from '../../../src/domain/models/Resource';
import { ResourceNotFoundException } from '../../../src/domain/exceptions/ResourceNotFound';
import { CreateResourceDTO } from '../../../src/domain/dto/createResourceDTO';
import { createMockResource } from '../../mocks/resource';
import { TopicNotFoundException } from '../../../src/domain/exceptions/TopicNotFound';

describe('ResourceService', () => {
	let resourceService: ResourceService;
	let mockResourceRepo: any;
	let mockMediator: any;

	const mockResource = createMockResource();

	beforeEach(() => {
		mockResourceRepo = {
			getResourceById: jest.fn(),
			getResourcesByTopicId: jest.fn(),
			createResource: jest.fn(),
			updateResource: jest.fn(),
			deleteResource: jest.fn(),
		};

		mockMediator = {
			getTopicById: jest.fn(),
		};

		global.crypto = {
			randomUUID: jest.fn().mockReturnValue('mocked-uuid'),
		} as any;

		resourceService = new ResourceService(mockResourceRepo, mockMediator);
	});

	describe('getResourceById', () => {
		it('should return a resource when it exists', () => {
			mockResourceRepo.getResourceById.mockReturnValue(mockResource);

			const result = resourceService.getResourceById('123');

			expect(result).toEqual(mockResource);
			expect(mockResourceRepo.getResourceById).toHaveBeenCalledWith(
				'123',
			);
		});

		it('should throw ResourceNotFoundException when resource does not exist', () => {
			mockResourceRepo.getResourceById.mockReturnValue(null);

			expect(() => {
				resourceService.getResourceById('123');
			}).toThrow(ResourceNotFoundException);
		});
	});

	describe('getResourcesByTopicId', () => {
		it('should return resources for a topic', () => {
			const resources = [mockResource];
			mockResourceRepo.getResourcesByTopicId.mockReturnValue(resources);

			const result = resourceService.getResourcesByTopicId(
				mockResource.topicId,
			);

			expect(result).toEqual(resources);
			expect(mockResourceRepo.getResourcesByTopicId).toHaveBeenCalledWith(
				mockResource.topicId,
			);
		});

		it('should return empty array when no resources found', () => {
			mockResourceRepo.getResourcesByTopicId.mockReturnValue([]);

			const result = resourceService.getResourcesByTopicId('123');

			expect(result).toEqual([]);
		});
	});

	describe('createResource', () => {
		it('should create a new resource', () => {
			const createResourceDTO: CreateResourceDTO = {
				topicId: 'topicId',
				url: 'http://example.com',
				description: 'description',
				type: ResourceType.VIDEO,
			};

			mockMediator.getTopicById.mockReturnValue({
				id: createResourceDTO.topicId,
			});

			const result = resourceService.createResource(createResourceDTO);

			expect(mockMediator.getTopicById).toHaveBeenCalledWith(
				createResourceDTO.topicId,
			);
			expect(mockResourceRepo.createResource).toHaveBeenCalled();

			expect(result).toBeInstanceOf(Resource);
			expect(result.id).toBe('mocked-uuid');
			expect(result.topicId).toBe(createResourceDTO.topicId);
			expect(result.url).toBe(createResourceDTO.url);
			expect(result.description).toBe(createResourceDTO.description);
			expect(result.type).toBe(createResourceDTO.type);
		});

		it('should throw error when topic does not exist', () => {
			const createResourceDTO: CreateResourceDTO = {
				topicId: 'topic-1',
				url: 'http://example.com',
				description: 'description',
				type: ResourceType.VIDEO,
			};

			mockMediator.getTopicById.mockImplementation(() => {
				throw new TopicNotFoundException(createResourceDTO.topicId);
			});

			expect(() => {
				resourceService.createResource(createResourceDTO);
			}).toThrow(TopicNotFoundException);
		});
	});

	describe('updateResource', () => {
		it('should update resource properties', () => {
			mockResourceRepo.getResourceById.mockReturnValue(mockResource);

			const updateDTO = {
				description: 'Updated description',
			};

			const result = resourceService.updateResource('123', updateDTO);

			expect(mockResourceRepo.updateResource).toHaveBeenCalled();
			expect(result.description).toBe(updateDTO.description);
			expect(result.type).toBe(mockResource.type);
			expect(result.topicId).toBe(mockResource.topicId);
		});

		it('should update topic ID and verify it exists', () => {
			mockResourceRepo.getResourceById.mockReturnValue(mockResource);
			mockMediator.getTopicById.mockReturnValue({ id: 'new-topic' });

			const updateDTO = {
				topicId: 'new-topic',
			};

			const result = resourceService.updateResource('123', updateDTO);

			expect(mockMediator.getTopicById).toHaveBeenCalledWith('new-topic');
			expect(result.topicId).toBe('new-topic');
		});

		it('should throw error when resource does not exist', () => {
			mockResourceRepo.getResourceById.mockImplementation(() => {
				throw new ResourceNotFoundException('123');
			});

			expect(() => {
				resourceService.updateResource('123', { url: 'new-url' });
			}).toThrow(ResourceNotFoundException);
		});

		it('should throw error when new topic does not exist', () => {
			mockResourceRepo.getResourceById.mockReturnValue(mockResource);
			mockMediator.getTopicById.mockImplementation(() => {
				throw new TopicNotFoundException('123');
			});

			expect(() => {
				resourceService.updateResource('123', {
					topicId: 'nonexistent',
				});
			}).toThrow(TopicNotFoundException);
		});
	});

	describe('deleteResource', () => {
		it('should delete an existing resource', () => {
			mockResourceRepo.getResourceById.mockReturnValue(mockResource);

			resourceService.deleteResource('123');

			expect(mockResourceRepo.deleteResource).toHaveBeenCalledWith(
				mockResource,
			);
		});

		it('should throw error when resource does not exist', () => {
			mockResourceRepo.getResourceById.mockImplementation(() => {
				throw new ResourceNotFoundException('123');
			});

			expect(() => {
				resourceService.deleteResource('123');
			}).toThrow(ResourceNotFoundException);
		});
	});
});
