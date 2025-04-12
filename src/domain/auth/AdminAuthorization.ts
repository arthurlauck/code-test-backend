import { IAuthorization } from './IAuthorization';

export default class AdminAuthorization implements IAuthorization {
	isAuthorized(): boolean {
		// Admins are allowed to perform any action
		return true;
	}
}
