//use this middleware to stop unauthorized user
//from making crud operation
//here we varify the authToken and then grant access
const mongoose = require('mongoose');
const token = require('./../library/tokenLib');
const response = require('./../library/responseLib');
const check = require('./../library/checkLib');

const authModel = mongoose.model('Auth');

let isAuthorized = (req, res, next) => {
    let authToken = req.params.authToken || req.query.authToken || req.body.authToken || req.header('authToken');
    if (authToken) {
        authModel.findOne({ authToken: authToken })
            .then((authDetails) => {
                if (check.isEmpty(authDetails)) {
                    let apiResponse = response.generate(true,
                        'invalid or expired authToken', 404, null);
                    res.status(404).send(apiResponse);
                }
                else {
                    token.verifyClaim(authDetails.authToken)
                        .then((decoded) => {
                            req.user = {
                                userId: decoded.data.userId
                            };
                            next();
                        })
                        .catch((error) => {
                            console.log('failed  authorize', error);
                            let apiResponse = response.generate(true, 'failed to authorize', 500, null);
                            res.status(500).send(apiResponse);
                        })
                }
            })
            .catch((error) => {
                console.log('failed to verify token', error);
                let apiResponse = response.generate(true, 'failed to verify authToken', 500);
                res.status(apiResponse.status).send(apiResponse);
            })
    }
    else {
        let apiResponse = response.generate(true,
            'AuthorizationToken Is Missing In Request', 400, null);
        res.status(400).send(apiResponse);

    }
}
module.exports = {
    isAuthorized
}
