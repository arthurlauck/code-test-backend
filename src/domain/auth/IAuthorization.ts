export enum Action {
	WRITE = 'write',
	READ = 'read',
}

export interface IAuthorization {
	isAuthorized(action: Action): boolean;
}
