const jwt = require('jsonwebtoken');
const secret = process.env.JWT_SECRET || 'fVDuPPGjWdtUNYUWUuAeXuJEtGHDyl2Z1LDaN4zCPLD1K/eKT3/k/luMvakiHz9r91A+lwJJfMMr4p5eRcdzQXq9kscd/uUznS6KJlf2pTvZZQ8h7WcLRDyJihYVPiDzRhs290FnTNSo8kJt8QwnYxJZ1bkTE+HlEExnbvCHn+A=';

module.exports = {
    sign: (data, fn) => {
        jwt.sign({
                data
            },
            secret,
            {
                expiresIn: '1h'
            },
            (err, token) => {
                if (err) {
                    console.log(`JWT error : ${err}`);
                    return fn(err, null);
                }
                return fn(null, token);
            });
    },
    verify: (token, fn) => {
        jwt.verify(token, secret, (err, data) => {
            if (err) {
                console.log(`JWT error : ${err}`);
                return fn(err, null);
            }
            return fn(null, data);
        });
    },
    renew: (token, fn) => {
        jwt.verify(token, secret, (err, data) => {
            if (err) {
                console.log(`JWT error : ${err}`);
                return fn(err, null);
            }
            jwt.sign({
                    data: data.data
                },
                secret,
                {
                    expiresIn: '1h'
                },
                (err, token) => {
                    if (err) {
                        console.log(`JWT error : ${err}`);
                        return fn(err, null);
                    }
                    return fn(null, {...data, token: token});
                });
        });
    }
};
