(function (_getIterator) {
'use strict';

_getIterator = 'default' in _getIterator ? _getIterator['default'] : _getIterator;

console.log('a');

var arr = [1, 2, 3];

for (var _iterator = arr, _isArray = Array.isArray(_iterator), _i = 0, _iterator = _isArray ? _iterator : _getIterator(_iterator);;) {
    var _ref;

    if (_isArray) {
        if (_i >= _iterator.length) break;
        _ref = _iterator[_i++];
    } else {
        _i = _iterator.next();
        if (_i.done) break;
        _ref = _i.value;
    }

    var v = _ref;

    console.log(v);
}

}(_getIterator));
