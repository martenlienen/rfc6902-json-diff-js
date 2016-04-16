var _flatten = require("lodash.flatten");
var _isArray = require("lodash.isarray");
var _isEqual = require("lodash.isequal");
var _isPlainObject = require("lodash.isplainobject");
var _keys = require("lodash.keys");
var _union = require("lodash.union");
var pointer = require("json-pointer");
var levenshtein = require("./levenshtein");

/**
 * Backtrace an optimal path through a levenshtein distance matrix.
 *
 * @returns {Array} List of operations
 */
function matrixToOperations (matrix, i, j) {
  if (i === 0 && j === 0) {
    return [];
  } else if (i === 0) {
    return matrixToOperations(matrix, i, j - 1).concat("add");
  } else if (j === 0) {
    return matrixToOperations(matrix, i - 1, j).concat("remove");
  } else {
    var left = matrix[i][j - 1];
    var up = matrix[i - 1][j];
    var upleft = matrix[i - 1][j - 1];

    if (upleft <= up && upleft <= left) {
      if (upleft === matrix[i][j]) {
        return matrixToOperations(matrix, i - 1, j - 1).concat("eq");
      } else {
        return matrixToOperations(matrix, i - 1, j - 1).concat("replace");
      }
    } else if (left <= upleft && left <= up) {
      return matrixToOperations(matrix, i, j - 1).concat("add");
    } else {
      return matrixToOperations(matrix, i - 1, j).concat("remove");
    }
  }
}

function diff (from, to) {
  var ops = [];

  if (_isEqual(from, to)) {
    return [];
  } else if (_isPlainObject(from) && _isPlainObject(to)) {
    var keys = _union(_keys(from), _keys(to));

    ops = keys.map(function (key) {
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

    return _flatten(ops, true);
  } else if (_isArray(from) && _isArray(to)) {
    var matrix = levenshtein(from, to);
    ops = [];

    if (matrix) {
      var m = matrix.length;
      var n = matrix[0].length;
      var i = 0;
      var j = 0;
      var o = matrixToOperations(matrix, m - 1, n - 1);

      o.forEach(function (op) {
        if (op == "add") {
          ops.push({ op: "add", path: [j], value: to[j] });
          j++;
        } else if (op == "remove") {
          ops.push({ op: "remove", path: [j] });
          i++;
        } else if (op == "replace") {
          var operations = diff(from[i], to[j]);

          ops = ops.concat(operations.map(function (op) {
            op.path.unshift(j);

            return op;
          }));

          i++;
          j++;
        } else {
          i++;
          j++;
        }
      });
    }

    return ops;
  } else {
    return [{ op: "replace", path: [], value: to }];
  }
}

module.exports = function (from, to) {
  var ops = diff(from, to);
  ops = ops.map(function (op) {
    op.path = pointer.compile(op.path.map(function (p) { return "" + p; }));

    return op;
  });

  return ops;
};
