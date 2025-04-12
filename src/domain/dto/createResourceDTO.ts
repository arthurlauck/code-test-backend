import { ResourceType } from '../models/Resource';

export interface CreateResourceDTO {
	topicId: string;
	url: string;
	description: string;
	type: ResourceType;
}
