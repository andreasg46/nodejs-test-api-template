const debug = process.env.DEBUGLOGS || false;

const jwt = require('./jwt.js');
const cr = require('./crypto.js');

const timeLog = (message, type) => {
    if (type == null) {
        type = 'INFO';
    }
    if (type === 'DEBUG' && !debug) {
        return;
    }
    type = (type + '           ').substring(0, 8);
    const d = new Date();
    let month = '0' + d.getMonth() + 1;
    let day = '0' + d.getDate();
    const year = d.getFullYear();
    let hours = '0' + d.getHours();
    let minutes = '0' + d.getMinutes();
    let seconds = '0' + d.getSeconds();
    month = month.substring(month.length - 2);
    day = day.substring(day.length - 2);
    hours = hours.substring(hours.length - 2);
    minutes = minutes.substring(minutes.length - 2);
    seconds = seconds.substring(seconds.length - 2);
    return console.log(`#############:  ${day}/${month}/${year} - ${hours}:${minutes}:${seconds} : ${type} : ${message}`);
};

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
        // timeLog(`ERROR : Incorrect token type : ${tokenType}.`);
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


module.exports = {jwt, cr, timeLog, bad, ok, checkJWT, checkEmail}





