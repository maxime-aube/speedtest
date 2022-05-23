import fs from 'fs';
import http from 'http';
import express from 'express';
import listEndpoints from 'express-list-endpoints';
import Scheduler from "./Scheduler.js";
import logger from './logger.js';

const env = process.env.NODE_ENV;
const port = 3000;
const app = express();
const router = express.Router();
const server = http.createServer(app);

app.set('view engine', 'ejs');

// définition des routes
router.use('/cdn', express.static('./dist', ));
router.get('/speedtest/view', (req, res) => {
    res.render('speedtest.ejs', {
        env: env
    });
});
router.get('/speedtest/data', (req, res) => {
    const data = fs.readFileSync('./speedtest.log.json', { encoding: 'utf-8'});
    res.json(JSON.parse(data));
});
app.use('/', router);

// démarre le serveur
server.listen(port, () => {
    logger.info(`Started ${ env } speedtest server. Listening on port ${port} to ${ listEndpoints(app).length } endpoint(s)...`, {
        port: port,
        routes: {
            express: listEndpoints(app),
        },
        env: env
    });
});

// add cronjob to run speedtest periodically
//Scheduler.addJob('speedtest');