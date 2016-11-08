20K for...of
============

[`for...of`][forof] is a very useful new syntax of ES2015. In the past, to iterate an array is like:

```javascript
var arr = [1, 2, 3];
var i, v;

for (i in arr) {
    v = arr[i];
    console.log(v);
}
```

But now its much easier:

```javascript
var arr = [1, 2, 3];

for (let v of arr) {
    console.log(v);
}
```

In propduction environment. There are still lots of user agent only supports ES5. 
So use of transpiler like [Babel][] is very popular. By Babel, the code transforms to:

```javascript
"use strict";

var arr = [1, 2, 3];

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
    for (var _iterator = arr[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var v = _step.value;

        console.log(v);
    }
} catch (err) {
    _didIteratorError = true;
    _iteratorError = err;
} finally {
    try {
        if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
        }
    } finally {
        if (_didIteratorError) {
            throw _iteratorError;
        }
    }
}
```

It depends on the iterator defined in ECMAScript 2015.
And Babel have [babel-polyfill][] to provide iterator.
But the size of babel-polyfill is very huge.
Normal size is 228KB and minimized size is 95KB.
So how about only import what we really need?
There is a plugin called [transform-runtime][] can do this.
The code will now transform to:

[babel-polyfill]:https://babeljs.io/docs/usage/polyfill/
[transform-runtime]:https://babeljs.io/docs/plugins/transform-runtime/

```javascript
import _getIterator from "babel-runtime/core-js/get-iterator";
var arr = [1, 2, 3];

var _iteratorNormalCompletion = true;
var _didIteratorError = false;
var _iteratorError = undefined;

try {
  for (var _iterator = _getIterator(arr), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
    var v = _step.value;

    console.log(v);
  }
} catch (err) {
  _didIteratorError = true;
  _iteratorError = err;
} finally {
  try {
    if (!_iteratorNormalCompletion && _iterator.return) {
      _iterator.return();
    }
  } finally {
    if (_didIteratorError) {
      throw _iteratorError;
    }
  }
}
```

There is an import statement on the top:

```javascript
import _getIterator from "babel-runtime/core-js/get-iterator";
```

Then we use [rollup][] to do module bundle with two plugins:

* [rollup-plugin-node-resolve][] to find module in `node_modules`
* [rollup-plugin-commonjs][] to recognize CommonJS module (node style module)

And following configure:

```javascript
babel({
  exclude: 'node_modules/**',
  plugins: ['transform-runtime'],
  presets: ['es2015-loose-rollup'],
  runtimeHelpers: true
}),
nodeResolve({ jsnext: true }),
commonjs({
  include: 'node_modules/**'
})
```

We will get a [20KB file][bundle-all]. Compare to the original code (72Bytes).
This is still too large. So, is ther any solution for this?

Yes, we have other options.
First is [TypeScript][]. 
TypeScript transform for...of loop to for...in loop if the target language is *ES3* or *ES5*.

The second is [Bublé][buble].
Bublé is another transpiler transform ES2015 to ES5. Build by the author of Rollup, Rich Harris.
The philosophy of Bublé is only do simple, straight forward transform.
So for...of loop will transform to a simple for...in loop.

Of course these two solution have their disadvantages.
For example, you can't use for...of on Map, Set...etc.
Bublé [don't support][buble-async] `async`, `await`.
TypeScript only supports `async`, `await` when [target is ES6][ts-async] (but in [2.1 roadmap][ts-2.1]).


[rollup]:http://rollupjs.org/
[rollup-plugin-node-resolve]:https://github.com/rollup/rollup-plugin-node-resolve
[rollup-plugin-commonjs]:https://github.com/rollup/rollup-plugin-commonjs

[bundle-all]:https://github.com/othree/20k-for-of/blob/master/out/bundle-all.js

[forof]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
[Babel]:https://babeljs.io/

[TypeScript]:https://www.typescriptlang.org/
[ts-ite]:https://www.typescriptlang.org/docs/handbook/iterators-and-generators.html#targeting-es5-and-es3

[buble]:https://buble.surge.sh/
[buble-async]:https://gitlab.com/Rich-Harris/buble/issues/71
[ts-async]:https://www.typescriptlang.org/docs/release-notes/typescript-1.7.html
[ts-2.1]:https://github.com/Microsoft/TypeScript/wiki/Roadmap#21-november-2016
