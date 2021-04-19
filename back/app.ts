import express from 'express';
import apiRouter from './src/routes/apiRoutes'
import http from 'http'
import Socket from './src/services/socketio.service'
import {ApolloServer, gql} from 'apollo-server-express'
const fs = require('fs')
const socketio = require('socket.io')
const bodyParser = require('body-parser');
import {Query, Mutation} from './src/resolvers/resolvers'
import {logger} from './logger'
const { print } = require('graphql');

class BasicLogging {
  requestDidStart({queryString, parsedQuery, variables}:any) {
    const query = queryString || print(parsedQuery);
    console.log(query);
    console.log(variables);
  }

  willSendResponse({graphqlResponse}:any) {
    console.log(JSON.stringify(graphqlResponse, null, 2));
  }
}

require('dotenv').config()

const app = express();
const server = http.createServer(app)
const io = socketio(server)
const PORT = 8000;

const typeDefs = gql(fs.readFileSync('./src/schemas/schemas.graphql', {encoding: 'utf8'}))
const resolvers = {Query, Mutation}


const apolloServer = new ApolloServer({typeDefs, resolvers, extensions: [() => new BasicLogging()]})
apolloServer.applyMiddleware({app, path: '/graphql'})
Socket(io)



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use('/api', apiRouter);
server.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});

app.use((req, res, next) => {
  logger.log('info', `Requesting ${req.method} ${req.originalUrl}`, {tags: 'http', additionalInfo: {body: req.body, headers: req.headers }});
  next()      
})