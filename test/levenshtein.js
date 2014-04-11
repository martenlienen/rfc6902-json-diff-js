var assert = require("assert");
var lev = require("../lib/levenshtein");

describe("Computing the levenshtein distance matrix", function () {
  it("should return null for identical lists", function () {
    assert.deepEqual(lev([1, 2, 3], [1, 2, 3]), null);
  });

  it("should solve case 1", function () {
    var m = lev([1, 2, 3], [1, 3, 2]);

    assert.deepEqual(m, [[0, 1, 2, 3],
                         [1, 0, 1, 2],
                         [2, 1, 1, 1],
                         [3, 2, 1, 2]]);
  });

  it("should solve case 2", function () {
    var m = lev("levenshtein", "meilenstein");

    assert.deepEqual(m, [[0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11],
                         [1, 1, 2, 3, 3, 4, 5, 6, 7, 8, 9, 10],
                         [2, 2, 1, 2, 3, 3, 4, 5, 6, 7, 8, 9],
                         [3, 3, 2, 2, 3, 4, 4, 5, 6, 7, 8, 9],
                         [4, 4, 3, 3, 3, 3, 4, 5, 6, 6, 7, 8],
                         [5, 5, 4, 4, 4, 4, 3, 4, 5, 6, 7, 7],
                         [6, 6, 5, 5, 5, 5, 4, 3, 4, 5, 6, 7],
                         [7, 7, 6, 6, 6, 6, 5, 4, 4, 5, 6, 7],
                         [8, 8, 7, 7, 7, 7, 6, 5, 4, 5, 6, 7],
                         [9, 9, 8, 8, 8, 7, 7, 6, 5, 4, 5, 6],
                         [10, 10, 9, 8, 9, 8, 8, 7, 6, 5, 4, 5],
                         [11, 11, 10, 9, 9, 9, 8, 8, 7, 6, 5, 4]]);
  });

  it("should work with arrays of different lengths", function () {
    var m = lev([1, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6]);

    assert.deepEqual(m, [[0, 1, 2, 3, 4, 5, 6],
                         [1, 0, 1, 2, 3, 4, 5],
                         [2, 1, 1, 1, 2, 3, 4],
                         [3, 2, 2, 2, 1, 2, 3],
                         [4, 3, 3, 3, 2, 1, 2],
                         [5, 4, 4, 4, 3, 2, 1]]);
  });
});
