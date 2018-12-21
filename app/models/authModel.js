const mongoose = require('mongoose');

const authModel = new mongoose.Schema({
    userId: {
        type: String
    },
    authToken: {
        type: String
    },
    tokenSecret: {
        type: String
    },
    tokenCreatedOn: {
        type: String
    }
});
mongoose.model('Auth', authModel);