var _ = require("lodash");
var pointer = require("json-pointer");

function diff (from, to) {
  if (_.isPlainObject(from) && _.isPlainObject(to)) {
    var keys = _.union(_.keys(from), _.keys(to));

    var ops = keys.map(function (key) {
      var hasFrom = from.hasOwnProperty(key);
      var hasTo = to.hasOwnProperty(key);

      if (hasFrom && hasTo) {
        var d = diff(from[key], to[key]);

        return d.map(function (op) {
          op.path.unshift(key);

          return op;
        });
      } else if (hasFrom) {
        return { op: "remove", path: [key] };
      } else {
        return { op: "add", path: [key], value: to[key] };
      }
    });

    return _.flatten(ops, true);
  } else if (_.isArray(from) && _.isArray(to)) {
    var length = Math.max(from.length, to.length);

    return [];
  } else {
    return [{ op: "replace", path: [], value: to }];
  }
}

module.exports = function (from, to) {
  var ops = diff(from, to);
  ops = _.map(ops, function (op) {
    op.path = pointer.compile(op.path);

    return op;
  });

  return ops;
};
