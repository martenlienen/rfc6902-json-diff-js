var _ = {
  isEqual: require("lodash.isequal"),
  min: require("lodash.min"),
  range: require("lodash.range")
};

// Compute the levenshtein edit distance matrix for two lists.
//
// It can be used to infer the concrete edit operations to transform the first
// list into the second.
//
// Returns an m*n matrix, where the (i, j) cell contains the levenshtein
// distance between the i-element prefix of from and the j-element prefix of to.
module.exports = function (from, to) {
  if (_.isEqual(from, to)) {
    return null;
  }

  var m = from.length;
  var n = to.length;
  var d = _.range(0, m + 1).map(function (x) {
    return [x];
  });

  d[0] = _.range(0, n + 1);

  for (var i = 1; i <= m; i++) {
    for (var j = 1; j <= n; j++) {
      var replacementCost = 1;

      if (_.isEqual(from[i - 1], to[j - 1])) {
        replacementCost = 0;
      }

      d[i][j] = _.min([d[i - 1][j - 1] + replacementCost,
                       d[i - 1][j] + 1,
                       d[i][j - 1] + 1]);
    }
  }

  return d;
};
