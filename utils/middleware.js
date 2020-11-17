const jwt = require('jsonwebtoken');

var connection = require('../db/databases.js');
// const User = mongoose.model('User');


module.exports = (req, res, next) => {
  const { authorization } = req.headers;
  if (!authorization) {
    return res.status(401).send({ error: "You must be logged in" });
  }

  const token = authorization.replace('Bearer ', '');
  jwt.verify(token, 'MY_SECRET_KEY', async (err, payload) => {
    if (err) {
      return res.status(401).send({ error: "You must be logged in" });
    }

    const { userId } = payload;

    let query = `select * from user_details where id = ${userId}`
    connection.query(query, function (err, user) {
      console.log(err);
      console.log('User:', user)
      if (!err) {
        req.user = user;
        next();
      }
    });
  });
};