import Topic from '../models/Topic';

export interface ITopicRepository {
	getTopicById(id: string): Topic | null;
	getTopicByVersion(id: string, version: number): Topic | null;
	getTopicChildren(id: string): Topic[];
	createTopic(topic: Topic): void;
	deleteTopic(topic: Topic): void;
}
