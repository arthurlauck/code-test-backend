import { Resource, ResourceType } from '../../src/domain/models/Resource';

export const createMockResource = (
	overrides: Partial<Resource> = {},
): Resource => {
	const defaults = {
		id: crypto.randomUUID(),
		topicId: crypto.randomUUID(),
		url: 'https://example.com',
		description: 'sample resource description',
		type: ResourceType.ARTICLE,
		createdAt: new Date(),
		updatedAt: new Date(),
	};

	return new Resource(
		overrides.id ?? defaults.id,
		overrides.topicId ?? defaults.topicId,
		overrides.url ?? defaults.url,
		overrides.description ?? defaults.description,
		overrides.type ?? defaults.type,
		overrides.createdAt ?? defaults.createdAt,
		overrides.updatedAt ?? defaults.updatedAt,
	);
};
