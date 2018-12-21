const mongoose = require('mongoose')
const Schema = mongoose.Schema

const socailUserSchema = new Schema({
    userId: {
        type: String,
        default: '',
        index: true,
        unique: true
      },
      firstName: {
        type: String,
        default: ''
      },
      lastName: {
        type: String,
        default: ''
      },
      email: {
        type: String,
        default: ''
      },
      createdOn :{
        type:Date,
        default:Date.now()
      }
})

module.exports = mongoose.model('SocialUser', socailUserSchema)