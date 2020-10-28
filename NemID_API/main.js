const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3');

const db = new sqlite3.Database('../NemID_ESB/nem_id_database.sqlite');
const app = express();
const port = 8099;

app.use(bodyParser.json());

// gender create
app.post('/gender', (req, res) => {
    if (req.body.gender === undefined) {
        req.status(400);
        req.send();
    }
    const query = `insert into main.Gender(Label)
                   values (?)`;
    console.log(query);
    db.run(query, [req.body.gender], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }

        console.log(`gender '${req.body.gender}' added`);
        res.sendStatus(200);
    });
});

// gender read all
app.get('/gender', (req, res) => {
    const query = `select *
                   from main.Gender`;
    db.all(query, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(403).send();
        } else if (rows === 0) {
            res.sendStatus(404);
        }

        res.json({
            'genders': rows
        })
    });
});

// gender read one
app.get('/gender/:id', (req, res) => {
    const query = `select * from main.Gender where Id=${req.params.id}`;
    db.get(query, (err, row) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        } else if (row === undefined) {
            res.sendStatus(404);
        }

        res.json(row);
    });
});

// gender update
app.put('/gender/:id', (req, res) => {
    const query = `update main.Gender
                   set Label = ?
                   where Id = ?`;
    db.run(query, [req.body.gender, req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }

        res.sendStatus(200);
    });
});

// gender delete
app.delete('/gender/:id', (req, res) => {
    const query = `delete from main.Gender
                   where Id = ?`;
    db.run(query, [req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }

        res.sendStatus(200);
    });
});

app.listen(port, () => {
    console.log(`listening on ${port}`);
});