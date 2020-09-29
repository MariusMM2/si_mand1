const express = require('express');
const bodyParser = require('body-parser')

let app = express()

app.use(bodyParser.json())

app.post('/generate-password-nemID', (req, res) => {
    const cpr = req.body.cpr._;
    const nemID = req.body.nemId;
    const gen = `${nemID.slice(0, 2)}${cpr.slice(-2)}`

    res.json({
        nemIdPassword: gen
    })
})

app.listen(8089, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("Listening on port 8089");
        console.log("ESB is configured...");
    }
})