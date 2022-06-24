const crypto = require('crypto');

module.exports = {
    create: (pass, fn) => {
        const salt = crypto.randomBytes(32).toString('hex');
        crypto.pbkdf2(pass, salt, 100000, 64, 'sha512', (err, derivedKey) => {
            if (err) {
                return fn(err, null);
            }
            const key = derivedKey.toString('hex');
            return fn(null, {salt: salt, key: key});
        });
    },
    verify: (pass, salt, key, fn) => {
        crypto.pbkdf2(pass, salt, 100000, 64, 'sha512', (err, derivedKey) => {
            if (err) {
                return fn(err, null);
            }
            const dkString = derivedKey.toString('hex');
            if (dkString !== key) {
                return fn(null, false);
            } else {
                return fn(null, true);
            }
        });
    }
};
