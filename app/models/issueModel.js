const mongoose = require('mongoose');

const issueModel = new mongoose.Schema({
    bugId: {
        type: String,
        index:true,
        unique:true,
        required:true
    },
    title:{
        type:String,
        required:true,
    },
    description:{
        type:String
    },
    status:{
        type: String,
        enum: ['backlog', 'in-progress','in-test','done'],
        required:true
    },
    reporterName:{
        type:String,
        require:true
    },
    reporterId:{
        type:String,
        require:true
    },
    assignedToId:{
        type:String
    },
    assignedToName:{
        type:String
    },
    date:{
        type:Date,
        default:Date.now()
    },
    image:{
        type:String
    }
});
mongoose.model('Issue', issueModel);