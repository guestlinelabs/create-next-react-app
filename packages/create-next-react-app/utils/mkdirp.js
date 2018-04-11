const mkdirp = require('mkdirp');

module.exports = function(path, options = {}) {
  return new Promise((resolve, reject) => {
    mkdirp(path, options, err => {
      if (err) {
        return reject(err);
      }

      resolve();
    });
  });
};
