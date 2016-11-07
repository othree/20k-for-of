20K for...of
============

[`for...of`][forof] is a very useful new syntax from ECMAScript 2015. In the past, to iterate an array is like:

	var arr = [1, 2, 3];
    var i, v;

    for (i in arr) {
        v = arr[i];
        console.log(v);
    }

But now its much easier:

	var arr = [1, 2, 3];

    for (let v of arr) {
        console.log(v);
    }

In propduction environment. Their are still lots of user agent only supports ES5.
So use transpiler like [Babel][] is very popular. By babel, the code transforms to:

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

It depends on the iterator defined in ECMAScript 2015.
And Babel have [babel-polyfill][] to provide iterator.
The size of babel-polyfill is quite big.
Normal size is 228KB and minimized size is 95KB.
So how about only import what we really need?
There is a plugin called [transform-runtime][] can do this.
The code will now transform to:

[babel-polyfill]:https://babeljs.io/docs/usage/polyfill/
[transform-runtime]:https://babeljs.io/docs/plugins/transform-runtime/


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

Then we use [rollup][] to do module bundle with two plugins:

* [rollup-plugin-node-resolve][]
* [rollup-plugin-commonjs][]

And we will get a [20KB file][bundle-all]

[rollup]:http://rollupjs.org/
[rollup-plugin-node-resolve]:https://github.com/rollup/rollup-plugin-node-resolve
[rollup-plugin-commonjs]:https://github.com/rollup/rollup-plugin-commonjs

[bundle-all]:https://github.com/othree/20k-for-of/blob/master/out/bundle-all.js

[forof]:https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/for...of
[Babel]:https://babeljs.io/