import request from 'supertest';
import app from '../../src/infrastructure/config/app';

const authHeader = {
	fake_auth: 'admin',
};

const authHeaderViewer = {
	fake_auth: 'viewer',
};

describe('Resource Integration Tests', () => {
	it('should create, update, get and delete a resource', async () => {
		const topicResponse = await request(app)
			.post('/topic')
			.set(authHeader)
			.send({
				name: 'topic 1',
				content: 'topic content 1',
			});

		const response = await request(app)
			.post('/resource')
			.set(authHeader)
			.send({
				topicId: topicResponse.body.id,
				url: 'http://exemple.com',
				description: 'resource 1',
				type: 'pdf',
			});
		expect(response.status).toBe(201);
		expect(response.body).toHaveProperty('id');
		expect(response.body.description).toBe('resource 1');
		expect(response.body.type).toBe('pdf');
		expect(response.body.url).toBe('http://exemple.com');
		expect(response.body.topicId).toBe(topicResponse.body.id);

		const updateResponse = await request(app)
			.put(`/resource/${response.body.id}`)
			.set(authHeader)
			.send({
				description: 'updated resource 1',
			});
		expect(updateResponse.status).toBe(200);
		expect(updateResponse.body.id).toBe(response.body.id);
		expect(updateResponse.body.description).toBe('updated resource 1');

		const resourceId = response.body.id;
		const getResponse = await request(app)
			.get(`/resource/${resourceId}`)
			.set(authHeader);
		expect(getResponse.status).toBe(200);
		expect(getResponse.body).toHaveProperty('id');
		expect(getResponse.body.id).toBe(resourceId);
		expect(getResponse.body.description).toBe('updated resource 1');
		expect(getResponse.body.type).toBe('pdf');
		expect(getResponse.body.url).toBe('http://exemple.com');
		expect(getResponse.body.topicId).toBe(topicResponse.body.id);

		const deleteResponse = await request(app)
			.delete(`/resource/${resourceId}`)
			.set(authHeader);
		expect(deleteResponse.status).toBe(204);

		const getDeletedResponse = await request(app)
			.get(`/resource/${resourceId}`)
			.set(authHeader);
		expect(getDeletedResponse.status).toBe(404);
	});

	it('should be denied to create a resource as a viewer', async () => {
		const response = await request(app)
			.post('/resource')
			.set(authHeaderViewer)
			.send({
				name: 'Resource 1',
				type: 'pdf',
				url: 'http://example.com/resource1.pdf',
			});

		expect(response.status).toBe(403);
		expect(response.body).not.toHaveProperty('id');
	});
});
