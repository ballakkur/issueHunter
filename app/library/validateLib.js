'use strict'

let Email = (email)=>{
    let emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    if(email.match(emailRegex)){
        return true;
    }else{
        return false
    }
}
let Password = (password)=>{
    let passRegex = /\w{6,}/    
    if(password.match(passRegex)){
        return true;
    }else{
        return false;
    }
}

module.exports = {
    Email,
    Password
}