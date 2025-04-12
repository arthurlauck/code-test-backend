import Resource from '../models/Resource';
import Topic from '../models/Topic';

export interface TopicWithResource extends Topic {
	resources: Resource[];
}
