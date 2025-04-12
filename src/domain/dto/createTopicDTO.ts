export interface CreateTopicDTO {
	name: string;
	content: string;
	parentTopicId?: string | null;
}
