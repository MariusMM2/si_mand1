const express = require('express');
const bodyParser = require('body-parser')
const sqlite3 = require('sqlite3');

var db = new sqlite3.Database('../NemID_ESB/nem_id_database.sqlite');

let app = express()

app.use(bodyParser.json())

app.post('/nemid-auth', (req, res) => {
    const code = req.body.nemIdCode;
    const nemID = req.body.nemId;

    db.all(`SELECT * FROM user WHERE NemID="${nemID}" AND Password="${code}"`, (err, rows) => {
        if (err || rows.length === 0) {
            return res.status(403).send();
        }

        res.json(
            {
                'generatedCode': Math.floor(Math.random() * 999999 + 100000)
            }
        )
    })

})

app.listen(8090, (err) => {
    if(err){
        console.log(err);
    }
    else{
        console.log("Listening on port 8090");
        console.log("ESB is configured...");
    }
})