import Topic from '../../domain/models/Topic';
import { ITopicRepository } from '../../domain/repositories/ITopicRepository';
import database from './data/db';

// Define a type for the database row
interface TopicRow {
	id: string;
	name: string;
	content: string;
	createdAt: string;
	updatedAt: string;
	version: number;
	parentTopicId: string | null;
}

export default class SqliteTopicRepository implements ITopicRepository {
	public getTopicById = (id: string): Topic | null => {
		const selectQuery = database.prepare(`
            SELECT * FROM topic WHERE id = ? ORDER BY version DESC LIMIT 1
        `);
		const topicRow = selectQuery.get(id) as TopicRow | undefined;
		if (!topicRow) {
			return null;
		}
		return new Topic(
			topicRow.id,
			topicRow.name,
			topicRow.content,
			new Date(topicRow.createdAt),
			new Date(topicRow.updatedAt),
			topicRow.version,
			topicRow.parentTopicId,
		);
	};

	public getTopicByVersion = (id: string, version: number): Topic | null => {
		const selectQuery = database.prepare(`
            SELECT * FROM topic WHERE id = ? AND version = ? LIMIT 1
        `);
		const topicRow = selectQuery.get(id, version) as TopicRow | undefined;
		if (!topicRow) {
			return null;
		}
		return new Topic(
			topicRow.id,
			topicRow.name,
			topicRow.content,
			new Date(topicRow.createdAt),
			new Date(topicRow.updatedAt),
			topicRow.version,
			topicRow.parentTopicId,
		);
	};

	public getTopicChildren = (id: string): Topic[] => {
		const selectQuery = database.prepare(`
            select topic.*
            from (
                SELECT id, MAX(version) as version FROM topic WHERE parentTopicId = ? GROUP BY id
            ) as subSelect
            JOIN topic ON subSelect.id = topic.id AND subSelect.version = topic.version
        `);
		const topicRows = selectQuery.all(id) as unknown as
			| TopicRow[]
			| undefined;
		if (!topicRows) {
			return [];
		}
		return topicRows.map(
			(topicRow) =>
				new Topic(
					topicRow.id,
					topicRow.name,
					topicRow.content,
					new Date(topicRow.createdAt),
					new Date(topicRow.updatedAt),
					topicRow.version,
					topicRow.parentTopicId,
				),
		);
	};

	public createTopic = (topic: Topic): void => {
		const insertQuery = database.prepare(`
            INSERT INTO topic(id, name, content, createdAt, updatedAt, version, parentTopicId)
            VALUES(?, ?, ?, ?, ?, ?, ?)
        `);

		insertQuery.run(
			topic.id,
			topic.name,
			topic.content,
			topic.createdAt.toISOString(),
			topic.updatedAt.toISOString(),
			topic.version,
			topic.parentTopicId,
		);
	};

	public deleteTopic = (topic: Topic): void => {
		// Set all related topics to null before deleting
		const updateAllRelationShipsQuery = database.prepare(`
            UPDATE topic SET parentTopicId = NULL WHERE parentTopicId = ?
        `);
		updateAllRelationShipsQuery.run(topic.id);

		const deleteQuery = database.prepare(`
            DELETE FROM topic WHERE id = ?
        `);
		deleteQuery.run(topic.id);
	};
}
