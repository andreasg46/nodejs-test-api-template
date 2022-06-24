require('dotenv').config();

const PORT = process.env.PORT;

const express = require('express');
const app = express();
const cors = require('cors');
const timeLog = require('./timelog.js');

// Swagger UI
const swaggerUI = require("swagger-ui-express")
const specs = require("./swagger_ui_config");

const user_api = require('./api/user_api');

// Connect DB
const db = require('./configs/db_config');
db.authenticate()
    .then(() =>
    {
        // console.log('Database connected...');
        timeLog(`/ : Success : Database Connected`);
    })
    .catch(err => console.log('Error: ' + err))

// Landing Message
app.get("/", (req, res) => { res.send('Visit => /api-docs | NodeJS REST API template running: ' + new Date())})

// Use External Libraries
app.use(cors())
app.use(express.json())

// Endpoints
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))
app.use('/', user_api)

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})



