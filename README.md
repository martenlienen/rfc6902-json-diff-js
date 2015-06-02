# JSON diff according to RFC6902

[![Build Status](https://travis-ci.org/cqql/rfc6902-json-diff-js.svg?branch=master)](https://travis-ci.org/cqql/rfc6902-json-diff-js)

Diff two JS objects and receive an [RFC6902](http://tools.ietf.org/html/rfc6902)
JSON patch.

```js
var diff = require("rfc6902-json-diff");

var patch = diff(
  { name: "CQQL", age: 21, likes: ["api stuff"] },
  { name: "CQQL", age: 22, likes: ["api stuff", "json"] }
);

console.log(patch);
//=> [{ op: "replace", path: "/age", value: 22 },
//=>  { op: "add", path: "/likes/1", value: "json" }]
```

## Implementation

The current implementation only uses the `add`, `remove` and `replace`
operation. Usage of `move` and `copy` can and may be added later and I am always
open for pull requests, but they are not needed to generate patches for every
possible modification. Your patches will just be a bit bigger than they would
be with `move` and `copy`.

Arrays are diffed with the
[Levenshtein distance](http://en.wikipedia.org/wiki/Levenshtein_distance). This
gives us

```js
diff([1, 2, 3, 4, 5, 6], [1, 5, 2, 3, 4, 6]) == [
  { op: "add", path: "/1", value: 5 },
  { op: "remove", path: "/5" }
]
```

instead of 5 `replace` operations.
