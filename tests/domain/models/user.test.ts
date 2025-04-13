import User, { UserRole } from '../../../src/domain/models/User';

describe('Should initiate user', () => {
	it('should create a new user with the given properties', () => {
		const user = new User('1', 'name', 'email', UserRole.ADMIN, new Date());
		expect(user.id).toBe('1');
	});
});
