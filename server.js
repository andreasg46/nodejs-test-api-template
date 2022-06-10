const PORT = process.env.PORT || 7000;

const cors = require('cors');
const express = require('express');
const app = express();

// Swagger UI
const swaggerUI = require("swagger-ui-express")
const specs = require("./swagger_ui_config");

const user_api = require('./api/user_api');

// Connect DB
const db = require('./db/config_db');
db.authenticate()
    .then(() => console.log('Database connected...'))
    .catch(err => console.log('Error: ' + err))

// Landing Message
app.get("/", (req, res) => { res.send('VR Architectural Models API: ' + new Date())})

// Use External Libraries
app.use(cors())
app.use(express.json())

// Endpoints
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs))
app.use('/', user_api)

app.listen(PORT, () => {
    console.log(`App listening at http://localhost:${PORT}`)
})



