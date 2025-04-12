import { ResourceType } from '../models/Resource';

export interface UpdateResourceDTO {
	topicId?: string;
	url?: string;
	description?: string;
	type?: ResourceType;
}
