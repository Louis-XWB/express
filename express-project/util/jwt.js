const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const tojwt = promisify(jwt.sign);
const verify = promisify(jwt.verify);
const { uuid } = require('../config/config.default');

module.exports.createToken = async userInfo => {
  const token = await tojwt(userInfo,
    uuid,
    {
      expiresIn: 60 * 60 * 24 * 7,
    });
  return token;
}

module.exports.verifyToken = function (require = true) {
  return async (req, res, next) => {
    let token = req.headers.authorization;
    token = token ? token.split('Bearer ')[1] : null;

    if (token) {
      try {
        const userInfo = await verify(token, uuid);
        req.user = userInfo;
        next();
      } catch (err) {
        res.status(402).json({ error: 'token is invalid' });
      }
    } else if (require) {
      res.status(402).json({ error: 'no token' });
    } else {
      next();
    }
  }
}





// jwt.sign({ foo: 'bar' }, 'hulala', function (err, token) {
//   if (err) {
//     console.log(err);
//   } else {
//     console.log(token);
//   }
// })

//  const result = jwt.verify('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJmb28iOiJiYXIiLCJpYXQiOjE2OTI1NDIzNzV9.81j6UwC3x2KlhOOUaALTDZkbv1VIbK0PXlwqd-z--xs', 'hulala'
//  ,'hulala');
//   console.log(result);

