const express = require('express');
const router = express.Router();

const Account = require('./models/account');
const Hash = require('./models/hash');

const helpers = require('./helpers')

const {jwt, cr, timeLog, ok, bad} = helpers;

router.post('/account/create', async (req, res) => {
    timeLog(`${req.method} : ${req.path}`);
    let {email, password, role_id} = req.body;
    role_id = role_id || 2;
    if (!email || !password) {
        timeLog(`${req.path} : Missing parameters in body : Need email and password`);
        return bad(res, 400, 'Need email and password');
    }

    Account.findOne({where: {email: email}}).then((account) => {
        if (account) {
            return bad(res, 400, 'Account already exists.');
        }

        Account.create({
            email: email,
            role_id: role_id
        }).then(account => {
            cr.create(password, (err, key_data) => {
                if (err) {
                    timeLog(`${req.path} : Unable create key : ${err} `);
                    return bad(res, 500, 'Unable to create account.');
                }
                Hash.create({
                    id: account.id,
                    key: key_data.key,
                    salt: key_data.salt,
                    AccountId: account.id
                })
                return res.status(200)
                    .setHeader('content-type', 'application/json')
                    .send({message: `Account added!`, account: account});
            })
        }).catch(error => {
            timeLog(`${req.path} : Unable to add account : ${error} `);
            return res.status(500)
                .setHeader('content-type', 'application/json')
                .send({error: `Server error: ${error.name}`});
        });
    })
})

router.post('/login', async (req, res) => {
    const {email, password} = req.body;
    let response = {};
    if (!email || !password) {
        timeLog('No email or password');
        return bad(res, 400, 'Need email and password.');
    }
    Account.findOne({
        where: {email: email},
        include: [Hash]
    }).then((account) => {
        if (!account) {
            timeLog(`No user found with email ${email}`);
            return bad(res, 401, 'Unable to login.');
        }
        if (account.role_id !== 2) {
            return bad(res, 401, 'Unauthorized');
        }
        console.log(account.Hash.dataValues);
        const {id, key, salt} = account.Hash.dataValues;
        const {role_id} = account.dataValues;

        cr.verify(password, salt, key, (err, match) => {
            if (err) {
                timeLog(err, 'ERROR');
                return bad(res, 500, 'Unable to login');
            }
            if (!match) {
                timeLog('Keys do not match', 'ERROR');
                return bad(res, 401, 'Incorrect email or password');
            }
            jwt.sign({uid: id, role_id: role_id}, (err, token) => {
                if (err) {
                    timeLog(err, 'ERROR');
                    return bad(res, 500, 'Unable to login');
                }
                response = {
                    account_id: account.id,
                    role_id: account.role_id,
                    jwt: token
                };
                timeLog(`/login : Success : ${email}`);
                return ok(res, response, 'Successful Login');
            });
        });
    }).catch((error) => {
        timeLog(`${req.path} : Unable to login : ${error} `);
        return res.status(500)
            .setHeader('content-type', 'application/json')
            .send({error: `Server error: ${error.name}`});
    });
});

module.exports = router;