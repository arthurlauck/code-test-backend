export type ResourceType = 'video' | 'article' | 'pdf';

export default class Resource {
	constructor(
		public readonly id: string,
		public readonly topicId: string,
		public readonly url: string,
		public readonly description: string,
		public readonly type: ResourceType,
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
	) {}
}
