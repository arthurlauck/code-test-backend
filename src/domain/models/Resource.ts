export enum ResourceType {
	VIDEO = 'video',
	ARTICLE = 'article',
	PDF = 'pdf',
}

export class Resource {
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
