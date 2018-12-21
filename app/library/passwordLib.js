const bcrypt = require('bcrypt');
const saltRounds = 10;

let hashPassword = (plainPassword) => {
    let salt = bcrypt.genSaltSync(saltRounds);
    let hashedPass = bcrypt.hashSync(plainPassword, salt);
    return hashedPass;
}

let comparePassword = (plainPassword, hashedPassword) => {
    return new Promise((resolve, reject) => {
        bcrypt.compare(plainPassword, hashedPassword)
            .then((data) => resolve(data))
            .catch((err) => reject(err));
    })

}
/* hashed = hashPassword('123456');
console.log(hashed);
comparePassword('12345', hashed)
    .then((data) => {
        console.log(data);
    })
    .catch((err) => {
        console.log(err.message);
    }) */
module.exports = {
    hashPassword,
    comparePassword
}