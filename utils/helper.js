const bcrypt = require('bcrypt');

var createHashPassword = function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.genSalt(10, (err, salt) => {
            if (err) {
                return reject(err);
            }

            bcrypt.hash(password, salt, (err, hash) => {
                if (err) {
                    return reject(err);
                }

                return resolve(hash);
            });
        });

    });
}


var comparePassword = function (candidatePassword, password) {
        return new Promise((resolve, reject) => {
            bcrypt.compare(candidatePassword, password, (err, isMatch) => {
                if (err) {
                    return reject(err);
                }

                if (!isMatch) {
                    return reject(false);
                }

                resolve(true);
            });
        });
    }

    module.exports = { createHashPassword, comparePassword }