const crypto = require('crypto');
// const d = crypto.createHash('md5').update('by' + '123456').digest('hex');
// console.log(d);


module.exports = (str) => {
  return crypto.createHash('md5').update(str).digest('hex');
}