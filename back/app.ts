import express from 'express';
import apiRouter from './src/routes/apiRoutes'
import graphqlRouter from './src/routes/graphqlRoutes'
import http from 'http'
import Socket from './src/services/socketio.service'
const socketio = require('socket.io')
const bodyParser = require('body-parser');


const app = express();
const server = http.createServer(app)
const io = socketio(server)
const PORT = 8000;

Socket(io)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', apiRouter);
app.use('/graphql', graphqlRouter)
server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});