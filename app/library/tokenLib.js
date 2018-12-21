const jwt = require('jsonwebtoken');
const shortId = require('shortid');
const secret = '@meeting##Organizer%12';

let genarateToken = (data) => {
    return new Promise((resolve, reject) => {
        try {
            let payLoad = {
                jwtid: shortId.generate(),
                iat: Date.now(),
                exp: Math.floor(Date.now() / 1000) + (60 * 60 * 24),
                sub: 'authToken',
                iss: 'chatBox',
                data: data
            }
            let details = {
                token: jwt.sign(payLoad, secret),
                secret: secret
            }
            resolve(details);
        } catch (err) {
            console.log(err);
            reject(err);
        }
    })
}

let verifyClaim = (token) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, function (err, decoded) {
            if (err) {
                reject(err);
            }
            else {
                console.log('verified');
                resolve(decoded);
            }
        })
    })
}

let verifyClaimsWithoutSecret = (token, cb) => {

    //verify a token
    jwt.verify(token, secret, function (err, decoded) {

        if (err) {
            console.log("error while verify token");
            console.log(err);
            cb(err, null);
        }
        else {
            console.log("user verified");
            console.log(decoded);
            cb(null, decoded);
        }
    });
}//end verifyClaimsWithoutSecret

/* verifyClaim('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJqd3RpZCI6IlhXVjZYd0VMSiIsImlhdCI6MTUzMzkwMjc3OTUwMywiZXhwIjoxNTMzOTg5MTc5LCJzdWIiOiJhdXRoVG9rZW4iLCJpc3MiOiJjaGF0Qm94IiwiZGF0YSI6eyJlbWFpbCI6Im1haWxAZ21haWwuY29tIiwibW9iaWxlTnVtYmVyIjo5MTI0NTg5NDM1LCJ1c2VySWQiOiI2Zi1LNUZ4Wl8iLCJmaXJzdE5hbWUiOiJNUiIsImxhc3ROYW1lIjoieHl6In19.XxkOamZEXd0DbBhKe6VSY2P_XE8kJ1ZeY1lM9WmVXeo')
    .then((data) => console.log(data))
    .catch((error) => console.log(error.message)); */

module.exports = {
    genarateToken,
    verifyClaim,
    verifyClaimsWithoutSecret
}