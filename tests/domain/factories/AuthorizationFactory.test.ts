import AdminAuthorization from '../../../src/domain/auth/AdminAuthorization';
import { AuthorizationFactory } from '../../../src/domain/factories/AuthorizationFactory';
import { UserRole } from '../../../src/domain/models/User';

describe('AuthorizationFactory', () => {
	it('should return AdminAuthorization for ADMIN role', () => {
		const factory = new AuthorizationFactory();
		const authorization = factory.getAuthorization(UserRole.ADMIN);
		expect(authorization).toBeInstanceOf(AdminAuthorization);
		expect(authorization.isAuthorized).toBeTruthy();
	});
});
