import app from './infrastructure/config/app';
import config from './infrastructure/config/config';

app.listen(config.port, () => {
	console.log(`Server running on port ${config.port}`);
});
