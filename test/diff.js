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
