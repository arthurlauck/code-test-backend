import { IAuthorization } from './IAuthorization';

export default class EditorAuthorization implements IAuthorization {
	isAuthorized(): boolean {
		// Editors are allowed to perform any action
		// in the assessment document, there is no explicit limit for editors
		return true;
	}
}
