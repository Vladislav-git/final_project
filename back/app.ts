import express from 'express';
import router from './src/routes/routes'
const bodyParser = require('body-parser');


const app = express();
const PORT = 8000;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use('/', router);
app.listen(PORT, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${PORT}`);
});