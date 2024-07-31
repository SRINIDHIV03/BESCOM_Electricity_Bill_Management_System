const dbService = require('./database')
const http = require('http');
const url = require('url');
const express = require('express');
const bodyparser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());
app.use(bodyparser.json());

const PORT = 5000;

app.get('/getAll', (request, response) => {
    const db = dbService.getDbServiceInstance();

    const result = db.getAllData();
    
    result.then(console.log(result))
    .then(data => response.json({data : data}))    
    .catch(err => console.log(err));
})

app.post('/checkInAdmin', (request, response) => {
    console.log("Admin Login Input received");
    const { name } = request.body;
    const { pass } = request.body;
    const db = dbService.getDbServiceInstance();
    
    const result = db.isUserPresent(name,pass);
    console.log("From experiment(admin login): "+result['truth']);

    result
    .then(data => response.json({ data: data}))
    .catch(err => console.log(err));
});


app.listen(PORT, () => console.log(`Hello World ${PORT}`));