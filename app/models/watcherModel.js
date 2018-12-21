const mongoose = require('mongoose');

const watcherModel = new mongoose.Schema({
    bugId: {
        type: String,
        index:true,
        unique:true,
        required:true
    },
    watcherName:[String],
});
mongoose.model('Watcher', watcherModel);