function promisify(fn) {
  const args = [];

  for (var i = 1, n = arguments.length; i < n; i++) {
    args.push(arguments[i]);
  }

  return new Promise(function (resolve, reject) {
    args.push(function (err) {
      const args = [];

      if (err) {
        reject(err);
      } else {
        for (var i = 1, n = arguments.length; i < n; i++) {
          args.push(arguments[i]);
        }
        resolve.apply(resolve, args);
      }
    });
    fn.apply(fn, args);
  });
}

promisify.setReturn = function (value) {
  return function () {
    const args = [];
    for (var i = 0, n = arguments.length; i < n; i++) {
      args.push(arguments[i]);
    }
    return promisify.apply(args[0], args).then(() => value);
  };
};

module.exports = promisify;