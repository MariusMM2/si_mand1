const sqlite3 = require('sqlite3');
const {dbLocation} = require('./config');
const router = require('express').Router();

const db = new sqlite3.Database(dbLocation);

// gender create
router.post('/', (req, res) => {
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
router.get('/', (req, res) => {
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
router.get('/:id', (req, res) => {
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
router.put('/:id', (req, res) => {
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
router.delete('/:id', (req, res) => {
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

module.exports = router;