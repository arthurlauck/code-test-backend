import { Resource } from '../../domain/models/Resource';
import IResourceRepository from '../../domain/repositories/IResourceRepository';
import database from './data/db';

export default class SqliteResourceRepository implements IResourceRepository {
	public getResourceById = (id: string): Resource | null => {
		const selectQuery = database
			.prepare(
				`
            SELECT * FROM resource WHERE id = ? LIMIT 1
        `,
			)
			.get(id) as Resource | undefined;
		if (!selectQuery) {
			return null;
		}
		return new Resource(
			selectQuery.id,
			selectQuery.topicId,
			selectQuery.url,
			selectQuery.description,
			selectQuery.type,
			new Date(selectQuery.createdAt),
			new Date(selectQuery.updatedAt),
		);
	};

	public getResourcesByTopicId = (topicId: string): Resource[] => {
		const selectQuery = database
			.prepare(
				`
            SELECT * FROM resource WHERE topicId = ?
        `,
			)
			.all(topicId) as unknown as Resource[] | undefined;
		if (!selectQuery) {
			return [];
		}
		return selectQuery.map(
			(row) =>
				new Resource(
					row.id,
					row.topicId,
					row.url,
					row.description,
					row.type,
					new Date(row.createdAt),
					new Date(row.updatedAt),
				),
		);
	};

	public createResource = (resource: Resource): void => {
		database
			.prepare(
				`
            INSERT INTO resource (id, topicId, url, description, type, createdAt, updatedAt)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `,
			)
			.run(
				resource.id,
				resource.topicId,
				resource.url,
				resource.description,
				resource.type,
				resource.createdAt.toISOString(),
				resource.updatedAt.toISOString(),
			);
	};

	public updateResource = (resource: Resource): void => {
		database
			.prepare(
				`
            UPDATE resource
            SET 
                url = ?, 
                description = ?, 
                type = ?, 
                createdAt = ?, 
                updatedAt = ?
            WHERE id = ?
        `,
			)
			.run(
				resource.url,
				resource.description,
				resource.type,
				resource.createdAt.toISOString(),
				resource.updatedAt.toISOString(),
				resource.id,
			);
	};

	public deleteResource = (resource: Resource): void => {
		database
			.prepare(
				`
            DELETE FROM resource WHERE id = ?
        `,
			)
			.run(resource.id);
	};
}
