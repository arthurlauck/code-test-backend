import { Resource } from '../models/Resource';

export default interface IResourceRepository {
	getResourceById(id: string): Resource | null;
	getResourcesByTopicId(topicId: string): Resource[];
	createResource(resource: Resource): void;
	updateResource(resource: Resource): void;
	deleteResource(resource: Resource): void;
}
