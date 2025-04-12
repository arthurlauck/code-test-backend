export class ResourceNotFoundException extends Error {
	constructor(id: string) {
		super(`Resource with ID ${id} not found`);
		this.name = 'ResourceNotFoundException';
	}
}
