const jwt = require('jsonwebtoken');
const cfg = require('../config');

verifyToken = (req, res, next) => {
  const token = req.headers['x-access-token'];

  if (!token) {
    return res.status(403).send({ message: 'No token provided!' });
  }

  jwt.verify(token, cfg.secret, (err, decoded) => {
    if (err) {
      return res.status(401).send({ message: 'Unauthorized!' });
    }
    req.authToken = decoded.authToken;
    next();
  });
};

const authJwt = {
  verifyToken
};
module.exports = authJwt;