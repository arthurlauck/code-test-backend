import { Action, IAuthorization } from './IAuthorization';

export default class ViewerAuthorization implements IAuthorization {
	isAuthorized(action: Action): boolean {
		// Can only read
		return action === Action.READ;
	}
}
