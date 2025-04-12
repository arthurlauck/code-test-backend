import Resource from '../models/Resource';
import Topic from '../models/Topic';

export class TopicTree extends Topic {
	public parent?: TopicTree | null;

	constructor(
		id: string,
		name: string,
		content: string,
		createdAt: Date,
		updatedAt: Date,
		version: number,
		parentTopicId: string | null,
		public resources: Resource[],
		public children: TopicTree[] = [],
	) {
		super(id, name, content, createdAt, updatedAt, version, parentTopicId);
	}

	public pushChild(child: TopicTree) {
		child.setParent(this);
		this.children.push(child);
	}

	public setParent(parent: TopicTree) {
		this.parent = parent;
	}

	public toJSON(): TopicTree {
		// Remove parent to avoid circular reference
		return {
			...this,
			parent: undefined,
		};
	}
}
