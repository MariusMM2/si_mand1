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
        return res.sendStatus(400);
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
            return res.sendStatus(404);
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
            return res.sendStatus(404);
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
    const query = `delete
                   from main.Gender
                   where Id = ?`;
    db.run(query, [req.params.id], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }

        res.sendStatus(200);
    });
});

// user create
app.post('/user', (req, res) => {
    const {nemId, cpr, genderId, email} = req.body;

    if (nemId === undefined || cpr === undefined || genderId === undefined || email === undefined) {
        return res.sendStatus(400);
    }

    const query = `insert into main.User(NemId, Cpr, CreatedAt, ModifiedAt, GenderId, Email)
                   values (?, ?, ?, ?, ?, ?)`;
    console.log(query);
    db.run(query, [nemId, cpr, new Date(), new Date(), genderId, email], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }

        console.log(`user '${cpr}' added`);
        res.sendStatus(200);
    });
});

// user read all
app.get('/user', (req, res) => {
    const query = `select *
                   from main.User`;
    db.all(query, (err, rows) => {
        if (err) {
            console.log(err);
            return res.status(403).send();
        } else if (rows === 0) {
            return res.sendStatus(404);
        }

        res.json({
            'users': rows
        })
    });
});

// user read one
app.get('/user/:id', (req, res) => {
    const query = `select * from main.User where Id=${req.params.id}`;
    db.get(query, (err, row) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        } else if (row === undefined) {
            return res.sendStatus(404);
        }

        res.json(row);
    });
});

// user update
app.put('/user/:id', (req, res) => {
    const {nemId, cpr, genderId, email} = req.body;
    const {id} = req.params;

    if (nemId === undefined || cpr === undefined || genderId === undefined || email === undefined) {
        return res.sendStatus(400);
    }

    const query = `update main.User
                   set NemId = ?,
                       Cpr = ?,
                       GenderId = ?,
                       Email = ?
                   where Id = ?`;
    db.run(query, [nemId, cpr, genderId, email, id], (err) => {
        if (err) {
            console.log(err);
            return res.sendStatus(403);
        }

        res.sendStatus(200);
    });
});

// user delete
app.delete('/user/:id', (req, res) => {
    const query = `delete
                   from main.User
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