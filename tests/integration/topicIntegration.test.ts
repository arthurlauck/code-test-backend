import request from 'supertest';
import app from '../../src/infrastructure/config/app';

const authHeader = {
	fake_auth: 'admin',
};

const authHeaderViewer = {
	fake_auth: 'viewer',
};

describe('Topic Integration Tests', () => {
	it('should create a new topic', async () => {
		const response = await request(app)
			.post('/topic')
			.set(authHeader)
			.send({
				name: 'topic 1',
				content: 'topic content 1',
			});

		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty('id');
		expect(response.body.name).toBe('topic 1');
		expect(response.body.content).toBe('topic content 1');
	});

	it('should be denied to create a topic as a viewer', async () => {
		const response = await request(app)
			.post('/topic')
			.set(authHeaderViewer)
			.send({
				name: 'topic 1',
				content: 'topic content 1',
			});

		expect(response.status).toBe(403);
		expect(response.body).not.toHaveProperty('id');
	});

	it('should retrieve a topic by ID', async () => {
		const createResponse = await request(app)
			.post('/topic')
			.set(authHeader)
			.send({
				name: 'topic 2',
				content: 'topic content 2',
			});

		const topicId = createResponse.body.id;

		const response = await request(app).get(`/topic/${topicId}`);

		expect(response.status).toBe(200);
		expect(response.body.id).toBe(topicId);
		expect(response.body.name).toBe('topic 2');
		expect(response.body.content).toBe('topic content 2');
	});

	it('should update an existing topic', async () => {
		const createResponse = await request(app)
			.post('/topic')
			.set(authHeader)
			.send({
				name: 'topic 3',
				content: 'topic content 3',
			});

		const topicId = createResponse.body.id;

		const updateResponse = await request(app)
			.put(`/topic/${topicId}`)
			.set(authHeader)
			.send({
				name: 'topic 3 updated',
				content: 'pic content 3 updated',
			});

		expect(updateResponse.status).toBe(200);

		const getResponse = await request(app).get(`/topic/${topicId}`);

		expect(getResponse.body.name).toBe('topic 3 updated');
		expect(getResponse.body.content).toBe('pic content 3 updated');
		expect(getResponse.body.version).toBe(2);

		const getResponseVersion = await request(app).get(
			`/topic/${topicId}/version/1`,
		);
		expect(getResponseVersion.body.name).toBe('topic 3');
		expect(getResponseVersion.body.content).toBe('topic content 3');
		expect(getResponseVersion.body.version).toBe(1);
	});

	it('should be denied to update an existing topic as viewer', async () => {
		const createResponse = await request(app)
			.post('/topic')
			.set(authHeader)
			.send({
				name: 'topic 3',
				content: 'topic content 3',
			});

		const topicId = createResponse.body.id;

		const updateResponse = await request(app)
			.put(`/topic/${topicId}`)
			.set(authHeaderViewer)
			.send({
				name: 'topic 3 updated',
				content: 'pic content 3 updated',
			});

		expect(updateResponse.status).toBe(403);
	});

	it('should delete a topic', async () => {
		const createResponse = await request(app)
			.post('/topic')
			.set(authHeader)
			.send({
				name: 'topic 4',
				content: 'topic content 4',
			});

		const topicId = createResponse.body.id;

		const deleteResponse = await request(app)
			.delete(`/topic/${topicId}`)
			.set(authHeader);

		expect(deleteResponse.status).toBe(204);

		const getResponse = await request(app).get(`/topic/${topicId}`);
		expect(getResponse.status).toBe(404);
	});

	it('should not be allow to delete a topic as a viewer', async () => {
		const createResponse = await request(app)
			.post('/topic')
			.set(authHeader)
			.send({
				name: 'topic 4',
				content: 'topic content 4',
			});

		const topicId = createResponse.body.id;

		const deleteResponse = await request(app)
			.delete(`/topic/${topicId}`)
			.set(authHeaderViewer);

		expect(deleteResponse.status).toBe(403);
	});
});
