const express = require('express');
const bodyParser = require('body-parser')

let app = express()

app.use(bodyParser.json())

app.post('/generate-nemID', (req, res) => {
    const cpr = req.body.cpr._;
    const random = Math.floor(Math.random() * 99999 + 10000)
    const last4 = cpr.split('-')[1]
    const gen = `${random}-${last4}`;


    res.json({
        nemId: gen
    })
})

app.listen(8088, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("Listening on port 8088");
        console.log("ESB is configured...");
    }
})