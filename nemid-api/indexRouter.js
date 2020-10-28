const sqlite3 = require('sqlite3');
const {confirmPassword} = require("./auth");
const {dbLocation} = require('./config');
const router = require('express').Router();

const db = new sqlite3.Database(dbLocation);

router.get('/authenticate', (req, res) => {
    const {nemId, password} = req.body;

    if (nemId === undefined || password === undefined) {
        return res.sendStatus(400);
    }

    const query = 'select * from User inner join Password on User.Id = Password.UserId and User.NemId = ?';
    db.all(query, [nemId], (err, dbPasswords) => {
        if (err) {
            console.log(err);
            return res.sendStatus(400);
        } else if (dbPasswords.length === 0) {
            console.log(`no user found for nemid ${nemId}`);
            return res.status(404).send('user not found');
        }

        dbPasswords.forEach(dbPassword => {
            if (confirmPassword(password, dbPassword.PasswordHash)) {
                const query = 'select * from User where id = ?';
                db.get(query, [dbPassword.UserId], (err, dbUser) => {
                    if (err) {
                        console.log(err);
                        return res.sendStatus(400);
                    } else if (dbUser === undefined) {
                        console.log(`no user found for nemid '${nemId}'`);
                        return res.status(404).send('user not found');
                    }

                    return res.status(200).json(dbUser);
                });
            }
        });

        return res.sendStatus(403);
    });
});

router.get('/change-password', (req, res) => {
    res.sendStatus(501);
});

router.get('/reset-password', (req, res) => {
    res.sendStatus(501);
});

module.exports = router;