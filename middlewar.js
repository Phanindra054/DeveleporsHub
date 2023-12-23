const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  const token = req.header('x-token');
  if (!token) {
    return res.status(401).send('Token Not Provided');
  } 
    try {
      const tokdata = jwt.verify(token, 'qwerty');
      req.user = tokdata.user;
      next();
    } catch (error) {
      console.error('Error verifying token:', error);
      return res.status(401).send('Invalid Token');
    }
  
};
