import { TopicTree } from '../dto/topicTree';
import { ITopicTreeFactory } from '../factories/TopicTreeFactory';
import { ITopicResourceMediator } from './TopicResourceMediator';

export interface ITopicTreeService {
	getTopicTree(id: string): TopicTree;
}

export class TopicTreeService implements ITopicTreeService {
	constructor(
		private topicResourceMediator: ITopicResourceMediator,
		private topicTreeFactory: ITopicTreeFactory,
	) {}

	public getTopicTree(id: string): TopicTree {
		const topic = this.topicResourceMediator.getTopicById(id);
		const resources = this.topicResourceMediator.getResourcesByTopicId(id);

		const tree = this.topicTreeFactory.buildTopicTree(topic, resources);
		return this.getChildren(tree);
	}

	private getChildren(tree: TopicTree): TopicTree {
		const children = this.topicResourceMediator.getTopicChildren(tree.id);

		for (const child of children) {
			const resources = this.topicResourceMediator.getResourcesByTopicId(
				tree.id,
			);
			const childTree = this.topicTreeFactory.buildTopicTree(
				child,
				resources,
			);
			tree.pushChild(this.getChildren(childTree));
		}

		return tree;
	}
}
