import Topic from '../../src/domain/models/Topic';

/**
 * Creates a mock Topic with customizable properties
 */
export const createMockTopic = (overrides: Partial<Topic> = {}): Topic => {
	const defaults = {
		id: 'topic-123',
		name: 'Sample Topic',
		content: 'Sample content',
		createdAt: new Date('2025-01-01T00:00:00Z'),
		updatedAt: new Date('2025-01-01T00:00:00Z'),
		version: 1,
		parentTopicId: null,
	};

	return new Topic(
		overrides.id ?? defaults.id,
		overrides.name ?? defaults.name,
		overrides.content ?? defaults.content,
		overrides.createdAt ?? defaults.createdAt,
		overrides.updatedAt ?? defaults.updatedAt,
		overrides.version ?? defaults.version,
		overrides.parentTopicId ?? defaults.parentTopicId,
	);
};
