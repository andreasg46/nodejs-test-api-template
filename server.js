require('dotenv').config();

const PORT = process.env.PORT;

// Libraries
const express = require('express');
const app = express();
const cors = require('cors');
const timeLog = require('./timelog')

// Swagger UI
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./swagger.yaml');

const auth = require('./auth');
const user_api = require('./api/user_api');

// Connect DB
const db = require('./configs/db_config');
db.authenticate()
    .then(() => {
        // console.log('Database connected...');
        timeLog(`/ : Success : Database Connected`);
    })
    .catch(err => console.log('Error: ' + err))

// Landing Message
app.get("/", (req, res) => {
    res.send('Visit => /api-docs | NodeJS REST API template running: ' + new Date())
})

// Use External Libraries
app.use(cors())
app.use(express.json())

// Api Docs
app.use('/docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));

// Endpoints
app.use('/', auth)
app.use('/', user_api)

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})



