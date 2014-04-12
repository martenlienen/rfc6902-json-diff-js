var assert = require("assert");
var diff = require("../");

describe("Generating diffs", function () {
  describe("for objects", function () {
    it("should add an `add` operation for added keys", function () {
      var d = diff({}, { key: 5 });

      assert.deepEqual(d, [{ op: "add", path: "/key", value: 5 }]);
    });

    it("should add a `remove` operation for removed keys", function () {
      var d = diff({ name: "value" }, {});

      assert.deepEqual(d, [{ op: "remove", path: "/name" }]);
    });

    it("should add a `replace` operation for changed keys", function () {
      var d = diff({ name: "value" }, { name: "no" });

      assert.deepEqual(d, [{ op: "replace", path: "/name", value: "no" }]);
    });
  });

  describe("for arrays", function () {
    it("should not replace elements unnecessarily", function () {
      var d = diff([1, 3, 4, 5, 6], [1, 2, 3, 4, 5, 6]);

      assert.deepEqual(d, [{ op: "add", path: "/1", value: 2 }]);
    });

    it("should generate `remove` operations", function () {
      var d = diff([1, 2, 3, 4, 5], [1, 3, 5]);

      assert.deepEqual(d, [{ op: "remove", path: "/1" }, { op: "remove", path: "/2" }]);
    });

    it("should generate `replace` operations", function () {
      var d = diff([1, 2, 3, 4, 5], [1, "a", 3, true, 5]);

      assert.deepEqual(d, [{ op: "replace", path: "/1", value: "a" },
                           { op: "replace", path: "/3", value: true }]);
    });

    it("should keep correct path values when mixing operations", function () {
      var d = diff([1, 2, 3, 4, 5], [true, 2, 4, 5, 6]);

      assert.deepEqual(d, [{ op: "replace", path: "/0", value: true },
                           { op: "remove", path: "/2" },
                           { op: "add", path: "/4", value: 6 }]);
    });

    it("should generate sub diffs when replacing", function () {
      var d = diff([1, { key: 1337 }, "b"], [1, { key: 6077, name: "cqql" }, "b"]);

      assert.deepEqual(d, [{ op: "replace", path: "/1/key", value: 6077 },
                           { op: "add", path: "/1/name", value: "cqql" }]);
    });
  });

  describe("for nested objects", function () {
    it("should only generate one `add` operation", function () {
      var d = diff({}, { top: { bottom: true } });

      assert.deepEqual(d, [{ op: "add", path: "/top", value: { bottom: true } }]);
    });

    it("should only generate one `remove` operation", function () {
      var d = diff({ top: { bottom: true } }, {});

      assert.deepEqual(d, [{ op: "remove", path: "/top" }]);
    });

    it("should only generate one `replace` operation", function () {
      var d = diff({ top: { bottom: true } }, { top: "string" });

      assert.deepEqual(d, [{ op: "replace", path: "/top", value: "string" }]);
    });
  });
});
