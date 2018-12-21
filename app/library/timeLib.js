'use strict'
const moment = require('moment');

let now = () => {
    let date = moment();
    let timeStamp = date.format('Do MMM YYYY  hh:m:s a');
    return timeStamp;
}
// console.log(now());
module.exports = {
    now
}