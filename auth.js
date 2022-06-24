const express = require('express');
const router = express.Router();

const Account = require('./models/account');
const Hash = require('./models/hash');

const jwt = require('./jwt.js');
const cr = require('./crypto.js');
const bad = (res, status, msg = 'ERROR') => {
    const response = {
        message: msg
    };
    res.setHeader('Content-Type', 'application/json');
    return res.status(status).end(JSON.stringify(response));
};
const ok = (res, data, msg = 'Success') => {
    const response = {
        ...data,
        message: msg
    };
    res.setHeader('Content-Type', 'application/json');
    return res.status(200).end(JSON.stringify(response));
};
const checkJWT = (req, res, next) => {
    const path = req.path.split('/')[1];

    const fullToken = req.header('Authorization') ? req.header('Authorization').split(' ') : null;
    const tokenType = fullToken ? fullToken[0] : null;
    const token = fullToken ? fullToken[1] : null;
    if (tokenType !== 'Bearer') {
        timeLog(`ERROR : Incorrect token type : ${tokenType}.`);
        return res.status(401).end('Unauthorized\n');
    }
    jwt.renew(token, (err, data) => {
        if (err) {
            timeLog(err);
            return res.status(401).end('Unauthorized\n');
        }
        req.jwt = data;
        return next();
    });
};
const checkEmail = (email, fn) => {
    Account.findOne({where: {email: email}}).then((result, err) => {
        if (err) {
            timeLog(err);
            return fn(err, null);
        }
        if (result.length > 0) {
            return fn(null, true);
        } else {
            return fn(null, false);
        }
    });
};

const timeLog = require('./timelog')


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
            return bad(res, 400, 'User already exists.');
        }
        
        Account.create({
            email: email,
            role_id: role_id
        }).then(account => {
            cr.create(password, (err, key_data) => {
                if (err) {
                    timeLog(`${req.path} : Unable create key : ${err} `);
                    return bad(res, 500, 'Unable to create user.');
                }
                Hash.create({
                    id: account.id,
                    hash_key: key_data.key,
                    salt: key_data.salt,
                    account_id: account.id
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
    Account.findOne({include: Hash}).then((err, result) => {
        if (err) {
            timeLog(err);
            return bad(res, 500, 'Unable to login.');
        }
        if (result.length < 1) {
            timeLog(`No user found with email ${email}`);
            return bad(res, 401, 'Unable to login.');
        }
        if (result[0].account.role_id !== 1) {
            return bad(res, 401, 'Unauthorized');
        }
        const {id, hash_key, salt, role_id} = result[0];

        cr.verify(password, salt, hash_key, (err, match) => {
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
                    account_id: result[0].id,
                    role_id: result[0].role_id,
                    jwt: token
                };
                timeLog(`/login : Success : ${email}`);
                return ok(res, response, 'Successful Login');
            });
        });
    })
});

module.exports = router;