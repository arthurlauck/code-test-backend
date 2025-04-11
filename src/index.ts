import express from 'express';
import config from './config/config';

const app = express();

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Setup express, ts, lint');
})

app.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`);
}); 
