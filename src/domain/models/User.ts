export enum UserRole {
	ADMIN = 'admin',
	EDITOR = 'editor',
	VIEWER = 'viewer',
}

export default class User {
	constructor(
		public readonly id: string,
		public readonly name: string,
		public readonly email: string,
		public readonly role: UserRole,
		public readonly createdAt: Date,
	) {}
}
