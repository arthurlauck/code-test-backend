import AdminAuthorization from '../auth/AdminAuthorization';
import EditorAuthorization from '../auth/EditorAuthorization';
import { IAuthorization } from '../auth/IAuthorization';
import ViewerAuthorization from '../auth/ViewerAuthorization';
import { UserRole } from '../models/User';

export class AuthorizationFactory {
	public getAuthorization(userRole?: UserRole): IAuthorization {
		switch (userRole) {
			case UserRole.ADMIN:
				return new AdminAuthorization();
			case UserRole.EDITOR:
				return new EditorAuthorization();
			case UserRole.VIEWER:
			default:
				return new ViewerAuthorization();
		}
	}
}
