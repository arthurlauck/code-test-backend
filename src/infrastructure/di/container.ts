import SqliteTopicRepository from '../persistence/SqliteTopicRepository';
import TopicService from '../../domain/services/TopicService';
import TopicController from '../../interfaces/http/controllers/TopicController';
import SqliteResourceRepository from '../persistence/SqliteResourceRepository';
import ResourceController from '../../interfaces/http/controllers/ResourceController';
import { TopicTreeService } from '../../domain/services/TopicTreeService';
import { TopicTreeFactory } from '../../domain/factories/TopicTreeFactory';
import { TopicResourceMediator } from '../../domain/services/TopicResourceMediator';
import { ResourceService } from '../../domain/services/ResourceService';
import { TopicPathService } from '../../domain/services/TopicPathService';

const topicResourceMediator = new TopicResourceMediator();
const topicTreeFactory = new TopicTreeFactory();

const topicRepository = new SqliteTopicRepository();
const topicService = new TopicService(topicRepository, topicResourceMediator);
topicResourceMediator.setTopicService(topicService);

const topicTreeService = new TopicTreeService(
	topicResourceMediator,
	topicTreeFactory,
);

const resourceRepository = new SqliteResourceRepository();
const resourceService = new ResourceService(
	resourceRepository,
	topicResourceMediator,
);
topicResourceMediator.setResourceService(resourceService);

const topicPathService = new TopicPathService(topicService, topicTreeService);

export const container = {
	topicRepository,
	topicService,
	topicController: new TopicController(
		topicService,
		topicTreeService,
		topicPathService,
	),
	resourceService,
	resourceController: new ResourceController(resourceService),
};
