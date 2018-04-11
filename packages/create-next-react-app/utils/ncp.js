const ncp = require('ncp').ncp;

module.exports = function(source, destination, options = {}) {
  return new Promise((resolve, reject) => {
    ncp(source, destination, options, err => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
};
