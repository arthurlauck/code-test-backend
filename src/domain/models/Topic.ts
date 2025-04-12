export default class Topic {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly content: string,
		public readonly createdAt: Date,
		public readonly updatedAt: Date,
		public readonly version: number,
		public readonly parentTopicId: string | null,
	) {}
}
