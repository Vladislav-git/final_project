import express from 'express';
import apiRouter from './src/routes/apiRoutes'
import http from 'http'
import Socket from './src/services/socketio.service'
import {ApolloServer, gql} from 'apollo-server-express'
const fs = require('fs')
const socketio = require('socket.io')
const bodyParser = require('body-parser'); 


const app = express();
const server = http.createServer(app)
const io = socketio(server)
const PORT = 8000;

const typeDefs = gql(fs.readFileSync('./src/schemas/schemas.graphql', {encoding: 'utf8'}))
const resolvers = require('./src/resolvers/resolvers.ts')

const apolloServer = new ApolloServer({typeDefs, resolvers})
apolloServer.applyMiddleware({app, path: '/graphql'})
Socket(io)

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/api', apiRouter);
server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});