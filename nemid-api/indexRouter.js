const sqlite3 = require('sqlite3');
const {confirmPassword, getHashedPassword} = require("./auth");
const {dbLocation} = require('./config');
const router = require('express').Router();

const db = new sqlite3.Database(dbLocation);

/**
 * A User
 * @typedef {{Id: number, NemId: string, Cpr: string, CreatedAt: Date, ModifiedAt: Date, GenderId: number, Email: string}} User
 */

router.get('/authenticate', async (req, res) => {
    const {nemId, password} = req.body;

    if (nemId === undefined || password === undefined) {
        return res.sendStatus(400);
    }

    const query = 'select * from User inner join Password on User.Id = Password.UserId and User.NemId = ?';
    let dbRows;
    try {
        dbRows = await new Promise(((resolve, reject) => {
            db.all(query, [nemId], (err, dbRows) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(dbRows);
                }
            })
        }))
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }

    if (dbRows.length === 0) {
        console.log(`no user found for nemid ${nemId}`);
        return res.status(404).send('user not found');
    }

    for (const dbRow of dbRows) {
        if (!confirmPassword(password, dbRow.PasswordHash)) {
            continue;
        }

        const query = 'select * from User where id = ?';
        let dbUser;
        try {
            dbUser = await new Promise(((resolve, reject) => {
                db.get(query, [dbRow.UserId], (err, dbUser) => {
                    if (err) {
                        reject(new Error(err));
                    } else {
                        resolve(dbUser);
                    }
                })
            }))
        } catch (e) {
            console.log(e);
            return res.sendStatus(400);
        }

        if (dbUser === undefined) {
            console.log(`no user found for nemid '${nemId}'`);
            return res.status(404).send('user not found');
        }

        return res.status(200).json(dbUser);
    }
});

router.post('/change-password', async (req, res) => {
    const {nemId, oldPassword, newPassword} = req.body;

    if (nemId === undefined ||
        oldPassword === undefined ||
        newPassword === undefined) {
        return res.sendStatus(400);
    }

    const queryUserPass = 'select * from User inner join Password on User.Id = Password.UserId and User.NemId = ?';
    let dbRows;
    try {
        dbRows = await new Promise((resolve, reject) => {
            db.all(queryUserPass, [nemId], (err, dbRows) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(dbRows);
                }
            });
        });
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }

    if (dbRows.length === 0) {
        console.log(`no rows found for nemid ${nemId}`);
        return res.sendStatus(404);
    }

    for (const dbRow of dbRows) {
        if (!confirmPassword(oldPassword, dbRow.PasswordHash)) {
            continue;
        }

        console.log(dbRow);
        const query = 'update Password set IsValid=false where Id = ?';
        try {
            await new Promise((resolve, reject) => {
                db.run(query, [dbRow.Id], (err) => {
                    if (err) {
                        reject(new Error(err));
                    } else {
                        resolve(true);
                    }
                });
            });
            break;
        } catch (e) {
            console.log(e);
            return res.sendStatus(400);
        }
    }

    const queryNewPass = 'insert into Password(UserId, PasswordHash) values (?, ?)';

    try {
        await new Promise(((resolve, reject) => {
            db.run(queryNewPass, [dbRows[0].UserId, getHashedPassword(newPassword)], (err) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(true);
                }
            })
        }))
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }

    return res.sendStatus(200);
});

router.get('/reset-password', async (req, res) => {
    const {cpr, password} = req.body;

    if (cpr === undefined ||
        password === undefined) {
        return res.sendStatus(400);
    }

    const queryUser = 'select * from User where User.Cpr = ?';
    let dbUser;
    try {
        dbUser = await new Promise((resolve, reject) => {
            db.get(queryUser, [cpr], (err, dbRow) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(dbRow);
                }
            });
        });
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }

    if (dbUser === undefined) {
        console.log(`no user found for cpr ${cpr}`);
        return res.sendStatus(404);
    }

    const queryPasswords = 'update Password set IsValid=false where UserId = ?';
    try {
        await new Promise((resolve, reject) => {
            db.run(queryPasswords, [dbUser.Id], (err) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(true);
                }
            });
        });
        console.log('invalidated old passwords for ' + dbUser.Cpr);
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }

    const queryNewPass = 'insert into Password(UserId, PasswordHash) values (?, ?)';

    try {
        await new Promise((resolve, reject) => {
            db.run(queryNewPass, [(dbUser.Id), (getHashedPassword(password))], (err) => {
                if (err) {
                    reject(new Error(err));
                } else {
                    resolve(true);
                }
            })
        });
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }

    return res.sendStatus(200);
});

module.exports = router;