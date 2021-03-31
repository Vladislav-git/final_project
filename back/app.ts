import express from 'express';
import apiRouter from './src/routes/apiRoutes'
import http from 'http'
import Socket from './src/services/socketio.service'
import {ApolloServer, gql} from 'apollo-server-express'
const fs = require('fs')
const socketio = require('socket.io')
const bodyParser = require('body-parser');
import {Query, Mutation} from './src/resolvers/resolvers'
var winston = require('winston'),
    expressWinston = require('express-winston');


const app = express();
const server = http.createServer(app)
const io = socketio(server)
const PORT = 8000;

const typeDefs = gql(fs.readFileSync('./src/schemas/schemas.graphql', {encoding: 'utf8'}))
const resolvers = {Query, Mutation}

const apolloServer = new ApolloServer({typeDefs, resolvers})
apolloServer.applyMiddleware({app, path: '/graphql'})
Socket(io)

app.use(expressWinston.logger({
  transports: [
    new winston.transports.Console()
  ],
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.json()
  ),
  meta: true, // optional: control whether you want to log the meta data about the request (default to true)
  msg: "HTTP {{req.method}} {{req.url}}", // optional: customize the default logging message. E.g. "{{res.statusCode}} {{req.method}} {{res.responseTime}}ms {{req.url}}"
  expressFormat: true, // Use the default Express/morgan request formatting. Enabling this will override any msg if true. Will only output colors with colorize set to true
  colorize: false, // Color the text and status code, using the Express/morgan color palette (text: gray, status: default green, 3XX cyan, 4XX yellow, 5XX red).
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', apiRouter);
server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});