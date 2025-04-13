import { TopicTree } from '../dto/topicTree';
import Topic from '../models/Topic';
import { ITopicService } from './TopicService';
import { ITopicTreeService } from './TopicTreeService';

export interface ITopicPathService {
	getTopicPath(fromId: string, toId: string): string[];
}

export class TopicPathService {
	constructor(
		private topicService: ITopicService,
		private topicTreeService: ITopicTreeService,
	) {}

	public getTopicPath(fromId: string, toId: string): string[] {
		const fromTopic = this.topicService.getTopicById(fromId);
		this.topicService.getTopicById(toId); // Just to check if exists

		// Get root node, to have complete tree
		const rootNode = this.getRootParentTopic(fromTopic);
		const treeFromRoot = this.topicTreeService.getTopicTree(rootNode.id);
		const fromInTree = this.findInChildTree(treeFromRoot, fromId)!;

		return this.findPathBetweenNodes(fromInTree, toId);
	}

	private getRootParentTopic = (topic: Topic): Topic => {
		if (!topic.parentTopicId) {
			return topic;
		}

		const parent = this.topicService.getTopicById(topic.parentTopicId);
		return this.getRootParentTopic(parent);
	};

	private findInChildTree = (
		tree: TopicTree,
		compareId: string,
	): TopicTree | null => {
		if (tree.id === compareId) {
			return tree;
		}

		for (const child of tree.children) {
			const found = this.findInChildTree(child, compareId);
			if (found) {
				return found;
			}
		}

		return null;
	};

	private findPathBetweenNodes(
		node: TopicTree,
		findNodeId: string,
		path: string[] = [],
		visitedNodes: string[] = [],
	): string[] {
		// make a copy of the path to avoid mutating the original array
		const newPath = [...path];
		newPath.push(node.id);
		// push to ignore visting repeated nodes
		visitedNodes.push(node.id);

		if (node.id === findNodeId) {
			// found it
			return newPath;
		}

		for (const child of node.children) {
			if (visitedNodes.includes(child.id)) {
				// Do not loop to children that already viseted
				continue;
			}
			const found = this.findPathBetweenNodes(
				child,
				findNodeId,
				newPath,
				visitedNodes,
			);
			if (found.length > 0) {
				return found;
			}
		}

		if (node.parent && !visitedNodes.includes(node.parent.id)) {
			const found = this.findPathBetweenNodes(
				node.parent,
				findNodeId,
				newPath,
				visitedNodes,
			);
			if (found.length > 0) {
				return found;
			}
		}

		// path not found
		return [];
	}
}
