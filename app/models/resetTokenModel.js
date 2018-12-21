const mongoose = require('mongoose');
const resetToken = new mongoose.Schema({
    email:{
        type:String,
        required:true
    },
    token:{
        type:String,
        required:true
    },
    confirmed:{
      type:Boolean,
      default:false  
    },
    createdOn:{
        type:Date,
        default:Date.now()
    },
    expiresOn:{
        type:Date,
        default:Date.now() + 3600000 //1hour
    }
});
mongoose.model('resetToken',resetToken);