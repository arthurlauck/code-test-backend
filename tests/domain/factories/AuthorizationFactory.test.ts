import AdminAuthorization from '../../../src/domain/auth/AdminAuthorization';
import EditorAuthorization from '../../../src/domain/auth/EditorAuthorization';
import { Action } from '../../../src/domain/auth/IAuthorization';
import ViewerAuthorization from '../../../src/domain/auth/ViewerAuthorization';
import { AuthorizationFactory } from '../../../src/domain/factories/AuthorizationFactory';
import { UserRole } from '../../../src/domain/models/User';

describe('AuthorizationFactory', () => {
	it('should return AdminAuthorization for ADMIN role', () => {
		const factory = new AuthorizationFactory();
		const authorization = factory.getAuthorization(UserRole.ADMIN);
		expect(authorization).toBeInstanceOf(AdminAuthorization);
		expect(authorization.isAuthorized(Action.WRITE)).toBeTruthy();
	});

	it('should return EditorAuthorization for EDITOR role', () => {
		const factory = new AuthorizationFactory();
		const authorization = factory.getAuthorization(UserRole.EDITOR);
		expect(authorization).toBeInstanceOf(EditorAuthorization);
		expect(authorization.isAuthorized(Action.WRITE)).toBeTruthy();
	});

	it('should return ViewerAuthorization for VIEWER role', () => {
		const factory = new AuthorizationFactory();
		const authorization = factory.getAuthorization(UserRole.VIEWER);
		expect(authorization).toBeInstanceOf(ViewerAuthorization);
		expect(authorization.isAuthorized(Action.READ)).toBeTruthy();
		expect(authorization.isAuthorized(Action.WRITE)).toBeFalsy();
	});
});
