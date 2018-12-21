const mongoose = require('mongoose');

const commentModel = new mongoose.Schema({
    bugId: {
        type: String,
        required:true
    },
    commentatorName:{
        type: String,
        required:true
    },
    comment:{
        type:String,
        required:true,
    },
    date:{
        type:Date,
        default:Date.now()
    }
});
mongoose.model('Comment',commentModel);