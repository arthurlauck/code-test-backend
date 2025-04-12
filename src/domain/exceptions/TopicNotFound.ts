export class TopicNotFoundException extends Error {
	constructor(id: string) {
		super(`Topic with ID ${id} not found`);
		this.name = 'TopicNotFoundException';
	}
}
