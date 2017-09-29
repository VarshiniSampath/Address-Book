/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 143);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

var validateFormat = function validateFormat(format) {};

if (process.env.NODE_ENV !== 'production') {
  validateFormat = function validateFormat(format) {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  };
}

function invariant(condition, format, a, b, c, d, e, f) {
  validateFormat(format);

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayModernRecord
 * 
 * @format
 */



var _extends3 = _interopRequireDefault(__webpack_require__(25));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = __webpack_require__(5),
    ID_KEY = _require.ID_KEY,
    REF_KEY = _require.REF_KEY,
    REFS_KEY = _require.REFS_KEY,
    TYPENAME_KEY = _require.TYPENAME_KEY,
    UNPUBLISH_FIELD_SENTINEL = _require.UNPUBLISH_FIELD_SENTINEL;

/**
 * @public
 *
 * Low-level record manipulation methods.
 *
 * A note about perf: we use long-hand property access rather than computed
 * properties in this file for speed ie.
 *
 *    const object = {};
 *    object[KEY] = value;
 *    record[storageKey] = object;
 *
 * instead of:
 *
 *    record[storageKey] = {
 *      [KEY]: value,
 *    };
 *
 * The latter gets transformed by Babel into something like:
 *
 *    function _defineProperty(obj, key, value) {
 *      if (key in obj) {
 *        Object.defineProperty(obj, key, {
 *          value: value,
 *          enumerable: true,
 *          configurable: true,
 *          writable: true,
 *        });
 *      } else {
 *        obj[key] = value;
 *      }
 *      return obj;
 *    }
 *
 *    record[storageKey] = _defineProperty({}, KEY, value);
 *
 * A quick benchmark shows that computed property access is an order of
 * magnitude slower (times in seconds for 100,000 iterations):
 *
 *               best     avg     sd
 *    computed 0.02175 0.02292 0.00113
 *      manual 0.00110 0.00123 0.00008
 */

/**
 * @public
 *
 * Clone a record.
 */
function clone(record) {
  return (0, _extends3['default'])({}, record);
}

/**
 * @public
 *
 * Copies all fields from `source` to `sink`, excluding `__id` and `__typename`.
 *
 * NOTE: This function does not treat `id` specially. To preserve the id,
 * manually reset it after calling this function. Also note that values are
 * copied by reference and not value; callers should ensure that values are
 * copied on write.
 */
function copyFields(source, sink) {
  for (var key in source) {
    if (source.hasOwnProperty(key)) {
      if (key !== ID_KEY && key !== TYPENAME_KEY) {
        sink[key] = source[key];
      }
    }
  }
}

/**
 * @public
 *
 * Create a new record.
 */
function create(dataID, typeName) {
  // See perf note above for why we aren't using computed property access.
  var record = {};
  record[ID_KEY] = dataID;
  record[TYPENAME_KEY] = typeName;
  return record;
}

/**
 * @public
 *
 * Get the record's `id` if available or the client-generated identifier.
 */
function getDataID(record) {
  return record[ID_KEY];
}

/**
 * @public
 *
 * Get the concrete type of the record.
 */
function getType(record) {
  return record[TYPENAME_KEY];
}

/**
 * @public
 *
 * Get a scalar (non-link) field value.
 */
function getValue(record, storageKey) {
  var value = record[storageKey];
  if (value && typeof value === 'object') {
    __webpack_require__(0)(!value.hasOwnProperty(REF_KEY) && !value.hasOwnProperty(REFS_KEY), 'RelayModernRecord.getValue(): Expected a scalar (non-link) value for `%s.%s` ' + 'but found %s.', record[ID_KEY], storageKey, value.hasOwnProperty(REF_KEY) ? 'a linked record' : 'plural linked records');
  }
  return value;
}

/**
 * @public
 *
 * Get the value of a field as a reference to another record. Throws if the
 * field has a different type.
 */
function getLinkedRecordID(record, storageKey) {
  var link = record[storageKey];
  if (link == null) {
    return link;
  }
  __webpack_require__(0)(typeof link === 'object' && link && typeof link[REF_KEY] === 'string', 'RelayModernRecord.getLinkedRecordID(): Expected `%s.%s` to be a linked ID, ' + 'was `%s`.', record[ID_KEY], storageKey, link);
  return link[REF_KEY];
}

/**
 * @public
 *
 * Get the value of a field as a list of references to other records. Throws if
 * the field has a different type.
 */
function getLinkedRecordIDs(record, storageKey) {
  var links = record[storageKey];
  if (links == null) {
    return links;
  }
  __webpack_require__(0)(typeof links === 'object' && Array.isArray(links[REFS_KEY]), 'RelayModernRecord.getLinkedRecordIDs(): Expected `%s.%s` to contain an array ' + 'of linked IDs, got `%s`.', record[ID_KEY], storageKey, JSON.stringify(links));
  // assume items of the array are ids
  return links[REFS_KEY];
}

/**
 * @public
 *
 * Compares the fields of a previous and new record, returning either the
 * previous record if all fields are equal or a new record (with merged fields)
 * if any fields have changed.
 */
function update(prevRecord, nextRecord) {
  var updated = void 0;
  var keys = Object.keys(nextRecord);
  for (var ii = 0; ii < keys.length; ii++) {
    var key = keys[ii];
    if (updated || !__webpack_require__(18)(prevRecord[key], nextRecord[key])) {
      updated = updated || (0, _extends3['default'])({}, prevRecord);
      if (nextRecord[key] !== UNPUBLISH_FIELD_SENTINEL) {
        updated[key] = nextRecord[key];
      } else {
        delete updated[key];
      }
    }
  }
  return updated || prevRecord;
}

/**
 * @public
 *
 * Returns a new record with the contents of the given records. Fields in the
 * second record will overwrite identical fields in the first record.
 */
function merge(record1, record2) {
  return Object.assign({}, record1, record2);
}

/**
 * @public
 *
 * Prevent modifications to the record. Attempts to call `set*` functions on a
 * frozen record will fatal at runtime.
 */
function freeze(record) {
  __webpack_require__(57)(record);
}

/**
 * @public
 *
 * Set the value of a storageKey to a scalar.
 */
function setValue(record, storageKey, value) {
  record[storageKey] = value;
}

/**
 * @public
 *
 * Set the value of a field to a reference to another record.
 */
function setLinkedRecordID(record, storageKey, linkedID) {
  // See perf note above for why we aren't using computed property access.
  var link = {};
  link[REF_KEY] = linkedID;
  record[storageKey] = link;
}

/**
 * @public
 *
 * Set the value of a field to a list of references other records.
 */
function setLinkedRecordIDs(record, storageKey, linkedIDs) {
  // See perf note above for why we aren't using computed property access.
  var links = {};
  links[REFS_KEY] = linkedIDs;
  record[storageKey] = links;
}

module.exports = {
  clone: clone,
  copyFields: copyFields,
  create: create,
  freeze: freeze,
  getDataID: getDataID,
  getLinkedRecordID: getLinkedRecordID,
  getLinkedRecordIDs: getLinkedRecordIDs,
  getType: getType,
  getValue: getValue,
  merge: merge,
  setValue: setValue,
  setLinkedRecordID: setLinkedRecordID,
  setLinkedRecordIDs: setLinkedRecordIDs,
  update: update
};

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyFunction = __webpack_require__(9);

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  var printWarning = function printWarning(format) {
    for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
      args[_key - 1] = arguments[_key];
    }

    var argIndex = 0;
    var message = 'Warning: ' + format.replace(/%s/g, function () {
      return args[argIndex++];
    });
    if (typeof console !== 'undefined') {
      console.error(message);
    }
    try {
      // --- Welcome to debugging React ---
      // This error was thrown as a convenience so that you can use this stack
      // to find the callsite that caused this warning to fire.
      throw new Error(message);
    } catch (x) {}
  };

  warning = function warning(condition, format) {
    if (format === undefined) {
      throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
    }

    if (format.indexOf('Failed Composite propType: ') === 0) {
      return; // Ignore CompositeComponent proptype check.
    }

    if (!condition) {
      for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
        args[_key2 - 2] = arguments[_key2];
      }

      printWarning.apply(undefined, [format].concat(args));
    }
  };
}

module.exports = warning;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayConcreteNode
 * 
 * @format
 */



/**
 * Represents a single ConcreteRoot along with metadata for processing it at
 * runtime. The persisted `id` (or `text`) can be used to fetch the query,
 * the `fragment` can be used to read the root data (masking data from child
 * fragments), and the `query` can be used to normalize server responses.
 *
 * NOTE: The use of "batch" in the name is intentional, as this wrapper around
 * the ConcreteRoot will provide a place to store multiple concrete nodes that
 * are part of the same batch, e.g. in the case of deferred nodes or
 * for streaming connections that are represented as distinct concrete roots but
 * are still conceptually tied to one source query.
 */
var RelayConcreteNode = {
  CONDITION: 'Condition',
  FRAGMENT: 'Fragment',
  FRAGMENT_SPREAD: 'FragmentSpread',
  INLINE_FRAGMENT: 'InlineFragment',
  LINKED_FIELD: 'LinkedField',
  LINKED_HANDLE: 'LinkedHandle',
  LITERAL: 'Literal',
  LOCAL_ARGUMENT: 'LocalArgument',
  ROOT: 'Root',
  ROOT_ARGUMENT: 'RootArgument',
  SCALAR_FIELD: 'ScalarField',
  SCALAR_HANDLE: 'ScalarHandle',
  VARIABLE: 'Variable'
};

module.exports = RelayConcreteNode;

/***/ }),
/* 4 */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 5 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayStoreUtils
 * 
 * @format
 */



var VARIABLE = __webpack_require__(3).VARIABLE;

/**
 * Returns the values of field/fragment arguments as an object keyed by argument
 * names.
 */


function getArgumentValues(args, variables) {
  var values = {};
  args.forEach(function (arg) {
    if (arg.kind === VARIABLE) {
      values[arg.name] = getVariableValue(arg.variableName, variables);
    } else {
      values[arg.name] = arg.value;
    }
  });
  return values;
}

function getHandleFilterValues(args, filters, variables) {
  var filterArgs = args.filter(function (arg) {
    return filters.indexOf(arg.name) > -1;
  });
  return getArgumentValues(filterArgs, variables);
}

/**
 * Given a field and variable values, returns a key that can be used to
 * uniquely identify the combination of the field name and argument values.
 *
 * Note: the word "storage" here refers to the fact this key is primarily used
 * when writing the results of a key in a normalized graph or "store". This
 * name was used in previous implementations of Relay internals and is also
 * used here for consistency.
 */
function getStorageKey(field, variables) {
  if (field.storageKey) {
    return field.storageKey;
  }
  var args = field.args,
      name = field.name;

  if (!args || !args.length) {
    return name;
  }
  var values = [];
  args.forEach(function (arg) {
    var value = void 0;
    if (arg.kind === VARIABLE) {
      value = getVariableValue(arg.variableName, variables);
    } else {
      value = arg.value;
    }
    if (value != null) {
      values.push('"' + arg.name + '":' + __webpack_require__(86)(value));
    }
  });
  if (values.length) {
    return field.name + ('{' + values.join(',') + '}');
  } else {
    return field.name;
  }
}

function getVariableValue(name, variables) {
  __webpack_require__(0)(variables.hasOwnProperty(name), 'getVariableValue(): Undefined variable `%s`.', name);
  return variables[name];
}

/**
 * Constants shared by all implementations of RecordSource/MutableRecordSource/etc.
 */
var RelayStoreUtils = {
  FRAGMENTS_KEY: '__fragments',
  ID_KEY: '__id',
  REF_KEY: '__ref',
  REFS_KEY: '__refs',
  ROOT_ID: 'client:root',
  ROOT_TYPE: '__Root',
  TYPENAME_KEY: '__typename',
  UNPUBLISH_RECORD_SENTINEL: Object.freeze({ __UNPUBLISH_RECORD_SENTINEL: true }),
  UNPUBLISH_FIELD_SENTINEL: Object.freeze({ __UNPUBLISH_FIELD_SENTINEL: true }),

  getArgumentValues: getArgumentValues,
  getStorageKey: getStorageKey,
  getHandleFilterValues: getHandleFilterValues
};

module.exports = RelayStoreUtils;

/***/ }),
/* 6 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 7 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {

if (process.env.NODE_ENV === 'production') {
  module.exports = __webpack_require__(144);
} else {
  module.exports = __webpack_require__(147);
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 8 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule formatStorageKey
 * 
 * @format
 */



/**
 * Given a `fieldName` (eg. "foo") and an object representing arguments and
 * values (eg. `{first: 10, orberBy: "name"}`) returns a unique storage key
 * (ie. `foo{"first":10,"orderBy":"name"}`).
 */
function formatStorageKey(fieldName, argsWithValues) {
  if (!argsWithValues) {
    return fieldName;
  }
  var filtered = null;
  for (var argName in argsWithValues) {
    if (argsWithValues.hasOwnProperty(argName)) {
      var value = argsWithValues[argName];
      if (value != null) {
        if (!filtered) {
          filtered = {};
        }
        filtered[argName] = value;
      }
    }
  }
  return filtered ? fieldName + __webpack_require__(86)(filtered) : fieldName;
}

module.exports = formatStorageKey;

/***/ }),
/* 9 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;

/***/ }),
/* 10 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 11 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayCore
 * 
 * @format
 */



var _require = __webpack_require__(58),
    getFragment = _require.getFragment,
    getOperation = _require.getOperation;

var _require2 = __webpack_require__(208),
    createOperationSelector = _require2.createOperationSelector;

var _require3 = __webpack_require__(133),
    areEqualSelectors = _require3.areEqualSelectors,
    getDataIDsFromObject = _require3.getDataIDsFromObject,
    getSelector = _require3.getSelector,
    getSelectorList = _require3.getSelectorList,
    getSelectorsFromObject = _require3.getSelectorsFromObject,
    getVariablesFromObject = _require3.getVariablesFromObject;

function createFragmentSpecResolver(context, containerName, fragments, props, callback) {
  if (process.env.NODE_ENV !== 'production') {
    var fragmentNames = Object.keys(fragments);
    fragmentNames.forEach(function (fragmentName) {
      var propValue = props[fragmentName];
      __webpack_require__(2)(propValue !== undefined, 'createFragmentSpecResolver: Expected prop `%s` to be supplied to `%s`, but ' + 'got `undefined`. Pass an explicit `null` if this is intentional.', fragmentName, containerName);
    });
  }

  return new (__webpack_require__(209))(context, fragments, props, callback);
}

module.exports = {
  areEqualSelectors: areEqualSelectors,
  createFragmentSpecResolver: createFragmentSpecResolver,
  createOperationSelector: createOperationSelector,
  getDataIDsFromObject: getDataIDsFromObject,
  getFragment: getFragment,
  getOperation: getOperation,
  getSelector: getSelector,
  getSelectorList: getSelectorList,
  getSelectorsFromObject: getSelectorsFromObject,
  getVariablesFromObject: getVariablesFromObject
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 12 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 13 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(12);
var core = __webpack_require__(10);
var ctx = __webpack_require__(105);
var hide = __webpack_require__(28);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 14 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(30)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 15 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayConnectionHandler
 * 
 * @format
 */



var CONNECTION = 'connection';

// Per-instance incrementing index used to generate unique edge IDs
var NEXT_EDGE_INDEX = '__connection_next_edge_index';

/**
 * @public
 *
 * A default runtime handler for connection fields that appends newly fetched
 * edges onto the end of a connection, regardless of the arguments used to fetch
 * those edges.
 */
function update(store, payload) {
  var record = store.get(payload.dataID);
  if (!record) {
    return;
  }

  var _RelayConnectionInter = __webpack_require__(16).get(),
      EDGES = _RelayConnectionInter.EDGES,
      END_CURSOR = _RelayConnectionInter.END_CURSOR,
      HAS_NEXT_PAGE = _RelayConnectionInter.HAS_NEXT_PAGE,
      HAS_PREV_PAGE = _RelayConnectionInter.HAS_PREV_PAGE,
      PAGE_INFO = _RelayConnectionInter.PAGE_INFO,
      PAGE_INFO_TYPE = _RelayConnectionInter.PAGE_INFO_TYPE,
      START_CURSOR = _RelayConnectionInter.START_CURSOR;

  var serverConnection = record.getLinkedRecord(payload.fieldKey);
  var serverPageInfo = serverConnection && serverConnection.getLinkedRecord(PAGE_INFO);
  if (!serverConnection) {
    record.setValue(null, payload.handleKey);
    return;
  }
  var clientConnection = record.getLinkedRecord(payload.handleKey);
  var clientPageInfo = clientConnection && clientConnection.getLinkedRecord(PAGE_INFO);
  if (!clientConnection) {
    // Initial fetch with data: copy fields from the server record
    var connection = store.create(__webpack_require__(17)(record.getDataID(), payload.handleKey), serverConnection.getType());
    connection.setValue(0, NEXT_EDGE_INDEX);
    connection.copyFieldsFrom(serverConnection);
    var serverEdges = serverConnection.getLinkedRecords(EDGES);
    if (serverEdges) {
      serverEdges = serverEdges.map(function (edge) {
        return buildConnectionEdge(store, connection, edge);
      });
      connection.setLinkedRecords(serverEdges, EDGES);
    }
    record.setLinkedRecord(connection, payload.handleKey);

    clientPageInfo = store.create(__webpack_require__(17)(connection.getDataID(), PAGE_INFO), PAGE_INFO_TYPE);
    clientPageInfo.setValue(false, HAS_NEXT_PAGE);
    clientPageInfo.setValue(false, HAS_PREV_PAGE);
    clientPageInfo.setValue(null, END_CURSOR);
    clientPageInfo.setValue(null, START_CURSOR);
    if (serverPageInfo) {
      clientPageInfo.copyFieldsFrom(serverPageInfo);
    }
    connection.setLinkedRecord(clientPageInfo, PAGE_INFO);
  } else {
    var _connection = clientConnection;
    // Subsequent fetches:
    // - updated fields on the connection
    // - merge prev/next edges, de-duplicating by node id
    // - synthesize page info fields
    var _serverEdges = serverConnection.getLinkedRecords(EDGES);
    if (_serverEdges) {
      _serverEdges = _serverEdges.map(function (edge) {
        return buildConnectionEdge(store, _connection, edge);
      });
    }
    var prevEdges = _connection.getLinkedRecords(EDGES);
    var prevPageInfo = _connection.getLinkedRecord(PAGE_INFO);
    _connection.copyFieldsFrom(serverConnection);
    // Reset EDGES and PAGE_INFO fields
    if (prevEdges) {
      _connection.setLinkedRecords(prevEdges, EDGES);
    }
    if (prevPageInfo) {
      _connection.setLinkedRecord(prevPageInfo, PAGE_INFO);
    }

    var nextEdges = [];
    var args = payload.args;
    if (prevEdges && _serverEdges) {
      if (args.after != null) {
        // Forward pagination from the end of the connection: append edges
        if (clientPageInfo && args.after === clientPageInfo.getValue(END_CURSOR)) {
          var nodeIDs = new Set();
          mergeEdges(prevEdges, nextEdges, nodeIDs);
          mergeEdges(_serverEdges, nextEdges, nodeIDs);
        } else {
          __webpack_require__(2)(false, 'RelayConnectionHandler: Unexpected after cursor `%s`, edges must ' + 'be fetched from the end of the list (`%s`).', args.after, clientPageInfo && clientPageInfo.getValue(END_CURSOR));
          return;
        }
      } else if (args.before != null) {
        // Backward pagination from the start of the connection: prepend edges
        if (clientPageInfo && args.before === clientPageInfo.getValue(START_CURSOR)) {
          var _nodeIDs = new Set();
          mergeEdges(_serverEdges, nextEdges, _nodeIDs);
          mergeEdges(prevEdges, nextEdges, _nodeIDs);
        } else {
          __webpack_require__(2)(false, 'RelayConnectionHandler: Unexpected before cursor `%s`, edges must ' + 'be fetched from the beginning of the list (`%s`).', args.before, clientPageInfo && clientPageInfo.getValue(START_CURSOR));
          return;
        }
      } else {
        // The connection was refetched from the beginning/end: replace edges
        nextEdges = _serverEdges;
      }
    } else if (_serverEdges) {
      nextEdges = _serverEdges;
    } else {
      nextEdges = prevEdges;
    }
    // Update edges only if they were updated, the null check is
    // for Flow (prevEdges could be null).
    if (nextEdges != null && nextEdges !== prevEdges) {
      _connection.setLinkedRecords(nextEdges, EDGES);
    }
    // Page info should be updated even if no new edge were returned.
    if (clientPageInfo && serverPageInfo) {
      if (args.before != null || args.after == null && args.last) {
        clientPageInfo.setValue(!!serverPageInfo.getValue(HAS_PREV_PAGE), HAS_PREV_PAGE);
        var startCursor = serverPageInfo.getValue(START_CURSOR);
        if (typeof startCursor === 'string') {
          clientPageInfo.setValue(startCursor, START_CURSOR);
        }
      } else if (args.after != null || args.before == null && args.first) {
        clientPageInfo.setValue(!!serverPageInfo.getValue(HAS_NEXT_PAGE), HAS_NEXT_PAGE);
        var endCursor = serverPageInfo.getValue(END_CURSOR);
        if (typeof endCursor === 'string') {
          clientPageInfo.setValue(endCursor, END_CURSOR);
        }
      }
    }
  }
}

/**
 * @public
 *
 * Given a record and the name of the schema field for which a connection was
 * fetched, returns the linked connection record.
 *
 * Example:
 *
 * Given that data has already been fetched on some user `<id>` on the `friends`
 * field:
 *
 * ```
 * fragment FriendsFragment on User {
 *   friends(first: 10) @connection(key: "FriendsFragment_friends") {
 *    edges {
 *      node {
 *        id
 *        }
 *      }
 *   }
 * }
 * ```
 *
 * The `friends` connection record can be accessed with:
 *
 * ```
 * store => {
 *   const user = store.get('<id>');
 *   const friends = RelayConnectionHandler.getConnection(user, 'FriendsFragment_friends');
 *   // Access fields on the connection:
 *   const edges = friends.getLinkedRecords('edges');
 * }
 * ```
 *
 * TODO: t15733312
 * Currently we haven't run into this case yet, but we need to add a `getConnections`
 * that returns an array of the connections under the same `key` regardless of the variables.
 */
function getConnection(record, key, filters) {
  var handleKey = __webpack_require__(54)(CONNECTION, key, null);
  return record.getLinkedRecord(handleKey, filters);
}

/**
 * @public
 *
 * Inserts an edge after the given cursor, or at the end of the list if no
 * cursor is provided.
 *
 * Example:
 *
 * Given that data has already been fetched on some user `<id>` on the `friends`
 * field:
 *
 * ```
 * fragment FriendsFragment on User {
 *   friends(first: 10) @connection(key: "FriendsFragment_friends") {
 *    edges {
 *      node {
 *        id
 *        }
 *      }
 *   }
 * }
 * ```
 *
 * An edge can be appended with:
 *
 * ```
 * store => {
 *   const user = store.get('<id>');
 *   const friends = RelayConnectionHandler.getConnection(user, 'FriendsFragment_friends');
 *   const edge = store.create('<edge-id>', 'FriendsEdge');
 *   RelayConnectionHandler.insertEdgeAfter(friends, edge);
 * }
 * ```
 */
function insertEdgeAfter(record, newEdge, cursor) {
  var _RelayConnectionInter2 = __webpack_require__(16).get(),
      CURSOR = _RelayConnectionInter2.CURSOR,
      EDGES = _RelayConnectionInter2.EDGES;

  var edges = record.getLinkedRecords(EDGES);
  if (!edges) {
    record.setLinkedRecords([newEdge], EDGES);
    return;
  }
  var nextEdges = void 0;
  if (cursor == null) {
    nextEdges = edges.concat(newEdge);
  } else {
    nextEdges = [];
    var foundCursor = false;
    for (var ii = 0; ii < edges.length; ii++) {
      var edge = edges[ii];
      nextEdges.push(edge);
      if (edge == null) {
        continue;
      }
      var edgeCursor = edge.getValue(CURSOR);
      if (cursor === edgeCursor) {
        nextEdges.push(newEdge);
        foundCursor = true;
      }
    }
    if (!foundCursor) {
      nextEdges.push(newEdge);
    }
  }
  record.setLinkedRecords(nextEdges, EDGES);
}

/**
 * @public
 *
 * Creates an edge for a connection record, given a node and edge type.
 */
function createEdge(store, record, node, edgeType) {
  var _RelayConnectionInter3 = __webpack_require__(16).get(),
      NODE = _RelayConnectionInter3.NODE;

  // An index-based client ID could easily conflict (unless it was
  // auto-incrementing, but there is nowhere to the store the id)
  // Instead, construct a client ID based on the connection ID and node ID,
  // which will only conflict if the same node is added to the same connection
  // twice. This is acceptable since the `insertEdge*` functions ignore
  // duplicates.


  var edgeID = __webpack_require__(17)(record.getDataID(), node.getDataID());
  var edge = store.get(edgeID);
  if (!edge) {
    edge = store.create(edgeID, edgeType);
  }
  edge.setLinkedRecord(node, NODE);
  return edge;
}

/**
 * @public
 *
 * Inserts an edge before the given cursor, or at the beginning of the list if
 * no cursor is provided.
 *
 * Example:
 *
 * Given that data has already been fetched on some user `<id>` on the `friends`
 * field:
 *
 * ```
 * fragment FriendsFragment on User {
 *   friends(first: 10) @connection(key: "FriendsFragment_friends") {
 *    edges {
 *      node {
 *        id
 *        }
 *      }
 *   }
 * }
 * ```
 *
 * An edge can be prepended with:
 *
 * ```
 * store => {
 *   const user = store.get('<id>');
 *   const friends = RelayConnectionHandler.getConnection(user, 'FriendsFragment_friends');
 *   const edge = store.create('<edge-id>', 'FriendsEdge');
 *   RelayConnectionHandler.insertEdgeBefore(friends, edge);
 * }
 * ```
 */
function insertEdgeBefore(record, newEdge, cursor) {
  var _RelayConnectionInter4 = __webpack_require__(16).get(),
      CURSOR = _RelayConnectionInter4.CURSOR,
      EDGES = _RelayConnectionInter4.EDGES;

  var edges = record.getLinkedRecords(EDGES);
  if (!edges) {
    record.setLinkedRecords([newEdge], EDGES);
    return;
  }
  var nextEdges = void 0;
  if (cursor == null) {
    nextEdges = [newEdge].concat(edges);
  } else {
    nextEdges = [];
    var foundCursor = false;
    for (var ii = 0; ii < edges.length; ii++) {
      var edge = edges[ii];
      if (edge != null) {
        var edgeCursor = edge.getValue(CURSOR);
        if (cursor === edgeCursor) {
          nextEdges.push(newEdge);
          foundCursor = true;
        }
      }
      nextEdges.push(edge);
    }
    if (!foundCursor) {
      nextEdges.unshift(newEdge);
    }
  }
  record.setLinkedRecords(nextEdges, EDGES);
}

/**
 * @public
 *
 * Remove any edges whose `node.id` matches the given id.
 */
function deleteNode(record, nodeID) {
  var _RelayConnectionInter5 = __webpack_require__(16).get(),
      EDGES = _RelayConnectionInter5.EDGES,
      NODE = _RelayConnectionInter5.NODE;

  var edges = record.getLinkedRecords(EDGES);
  if (!edges) {
    return;
  }
  var nextEdges = void 0;
  for (var ii = 0; ii < edges.length; ii++) {
    var edge = edges[ii];
    var node = edge && edge.getLinkedRecord(NODE);
    if (node != null && node.getDataID() === nodeID) {
      if (nextEdges === undefined) {
        nextEdges = edges.slice(0, ii);
      }
    } else if (nextEdges !== undefined) {
      nextEdges.push(edge);
    }
  }
  if (nextEdges !== undefined) {
    record.setLinkedRecords(nextEdges, EDGES);
  }
}

/**
 * @internal
 *
 * Creates a copy of an edge with a unique ID based on per-connection-instance
 * incrementing edge index. This is necessary to avoid collisions between edges,
 * which can occur because (edge) client IDs are assigned deterministically
 * based on the path from the nearest node with an id.
 *
 * Example: if the first N edges of the same connection are refetched, the edges
 * from the second fetch will be assigned the same IDs as the first fetch, even
 * though the nodes they point to may be different (or the same and in different
 * order).
 */
function buildConnectionEdge(store, connection, edge) {
  if (edge == null) {
    return edge;
  }

  var _RelayConnectionInter6 = __webpack_require__(16).get(),
      EDGES = _RelayConnectionInter6.EDGES;

  var edgeIndex = connection.getValue(NEXT_EDGE_INDEX);
  __webpack_require__(0)(typeof edgeIndex === 'number', 'RelayConnectionHandler: Expected %s to be a number, got `%s`.', NEXT_EDGE_INDEX, edgeIndex);
  var edgeID = __webpack_require__(17)(connection.getDataID(), EDGES, edgeIndex);
  var connectionEdge = store.create(edgeID, edge.getType());
  connectionEdge.copyFieldsFrom(edge);
  connection.setValue(edgeIndex + 1, NEXT_EDGE_INDEX);
  return connectionEdge;
}

/**
 * @internal
 *
 * Adds the source edges to the target edges, skipping edges with
 * duplicate cursors or node ids.
 */
function mergeEdges(sourceEdges, targetEdges, nodeIDs) {
  var _RelayConnectionInter7 = __webpack_require__(16).get(),
      NODE = _RelayConnectionInter7.NODE;

  for (var ii = 0; ii < sourceEdges.length; ii++) {
    var edge = sourceEdges[ii];
    if (!edge) {
      continue;
    }
    var node = edge.getLinkedRecord(NODE);
    var nodeID = node && node.getValue('id');
    if (nodeID) {
      if (nodeIDs.has(nodeID)) {
        continue;
      }
      nodeIDs.add(nodeID);
    }
    targetEdges.push(edge);
  }
}

module.exports = {
  buildConnectionEdge: buildConnectionEdge,
  createEdge: createEdge,
  deleteNode: deleteNode,
  getConnection: getConnection,
  insertEdgeAfter: insertEdgeAfter,
  insertEdgeBefore: insertEdgeBefore,
  update: update
};

/***/ }),
/* 16 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayConnectionInterface
 * 
 * @format
 */



var _defineProperty3 = _interopRequireDefault(__webpack_require__(188));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var CONNECTION_CALLS = {
  after: true,
  before: true,
  find: true,
  first: true,
  last: true,
  surrounds: true
};

var REQUIRED_RANGE_CALLS = {
  find: true,
  first: true,
  last: true
};

var config = {
  CLIENT_MUTATION_ID: 'clientMutationId',
  CURSOR: 'cursor',
  /**
   * Whether `edges` fields are expected to have `source` fields.
   */
  EDGES_HAVE_SOURCE_FIELD: false,
  EDGES: 'edges',
  END_CURSOR: 'endCursor',
  HAS_NEXT_PAGE: 'hasNextPage',
  HAS_PREV_PAGE: 'hasPreviousPage',
  NODE: 'node',
  PAGE_INFO_TYPE: 'PageInfo',
  PAGE_INFO: 'pageInfo',
  START_CURSOR: 'startCursor'
};

/**
 * @internal
 *
 * Defines logic relevant to the informal "Connection" GraphQL interface.
 */
var RelayConnectionInterface = {
  inject: function inject(newConfig) {
    config = newConfig;
  },
  get: function get() {
    return config;
  },


  /**
   * Checks whether a call exists strictly to encode which parts of a connection
   * to fetch. Fields that only differ by connection call values should have the
   * same identity.
   */
  isConnectionCall: function isConnectionCall(call) {
    return CONNECTION_CALLS.hasOwnProperty(call.name);
  },


  /**
   * Checks whether a set of calls on a connection supply enough information to
   * fetch the range fields (i.e. `edges` and `page_info`).
   */
  hasRangeCalls: function hasRangeCalls(calls) {
    return calls.some(function (call) {
      return REQUIRED_RANGE_CALLS.hasOwnProperty(call.name);
    });
  },


  /**
   * Gets a default record representing a connection's `PAGE_INFO`.
   */
  getDefaultPageInfo: function getDefaultPageInfo() {
    var _ref;

    return _ref = {}, (0, _defineProperty3['default'])(_ref, config.END_CURSOR, undefined), (0, _defineProperty3['default'])(_ref, config.HAS_NEXT_PAGE, false), (0, _defineProperty3['default'])(_ref, config.HAS_PREV_PAGE, false), (0, _defineProperty3['default'])(_ref, config.START_CURSOR, undefined), _ref;
  }
};

module.exports = RelayConnectionInterface;

/***/ }),
/* 17 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule generateRelayClientID
 * 
 * @format
 */



var PREFIX = 'client:';

function generateRelayClientID(id, storageKey, index) {
  var key = id + ':' + storageKey;
  if (index != null) {
    key += ':' + index;
  }
  if (key.indexOf(PREFIX) !== 0) {
    key = PREFIX + key;
  }
  return key;
}

module.exports = generateRelayClientID;

/***/ }),
/* 18 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

var aStackPool = [];
var bStackPool = [];

/**
 * Checks if two values are equal. Values may be primitives, arrays, or objects.
 * Returns true if both arguments have the same keys and values.
 *
 * @see http://underscorejs.org
 * @copyright 2009-2013 Jeremy Ashkenas, DocumentCloud Inc.
 * @license MIT
 */
function areEqual(a, b) {
  var aStack = aStackPool.length ? aStackPool.pop() : [];
  var bStack = bStackPool.length ? bStackPool.pop() : [];
  var result = eq(a, b, aStack, bStack);
  aStack.length = 0;
  bStack.length = 0;
  aStackPool.push(aStack);
  bStackPool.push(bStack);
  return result;
}

function eq(a, b, aStack, bStack) {
  if (a === b) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    return a !== 0 || 1 / a == 1 / b;
  }
  if (a == null || b == null) {
    // a or b can be `null` or `undefined`
    return false;
  }
  if (typeof a != 'object' || typeof b != 'object') {
    return false;
  }
  var objToStr = Object.prototype.toString;
  var className = objToStr.call(a);
  if (className != objToStr.call(b)) {
    return false;
  }
  switch (className) {
    case '[object String]':
      return a == String(b);
    case '[object Number]':
      return isNaN(a) || isNaN(b) ? false : a == Number(b);
    case '[object Date]':
    case '[object Boolean]':
      return +a == +b;
    case '[object RegExp]':
      return a.source == b.source && a.global == b.global && a.multiline == b.multiline && a.ignoreCase == b.ignoreCase;
  }
  // Assume equality for cyclic structures.
  var length = aStack.length;
  while (length--) {
    if (aStack[length] == a) {
      return bStack[length] == b;
    }
  }
  aStack.push(a);
  bStack.push(b);
  var size = 0;
  // Recursively compare objects and arrays.
  if (className === '[object Array]') {
    size = a.length;
    if (size !== b.length) {
      return false;
    }
    // Deep compare the contents, ignoring non-numeric properties.
    while (size--) {
      if (!eq(a[size], b[size], aStack, bStack)) {
        return false;
      }
    }
  } else {
    if (a.constructor !== b.constructor) {
      return false;
    }
    if (a.hasOwnProperty('valueOf') && b.hasOwnProperty('valueOf')) {
      return a.valueOf() == b.valueOf();
    }
    var keys = Object.keys(a);
    if (keys.length != Object.keys(b).length) {
      return false;
    }
    for (var i = 0; i < keys.length; i++) {
      if (!eq(a[keys[i]], b[keys[i]], aStack, bStack)) {
        return false;
      }
    }
  }
  aStack.pop();
  bStack.pop();
  return true;
}

module.exports = areEqual;

/***/ }),
/* 19 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 20 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(37);
var IE8_DOM_DEFINE = __webpack_require__(106);
var toPrimitive = __webpack_require__(71);
var dP = Object.defineProperty;

exports.f = __webpack_require__(14) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 21 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

/***/ }),
/* 22 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _typeof2 = __webpack_require__(110);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};

/***/ }),
/* 23 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _setPrototypeOf = __webpack_require__(177);

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = __webpack_require__(181);

var _create2 = _interopRequireDefault(_create);

var _typeof2 = __webpack_require__(110);

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};

/***/ }),
/* 24 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayInMemoryRecordSource
 * 
 * @format
 */



var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var EXISTENT = __webpack_require__(33).EXISTENT,
    NONEXISTENT = __webpack_require__(33).NONEXISTENT,
    UNKNOWN = __webpack_require__(33).UNKNOWN;

/**
 * An implementation of the `MutableRecordSource` interface (defined in
 * `RelayStoreTypes`) that holds all records in memory.
 */


var RelayInMemoryRecordSource = function () {
  function RelayInMemoryRecordSource(records) {
    (0, _classCallCheck3['default'])(this, RelayInMemoryRecordSource);

    this._records = records || {};
  }

  RelayInMemoryRecordSource.prototype.clear = function clear() {
    this._records = {};
  };

  RelayInMemoryRecordSource.prototype['delete'] = function _delete(dataID) {
    this._records[dataID] = null;
  };

  RelayInMemoryRecordSource.prototype.get = function get(dataID) {
    return this._records[dataID];
  };

  RelayInMemoryRecordSource.prototype.getRecordIDs = function getRecordIDs() {
    return Object.keys(this._records);
  };

  RelayInMemoryRecordSource.prototype.getStatus = function getStatus(dataID) {
    if (!this._records.hasOwnProperty(dataID)) {
      return UNKNOWN;
    }
    return this._records[dataID] == null ? NONEXISTENT : EXISTENT;
  };

  RelayInMemoryRecordSource.prototype.has = function has(dataID) {
    return this._records.hasOwnProperty(dataID);
  };

  RelayInMemoryRecordSource.prototype.load = function load(dataID, callback) {
    callback(null, this.get(dataID));
  };

  RelayInMemoryRecordSource.prototype.remove = function remove(dataID) {
    delete this._records[dataID];
  };

  RelayInMemoryRecordSource.prototype.set = function set(dataID, record) {
    this._records[dataID] = record;
  };

  RelayInMemoryRecordSource.prototype.size = function size() {
    return Object.keys(this._records).length;
  };

  RelayInMemoryRecordSource.prototype.toJSON = function toJSON() {
    return this._records;
  };

  return RelayInMemoryRecordSource;
}();

module.exports = RelayInMemoryRecordSource;

/***/ }),
/* 25 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(197);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),
/* 26 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(128)('wks');
var uid = __webpack_require__(129);
var Symbol = __webpack_require__(38).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 27 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

if (process.env.NODE_ENV !== 'production') {
  var REACT_ELEMENT_TYPE = (typeof Symbol === 'function' &&
    Symbol.for &&
    Symbol.for('react.element')) ||
    0xeac7;

  var isValidElement = function(object) {
    return typeof object === 'object' &&
      object !== null &&
      object.$$typeof === REACT_ELEMENT_TYPE;
  };

  // By explicitly using `prop-types` you are opting into new development behavior.
  // http://fb.me/prop-types-in-prod
  var throwOnDirectAccess = true;
  module.exports = __webpack_require__(145)(isValidElement, throwOnDirectAccess);
} else {
  // By explicitly using `prop-types` you are opting into new production behavior.
  // http://fb.me/prop-types-in-prod
  module.exports = __webpack_require__(146)();
}

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 28 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(20);
var createDesc = __webpack_require__(47);
module.exports = __webpack_require__(14) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 29 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 30 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 31 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(115);
var defined = __webpack_require__(68);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 32 */
/***/ (function(module, exports, __webpack_require__) {

var store = __webpack_require__(70)('wks');
var uid = __webpack_require__(46);
var Symbol = __webpack_require__(12).Symbol;
var USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function (name) {
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;


/***/ }),
/* 33 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayRecordState
 * 
 * @format
 */



var RelayRecordState = {
  /**
   * Record exists (either fetched from the server or produced by a local,
   * optimistic update).
   */
  EXISTENT: 'EXISTENT',

  /**
   * Record is known not to exist (either as the result of a mutation, or
   * because the server returned `null` when queried for the record).
   */
  NONEXISTENT: 'NONEXISTENT',

  /**
   * Record State is unknown because it has not yet been fetched from the
   * server.
   */
  UNKNOWN: 'UNKNOWN'
};

module.exports = RelayRecordState;

/***/ }),
/* 34 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 * 
 */

/**
 * Removes an element from an array.
 */
function removeFromArray(array, element) {
  var index = array.indexOf(element);
  if (index !== -1) {
    array.splice(index, 1);
  }
}

module.exports = removeFromArray;

/***/ }),
/* 35 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @typechecks
 */

/**
 * Simple function for formatting strings.
 *
 * Replaces placeholders with values passed as extra arguments
 *
 * @param {string} format the base string
 * @param ...args the values to insert
 * @return {string} the replaced string
 */
function sprintf(format) {
  for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
    args[_key - 1] = arguments[_key];
  }

  var index = 0;
  return format.replace(/%s/g, function (match) {
    return args[index++];
  });
}

module.exports = sprintf;

/***/ }),
/* 36 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var asap = __webpack_require__(139);

function noop() {}

// States:
//
// 0 - pending
// 1 - fulfilled with _value
// 2 - rejected with _value
// 3 - adopted the state of another promise, _value
//
// once the state is no longer pending (0) it is immutable

// All `_` prefixed properties will be reduced to `_{random number}`
// at build time to obfuscate them and discourage their use.
// We don't use symbols or Object.defineProperty to fully hide them
// because the performance isn't good enough.


// to avoid using try/catch inside critical functions, we
// extract them to here.
var LAST_ERROR = null;
var IS_ERROR = {};
function getThen(obj) {
  try {
    return obj.then;
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

function tryCallOne(fn, a) {
  try {
    return fn(a);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}
function tryCallTwo(fn, a, b) {
  try {
    fn(a, b);
  } catch (ex) {
    LAST_ERROR = ex;
    return IS_ERROR;
  }
}

module.exports = Promise;

function Promise(fn) {
  if (typeof this !== 'object') {
    throw new TypeError('Promises must be constructed via new');
  }
  if (typeof fn !== 'function') {
    throw new TypeError('Promise constructor\'s argument is not a function');
  }
  this._40 = 0;
  this._65 = 0;
  this._55 = null;
  this._72 = null;
  if (fn === noop) return;
  doResolve(fn, this);
}
Promise._37 = null;
Promise._87 = null;
Promise._61 = noop;

Promise.prototype.then = function(onFulfilled, onRejected) {
  if (this.constructor !== Promise) {
    return safeThen(this, onFulfilled, onRejected);
  }
  var res = new Promise(noop);
  handle(this, new Handler(onFulfilled, onRejected, res));
  return res;
};

function safeThen(self, onFulfilled, onRejected) {
  return new self.constructor(function (resolve, reject) {
    var res = new Promise(noop);
    res.then(resolve, reject);
    handle(self, new Handler(onFulfilled, onRejected, res));
  });
}
function handle(self, deferred) {
  while (self._65 === 3) {
    self = self._55;
  }
  if (Promise._37) {
    Promise._37(self);
  }
  if (self._65 === 0) {
    if (self._40 === 0) {
      self._40 = 1;
      self._72 = deferred;
      return;
    }
    if (self._40 === 1) {
      self._40 = 2;
      self._72 = [self._72, deferred];
      return;
    }
    self._72.push(deferred);
    return;
  }
  handleResolved(self, deferred);
}

function handleResolved(self, deferred) {
  asap(function() {
    var cb = self._65 === 1 ? deferred.onFulfilled : deferred.onRejected;
    if (cb === null) {
      if (self._65 === 1) {
        resolve(deferred.promise, self._55);
      } else {
        reject(deferred.promise, self._55);
      }
      return;
    }
    var ret = tryCallOne(cb, self._55);
    if (ret === IS_ERROR) {
      reject(deferred.promise, LAST_ERROR);
    } else {
      resolve(deferred.promise, ret);
    }
  });
}
function resolve(self, newValue) {
  // Promise Resolution Procedure: https://github.com/promises-aplus/promises-spec#the-promise-resolution-procedure
  if (newValue === self) {
    return reject(
      self,
      new TypeError('A promise cannot be resolved with itself.')
    );
  }
  if (
    newValue &&
    (typeof newValue === 'object' || typeof newValue === 'function')
  ) {
    var then = getThen(newValue);
    if (then === IS_ERROR) {
      return reject(self, LAST_ERROR);
    }
    if (
      then === self.then &&
      newValue instanceof Promise
    ) {
      self._65 = 3;
      self._55 = newValue;
      finale(self);
      return;
    } else if (typeof then === 'function') {
      doResolve(then.bind(newValue), self);
      return;
    }
  }
  self._65 = 1;
  self._55 = newValue;
  finale(self);
}

function reject(self, newValue) {
  self._65 = 2;
  self._55 = newValue;
  if (Promise._87) {
    Promise._87(self, newValue);
  }
  finale(self);
}
function finale(self) {
  if (self._40 === 1) {
    handle(self, self._72);
    self._72 = null;
  }
  if (self._40 === 2) {
    for (var i = 0; i < self._72.length; i++) {
      handle(self, self._72[i]);
    }
    self._72 = null;
  }
}

function Handler(onFulfilled, onRejected, promise){
  this.onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : null;
  this.onRejected = typeof onRejected === 'function' ? onRejected : null;
  this.promise = promise;
}

/**
 * Take a potentially misbehaving resolver function and make sure
 * onFulfilled and onRejected are only called once.
 *
 * Makes no guarantees about asynchrony.
 */
function doResolve(fn, promise) {
  var done = false;
  var res = tryCallTwo(fn, function (value) {
    if (done) return;
    done = true;
    resolve(promise, value);
  }, function (reason) {
    if (done) return;
    done = true;
    reject(promise, reason);
  });
  if (!done && res === IS_ERROR) {
    done = true;
    reject(promise, LAST_ERROR);
  }
}


/***/ }),
/* 37 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(29);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 38 */
/***/ (function(module, exports) {

// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self
  // eslint-disable-next-line no-new-func
  : Function('return this')();
if (typeof __g == 'number') __g = global; // eslint-disable-line no-undef


/***/ }),
/* 39 */
/***/ (function(module, exports) {

var core = module.exports = { version: '2.5.1' };
if (typeof __e == 'number') __e = core; // eslint-disable-line no-undef


/***/ }),
/* 40 */
/***/ (function(module, exports, __webpack_require__) {

var anObject = __webpack_require__(53);
var IE8_DOM_DEFINE = __webpack_require__(193);
var toPrimitive = __webpack_require__(194);
var dP = Object.defineProperty;

exports.f = __webpack_require__(41) ? Object.defineProperty : function defineProperty(O, P, Attributes) {
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if (IE8_DOM_DEFINE) try {
    return dP(O, P, Attributes);
  } catch (e) { /* empty */ }
  if ('get' in Attributes || 'set' in Attributes) throw TypeError('Accessors not supported!');
  if ('value' in Attributes) O[P] = Attributes.value;
  return O;
};


/***/ }),
/* 41 */
/***/ (function(module, exports, __webpack_require__) {

// Thank's IE8 for his funny defineProperty
module.exports = !__webpack_require__(84)(function () {
  return Object.defineProperty({}, 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 42 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule normalizeRelayPayload
 * 
 * @format
 */



var _require = __webpack_require__(5),
    ROOT_ID = _require.ROOT_ID,
    ROOT_TYPE = _require.ROOT_TYPE;

function normalizeRelayPayload(selector, payload, errors) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { handleStrippedNulls: false };

  var source = new (__webpack_require__(24))();
  source.set(ROOT_ID, __webpack_require__(1).create(ROOT_ID, ROOT_TYPE));
  var fieldPayloads = __webpack_require__(206).normalize(source, selector, payload, options);
  return {
    errors: errors,
    fieldPayloads: fieldPayloads,
    source: source
  };
}

module.exports = normalizeRelayPayload;

/***/ }),
/* 43 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayPropTypes
 * 
 * @format
 */



var RelayPropTypes = {
  Container: function Container(props, propName, componentName) {
    var component = props[propName];
    if (component == null) {
      return new Error(__webpack_require__(35)('Required prop `%s` was not specified in `%s`.', propName, componentName));
    } else if (!__webpack_require__(264)(component)) {
      return new Error(__webpack_require__(35)('Invalid prop `%s` supplied to `%s`, expected a RelayContainer.', propName, componentName));
    }
    return null;
  },
  Environment: function Environment(props, propName, componentName) {
    var context = props[propName];
    if (!__webpack_require__(140)(context) || !__webpack_require__(141)(context)) {
      return new Error(__webpack_require__(35)('Invalid prop/context `%s` supplied to `%s`, expected `%s` to be ' + 'an object conforming to the `RelayEnvironment` interface.', propName, componentName, context));
    }
    return null;
  },


  QueryConfig: __webpack_require__(27).shape({
    name: __webpack_require__(27).string.isRequired,
    params: __webpack_require__(27).object.isRequired,
    queries: __webpack_require__(27).object.isRequired
  }),

  ClassicRelay: function ClassicRelay(props, propName, componentName) {
    var relay = props[propName];
    if (!__webpack_require__(44)(relay) || !__webpack_require__(140)(relay.environment)) {
      return new Error(__webpack_require__(35)('Invalid prop/context `%s` supplied to `%s`, expected `%s` to be ' + 'an object with a classic `environment` implementation and `variables`.', propName, componentName, relay));
    }
    return null;
  },
  Relay: function Relay(props, propName, componentName) {
    var relay = props[propName];
    if (!__webpack_require__(44)(relay)) {
      return new Error(__webpack_require__(35)('Invalid prop/context `%s` supplied to `%s`, expected `%s` to be ' + 'an object with an `environment` and `variables`.', propName, componentName, relay));
    }
    return null;
  }
};

module.exports = RelayPropTypes;

/***/ }),
/* 44 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isRelayContext
 * 
 * @format
 */



/**
 * Determine if the input is a plain object that matches the `RelayContext`
 * type defined in `RelayEnvironmentTypes`.
 */
function isRelayContext(context) {
  return typeof context === 'object' && context !== null && !Array.isArray(context) && __webpack_require__(141)(context.environment) && __webpack_require__(265)(context.variables);
}

module.exports = isRelayContext;

/***/ }),
/* 45 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/*
object-assign
(c) Sindre Sorhus
@license MIT
*/


/* eslint-disable no-unused-vars */
var getOwnPropertySymbols = Object.getOwnPropertySymbols;
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line no-new-wrappers
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (err) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (getOwnPropertySymbols) {
			symbols = getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};


/***/ }),
/* 46 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 47 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 48 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(114);
var enumBugKeys = __webpack_require__(76);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 49 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 50 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Relay v1.4.0
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

module.exports = __webpack_require__(185);

/***/ }),
/* 51 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(38);
var core = __webpack_require__(39);
var ctx = __webpack_require__(120);
var hide = __webpack_require__(52);
var PROTOTYPE = 'prototype';

var $export = function (type, name, source) {
  var IS_FORCED = type & $export.F;
  var IS_GLOBAL = type & $export.G;
  var IS_STATIC = type & $export.S;
  var IS_PROTO = type & $export.P;
  var IS_BIND = type & $export.B;
  var IS_WRAP = type & $export.W;
  var exports = IS_GLOBAL ? core : core[name] || (core[name] = {});
  var expProto = exports[PROTOTYPE];
  var target = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE];
  var key, own, out;
  if (IS_GLOBAL) source = name;
  for (key in source) {
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if (own && key in exports) continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function (C) {
      var F = function (a, b, c) {
        if (this instanceof C) {
          switch (arguments.length) {
            case 0: return new C();
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if (IS_PROTO) {
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if (type & $export.R && expProto && !expProto[key]) hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library`
module.exports = $export;


/***/ }),
/* 52 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(40);
var createDesc = __webpack_require__(85);
module.exports = __webpack_require__(41) ? function (object, key, value) {
  return dP.f(object, key, createDesc(1, value));
} : function (object, key, value) {
  object[key] = value;
  return object;
};


/***/ }),
/* 53 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(83);
module.exports = function (it) {
  if (!isObject(it)) throw TypeError(it + ' is not an object!');
  return it;
};


/***/ }),
/* 54 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 * @providesModule getRelayHandleKey
 * @format
 */



var _require = __webpack_require__(195),
    DEFAULT_HANDLE_KEY = _require.DEFAULT_HANDLE_KEY;

/**
 * @internal
 *
 * Helper to create a unique name for a handle field based on the handle name, handle key and
 * source field.
 */


function getRelayHandleKey(handleName, key, fieldName) {
  if (key && key !== DEFAULT_HANDLE_KEY) {
    return '__' + key + '_' + handleName;
  }

  __webpack_require__(0)(fieldName != null, 'getRelayHandleKey: Expected either `fieldName` or `key` in `handle` to be provided');
  return '__' + fieldName + '_' + handleName;
}

module.exports = getRelayHandleKey;

/***/ }),
/* 55 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayRecordSourceMutator
 * 
 * @format
 */



var _extends3 = _interopRequireDefault(__webpack_require__(25));

var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = __webpack_require__(33),
    EXISTENT = _require.EXISTENT;

var _require2 = __webpack_require__(5),
    UNPUBLISH_FIELD_SENTINEL = _require2.UNPUBLISH_FIELD_SENTINEL,
    UNPUBLISH_RECORD_SENTINEL = _require2.UNPUBLISH_RECORD_SENTINEL;

/**
 * @internal
 *
 * Wrapper API that is an amalgam of the `RelayModernRecord` API and
 * `MutableRecordSource` interface, implementing copy-on-write semantics for
 * records in a record source. If a `backup` is supplied, the mutator will
 * ensure that the backup contains sufficient information to revert all
 * modifications by publishing the backup.
 *
 * Modifications are applied to fresh copies of records with optional backups
 * created:
 * - Records in `base` are never modified.
 * - Modifications cause a fresh version of a record to be created in `sink`.
 *   These sink records contain only modified fields.
 * - If a `backup` is supplied, any modifications to a record will cause the
 *   sink version of the record to be added to the backup.
 * - Creation of a record causes a sentinel object to be added to the backup
 *   so that the new record can be removed from the store by publishing the
 *   backup.
 */
var RelayRecordSourceMutator = function () {
  function RelayRecordSourceMutator(base, sink, backup) {
    (0, _classCallCheck3['default'])(this, RelayRecordSourceMutator);

    this._backup = backup;
    this._base = base;
    this._sink = sink;
    this.__sources = [sink, base];
  }

  RelayRecordSourceMutator.prototype._createBackupRecord = function _createBackupRecord(dataID) {
    var backup = this._backup;
    if (backup && !backup.has(dataID)) {
      var baseRecord = this._base.get(dataID);
      if (baseRecord != null) {
        backup.set(dataID, baseRecord);
      } else if (baseRecord === null) {
        backup['delete'](dataID);
      }
    }
  };

  RelayRecordSourceMutator.prototype._setSentinelFieldsInBackupRecord = function _setSentinelFieldsInBackupRecord(dataID, record) {
    var backup = this._backup;
    if (backup) {
      var backupRecord = backup.get(dataID);
      if (backupRecord && backupRecord !== UNPUBLISH_RECORD_SENTINEL) {
        var copy = null;
        for (var key in record) {
          if (record.hasOwnProperty(key)) {
            if (!(key in backupRecord)) {
              copy = copy || (0, _extends3['default'])({}, backupRecord);
              copy[key] = UNPUBLISH_FIELD_SENTINEL;
            }
          }
        }
        backup.set(dataID, copy || backupRecord);
      }
    }
  };

  RelayRecordSourceMutator.prototype._setSentinelFieldInBackupRecord = function _setSentinelFieldInBackupRecord(dataID, storageKey) {
    var backup = this._backup;
    if (backup) {
      var backupRecord = backup.get(dataID);
      if (backupRecord && backupRecord !== UNPUBLISH_RECORD_SENTINEL && !(storageKey in backupRecord)) {
        var copy = (0, _extends3['default'])({}, backupRecord);
        __webpack_require__(1).setValue(copy, storageKey, UNPUBLISH_FIELD_SENTINEL);
        backup.set(dataID, copy);
      }
    }
  };

  RelayRecordSourceMutator.prototype._getSinkRecord = function _getSinkRecord(dataID) {
    var sinkRecord = this._sink.get(dataID);
    if (!sinkRecord) {
      var baseRecord = this._base.get(dataID);
      __webpack_require__(0)(baseRecord, 'RelayRecordSourceMutator: Cannot modify non-existent record `%s`.', dataID);
      sinkRecord = __webpack_require__(1).create(dataID, __webpack_require__(1).getType(baseRecord));
      this._sink.set(dataID, sinkRecord);
    }
    return sinkRecord;
  };

  RelayRecordSourceMutator.prototype.copyFields = function copyFields(sourceID, sinkID) {
    var sinkSource = this._sink.get(sourceID);
    var baseSource = this._base.get(sourceID);
    __webpack_require__(0)(sinkSource || baseSource, 'RelayRecordSourceMutator#copyFields(): Cannot copy fields from ' + 'non-existent record `%s`.', sourceID);
    this._createBackupRecord(sinkID);
    var sink = this._getSinkRecord(sinkID);
    if (baseSource) {
      __webpack_require__(1).copyFields(baseSource, sink);
    }
    if (sinkSource) {
      __webpack_require__(1).copyFields(sinkSource, sink);
    }
    this._setSentinelFieldsInBackupRecord(sinkID, sink);
  };

  RelayRecordSourceMutator.prototype.copyFieldsFromRecord = function copyFieldsFromRecord(record, sinkID) {
    this.copyFields(__webpack_require__(1).getDataID(record), sinkID);
    var sink = this._getSinkRecord(sinkID);
    __webpack_require__(1).copyFields(record, sink);
    this._setSentinelFieldsInBackupRecord(sinkID, sink);
  };

  RelayRecordSourceMutator.prototype.create = function create(dataID, typeName) {
    __webpack_require__(0)(this._base.getStatus(dataID) !== EXISTENT && this._sink.getStatus(dataID) !== EXISTENT, 'RelayRecordSourceMutator#create(): Cannot create a record with id ' + '`%s`, this record already exists.', dataID);
    if (this._backup) {
      this._backup.set(dataID, UNPUBLISH_RECORD_SENTINEL);
    }
    var record = __webpack_require__(1).create(dataID, typeName);
    this._sink.set(dataID, record);
  };

  RelayRecordSourceMutator.prototype['delete'] = function _delete(dataID) {
    this._createBackupRecord(dataID);
    this._sink['delete'](dataID);
  };

  RelayRecordSourceMutator.prototype.getStatus = function getStatus(dataID) {
    return this._sink.has(dataID) ? this._sink.getStatus(dataID) : this._base.getStatus(dataID);
  };

  RelayRecordSourceMutator.prototype.getType = function getType(dataID) {
    for (var ii = 0; ii < this.__sources.length; ii++) {
      var record = this.__sources[ii].get(dataID);
      if (record) {
        return __webpack_require__(1).getType(record);
      } else if (record === null) {
        return null;
      }
    }
  };

  RelayRecordSourceMutator.prototype.getValue = function getValue(dataID, storageKey) {
    for (var ii = 0; ii < this.__sources.length; ii++) {
      var record = this.__sources[ii].get(dataID);
      if (record) {
        var value = __webpack_require__(1).getValue(record, storageKey);
        if (value !== undefined) {
          return value;
        }
      } else if (record === null) {
        return null;
      }
    }
  };

  RelayRecordSourceMutator.prototype.setValue = function setValue(dataID, storageKey, value) {
    this._createBackupRecord(dataID);
    var sinkRecord = this._getSinkRecord(dataID);
    __webpack_require__(1).setValue(sinkRecord, storageKey, value);
    this._setSentinelFieldInBackupRecord(dataID, storageKey);
  };

  RelayRecordSourceMutator.prototype.getLinkedRecordID = function getLinkedRecordID(dataID, storageKey) {
    for (var ii = 0; ii < this.__sources.length; ii++) {
      var record = this.__sources[ii].get(dataID);
      if (record) {
        var linkedID = __webpack_require__(1).getLinkedRecordID(record, storageKey);
        if (linkedID !== undefined) {
          return linkedID;
        }
      } else if (record === null) {
        return null;
      }
    }
  };

  RelayRecordSourceMutator.prototype.setLinkedRecordID = function setLinkedRecordID(dataID, storageKey, linkedID) {
    this._createBackupRecord(dataID);
    var sinkRecord = this._getSinkRecord(dataID);
    __webpack_require__(1).setLinkedRecordID(sinkRecord, storageKey, linkedID);
    this._setSentinelFieldInBackupRecord(dataID, storageKey);
  };

  RelayRecordSourceMutator.prototype.getLinkedRecordIDs = function getLinkedRecordIDs(dataID, storageKey) {
    for (var ii = 0; ii < this.__sources.length; ii++) {
      var record = this.__sources[ii].get(dataID);
      if (record) {
        var linkedIDs = __webpack_require__(1).getLinkedRecordIDs(record, storageKey);
        if (linkedIDs !== undefined) {
          return linkedIDs;
        }
      } else if (record === null) {
        return null;
      }
    }
  };

  RelayRecordSourceMutator.prototype.setLinkedRecordIDs = function setLinkedRecordIDs(dataID, storageKey, linkedIDs) {
    this._createBackupRecord(dataID);
    var sinkRecord = this._getSinkRecord(dataID);
    __webpack_require__(1).setLinkedRecordIDs(sinkRecord, storageKey, linkedIDs);
    this._setSentinelFieldInBackupRecord(dataID, storageKey);
  };

  return RelayRecordSourceMutator;
}();

module.exports = RelayRecordSourceMutator;

/***/ }),
/* 56 */
/***/ (function(module, exports) {

var hasOwnProperty = {}.hasOwnProperty;
module.exports = function (it, key) {
  return hasOwnProperty.call(it, key);
};


/***/ }),
/* 57 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 * @providesModule deepFreeze
 * @format
 */



/**
 * Recursively "deep" freezes the supplied object.
 *
 * For convenience, and for consistency with the behavior of `Object.freeze`,
 * returns the now-frozen original object.
 */

function deepFreeze(object) {
  Object.freeze(object);
  Object.getOwnPropertyNames(object).forEach(function (name) {
    var property = object[name];
    if (property && typeof property === 'object' && !Object.isFrozen(property)) {
      deepFreeze(property);
    }
  });
  return object;
}

module.exports = deepFreeze;

/***/ }),
/* 58 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayModernGraphQLTag
 * 
 * @format
 */



/**
 * Runtime function to correspond to the `graphql` tagged template function.
 * All calls to this function should be transformed by the plugin.
 */


// The type of a graphql`...` tagged template expression.
function graphql(strings) {
  __webpack_require__(0)(false, 'graphql: Unexpected invocation at runtime. Either the Babel transform ' + 'was not set up, or it failed to identify this call site. Make sure it ' + 'is being used verbatim as `graphql`.');
}

/**
 * Variant of the `graphql` tag that enables experimental features.
 */
graphql.experimental = function (strings) {
  __webpack_require__(0)(false, 'graphql.experimental: Unexpected invocation at runtime. Either the ' + 'Babel transform was not set up, or it failed to identify this call ' + 'site. Make sure it is being used verbatim as `graphql`.');
};

function getNode(taggedNode) {
  var fn = typeof taggedNode === 'function' ? taggedNode : taggedNode.modern;
  // Support for classic raw nodes (used in test mock)
  if (typeof fn !== 'function') {
    return taggedNode;
  }
  return fn();
}

function getFragment(taggedNode) {
  var fragment = getNode(taggedNode);
  __webpack_require__(0)(typeof fragment === 'object' && fragment !== null && fragment.kind === 'Fragment', 'RelayModernGraphQLTag: Expected a fragment, got `%s`.', JSON.stringify(fragment));
  return fragment;
}

function getOperation(taggedNode) {
  var operation = getNode(taggedNode);
  __webpack_require__(0)(typeof operation === 'object' && operation !== null && operation.kind === 'Batch', 'RelayModernGraphQLTag: Expected an operation, got `%s`.', JSON.stringify(operation));
  return operation;
}

module.exports = {
  getFragment: getFragment,
  getOperation: getOperation,
  graphql: graphql
};

/***/ }),
/* 59 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayObservable
 * 
 * @format
 */



var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

// Note: This should accept Subscribable<T> instead of RelayObservable<T>,
// however Flow cannot yet distinguish it from T.
var hostReportError = swallowError;

/**
 * Limited implementation of ESObservable, providing the limited set of behavior
 * Relay networking requires.
 *
 * Observables retain the benefit of callbacks which can be called
 * synchronously, avoiding any UI jitter, while providing a compositional API,
 * which simplifies logic and prevents mishandling of errors compared to
 * the direct use of callback functions.
 *
 * ESObservable: https://github.com/tc39/proposal-observable
 */

var RelayObservable = function () {
  function RelayObservable(source) {
    (0, _classCallCheck3['default'])(this, RelayObservable);

    if (process.env.NODE_ENV !== 'production') {
      // Early runtime errors for ill-formed sources.
      if (!source || typeof source !== 'function') {
        throw new Error('Source must be a Function: ' + String(source));
      }
    }
    this._source = source;
  }

  /**
   * When an emitted error event is not handled by an Observer, it is reported
   * to the host environment (what the ESObservable spec refers to as
   * "HostReportErrors()").
   *
   * The default implementation in development rethrows thrown errors, and
   * logs emitted error events to the console, while in production does nothing
   * (swallowing unhandled errors).
   *
   * Called during application initialization, this method allows
   * application-specific handling of unhandled errors. Allowing, for example,
   * integration with error logging or developer tools.
   *
   * A second parameter `isUncaughtThrownError` is true when the unhandled error
   * was thrown within an Observer handler, and false when the unhandled error
   * was an unhandled emitted event.
   *
   *  - Uncaught thrown errors typically represent avoidable errors thrown from
   *    application code, which should be handled with a try/catch block, and
   *    usually have useful stack traces.
   *
   *  - Unhandled emitted event errors typically represent unavoidable events in
   *    application flow such as network failure, and may not have useful
   *    stack traces.
   */


  RelayObservable.onUnhandledError = function onUnhandledError(callback) {
    hostReportError = callback;
  };

  /**
   * Accepts various kinds of data sources, and always returns a RelayObservable
   * useful for accepting the result of a user-provided FetchFunction.
   */


  RelayObservable.from = function from(obj) {
    return isObservable(obj) ? fromObservable(obj) : __webpack_require__(237)(obj) ? fromPromise(obj) : fromValue(obj);
  };

  /**
   * Creates a RelayObservable, given a function which expects a legacy
   * Relay Observer as the last argument and which returns a Disposable.
   *
   * To support migration to Observable, the function may ignore the
   * legacy Relay observer and directly return an Observable instead.
   */


  RelayObservable.fromLegacy = function fromLegacy(callback) {
    return new RelayObservable(function (sink) {
      var result = callback({
        onNext: sink.next,
        onError: sink.error,
        onCompleted: sink.complete
      });
      return isObservable(result) ? result.subscribe(sink) : function () {
        return result.dispose();
      };
    });
  };

  /**
   * Similar to promise.catch(), observable.catch() handles error events, and
   * provides an alternative observable to use in it's place.
   *
   * If the catch handler throws a new error, it will appear as an error event
   * on the resulting Observable.
   */


  RelayObservable.prototype['catch'] = function _catch(fn) {
    var _this = this;

    return new RelayObservable(function (sink) {
      var subscription = void 0;
      _this.subscribe({
        start: function start(sub) {
          subscription = sub;
        },
        next: sink.next,
        complete: sink.complete,
        error: function (_error2) {
          function error(_x) {
            return _error2.apply(this, arguments);
          }

          error.toString = function () {
            return _error2.toString();
          };

          return error;
        }(function (error) {
          try {
            fn(error).subscribe({
              start: function start(sub) {
                subscription = sub;
              },
              next: sink.next,
              complete: sink.complete,
              error: sink.error
            });
          } catch (error2) {
            sink.error(error2, true /* isUncaughtThrownError */);
          }
        })
      });
      return function () {
        return subscription.unsubscribe();
      };
    });
  };

  /**
   * Returns a new Observable which returns the same values as this one, but
   * modified so that the provided Observer is called to perform a side-effects
   * for all events emitted by the source.
   *
   * Any errors that are thrown in the side-effect Observer are unhandled, and
   * do not affect the source Observable or its Observer.
   *
   * This is useful for when debugging your Observables or performing other
   * side-effects such as logging or performance monitoring.
   */


  RelayObservable.prototype['do'] = function _do(observer) {
    var _this2 = this;

    return new RelayObservable(function (sink) {
      var both = function both(action) {
        return function () {
          try {
            observer[action] && observer[action].apply(observer, arguments);
          } catch (error) {
            hostReportError(error, true /* isUncaughtThrownError */);
          }
          sink[action] && sink[action].apply(sink, arguments);
        };
      };
      return _this2.subscribe({
        start: both('start'),
        next: both('next'),
        error: both('error'),
        complete: both('complete'),
        unsubscribe: both('unsubscribe')
      });
    });
  };

  /**
   * Returns a new Observable which returns the same values as this one, but
   * modified so that the finally callback is performed after completion,
   * whether normal or due to error or unsubscription.
   *
   * This is useful for cleanup such as resource finalization.
   */


  RelayObservable.prototype['finally'] = function _finally(fn) {
    var _this3 = this;

    return new RelayObservable(function (sink) {
      var subscription = _this3.subscribe(sink);
      return function () {
        subscription.unsubscribe();
        fn();
      };
    });
  };

  /**
   * Returns a new Observable which is identical to this one, unless this
   * Observable completes before yielding any values, in which case the new
   * Observable will yield the values from the alternate Observable.
   *
   * If this Observable does yield values, the alternate is never subscribed to.
   *
   * This is useful for scenarios where values may come from multiple sources
   * which should be tried in order, i.e. from a cache before a network.
   */


  RelayObservable.prototype.ifEmpty = function ifEmpty(alternate) {
    var _this4 = this;

    return new RelayObservable(function (sink) {
      var hasValue = false;
      var current = _this4.subscribe({
        next: function next(value) {
          hasValue = true;
          sink.next(value);
        },

        error: sink.error,
        complete: function complete() {
          if (hasValue) {
            sink.complete();
          } else {
            current = alternate.subscribe(sink);
          }
        }
      });
      return function () {
        current.unsubscribe();
      };
    });
  };

  /**
   * Observable's primary API: returns an unsubscribable Subscription to the
   * source of this Observable.
   */


  RelayObservable.prototype.subscribe = function subscribe(observer) {
    if (process.env.NODE_ENV !== 'production') {
      // Early runtime errors for ill-formed observers.
      if (!observer || typeof observer !== 'object') {
        throw new Error('Observer must be an Object with callbacks: ' + String(observer));
      }
    }
    return _subscribe(this._source, observer);
  };

  /**
   * Supports subscription of a legacy Relay Observer, returning a Disposable.
   */


  RelayObservable.prototype.subscribeLegacy = function subscribeLegacy(legacyObserver) {
    var subscription = this.subscribe({
      next: legacyObserver.onNext,
      error: legacyObserver.onError,
      complete: legacyObserver.onCompleted
    });
    return {
      dispose: subscription.unsubscribe
    };
  };

  /**
   * Returns a new Observerable where each value has been transformed by
   * the mapping function.
   */


  RelayObservable.prototype.map = function map(fn) {
    return this.mergeMap(function (value) {
      return fromValue(fn(value));
    });
  };

  /**
   * Returns a new Observable where each value is replaced with a new Observable
   * by the mapping function, the results of which returned as a single
   * merged Observable.
   */


  RelayObservable.prototype.mergeMap = function mergeMap(fn) {
    var _this5 = this;

    return new RelayObservable(function (sink) {
      var subscriptions = [];

      function start(subscription) {
        this._sub = subscription;
        subscriptions.push(subscription);
      }

      function complete() {
        subscriptions.splice(subscriptions.indexOf(this._sub), 1);
        if (subscriptions.length === 0) {
          sink.complete();
        }
      }

      _this5.subscribe({
        start: start,
        next: function next(value) {
          try {
            if (!sink.closed) {
              RelayObservable.from(fn(value)).subscribe({
                start: start,
                next: sink.next,
                error: sink.error,
                complete: complete
              });
            }
          } catch (error) {
            sink.error(error, true /* isUncaughtThrownError */);
          }
        },

        error: sink.error,
        complete: complete
      });

      return function () {
        subscriptions.forEach(function (sub) {
          return sub.unsubscribe();
        });
        subscriptions.length = 0;
      };
    });
  };

  /**
   * Returns a new Observable which first mirrors this Observable, then when it
   * completes, waits for `pollInterval` milliseconds before re-subscribing to
   * this Observable again, looping in this manner until unsubscribed.
   *
   * The returned Observable never completes.
   */


  RelayObservable.prototype.poll = function poll(pollInterval) {
    var _this6 = this;

    if (process.env.NODE_ENV !== 'production') {
      if (typeof pollInterval !== 'number' || pollInterval <= 0) {
        throw new Error('RelayObservable: Expected pollInterval to be positive, got: ' + pollInterval);
      }
    }
    return new RelayObservable(function (sink) {
      var subscription = void 0;
      var timeout = void 0;
      var poll = function poll() {
        subscription = _this6.subscribe({
          next: sink.next,
          error: sink.error,
          complete: function complete() {
            timeout = setTimeout(poll, pollInterval);
          }
        });
      };
      poll();
      return function () {
        clearTimeout(timeout);
        subscription.unsubscribe();
      };
    });
  };

  /**
   * Returns a Promise which resolves when this Observable yields a first value
   * or when it completes with no value.
   */


  RelayObservable.prototype.toPromise = function toPromise() {
    var _this7 = this;

    return new Promise(function (resolve, reject) {
      var subscription = void 0;
      _this7.subscribe({
        start: function start(sub) {
          subscription = sub;
        },
        next: function next(val) {
          resolve(val);
          subscription.unsubscribe();
        },

        error: reject,
        complete: resolve
      });
    });
  };

  return RelayObservable;
}();

// Use declarations to teach Flow how to check isObservable.


// prettier-ignore
function isObservable(obj) {
  return typeof obj === 'object' && obj !== null && typeof obj.subscribe === 'function';
}

function fromObservable(obj) {
  return obj instanceof RelayObservable ? obj : new RelayObservable(function (sink) {
    return obj.subscribe(sink);
  });
}

function fromPromise(promise) {
  return new RelayObservable(function (sink) {
    // Since sink methods do not throw, the resulting Promise can be ignored.
    promise.then(function (value) {
      sink.next(value);
      sink.complete();
    }, sink.error);
  });
}

function fromValue(value) {
  return new RelayObservable(function (sink) {
    sink.next(value);
    sink.complete();
  });
}

function _subscribe(source, observer) {
  var closed = false;
  var cleanup = void 0;

  // Ideally we would simply describe a `get closed()` method on the Sink and
  // Subscription objects below, however not all flow environments we expect
  // Relay to be used within will support property getters, and many minifier
  // tools still do not support ES5 syntax. Instead, we can use defineProperty.
  var withClosed = function withClosed(obj) {
    return Object.defineProperty(obj, 'closed', { get: function get() {
        return closed;
      } });
  };

  function doCleanup() {
    if (cleanup) {
      if (cleanup.unsubscribe) {
        cleanup.unsubscribe();
      } else {
        try {
          cleanup();
        } catch (error) {
          hostReportError(error, true /* isUncaughtThrownError */);
        }
      }
      cleanup = undefined;
    }
  }

  // Create a Subscription.
  var subscription = withClosed({
    unsubscribe: function unsubscribe() {
      if (!closed) {
        closed = true;

        // Tell Observer that unsubscribe was called.
        try {
          observer.unsubscribe && observer.unsubscribe(subscription);
        } catch (error) {
          hostReportError(error, true /* isUncaughtThrownError */);
        } finally {
          doCleanup();
        }
      }
    }
  });

  // Tell Observer that observation is about to begin.
  try {
    observer.start && observer.start(subscription);
  } catch (error) {
    hostReportError(error, true /* isUncaughtThrownError */);
  }

  // If closed already, don't bother creating a Sink.
  if (closed) {
    return subscription;
  }

  // Create a Sink respecting subscription state and cleanup.
  var sink = withClosed({
    next: function next(value) {
      if (!closed && observer.next) {
        try {
          observer.next(value);
        } catch (error) {
          hostReportError(error, true /* isUncaughtThrownError */);
        }
      }
    },
    error: function (_error3) {
      function error(_x2, _x3) {
        return _error3.apply(this, arguments);
      }

      error.toString = function () {
        return _error3.toString();
      };

      return error;
    }(function (error, isUncaughtThrownError) {
      if (closed || !observer.error) {
        closed = true;
        hostReportError(error, isUncaughtThrownError || false);
        doCleanup();
      } else {
        closed = true;
        try {
          observer.error(error);
        } catch (error2) {
          hostReportError(error2, true /* isUncaughtThrownError */);
        } finally {
          doCleanup();
        }
      }
    }),
    complete: function complete() {
      if (!closed) {
        closed = true;
        try {
          observer.complete && observer.complete();
        } catch (error) {
          hostReportError(error, true /* isUncaughtThrownError */);
        } finally {
          doCleanup();
        }
      }
    }
  });

  // If anything goes wrong during observing the source, handle the error.
  try {
    cleanup = source(sink);
  } catch (error) {
    sink.error(error, true /* isUncaughtThrownError */);
  }

  if (process.env.NODE_ENV !== 'production') {
    // Early runtime errors for ill-formed returned cleanup.
    if (cleanup !== undefined && typeof cleanup !== 'function' && (!cleanup || typeof cleanup.unsubscribe !== 'function')) {
      throw new Error('Returned cleanup function which cannot be called: ' + String(cleanup));
    }
  }

  // If closed before the source function existed, cleanup now.
  if (closed) {
    doCleanup();
  }

  return subscription;
}

function swallowError(_error, _isUncaughtThrownError) {
  // do nothing.
}

if (process.env.NODE_ENV !== 'production') {
  // Default implementation of HostReportErrors() in development builds.
  // Can be replaced by the host application environment.
  RelayObservable.onUnhandledError(function (error, isUncaughtThrownError) {
    if (typeof fail === 'function') {
      // In test environments (Jest), fail() immediately fails the current test.
      fail(String(error));
    } else if (isUncaughtThrownError) {
      // Rethrow uncaught thrown errors on the next frame to avoid breaking
      // current logic.
      setTimeout(function () {
        throw error;
      });
    } else if (typeof console !== 'undefined') {
      // Otherwise, log the unhandled error for visibility.
      // eslint-ignore-next-line no-console
      console.error('RelayObservable: Unhandled Error', error);
    }
  });
}

module.exports = RelayObservable;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 60 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _assign = __webpack_require__(259);

var _assign2 = _interopRequireDefault(_assign);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = _assign2.default || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/***/ }),
/* 61 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayProfiler
 * 
 * @format
 */



var aggregateHandlersByName = {
  '*': []
};
var profileHandlersByName = {
  '*': []
};

var NOT_INVOKED = {};
var defaultProfiler = { stop: __webpack_require__(9) };
var shouldInstrument = function shouldInstrument(name) {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }
  return name.charAt(0) !== '@';
};

/**
 * @public
 *
 * Instruments methods to allow profiling various parts of Relay. Profiling code
 * in Relay consists of three steps:
 *
 *  - Instrument the function to be profiled.
 *  - Attach handlers to the instrumented function.
 *  - Run the code which triggers the handlers.
 *
 * Handlers attached to instrumented methods are called with an instrumentation
 * name and a callback that must be synchronously executed:
 *
 *   instrumentedMethod.attachHandler(function(name, callback) {
 *     const start = performance.now();
 *     callback();
 *     console.log('Duration', performance.now() - start);
 *   });
 *
 * Handlers for profiles are callbacks that return a stop method:
 *
 *   RelayProfiler.attachProfileHandler('profileName', (name, state) => {
 *     const start = performance.now();
 *     return function stop(name, state) {
 *       console.log(`Duration (${name})`, performance.now() - start);
 *     }
 *   });
 *
 * In order to reduce the impact on performance in production, instrumented
 * methods and profilers with names that begin with `@` will only be measured
 * if `__DEV__` is true. This should be used for very hot functions.
 */
var RelayProfiler = {
  /**
   * Instruments methods on a class or object. This re-assigns the method in
   * order to preserve function names in stack traces (which are detected by
   * modern debuggers via heuristics). Example usage:
   *
   *   const RelayStore = { primeCache: function() {...} };
   *   RelayProfiler.instrumentMethods(RelayStore, {
   *     primeCache: 'RelayStore.primeCache'
   *   });
   *
   *   RelayStore.primeCache.attachHandler(...);
   *
   * As a result, the methods will be replaced by wrappers that provide the
   * `attachHandler` and `detachHandler` methods.
   */
  instrumentMethods: function instrumentMethods(object, names) {
    for (var _key in names) {
      if (names.hasOwnProperty(_key)) {
        object[_key] = RelayProfiler.instrument(names[_key], object[_key]);
      }
    }
  },


  /**
   * Wraps the supplied function with one that provides the `attachHandler` and
   * `detachHandler` methods. Example usage:
   *
   *   const printRelayQuery =
   *     RelayProfiler.instrument('printRelayQuery', printRelayQuery);
   *
   *   printRelayQuery.attachHandler(...);
   *
   * NOTE: The instrumentation assumes that no handlers are attached or detached
   * in the course of executing another handler.
   */
  instrument: function instrument(name, originalFunction) {
    if (!shouldInstrument(name)) {
      originalFunction.attachHandler = __webpack_require__(9);
      originalFunction.detachHandler = __webpack_require__(9);
      return originalFunction;
    }
    if (!aggregateHandlersByName.hasOwnProperty(name)) {
      aggregateHandlersByName[name] = [];
    }
    var catchallHandlers = aggregateHandlersByName['*'];
    var aggregateHandlers = aggregateHandlersByName[name];
    var handlers = [];
    var contexts = [];
    var invokeHandlers = function invokeHandlers() {
      var context = contexts[contexts.length - 1];
      if (context[0]) {
        context[0]--;
        catchallHandlers[context[0]](name, invokeHandlers);
      } else if (context[1]) {
        context[1]--;
        aggregateHandlers[context[1]](name, invokeHandlers);
      } else if (context[2]) {
        context[2]--;
        handlers[context[2]](name, invokeHandlers);
      } else {
        context[5] = originalFunction.apply(context[3], context[4]);
      }
    };
    var instrumentedCallback = function instrumentedCallback() {
      var returnValue = void 0;
      if (aggregateHandlers.length === 0 && handlers.length === 0 && catchallHandlers.length === 0) {
        returnValue = originalFunction.apply(this, arguments);
      } else {
        contexts.push([catchallHandlers.length, aggregateHandlers.length, handlers.length, this, arguments, NOT_INVOKED]);
        invokeHandlers();
        var context = contexts.pop();
        returnValue = context[5];
        if (returnValue === NOT_INVOKED) {
          throw new Error('RelayProfiler: Handler did not invoke original function.');
        }
      }
      return returnValue;
    };
    instrumentedCallback.attachHandler = function (handler) {
      handlers.push(handler);
    };
    instrumentedCallback.detachHandler = function (handler) {
      __webpack_require__(34)(handlers, handler);
    };
    instrumentedCallback.displayName = '(instrumented ' + name + ')';
    return instrumentedCallback;
  },


  /**
   * Attaches a handler to all methods instrumented with the supplied name.
   *
   *   function createRenderer() {
   *     return RelayProfiler.instrument('render', function() {...});
   *   }
   *   const renderA = createRenderer();
   *   const renderB = createRenderer();
   *
   *   // Only profiles `renderA`.
   *   renderA.attachHandler(...);
   *
   *   // Profiles both `renderA` and `renderB`.
   *   RelayProfiler.attachAggregateHandler('render', ...);
   *
   */
  attachAggregateHandler: function attachAggregateHandler(name, handler) {
    if (shouldInstrument(name)) {
      if (!aggregateHandlersByName.hasOwnProperty(name)) {
        aggregateHandlersByName[name] = [];
      }
      aggregateHandlersByName[name].push(handler);
    }
  },


  /**
   * Detaches a handler attached via `attachAggregateHandler`.
   */
  detachAggregateHandler: function detachAggregateHandler(name, handler) {
    if (shouldInstrument(name)) {
      if (aggregateHandlersByName.hasOwnProperty(name)) {
        __webpack_require__(34)(aggregateHandlersByName[name], handler);
      }
    }
  },


  /**
   * Instruments profiling for arbitrarily asynchronous code by a name.
   *
   *   const timerProfiler = RelayProfiler.profile('timeout');
   *   setTimeout(function() {
   *     timerProfiler.stop();
   *   }, 1000);
   *
   *   RelayProfiler.attachProfileHandler('timeout', ...);
   *
   * Arbitrary state can also be passed into `profile` as a second argument. The
   * attached profile handlers will receive this as the second argument.
   */
  profile: function profile(name, state) {
    var hasCatchAllHandlers = profileHandlersByName['*'].length > 0;
    var hasNamedHandlers = profileHandlersByName.hasOwnProperty(name);
    if (hasNamedHandlers || hasCatchAllHandlers) {
      var profileHandlers = hasNamedHandlers && hasCatchAllHandlers ? profileHandlersByName[name].concat(profileHandlersByName['*']) : hasNamedHandlers ? profileHandlersByName[name] : profileHandlersByName['*'];
      var stopHandlers = void 0;
      for (var ii = profileHandlers.length - 1; ii >= 0; ii--) {
        var profileHandler = profileHandlers[ii];
        var stopHandler = profileHandler(name, state);
        stopHandlers = stopHandlers || [];
        stopHandlers.unshift(stopHandler);
      }
      return {
        stop: function stop() {
          if (stopHandlers) {
            stopHandlers.forEach(function (stopHandler) {
              return stopHandler();
            });
          }
        }
      };
    }
    return defaultProfiler;
  },


  /**
   * Attaches a handler to profiles with the supplied name. You can also
   * attach to the special name '*' which is a catch all.
   */
  attachProfileHandler: function attachProfileHandler(name, handler) {
    if (shouldInstrument(name)) {
      if (!profileHandlersByName.hasOwnProperty(name)) {
        profileHandlersByName[name] = [];
      }
      profileHandlersByName[name].push(handler);
    }
  },


  /**
   * Detaches a handler attached via `attachProfileHandler`.
   */
  detachProfileHandler: function detachProfileHandler(name, handler) {
    if (shouldInstrument(name)) {
      if (profileHandlersByName.hasOwnProperty(name)) {
        __webpack_require__(34)(profileHandlersByName[name], handler);
      }
    }
  }
};

module.exports = RelayProfiler;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 62 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayContainerUtils
 * 
 * @format
 */



/**
 * @internal
 *
 * Helper for checking if this is a React Component
 * created with React.Component or React.createClass().
 */

function isReactComponent(component) {
  return !!(component && typeof component.prototype === 'object' && component.prototype && component.prototype.isReactComponent);
}

function getReactComponent(Component) {
  if (isReactComponent(Component)) {
    return Component;
  } else {
    return null;
  }
}

function getComponentName(Component) {
  var name = void 0;
  var ComponentClass = getReactComponent(Component);
  if (ComponentClass) {
    name = ComponentClass.displayName || ComponentClass.name;
  } else if (typeof Component === 'function') {
    // This is a stateless functional component.
    name = Component.displayName || Component.name || 'StatelessComponent';
  } else {
    name = 'ReactElement';
  }
  return String(name);
}

function getContainerName(Component) {
  return 'Relay(' + getComponentName(Component) + ')';
}

module.exports = {
  getComponentName: getComponentName,
  getContainerName: getContainerName,
  getReactComponent: getReactComponent
};

/***/ }),
/* 63 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var emptyObject = {};

if (process.env.NODE_ENV !== 'production') {
  Object.freeze(emptyObject);
}

module.exports = emptyObject;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 64 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;


/***/ }),
/* 65 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



if (process.env.NODE_ENV !== 'production') {
  var invariant = __webpack_require__(0);
  var warning = __webpack_require__(2);
  var ReactPropTypesSecret = __webpack_require__(64);
  var loggedTypeFailures = {};
}

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?Function} getStack Returns the component stack.
 * @private
 */
function checkPropTypes(typeSpecs, values, location, componentName, getStack) {
  if (process.env.NODE_ENV !== 'production') {
    for (var typeSpecName in typeSpecs) {
      if (typeSpecs.hasOwnProperty(typeSpecName)) {
        var error;
        // Prop type validation may throw. In case they do, we don't want to
        // fail the render phase where it didn't fail before. So we log it.
        // After these have been cleaned up, we'll let them throw.
        try {
          // This is intentionally an invariant that gets caught. It's the same
          // behavior as without this statement except with a better message.
          invariant(typeof typeSpecs[typeSpecName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'the `prop-types` package, but received `%s`.', componentName || 'React class', location, typeSpecName, typeof typeSpecs[typeSpecName]);
          error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
        } catch (ex) {
          error = ex;
        }
        warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', location, typeSpecName, typeof error);
        if (error instanceof Error && !(error.message in loggedTypeFailures)) {
          // Only monitor this failure once because there tends to be a lot of the
          // same error.
          loggedTypeFailures[error.message] = true;

          var stack = getStack ? getStack() : '';

          warning(false, 'Failed %s type: %s%s', location, error.message, stack != null ? stack : '');
        }
      }
    }
  }
}

module.exports = checkPropTypes;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 66 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(150), __esModule: true };

/***/ }),
/* 67 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(68);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 68 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 69 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(70)('keys');
var uid = __webpack_require__(46);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 70 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(12);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),
/* 71 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(29);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 72 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 73 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 74 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 75 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(37);
var dPs = __webpack_require__(113);
var enumBugKeys = __webpack_require__(76);
var IE_PROTO = __webpack_require__(69)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(107)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(163).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 76 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 77 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(20).f;
var has = __webpack_require__(19);
var TAG = __webpack_require__(32)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 78 */
/***/ (function(module, exports, __webpack_require__) {

exports.f = __webpack_require__(32);


/***/ }),
/* 79 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(12);
var core = __webpack_require__(10);
var LIBRARY = __webpack_require__(73);
var wksExt = __webpack_require__(78);
var defineProperty = __webpack_require__(20).f;
module.exports = function (name) {
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if (name.charAt(0) != '_' && !(name in $Symbol)) defineProperty($Symbol, name, { value: wksExt.f(name) });
};


/***/ }),
/* 80 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 81 */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Relay v1.4.0
 *
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

module.exports = __webpack_require__(184);

/***/ }),
/* 82 */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 83 */
/***/ (function(module, exports) {

module.exports = function (it) {
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};


/***/ }),
/* 84 */
/***/ (function(module, exports) {

module.exports = function (exec) {
  try {
    return !!exec();
  } catch (e) {
    return true;
  }
};


/***/ }),
/* 85 */
/***/ (function(module, exports) {

module.exports = function (bitmap, value) {
  return {
    enumerable: !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable: !(bitmap & 4),
    value: value
  };
};


/***/ }),
/* 86 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 * @providesModule stableJSONStringify
 * @format
 */



/**
 * Simple recursive stringifier that produces a stable JSON string suitable for
 * use as a cache key. Does not handle corner-cases such as circular references
 * or exotic types.
 */

function stableJSONStringify(obj) {
  if (Array.isArray(obj)) {
    var result = [];
    for (var ii = 0; ii < obj.length; ii++) {
      var value = obj[ii] !== undefined ? obj[ii] : null;
      result.push(stableJSONStringify(value));
    }
    return '[' + result.join(',') + ']';
  } else if (typeof obj === 'object' && obj) {
    var _result = [];
    var keys = Object.keys(obj);
    keys.sort();
    for (var _ii = 0; _ii < keys.length; _ii++) {
      var key = keys[_ii];
      var _value = stableJSONStringify(obj[key]);
      _result.push('"' + key + '":' + _value);
    }
    return '{' + _result.join(',') + '}';
  } else {
    return JSON.stringify(obj);
  }
}

module.exports = stableJSONStringify;

/***/ }),
/* 87 */
/***/ (function(module, exports) {

// 7.2.1 RequireObjectCoercible(argument)
module.exports = function (it) {
  if (it == undefined) throw TypeError("Can't call method on  " + it);
  return it;
};


/***/ }),
/* 88 */
/***/ (function(module, exports) {

// 7.1.4 ToInteger
var ceil = Math.ceil;
var floor = Math.floor;
module.exports = function (it) {
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};


/***/ }),
/* 89 */
/***/ (function(module, exports, __webpack_require__) {

var shared = __webpack_require__(128)('keys');
var uid = __webpack_require__(129);
module.exports = function (key) {
  return shared[key] || (shared[key] = uid(key));
};


/***/ }),
/* 90 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.13 ToObject(argument)
var defined = __webpack_require__(87);
module.exports = function (it) {
  return Object(defined(it));
};


/***/ }),
/* 91 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayRecordSourceProxy
 * 
 * @format
 */



var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = __webpack_require__(33),
    EXISTENT = _require.EXISTENT,
    NONEXISTENT = _require.NONEXISTENT;

var _require2 = __webpack_require__(5),
    ROOT_ID = _require2.ROOT_ID,
    ROOT_TYPE = _require2.ROOT_TYPE;

/**
 * @internal
 *
 * A helper for manipulating a `RecordSource` via an imperative/OO-style API.
 */
var RelayRecordSourceProxy = function () {
  function RelayRecordSourceProxy(mutator, handlerProvider) {
    (0, _classCallCheck3['default'])(this, RelayRecordSourceProxy);

    this.__mutator = mutator;
    this._handlerProvider = handlerProvider || null;
    this._proxies = {};
  }

  RelayRecordSourceProxy.prototype.commitPayload = function commitPayload(operation, response) {
    var _this = this;

    if (!response) {
      return new (__webpack_require__(92))(this, operation.fragment);
    }

    var _normalizeRelayPayloa = __webpack_require__(42)(operation.root, response),
        source = _normalizeRelayPayloa.source,
        fieldPayloads = _normalizeRelayPayloa.fieldPayloads;

    var dataIDs = source.getRecordIDs();
    dataIDs.forEach(function (dataID) {
      var status = source.getStatus(dataID);
      if (status === EXISTENT) {
        var sourceRecord = source.get(dataID);
        if (sourceRecord) {
          if (_this.__mutator.getStatus(dataID) !== EXISTENT) {
            _this.create(dataID, __webpack_require__(1).getType(sourceRecord));
          }
          _this.__mutator.copyFieldsFromRecord(sourceRecord, dataID);
          delete _this._proxies[dataID];
        }
      } else if (status === NONEXISTENT) {
        _this['delete'](dataID);
      }
    });

    if (fieldPayloads && fieldPayloads.length) {
      fieldPayloads.forEach(function (fieldPayload) {
        var handler = _this._handlerProvider && _this._handlerProvider(fieldPayload.handle);
        __webpack_require__(0)(handler, 'RelayModernEnvironment: Expected a handler to be provided for handle `%s`.', fieldPayload.handle);
        handler.update(_this, fieldPayload);
      });
    }
    return new (__webpack_require__(92))(this, operation.fragment);
  };

  RelayRecordSourceProxy.prototype.create = function create(dataID, typeName) {
    this.__mutator.create(dataID, typeName);
    delete this._proxies[dataID];
    var record = this.get(dataID);
    // For flow
    __webpack_require__(0)(record, 'RelayRecordSourceProxy#create(): Expected the created record to exist.');
    return record;
  };

  RelayRecordSourceProxy.prototype['delete'] = function _delete(dataID) {
    __webpack_require__(0)(dataID !== ROOT_ID, 'RelayRecordSourceProxy#delete(): Cannot delete the root record.');
    delete this._proxies[dataID];
    this.__mutator['delete'](dataID);
  };

  RelayRecordSourceProxy.prototype.get = function get(dataID) {
    if (!this._proxies.hasOwnProperty(dataID)) {
      var status = this.__mutator.getStatus(dataID);
      if (status === EXISTENT) {
        this._proxies[dataID] = new (__webpack_require__(207))(this, this.__mutator, dataID);
      } else {
        this._proxies[dataID] = status === NONEXISTENT ? null : undefined;
      }
    }
    return this._proxies[dataID];
  };

  RelayRecordSourceProxy.prototype.getRoot = function getRoot() {
    var root = this.get(ROOT_ID);
    if (!root) {
      root = this.create(ROOT_ID, ROOT_TYPE);
    }
    __webpack_require__(0)(root && root.getType() === ROOT_TYPE, 'RelayRecordSourceProxy#getRoot(): Expected the source to contain a ' + 'root record.');
    return root;
  };

  return RelayRecordSourceProxy;
}();

module.exports = RelayRecordSourceProxy;

/***/ }),
/* 92 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayRecordSourceSelectorProxy
 * 
 * @format
 */



var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = __webpack_require__(5),
    getStorageKey = _require.getStorageKey;

/**
 * @internal
 *
 * A subclass of RecordSourceProxy that provides convenience methods for
 * accessing the root fields of a given query/mutation. These fields accept
 * complex arguments and it can be tedious to re-construct the correct sets of
 * arguments to pass to e.g. `getRoot().getLinkedRecord()`.
 */
var RelayRecordSourceSelectorProxy = function () {
  function RelayRecordSourceSelectorProxy(recordSource, readSelector) {
    (0, _classCallCheck3['default'])(this, RelayRecordSourceSelectorProxy);

    this.__recordSource = recordSource;
    this._readSelector = readSelector;
  }

  RelayRecordSourceSelectorProxy.prototype.create = function create(dataID, typeName) {
    return this.__recordSource.create(dataID, typeName);
  };

  RelayRecordSourceSelectorProxy.prototype['delete'] = function _delete(dataID) {
    this.__recordSource['delete'](dataID);
  };

  RelayRecordSourceSelectorProxy.prototype.get = function get(dataID) {
    return this.__recordSource.get(dataID);
  };

  RelayRecordSourceSelectorProxy.prototype.getRoot = function getRoot() {
    return this.__recordSource.getRoot();
  };

  RelayRecordSourceSelectorProxy.prototype._getRootField = function _getRootField(selector, fieldName, plural) {
    var field = selector.node.selections.find(function (selection) {
      return selection.kind === 'LinkedField' && selection.name === fieldName;
    });
    __webpack_require__(0)(field && field.kind === 'LinkedField', 'RelayRecordSourceSelectorProxy#getRootField(): Cannot find root ' + 'field `%s`, no such field is defined on GraphQL document `%s`.', fieldName, selector.node.name);
    __webpack_require__(0)(field.plural === plural, 'RelayRecordSourceSelectorProxy#getRootField(): Expected root field ' + '`%s` to be %s.', fieldName, plural ? 'plural' : 'singular');
    return field;
  };

  RelayRecordSourceSelectorProxy.prototype.getRootField = function getRootField(fieldName) {
    var field = this._getRootField(this._readSelector, fieldName, false);
    var storageKey = getStorageKey(field, this._readSelector.variables);
    return this.getRoot().getLinkedRecord(storageKey);
  };

  RelayRecordSourceSelectorProxy.prototype.getPluralRootField = function getPluralRootField(fieldName) {
    var field = this._getRootField(this._readSelector, fieldName, true);
    var storageKey = getStorageKey(field, this._readSelector.variables);
    return this.getRoot().getLinkedRecords(storageKey);
  };

  return RelayRecordSourceSelectorProxy;
}();

module.exports = RelayRecordSourceSelectorProxy;

/***/ }),
/* 93 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayReader
 * 
 * @format
 */



var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var CONDITION = __webpack_require__(3).CONDITION,
    FRAGMENT_SPREAD = __webpack_require__(3).FRAGMENT_SPREAD,
    INLINE_FRAGMENT = __webpack_require__(3).INLINE_FRAGMENT,
    LINKED_FIELD = __webpack_require__(3).LINKED_FIELD,
    SCALAR_FIELD = __webpack_require__(3).SCALAR_FIELD;

var FRAGMENTS_KEY = __webpack_require__(5).FRAGMENTS_KEY,
    ID_KEY = __webpack_require__(5).ID_KEY,
    getArgumentValues = __webpack_require__(5).getArgumentValues,
    getStorageKey = __webpack_require__(5).getStorageKey;

function read(recordSource, selector) {
  var dataID = selector.dataID,
      node = selector.node,
      variables = selector.variables;

  var reader = new RelayReader(recordSource, variables);
  return reader.read(node, dataID);
}

/**
 * @private
 */

var RelayReader = function () {
  function RelayReader(recordSource, variables) {
    (0, _classCallCheck3['default'])(this, RelayReader);

    this._recordSource = recordSource;
    this._seenRecords = {};
    this._variables = variables;
  }

  RelayReader.prototype.read = function read(node, dataID) {
    var data = this._traverse(node, dataID, null);
    return {
      data: data,
      dataID: dataID,
      node: node,
      seenRecords: this._seenRecords,
      variables: this._variables
    };
  };

  RelayReader.prototype._traverse = function _traverse(node, dataID, prevData) {
    var record = this._recordSource.get(dataID);
    this._seenRecords[dataID] = record;
    if (record == null) {
      return record;
    }
    var data = prevData || {};
    this._traverseSelections(node.selections, record, data);
    return data;
  };

  RelayReader.prototype._getVariableValue = function _getVariableValue(name) {
    __webpack_require__(0)(this._variables.hasOwnProperty(name), 'RelayReader(): Undefined variable `%s`.', name);
    return this._variables[name];
  };

  RelayReader.prototype._traverseSelections = function _traverseSelections(selections, record, data) {
    var _this = this;

    selections.forEach(function (selection) {
      if (selection.kind === SCALAR_FIELD) {
        _this._readScalar(selection, record, data);
      } else if (selection.kind === LINKED_FIELD) {
        if (selection.plural) {
          _this._readPluralLink(selection, record, data);
        } else {
          _this._readLink(selection, record, data);
        }
      } else if (selection.kind === CONDITION) {
        var conditionValue = _this._getVariableValue(selection.condition);
        if (conditionValue === selection.passingValue) {
          _this._traverseSelections(selection.selections, record, data);
        }
      } else if (selection.kind === INLINE_FRAGMENT) {
        var typeName = __webpack_require__(1).getType(record);
        if (typeName != null && typeName === selection.type) {
          _this._traverseSelections(selection.selections, record, data);
        }
      } else if (selection.kind === FRAGMENT_SPREAD) {
        _this._createFragmentPointer(selection, record, data);
      } else {
        __webpack_require__(0)(false, 'RelayReader(): Unexpected ast kind `%s`.', selection.kind);
      }
    });
  };

  RelayReader.prototype._readScalar = function _readScalar(field, record, data) {
    var applicationName = field.alias || field.name;
    var storageKey = getStorageKey(field, this._variables);
    var value = __webpack_require__(1).getValue(record, storageKey);
    data[applicationName] = value;
  };

  RelayReader.prototype._readLink = function _readLink(field, record, data) {
    var applicationName = field.alias || field.name;
    var storageKey = getStorageKey(field, this._variables);
    var linkedID = __webpack_require__(1).getLinkedRecordID(record, storageKey);

    if (linkedID == null) {
      data[applicationName] = linkedID;
      return;
    }

    var prevData = data[applicationName];
    __webpack_require__(0)(prevData == null || typeof prevData === 'object', 'RelayReader(): Expected data for field `%s` on record `%s` ' + 'to be an object, got `%s`.', applicationName, __webpack_require__(1).getDataID(record), prevData);
    data[applicationName] = this._traverse(field, linkedID, prevData);
  };

  RelayReader.prototype._readPluralLink = function _readPluralLink(field, record, data) {
    var _this2 = this;

    var applicationName = field.alias || field.name;
    var storageKey = getStorageKey(field, this._variables);
    var linkedIDs = __webpack_require__(1).getLinkedRecordIDs(record, storageKey);

    if (linkedIDs == null) {
      data[applicationName] = linkedIDs;
      return;
    }

    var prevData = data[applicationName];
    __webpack_require__(0)(prevData == null || Array.isArray(prevData), 'RelayReader(): Expected data for field `%s` on record `%s` ' + 'to be an array, got `%s`.', applicationName, __webpack_require__(1).getDataID(record), prevData);
    var linkedArray = prevData || [];
    linkedIDs.forEach(function (linkedID, nextIndex) {
      if (linkedID == null) {
        linkedArray[nextIndex] = linkedID;
        return;
      }
      var prevItem = linkedArray[nextIndex];
      __webpack_require__(0)(prevItem == null || typeof prevItem === 'object', 'RelayReader(): Expected data for field `%s` on record `%s` ' + 'to be an object, got `%s`.', applicationName, __webpack_require__(1).getDataID(record), prevItem);
      var linkedItem = _this2._traverse(field, linkedID, prevItem);
      linkedArray[nextIndex] = linkedItem;
    });
    data[applicationName] = linkedArray;
  };

  RelayReader.prototype._createFragmentPointer = function _createFragmentPointer(fragmentSpread, record, data) {
    var fragmentPointers = data[FRAGMENTS_KEY];
    if (!fragmentPointers) {
      fragmentPointers = data[FRAGMENTS_KEY] = {};
    }
    __webpack_require__(0)(typeof fragmentPointers === 'object' && fragmentPointers, 'RelayReader: Expected fragment spread data to be an object, got `%s`.', fragmentPointers);
    data[ID_KEY] = data[ID_KEY] || __webpack_require__(1).getDataID(record);
    var variables = fragmentSpread.args ? getArgumentValues(fragmentSpread.args, this._variables) : {};
    fragmentPointers[fragmentSpread.name] = variables;
  };

  return RelayReader;
}();

module.exports = { read: read };

/***/ }),
/* 94 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayRecordSourceInspector
 * 
 * @format
 */



var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = __webpack_require__(5),
    ROOT_ID = _require.ROOT_ID,
    ROOT_TYPE = _require.ROOT_TYPE;

var _require2 = __webpack_require__(5),
    REF_KEY = _require2.REF_KEY,
    REFS_KEY = _require2.REFS_KEY;

/**
 * A class intended for introspecting a RecordSource and its Records during
 * development.
 */
var RelayRecordSourceInspector = function () {
  RelayRecordSourceInspector.getForEnvironment = function getForEnvironment(environment) {
    return new RelayRecordSourceInspector(environment.getStore().getSource());
  };

  function RelayRecordSourceInspector(source) {
    (0, _classCallCheck3['default'])(this, RelayRecordSourceInspector);

    this._proxies = {};
    this._source = source;
  }

  /**
   * Returns an inspector for the record with the given id, or null/undefined if
   * that record is deleted/unfetched.
   */


  RelayRecordSourceInspector.prototype.get = function get(dataID) {
    if (!this._proxies.hasOwnProperty(dataID)) {
      var record = this._source.get(dataID);
      if (record != null) {
        this._proxies[dataID] = new RecordInspector(this, record);
      } else {
        this._proxies[dataID] = record;
      }
    }
    return this._proxies[dataID];
  };

  /**
   * Returns a list of "<id>: <type>" for each record in the store that has an
   * `id`.
   */


  RelayRecordSourceInspector.prototype.getNodes = function getNodes() {
    var _this = this;

    var nodes = [];
    this._source.getRecordIDs().forEach(function (dataID) {
      if (dataID.indexOf('client:') === 0) {
        return;
      }
      var record = _this._source.get(dataID);
      nodes.push(RecordSummary.createFromRecord(dataID, record));
    });
    return nodes;
  };

  /**
   * Returns a list of "<id>: <type>" for all records in the store including
   * those that do not have an `id`.
   */


  RelayRecordSourceInspector.prototype.getRecords = function getRecords() {
    var _this2 = this;

    return this._source.getRecordIDs().map(function (dataID) {
      var record = _this2._source.get(dataID);
      return RecordSummary.createFromRecord(dataID, record);
    });
  };

  /**
   * Returns an inspector for the synthesized "root" object, allowing access to
   * e.g. the `viewer` object or the results of other fields on the "Query"
   * type.
   */


  RelayRecordSourceInspector.prototype.getRoot = function getRoot() {
    var root = this.get(ROOT_ID);
    __webpack_require__(0)(root && root.getType() === ROOT_TYPE, 'RelayRecordSourceProxy#getRoot(): Expected the source to contain a ' + 'root record.');
    // Make viewer more accessible: if a record is not present on the original
    // field name but is present on the viewer handle field, rewrite the getter
    // to make `root.viewer` work.
    if (root.viewer == null) {
      var viewerHandle = __webpack_require__(54)('viewer', null, 'viewer');
      var unsafeRoot = root; // to access getter properties
      if (unsafeRoot[viewerHandle] != null) {
        Object.defineProperty(unsafeRoot, 'viewer', {
          configurable: true,
          enumerable: true,
          get: function get() {
            return unsafeRoot[viewerHandle];
          }
        });
      }
    }
    return root;
  };

  return RelayRecordSourceInspector;
}();

/**
 * Internal class for inspecting a single Record.
 */


var RecordInspector = function () {
  function RecordInspector(sourceInspector, record) {
    var _this3 = this;

    (0, _classCallCheck3['default'])(this, RecordInspector);

    this._record = record;
    this._sourceInspector = sourceInspector;

    // Make it easier to inspect the record in a debugger console:
    // defined properties appear in autocomplete when typing "obj."

    var _loop = function _loop(key) {
      if (record.hasOwnProperty(key)) {
        var value = record[key];
        var identifier = key.replace(/[^_a-zA-Z0-9]/g, '_');
        if (typeof value === 'object' && value !== null) {
          if (value.hasOwnProperty(REF_KEY)) {
            Object.defineProperty(_this3, identifier, {
              configurable: true,
              enumerable: true,
              get: function get() {
                return this.getLinkedRecord(key);
              }
            });
          } else if (value.hasOwnProperty(REFS_KEY)) {
            Object.defineProperty(_this3, identifier, {
              configurable: true,
              enumerable: true,
              get: function get() {
                return this.getLinkedRecords(key);
              }
            });
          }
        } else {
          Object.defineProperty(_this3, identifier, {
            configurable: true,
            enumerable: true,
            get: function get() {
              return this.getValue(key);
            }
          });
        }
      }
    };

    for (var key in record) {
      _loop(key);
    }
  }

  /**
   * Get the cache id of the given record. For types that implement the `Node`
   * interface (or that have an `id`) this will be `id`, for other types it will be
   * a synthesized identifier based on the field path from the nearest ancestor
   * record that does have an `id`.
   */


  RecordInspector.prototype.getDataID = function getDataID() {
    return __webpack_require__(1).getDataID(this._record);
  };

  /**
   * Returns a list of the fields that have been fetched on the current record.
   */


  RecordInspector.prototype.getFields = function getFields() {
    return Object.keys(this._record).sort();
  };

  /**
   * Returns the type of the record.
   */


  RecordInspector.prototype.getType = function getType() {
    return __webpack_require__(1).getType(this._record);
  };

  /**
   * Returns a copy of the internal representation of the record.
   */


  RecordInspector.prototype.inspect = function inspect() {
    return __webpack_require__(212)(this._record);
  };

  /**
   * Returns the value of a scalar field. May throw if the given field is
   * present but not actually scalar.
   */


  RecordInspector.prototype.getValue = function getValue(name, args) {
    var storageKey = args ? __webpack_require__(8)(name, args) : name;
    return __webpack_require__(1).getValue(this._record, storageKey);
  };

  /**
   * Returns an inspector for the given scalar "linked" field (a field whose
   * value is another Record instead of a scalar). May throw if the field is
   * present but not a scalar linked record.
   */


  RecordInspector.prototype.getLinkedRecord = function getLinkedRecord(name, args) {
    var storageKey = args ? __webpack_require__(8)(name, args) : name;
    var linkedID = __webpack_require__(1).getLinkedRecordID(this._record, storageKey);
    return linkedID != null ? this._sourceInspector.get(linkedID) : linkedID;
  };

  /**
   * Returns an array of inspectors for the given plural "linked" field (a field
   * whose value is an array of Records instead of a scalar). May throw if the
   * field is  present but not a plural linked record.
   */


  RecordInspector.prototype.getLinkedRecords = function getLinkedRecords(name, args) {
    var _this4 = this;

    var storageKey = args ? __webpack_require__(8)(name, args) : name;
    var linkedIDs = __webpack_require__(1).getLinkedRecordIDs(this._record, storageKey);
    if (linkedIDs == null) {
      return linkedIDs;
    }
    return linkedIDs.map(function (linkedID) {
      return linkedID != null ? _this4._sourceInspector.get(linkedID) : linkedID;
    });
  };

  return RecordInspector;
}();

/**
 * An internal class to provide a console-friendly string representation of a
 * Record.
 */


var RecordSummary = function () {
  RecordSummary.createFromRecord = function createFromRecord(id, record) {
    var type = record ? __webpack_require__(1).getType(record) : null;
    return new RecordSummary(id, type);
  };

  function RecordSummary(id, type) {
    (0, _classCallCheck3['default'])(this, RecordSummary);

    this.id = id;
    this.type = type;
  }

  RecordSummary.prototype.toString = function toString() {
    return this.type ? this.id + ': ' + this.type : this.id;
  };

  return RecordSummary;
}();

module.exports = RelayRecordSourceInspector;

/***/ }),
/* 95 */
/***/ (function(module, exports) {

module.exports = {};


/***/ }),
/* 96 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isRelayModernEnvironment
 * 
 * @format
 */



/**
 * Determine if a given value is an object that implements the `Environment`
 * interface defined in `RelayStoreTypes`.
 *
 * Use a sigil for detection to avoid a realm-specific instanceof check, and to
 * aid in module tree-shaking to avoid requiring all of RelayRuntime just to
 * detect its environment.
 */

function isRelayModernEnvironment(environment) {
  return Boolean(environment && environment['@@RelayModernEnvironment']);
}

module.exports = isRelayModernEnvironment;

/***/ }),
/* 97 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule setRelayModernMutationConfigs
 * 
 * @format
 */



function setRelayModernMutationConfigs(configs, operation, optimisticUpdater, updater) {
  var configOptimisticUpdates = optimisticUpdater ? [optimisticUpdater] : [];
  var configUpdates = updater ? [updater] : [];
  configs.forEach(function (config) {
    switch (config.type) {
      case 'NODE_DELETE':
        var nodeDeleteResult = nodeDelete(config, operation);
        if (nodeDeleteResult) {
          configOptimisticUpdates.push(nodeDeleteResult);
          configUpdates.push(nodeDeleteResult);
        }
        break;
      case 'RANGE_ADD':
        var rangeAddResult = rangeAdd(config, operation);
        if (rangeAddResult) {
          configOptimisticUpdates.push(rangeAddResult);
          configUpdates.push(rangeAddResult);
        }
        break;
      case 'RANGE_DELETE':
        var rangeDeleteResult = rangeDelete(config, operation);
        if (rangeDeleteResult) {
          configOptimisticUpdates.push(rangeDeleteResult);
          configUpdates.push(rangeDeleteResult);
        }
        break;
    }
  });
  optimisticUpdater = function optimisticUpdater(store, data) {
    configOptimisticUpdates.forEach(function (eachOptimisticUpdater) {
      eachOptimisticUpdater(store, data);
    });
  };
  updater = function updater(store, data) {
    configUpdates.forEach(function (eachUpdater) {
      eachUpdater(store, data);
    });
  };
  return { optimisticUpdater: optimisticUpdater, updater: updater };
}

function nodeDelete(config, operation) {
  var updater = void 0;
  if (config.type !== 'NODE_DELETE') {
    return;
  }
  var deletedIDFieldName = config.deletedIDFieldName;

  var rootField = getRootField(operation);
  if (rootField) {
    updater = function updater(store, data) {
      var payload = store.getRootField(rootField);
      if (!payload) {
        return;
      }
      var deleteID = payload.getValue(deletedIDFieldName);
      var deleteIDs = Array.isArray(deleteID) ? deleteID : [deleteID];
      deleteIDs.forEach(function (id) {
        if (id && typeof id === 'string') {
          store['delete'](id);
        }
      });
    };
  }
  return updater;
}

function rangeAdd(config, operation) {
  var updater = void 0;
  if (config.type !== 'RANGE_ADD') {
    return;
  }
  var parentID = config.parentID,
      connectionInfo = config.connectionInfo,
      edgeName = config.edgeName;

  if (!parentID) {
    __webpack_require__(2)(false, 'setRelayModernMutationConfigs: For mutation config RANGE_ADD ' + 'to work you must include a parentID');
    return;
  }
  var rootField = getRootField(operation);
  if (connectionInfo && rootField) {
    updater = function updater(store, data) {
      var parent = store.get(parentID);
      if (parent) {
        var payload = store.getRootField(rootField);
        if (!payload) {
          return;
        }
        var serverEdge = payload.getLinkedRecord(edgeName);
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = connectionInfo[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var info = _step.value;

            if (serverEdge) {
              var connection = __webpack_require__(15).getConnection(parent, info.key, info.filters);
              if (!connection) {
                return;
              }
              var clientEdge = __webpack_require__(15).buildConnectionEdge(store, connection, serverEdge);
              if (!clientEdge) {
                return;
              }
              switch (info.rangeBehavior) {
                case 'append':
                  __webpack_require__(15).insertEdgeAfter(connection, clientEdge);
                  break;
                case 'ignore':
                  // Do nothing
                  break;
                case 'prepend':
                  __webpack_require__(15).insertEdgeBefore(connection, clientEdge);
                  break;
                default:
                  __webpack_require__(2)(false, 'setRelayModernMutationConfigs: RANGE_ADD range behavior ' + ('\'' + info.rangeBehavior + '\' will not work as expected in RelayModern, ') + "supported range behaviors are 'append', 'prepend', and " + "'ignore'");
                  break;
              }
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator['return']) {
              _iterator['return']();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      }
    };
  }
  return updater;
}

function rangeDelete(config, operation) {
  var updater = void 0;
  if (config.type !== 'RANGE_DELETE') {
    return;
  }
  var parentID = config.parentID,
      connectionKeys = config.connectionKeys,
      pathToConnection = config.pathToConnection,
      deletedIDFieldName = config.deletedIDFieldName;

  if (!parentID) {
    __webpack_require__(2)(false, 'setRelayModernMutationConfigs: For mutation config RANGE_DELETE ' + 'to work you must include a parentID');
    return;
  }
  var rootField = getRootField(operation);
  if (rootField) {
    updater = function updater(store, data) {
      if (data) {
        var deleteIDs = [];
        var deletedIDField = data[rootField];
        if (deletedIDField && Array.isArray(deletedIDFieldName)) {
          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = deletedIDFieldName[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var eachField = _step2.value;

              if (deletedIDField && typeof deletedIDField === 'object') {
                deletedIDField = deletedIDField[eachField];
              }
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2['return']) {
                _iterator2['return']();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }

          if (Array.isArray(deletedIDField)) {
            deletedIDField.forEach(function (idObject) {
              if (idObject && idObject.id && typeof idObject === 'object' && typeof idObject.id === 'string') {
                deleteIDs.push(idObject.id);
              }
            });
          } else if (deletedIDField && deletedIDField.id && typeof deletedIDField.id === 'string') {
            deleteIDs.push(deletedIDField.id);
          }
        } else if (deletedIDField && typeof deletedIDFieldName === 'string' && typeof deletedIDField === 'object') {
          deletedIDField = deletedIDField[deletedIDFieldName];
          if (typeof deletedIDField === 'string') {
            deleteIDs.push(deletedIDField);
          } else if (Array.isArray(deletedIDField)) {
            deletedIDField.forEach(function (id) {
              if (typeof id === 'string') {
                deleteIDs.push(id);
              }
            });
          }
        }
        deleteNode(parentID, connectionKeys, pathToConnection, store, deleteIDs);
      }
    };
  }
  return updater;
}

function deleteNode(parentID, connectionKeys, pathToConnection, store, deleteIDs) {
  __webpack_require__(2)(connectionKeys, 'setRelayModernMutationConfigs: RANGE_DELETE must provide a ' + 'connectionKeys');
  var parent = store.get(parentID);
  if (!parent) {
    return;
  }
  if (pathToConnection.length >= 2) {
    var recordProxy = parent;
    for (var i = 1; i < pathToConnection.length - 1; i++) {
      if (recordProxy) {
        recordProxy = recordProxy.getLinkedRecord(pathToConnection[i]);
      }
    }
    // Should never enter loop except edge cases
    if (connectionKeys && recordProxy) {
      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        var _loop = function _loop() {
          var key = _step3.value;

          var connection = __webpack_require__(15).getConnection(recordProxy, key.key, key.filters);
          if (connection) {
            deleteIDs.forEach(function (deleteID) {
              __webpack_require__(15).deleteNode(connection, deleteID);
            });
            return 'break';
          }
        };

        for (var _iterator3 = connectionKeys[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var _ret = _loop();

          if (_ret === 'break') break;
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3['return']) {
            _iterator3['return']();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }
    } else {
      __webpack_require__(2)(false, 'setRelayModernMutationConfigs: RANGE_DELETE ' + 'pathToConnection is incorrect. Unable to find connection with ' + 'parentID: %s and path: %s', parentID, pathToConnection.toString());
    }
  } else {
    __webpack_require__(2)(false, 'setRelayModernMutationConfigs: RANGE_DELETE ' + 'pathToConnection must include at least parent and connection');
  }
}

function getRootField(operation) {
  var rootField = void 0;
  if (operation.fragment && operation.fragment.selections && operation.fragment.selections.length > 0 && operation.fragment.selections[0].kind === 'LinkedField') {
    rootField = operation.fragment.selections[0].name;
  }
  return rootField;
}

module.exports = setRelayModernMutationConfigs;

/***/ }),
/* 98 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactRelayContainerProfiler
 * 
 * @format
 */



function profileContainer(Container, containerName) {
  /* $FlowFixMe(>=0.53.0) This comment suppresses an error
   * when upgrading Flow's support for React. Common errors found when
   * upgrading Flow's React support are documented at
   * https://fburl.com/eq7bs81w */
  __webpack_require__(61).instrumentMethods(Container.prototype, {
    constructor: containerName + '.prototype.constructor',
    componentWillReceiveProps: containerName + '.prototype.componentWillReceiveProps',
    componentWillUnmount: containerName + '.prototype.componentWillUnmount',
    shouldComponentUpdate: containerName + '.prototype.shouldComponentUpdate'
  });
}

module.exports = { profileContainer: profileContainer };

/***/ }),
/* 99 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

var nullthrows = function nullthrows(x) {
  if (x != null) {
    return x;
  }
  throw new Error("Got unexpected null or undefined");
};

module.exports = nullthrows;

/***/ }),
/* 100 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 * @providesModule isScalarAndEqual
 * @format
 */



/**
 * A fast test to determine if two values are equal scalars:
 * - compares scalars such as booleans, strings, numbers by value
 * - compares functions by identity
 * - returns false for complex values, since these cannot be cheaply tested for
 *   equality (use `areEquals` instead)
 */

function isScalarAndEqual(valueA, valueB) {
  return valueA === valueB && (valueA === null || typeof valueA !== 'object');
}

module.exports = isScalarAndEqual;

/***/ }),
/* 101 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule buildReactRelayContainer
 * 
 * @format
 */



var _require = __webpack_require__(62),
    getComponentName = _require.getComponentName,
    getContainerName = _require.getContainerName;

var containerContextTypes = {
  relay: __webpack_require__(43).Relay
};

/**
 * Creates a component class whose instances adapt to the
 * `context.relay.environment` in which they are rendered and which have the
 * necessary static methods (`getFragment()` etc) to be composed within classic
 * `Relay.Containers`.
 */
function buildReactRelayContainer(ComponentClass, fragmentSpec, createContainerWithFragments) {
  // Sanity-check user-defined fragment input
  var containerName = getContainerName(ComponentClass);
  __webpack_require__(267)(getComponentName(ComponentClass), fragmentSpec);

  // Memoize a container for the last environment instance encountered
  var environment = void 0;
  var Container = void 0;
  function ContainerConstructor(props, context) {
    if (Container == null || context.relay.environment !== environment) {
      environment = context.relay.environment;
      if (process.env.NODE_ENV !== 'production') {
        var _require2 = __webpack_require__(50),
            isRelayModernEnvironment = _require2.isRelayModernEnvironment;

        if (!isRelayModernEnvironment(environment)) {
          throw new Error('RelayModernContainer: Can only use Relay Modern component ' + (containerName + ' in a Relay Modern environment!\n') + 'When using Relay Modern and Relay Classic in the same ' + 'application, ensure components use Relay Compat to work in ' + 'both environments.\n' + 'See: http://facebook.github.io/relay/docs/relay-compat.html');
        }
      }
      var getFragmentFromTag = environment.unstable_internal.getFragment;

      var _fragments = __webpack_require__(134)(fragmentSpec, getFragmentFromTag);
      Container = createContainerWithFragments(ComponentClass, _fragments);
    }
    /* $FlowFixMe(>=0.53.0) This comment suppresses an
     * error when upgrading Flow's support for React. Common errors found when
     * upgrading Flow's React support are documented at
     * https://fburl.com/eq7bs81w */
    return new Container(props, context);
  }
  ContainerConstructor.contextTypes = containerContextTypes;
  ContainerConstructor.displayName = containerName;

  if (process.env.NODE_ENV !== 'production') {
    // Classic container static methods.
    ContainerConstructor.getFragment = function getFragmentOnModernContainer() {
      throw new Error('RelayModernContainer: ' + containerName + '.getFragment() was called on ' + 'a Relay Modern component by a Relay Classic or Relay Compat ' + 'component.\n' + 'When using Relay Modern and Relay Classic in the same ' + 'application, ensure components use Relay Compat to work in ' + 'both environments.\n' + 'See: http://facebook.github.io/relay/docs/relay-compat.html');
    };
  }

  return ContainerConstructor;
}

module.exports = buildReactRelayContainer;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 102 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var _assign = __webpack_require__(45);

var emptyObject = __webpack_require__(63);
var _invariant = __webpack_require__(0);

if (process.env.NODE_ENV !== 'production') {
  var warning = __webpack_require__(2);
}

var MIXINS_KEY = 'mixins';

// Helper function to allow the creation of anonymous functions which do not
// have .name set to the name of the variable being assigned to.
function identity(fn) {
  return fn;
}

var ReactPropTypeLocationNames;
if (process.env.NODE_ENV !== 'production') {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
} else {
  ReactPropTypeLocationNames = {};
}

function factory(ReactComponent, isValidElement, ReactNoopUpdateQueue) {
  /**
   * Policies that describe methods in `ReactClassInterface`.
   */

  var injectedMixins = [];

  /**
   * Composite components are higher-level components that compose other composite
   * or host components.
   *
   * To create a new type of `ReactClass`, pass a specification of
   * your new class to `React.createClass`. The only requirement of your class
   * specification is that you implement a `render` method.
   *
   *   var MyComponent = React.createClass({
   *     render: function() {
   *       return <div>Hello World</div>;
   *     }
   *   });
   *
   * The class specification supports a specific protocol of methods that have
   * special meaning (e.g. `render`). See `ReactClassInterface` for
   * more the comprehensive protocol. Any other properties and methods in the
   * class specification will be available on the prototype.
   *
   * @interface ReactClassInterface
   * @internal
   */
  var ReactClassInterface = {
    /**
     * An array of Mixin objects to include when defining your component.
     *
     * @type {array}
     * @optional
     */
    mixins: 'DEFINE_MANY',

    /**
     * An object containing properties and methods that should be defined on
     * the component's constructor instead of its prototype (static methods).
     *
     * @type {object}
     * @optional
     */
    statics: 'DEFINE_MANY',

    /**
     * Definition of prop types for this component.
     *
     * @type {object}
     * @optional
     */
    propTypes: 'DEFINE_MANY',

    /**
     * Definition of context types for this component.
     *
     * @type {object}
     * @optional
     */
    contextTypes: 'DEFINE_MANY',

    /**
     * Definition of context types this component sets for its children.
     *
     * @type {object}
     * @optional
     */
    childContextTypes: 'DEFINE_MANY',

    // ==== Definition methods ====

    /**
     * Invoked when the component is mounted. Values in the mapping will be set on
     * `this.props` if that prop is not specified (i.e. using an `in` check).
     *
     * This method is invoked before `getInitialState` and therefore cannot rely
     * on `this.state` or use `this.setState`.
     *
     * @return {object}
     * @optional
     */
    getDefaultProps: 'DEFINE_MANY_MERGED',

    /**
     * Invoked once before the component is mounted. The return value will be used
     * as the initial value of `this.state`.
     *
     *   getInitialState: function() {
     *     return {
     *       isOn: false,
     *       fooBaz: new BazFoo()
     *     }
     *   }
     *
     * @return {object}
     * @optional
     */
    getInitialState: 'DEFINE_MANY_MERGED',

    /**
     * @return {object}
     * @optional
     */
    getChildContext: 'DEFINE_MANY_MERGED',

    /**
     * Uses props from `this.props` and state from `this.state` to render the
     * structure of the component.
     *
     * No guarantees are made about when or how often this method is invoked, so
     * it must not have side effects.
     *
     *   render: function() {
     *     var name = this.props.name;
     *     return <div>Hello, {name}!</div>;
     *   }
     *
     * @return {ReactComponent}
     * @required
     */
    render: 'DEFINE_ONCE',

    // ==== Delegate methods ====

    /**
     * Invoked when the component is initially created and about to be mounted.
     * This may have side effects, but any external subscriptions or data created
     * by this method must be cleaned up in `componentWillUnmount`.
     *
     * @optional
     */
    componentWillMount: 'DEFINE_MANY',

    /**
     * Invoked when the component has been mounted and has a DOM representation.
     * However, there is no guarantee that the DOM node is in the document.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been mounted (initialized and rendered) for the first time.
     *
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidMount: 'DEFINE_MANY',

    /**
     * Invoked before the component receives new props.
     *
     * Use this as an opportunity to react to a prop transition by updating the
     * state using `this.setState`. Current props are accessed via `this.props`.
     *
     *   componentWillReceiveProps: function(nextProps, nextContext) {
     *     this.setState({
     *       likesIncreasing: nextProps.likeCount > this.props.likeCount
     *     });
     *   }
     *
     * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
     * transition may cause a state change, but the opposite is not true. If you
     * need it, you are probably looking for `componentWillUpdate`.
     *
     * @param {object} nextProps
     * @optional
     */
    componentWillReceiveProps: 'DEFINE_MANY',

    /**
     * Invoked while deciding if the component should be updated as a result of
     * receiving new props, state and/or context.
     *
     * Use this as an opportunity to `return false` when you're certain that the
     * transition to the new props/state/context will not require a component
     * update.
     *
     *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
     *     return !equal(nextProps, this.props) ||
     *       !equal(nextState, this.state) ||
     *       !equal(nextContext, this.context);
     *   }
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @return {boolean} True if the component should update.
     * @optional
     */
    shouldComponentUpdate: 'DEFINE_ONCE',

    /**
     * Invoked when the component is about to update due to a transition from
     * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
     * and `nextContext`.
     *
     * Use this as an opportunity to perform preparation before an update occurs.
     *
     * NOTE: You **cannot** use `this.setState()` in this method.
     *
     * @param {object} nextProps
     * @param {?object} nextState
     * @param {?object} nextContext
     * @param {ReactReconcileTransaction} transaction
     * @optional
     */
    componentWillUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component's DOM representation has been updated.
     *
     * Use this as an opportunity to operate on the DOM when the component has
     * been updated.
     *
     * @param {object} prevProps
     * @param {?object} prevState
     * @param {?object} prevContext
     * @param {DOMElement} rootNode DOM element representing the component.
     * @optional
     */
    componentDidUpdate: 'DEFINE_MANY',

    /**
     * Invoked when the component is about to be removed from its parent and have
     * its DOM representation destroyed.
     *
     * Use this as an opportunity to deallocate any external resources.
     *
     * NOTE: There is no `componentDidUnmount` since your component will have been
     * destroyed by that point.
     *
     * @optional
     */
    componentWillUnmount: 'DEFINE_MANY',

    // ==== Advanced methods ====

    /**
     * Updates the component's currently mounted DOM representation.
     *
     * By default, this implements React's rendering and reconciliation algorithm.
     * Sophisticated clients may wish to override this.
     *
     * @param {ReactReconcileTransaction} transaction
     * @internal
     * @overridable
     */
    updateComponent: 'OVERRIDE_BASE'
  };

  /**
   * Mapping from class specification keys to special processing functions.
   *
   * Although these are declared like instance properties in the specification
   * when defining classes using `React.createClass`, they are actually static
   * and are accessible on the constructor instead of the prototype. Despite
   * being static, they must be defined outside of the "statics" key under
   * which all other static methods are defined.
   */
  var RESERVED_SPEC_KEYS = {
    displayName: function(Constructor, displayName) {
      Constructor.displayName = displayName;
    },
    mixins: function(Constructor, mixins) {
      if (mixins) {
        for (var i = 0; i < mixins.length; i++) {
          mixSpecIntoComponent(Constructor, mixins[i]);
        }
      }
    },
    childContextTypes: function(Constructor, childContextTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, childContextTypes, 'childContext');
      }
      Constructor.childContextTypes = _assign(
        {},
        Constructor.childContextTypes,
        childContextTypes
      );
    },
    contextTypes: function(Constructor, contextTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, contextTypes, 'context');
      }
      Constructor.contextTypes = _assign(
        {},
        Constructor.contextTypes,
        contextTypes
      );
    },
    /**
     * Special case getDefaultProps which should move into statics but requires
     * automatic merging.
     */
    getDefaultProps: function(Constructor, getDefaultProps) {
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps = createMergedResultFunction(
          Constructor.getDefaultProps,
          getDefaultProps
        );
      } else {
        Constructor.getDefaultProps = getDefaultProps;
      }
    },
    propTypes: function(Constructor, propTypes) {
      if (process.env.NODE_ENV !== 'production') {
        validateTypeDef(Constructor, propTypes, 'prop');
      }
      Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
    },
    statics: function(Constructor, statics) {
      mixStaticSpecIntoComponent(Constructor, statics);
    },
    autobind: function() {}
  };

  function validateTypeDef(Constructor, typeDef, location) {
    for (var propName in typeDef) {
      if (typeDef.hasOwnProperty(propName)) {
        // use a warning instead of an _invariant so components
        // don't show up in prod but only in __DEV__
        if (process.env.NODE_ENV !== 'production') {
          warning(
            typeof typeDef[propName] === 'function',
            '%s: %s type `%s` is invalid; it must be a function, usually from ' +
              'React.PropTypes.',
            Constructor.displayName || 'ReactClass',
            ReactPropTypeLocationNames[location],
            propName
          );
        }
      }
    }
  }

  function validateMethodOverride(isAlreadyDefined, name) {
    var specPolicy = ReactClassInterface.hasOwnProperty(name)
      ? ReactClassInterface[name]
      : null;

    // Disallow overriding of base class methods unless explicitly allowed.
    if (ReactClassMixin.hasOwnProperty(name)) {
      _invariant(
        specPolicy === 'OVERRIDE_BASE',
        'ReactClassInterface: You are attempting to override ' +
          '`%s` from your class specification. Ensure that your method names ' +
          'do not overlap with React methods.',
        name
      );
    }

    // Disallow defining methods more than once unless explicitly allowed.
    if (isAlreadyDefined) {
      _invariant(
        specPolicy === 'DEFINE_MANY' || specPolicy === 'DEFINE_MANY_MERGED',
        'ReactClassInterface: You are attempting to define ' +
          '`%s` on your component more than once. This conflict may be due ' +
          'to a mixin.',
        name
      );
    }
  }

  /**
   * Mixin helper which handles policy validation and reserved
   * specification keys when building React classes.
   */
  function mixSpecIntoComponent(Constructor, spec) {
    if (!spec) {
      if (process.env.NODE_ENV !== 'production') {
        var typeofSpec = typeof spec;
        var isMixinValid = typeofSpec === 'object' && spec !== null;

        if (process.env.NODE_ENV !== 'production') {
          warning(
            isMixinValid,
            "%s: You're attempting to include a mixin that is either null " +
              'or not an object. Check the mixins included by the component, ' +
              'as well as any mixins they include themselves. ' +
              'Expected object but got %s.',
            Constructor.displayName || 'ReactClass',
            spec === null ? null : typeofSpec
          );
        }
      }

      return;
    }

    _invariant(
      typeof spec !== 'function',
      "ReactClass: You're attempting to " +
        'use a component class or function as a mixin. Instead, just use a ' +
        'regular object.'
    );
    _invariant(
      !isValidElement(spec),
      "ReactClass: You're attempting to " +
        'use a component as a mixin. Instead, just use a regular object.'
    );

    var proto = Constructor.prototype;
    var autoBindPairs = proto.__reactAutoBindPairs;

    // By handling mixins before any other properties, we ensure the same
    // chaining order is applied to methods with DEFINE_MANY policy, whether
    // mixins are listed before or after these methods in the spec.
    if (spec.hasOwnProperty(MIXINS_KEY)) {
      RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
    }

    for (var name in spec) {
      if (!spec.hasOwnProperty(name)) {
        continue;
      }

      if (name === MIXINS_KEY) {
        // We have already handled mixins in a special case above.
        continue;
      }

      var property = spec[name];
      var isAlreadyDefined = proto.hasOwnProperty(name);
      validateMethodOverride(isAlreadyDefined, name);

      if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
        RESERVED_SPEC_KEYS[name](Constructor, property);
      } else {
        // Setup methods on prototype:
        // The following member methods should not be automatically bound:
        // 1. Expected ReactClass methods (in the "interface").
        // 2. Overridden methods (that were mixed in).
        var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
        var isFunction = typeof property === 'function';
        var shouldAutoBind =
          isFunction &&
          !isReactClassMethod &&
          !isAlreadyDefined &&
          spec.autobind !== false;

        if (shouldAutoBind) {
          autoBindPairs.push(name, property);
          proto[name] = property;
        } else {
          if (isAlreadyDefined) {
            var specPolicy = ReactClassInterface[name];

            // These cases should already be caught by validateMethodOverride.
            _invariant(
              isReactClassMethod &&
                (specPolicy === 'DEFINE_MANY_MERGED' ||
                  specPolicy === 'DEFINE_MANY'),
              'ReactClass: Unexpected spec policy %s for key %s ' +
                'when mixing in component specs.',
              specPolicy,
              name
            );

            // For methods which are defined more than once, call the existing
            // methods before calling the new property, merging if appropriate.
            if (specPolicy === 'DEFINE_MANY_MERGED') {
              proto[name] = createMergedResultFunction(proto[name], property);
            } else if (specPolicy === 'DEFINE_MANY') {
              proto[name] = createChainedFunction(proto[name], property);
            }
          } else {
            proto[name] = property;
            if (process.env.NODE_ENV !== 'production') {
              // Add verbose displayName to the function, which helps when looking
              // at profiling tools.
              if (typeof property === 'function' && spec.displayName) {
                proto[name].displayName = spec.displayName + '_' + name;
              }
            }
          }
        }
      }
    }
  }

  function mixStaticSpecIntoComponent(Constructor, statics) {
    if (!statics) {
      return;
    }
    for (var name in statics) {
      var property = statics[name];
      if (!statics.hasOwnProperty(name)) {
        continue;
      }

      var isReserved = name in RESERVED_SPEC_KEYS;
      _invariant(
        !isReserved,
        'ReactClass: You are attempting to define a reserved ' +
          'property, `%s`, that shouldn\'t be on the "statics" key. Define it ' +
          'as an instance property instead; it will still be accessible on the ' +
          'constructor.',
        name
      );

      var isInherited = name in Constructor;
      _invariant(
        !isInherited,
        'ReactClass: You are attempting to define ' +
          '`%s` on your component more than once. This conflict may be ' +
          'due to a mixin.',
        name
      );
      Constructor[name] = property;
    }
  }

  /**
   * Merge two objects, but throw if both contain the same key.
   *
   * @param {object} one The first object, which is mutated.
   * @param {object} two The second object
   * @return {object} one after it has been mutated to contain everything in two.
   */
  function mergeIntoWithNoDuplicateKeys(one, two) {
    _invariant(
      one && two && typeof one === 'object' && typeof two === 'object',
      'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.'
    );

    for (var key in two) {
      if (two.hasOwnProperty(key)) {
        _invariant(
          one[key] === undefined,
          'mergeIntoWithNoDuplicateKeys(): ' +
            'Tried to merge two objects with the same key: `%s`. This conflict ' +
            'may be due to a mixin; in particular, this may be caused by two ' +
            'getInitialState() or getDefaultProps() methods returning objects ' +
            'with clashing keys.',
          key
        );
        one[key] = two[key];
      }
    }
    return one;
  }

  /**
   * Creates a function that invokes two functions and merges their return values.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createMergedResultFunction(one, two) {
    return function mergedResult() {
      var a = one.apply(this, arguments);
      var b = two.apply(this, arguments);
      if (a == null) {
        return b;
      } else if (b == null) {
        return a;
      }
      var c = {};
      mergeIntoWithNoDuplicateKeys(c, a);
      mergeIntoWithNoDuplicateKeys(c, b);
      return c;
    };
  }

  /**
   * Creates a function that invokes two functions and ignores their return vales.
   *
   * @param {function} one Function to invoke first.
   * @param {function} two Function to invoke second.
   * @return {function} Function that invokes the two argument functions.
   * @private
   */
  function createChainedFunction(one, two) {
    return function chainedFunction() {
      one.apply(this, arguments);
      two.apply(this, arguments);
    };
  }

  /**
   * Binds a method to the component.
   *
   * @param {object} component Component whose method is going to be bound.
   * @param {function} method Method to be bound.
   * @return {function} The bound method.
   */
  function bindAutoBindMethod(component, method) {
    var boundMethod = method.bind(component);
    if (process.env.NODE_ENV !== 'production') {
      boundMethod.__reactBoundContext = component;
      boundMethod.__reactBoundMethod = method;
      boundMethod.__reactBoundArguments = null;
      var componentName = component.constructor.displayName;
      var _bind = boundMethod.bind;
      boundMethod.bind = function(newThis) {
        for (
          var _len = arguments.length,
            args = Array(_len > 1 ? _len - 1 : 0),
            _key = 1;
          _key < _len;
          _key++
        ) {
          args[_key - 1] = arguments[_key];
        }

        // User is trying to bind() an autobound method; we effectively will
        // ignore the value of "this" that the user is trying to use, so
        // let's warn.
        if (newThis !== component && newThis !== null) {
          if (process.env.NODE_ENV !== 'production') {
            warning(
              false,
              'bind(): React component methods may only be bound to the ' +
                'component instance. See %s',
              componentName
            );
          }
        } else if (!args.length) {
          if (process.env.NODE_ENV !== 'production') {
            warning(
              false,
              'bind(): You are binding a component method to the component. ' +
                'React does this for you automatically in a high-performance ' +
                'way, so you can safely remove this call. See %s',
              componentName
            );
          }
          return boundMethod;
        }
        var reboundMethod = _bind.apply(boundMethod, arguments);
        reboundMethod.__reactBoundContext = component;
        reboundMethod.__reactBoundMethod = method;
        reboundMethod.__reactBoundArguments = args;
        return reboundMethod;
      };
    }
    return boundMethod;
  }

  /**
   * Binds all auto-bound methods in a component.
   *
   * @param {object} component Component whose method is going to be bound.
   */
  function bindAutoBindMethods(component) {
    var pairs = component.__reactAutoBindPairs;
    for (var i = 0; i < pairs.length; i += 2) {
      var autoBindKey = pairs[i];
      var method = pairs[i + 1];
      component[autoBindKey] = bindAutoBindMethod(component, method);
    }
  }

  var IsMountedPreMixin = {
    componentDidMount: function() {
      this.__isMounted = true;
    }
  };

  var IsMountedPostMixin = {
    componentWillUnmount: function() {
      this.__isMounted = false;
    }
  };

  /**
   * Add more to the ReactClass base class. These are all legacy features and
   * therefore not already part of the modern ReactComponent.
   */
  var ReactClassMixin = {
    /**
     * TODO: This will be deprecated because state should always keep a consistent
     * type signature and the only use case for this, is to avoid that.
     */
    replaceState: function(newState, callback) {
      this.updater.enqueueReplaceState(this, newState, callback);
    },

    /**
     * Checks whether or not this composite component is mounted.
     * @return {boolean} True if mounted, false otherwise.
     * @protected
     * @final
     */
    isMounted: function() {
      if (process.env.NODE_ENV !== 'production') {
        warning(
          this.__didWarnIsMounted,
          '%s: isMounted is deprecated. Instead, make sure to clean up ' +
            'subscriptions and pending requests in componentWillUnmount to ' +
            'prevent memory leaks.',
          (this.constructor && this.constructor.displayName) ||
            this.name ||
            'Component'
        );
        this.__didWarnIsMounted = true;
      }
      return !!this.__isMounted;
    }
  };

  var ReactClassComponent = function() {};
  _assign(
    ReactClassComponent.prototype,
    ReactComponent.prototype,
    ReactClassMixin
  );

  /**
   * Creates a composite component class given a class specification.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
   *
   * @param {object} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */
  function createClass(spec) {
    // To keep our warnings more understandable, we'll use a little hack here to
    // ensure that Constructor.name !== 'Constructor'. This makes sure we don't
    // unnecessarily identify a class without displayName as 'Constructor'.
    var Constructor = identity(function(props, context, updater) {
      // This constructor gets overridden by mocks. The argument is used
      // by mocks to assert on what gets mounted.

      if (process.env.NODE_ENV !== 'production') {
        warning(
          this instanceof Constructor,
          'Something is calling a React component directly. Use a factory or ' +
            'JSX instead. See: https://fb.me/react-legacyfactory'
        );
      }

      // Wire up auto-binding
      if (this.__reactAutoBindPairs.length) {
        bindAutoBindMethods(this);
      }

      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;

      this.state = null;

      // ReactClasses doesn't have constructors. Instead, they use the
      // getInitialState and componentWillMount methods for initialization.

      var initialState = this.getInitialState ? this.getInitialState() : null;
      if (process.env.NODE_ENV !== 'production') {
        // We allow auto-mocks to proceed as if they're returning null.
        if (
          initialState === undefined &&
          this.getInitialState._isMockFunction
        ) {
          // This is probably bad practice. Consider warning here and
          // deprecating this convenience.
          initialState = null;
        }
      }
      _invariant(
        typeof initialState === 'object' && !Array.isArray(initialState),
        '%s.getInitialState(): must return an object or null',
        Constructor.displayName || 'ReactCompositeComponent'
      );

      this.state = initialState;
    });
    Constructor.prototype = new ReactClassComponent();
    Constructor.prototype.constructor = Constructor;
    Constructor.prototype.__reactAutoBindPairs = [];

    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

    mixSpecIntoComponent(Constructor, IsMountedPreMixin);
    mixSpecIntoComponent(Constructor, spec);
    mixSpecIntoComponent(Constructor, IsMountedPostMixin);

    // Initialize the defaultProps property after all mixins have been merged.
    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps();
    }

    if (process.env.NODE_ENV !== 'production') {
      // This is a tag to indicate that the use of these method names is ok,
      // since it's used with createClass. If it's not, then it's likely a
      // mistake so we'll warn you to use the static property, property
      // initializer or constructor respectively.
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps.isReactClassApproved = {};
      }
      if (Constructor.prototype.getInitialState) {
        Constructor.prototype.getInitialState.isReactClassApproved = {};
      }
    }

    _invariant(
      Constructor.prototype.render,
      'createClass(...): Class specification must implement a `render` method.'
    );

    if (process.env.NODE_ENV !== 'production') {
      warning(
        !Constructor.prototype.componentShouldUpdate,
        '%s has a method called ' +
          'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' +
          'The name is phrased as a question because the function is ' +
          'expected to return a value.',
        spec.displayName || 'A component'
      );
      warning(
        !Constructor.prototype.componentWillRecieveProps,
        '%s has a method called ' +
          'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?',
        spec.displayName || 'A component'
      );
    }

    // Reduce time spent doing lookups by setting these on the prototype.
    for (var methodName in ReactClassInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }

    return Constructor;
  }

  return createClass;
}

module.exports = factory;

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 103 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(19);
var toObject = __webpack_require__(67);
var IE_PROTO = __webpack_require__(69)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 104 */
/***/ (function(module, exports, __webpack_require__) {

// most Object methods by ES6 should accept primitives
var $export = __webpack_require__(13);
var core = __webpack_require__(10);
var fails = __webpack_require__(30);
module.exports = function (KEY, exec) {
  var fn = (core.Object || {})[KEY] || Object[KEY];
  var exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function () { fn(1); }), 'Object', exp);
};


/***/ }),
/* 105 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(152);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 106 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(14) && !__webpack_require__(30)(function () {
  return Object.defineProperty(__webpack_require__(107)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 107 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(29);
var document = __webpack_require__(12).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 108 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(109);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();

/***/ }),
/* 109 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(153), __esModule: true };

/***/ }),
/* 110 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _iterator = __webpack_require__(155);

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = __webpack_require__(168);

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};

/***/ }),
/* 111 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(73);
var $export = __webpack_require__(13);
var redefine = __webpack_require__(112);
var hide = __webpack_require__(28);
var has = __webpack_require__(19);
var Iterators = __webpack_require__(74);
var $iterCreate = __webpack_require__(159);
var setToStringTag = __webpack_require__(77);
var getPrototypeOf = __webpack_require__(103);
var ITERATOR = __webpack_require__(32)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 112 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(28);


/***/ }),
/* 113 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(20);
var anObject = __webpack_require__(37);
var getKeys = __webpack_require__(48);

module.exports = __webpack_require__(14) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 114 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(19);
var toIObject = __webpack_require__(31);
var arrayIndexOf = __webpack_require__(160)(false);
var IE_PROTO = __webpack_require__(69)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 115 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(116);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 116 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 117 */
/***/ (function(module, exports, __webpack_require__) {

var META = __webpack_require__(46)('meta');
var isObject = __webpack_require__(29);
var has = __webpack_require__(19);
var setDesc = __webpack_require__(20).f;
var id = 0;
var isExtensible = Object.isExtensible || function () {
  return true;
};
var FREEZE = !__webpack_require__(30)(function () {
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function (it) {
  setDesc(it, META, { value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  } });
};
var fastKey = function (it, create) {
  // return primitive with prefix
  if (!isObject(it)) return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return 'F';
    // not necessary to add metadata
    if (!create) return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function (it, create) {
  if (!has(it, META)) {
    // can't set metadata to uncaught frozen object
    if (!isExtensible(it)) return true;
    // not necessary to add metadata
    if (!create) return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function (it) {
  if (FREEZE && meta.NEED && isExtensible(it) && !has(it, META)) setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY: META,
  NEED: false,
  fastKey: fastKey,
  getWeak: getWeak,
  onFreeze: onFreeze
};


/***/ }),
/* 118 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys = __webpack_require__(114);
var hiddenKeys = __webpack_require__(76).concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O) {
  return $keys(O, hiddenKeys);
};


/***/ }),
/* 119 */
/***/ (function(module, exports, __webpack_require__) {

var pIE = __webpack_require__(49);
var createDesc = __webpack_require__(47);
var toIObject = __webpack_require__(31);
var toPrimitive = __webpack_require__(71);
var has = __webpack_require__(19);
var IE8_DOM_DEFINE = __webpack_require__(106);
var gOPD = Object.getOwnPropertyDescriptor;

exports.f = __webpack_require__(14) ? gOPD : function getOwnPropertyDescriptor(O, P) {
  O = toIObject(O);
  P = toPrimitive(P, true);
  if (IE8_DOM_DEFINE) try {
    return gOPD(O, P);
  } catch (e) { /* empty */ }
  if (has(O, P)) return createDesc(!pIE.f.call(O, P), O[P]);
};


/***/ }),
/* 120 */
/***/ (function(module, exports, __webpack_require__) {

// optional / simple context binding
var aFunction = __webpack_require__(192);
module.exports = function (fn, that, length) {
  aFunction(fn);
  if (that === undefined) return fn;
  switch (length) {
    case 1: return function (a) {
      return fn.call(that, a);
    };
    case 2: return function (a, b) {
      return fn.call(that, a, b);
    };
    case 3: return function (a, b, c) {
      return fn.call(that, a, b, c);
    };
  }
  return function (/* ...args */) {
    return fn.apply(that, arguments);
  };
};


/***/ }),
/* 121 */
/***/ (function(module, exports, __webpack_require__) {

var isObject = __webpack_require__(83);
var document = __webpack_require__(38).document;
// typeof document.createElement is 'object' in old IE
var is = isObject(document) && isObject(document.createElement);
module.exports = function (it) {
  return is ? document.createElement(it) : {};
};


/***/ }),
/* 122 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayViewerHandler
 * 
 * @format
 */



var _require = __webpack_require__(5),
    ROOT_ID = _require.ROOT_ID;

var VIEWER_ID = __webpack_require__(17)(ROOT_ID, 'viewer');
var VIEWER_TYPE = 'Viewer';

/**
 * A runtime handler for the `viewer` field. The actual viewer record will
 * *never* be accessed at runtime because all fragments that reference it will
 * delegate to the handle field. So in order to prevent GC from having to check
 * both the original server field *and* the handle field (which would be almost
 * duplicate work), the handler copies server fields and then deletes the server
 * record.
 *
 * NOTE: This means other handles may not be added on viewer, since they may
 * execute after this handle when the server record is already deleted.
 */
function update(store, payload) {
  var record = store.get(payload.dataID);
  if (!record) {
    return;
  }
  var serverViewer = record.getLinkedRecord(payload.fieldKey);
  if (!serverViewer) {
    record.setValue(null, payload.handleKey);
    return;
  }
  // Server data already has viewer data at `client:root:viewer`, so link the
  // handle field to the server viewer record.
  if (serverViewer.getDataID() === VIEWER_ID) {
    record.setValue(null, payload.fieldKey);
    record.setLinkedRecord(serverViewer, payload.handleKey);
    return;
  }
  // Other ways to access viewer such as mutations may have a different id for
  // viewer: synthesize a record at the canonical viewer id, copy its fields
  // from the server record, and delete the server record link to speed up GC.
  var clientViewer = store.get(VIEWER_ID) || store.create(VIEWER_ID, VIEWER_TYPE);
  clientViewer.copyFieldsFrom(serverViewer);
  record.setValue(null, payload.fieldKey);
  record.setLinkedRecord(clientViewer, payload.handleKey);

  // Make sure the root object points to the viewer object as well
  var root = store.getRoot();
  root.setLinkedRecord(clientViewer, payload.handleKey);
}

module.exports = {
  VIEWER_ID: VIEWER_ID,
  update: update
};

/***/ }),
/* 123 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys = __webpack_require__(201);
var enumBugKeys = __webpack_require__(130);

module.exports = Object.keys || function keys(O) {
  return $keys(O, enumBugKeys);
};


/***/ }),
/* 124 */
/***/ (function(module, exports, __webpack_require__) {

// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = __webpack_require__(125);
var defined = __webpack_require__(87);
module.exports = function (it) {
  return IObject(defined(it));
};


/***/ }),
/* 125 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = __webpack_require__(126);
// eslint-disable-next-line no-prototype-builtins
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function (it) {
  return cof(it) == 'String' ? it.split('') : Object(it);
};


/***/ }),
/* 126 */
/***/ (function(module, exports) {

var toString = {}.toString;

module.exports = function (it) {
  return toString.call(it).slice(8, -1);
};


/***/ }),
/* 127 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(88);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 128 */
/***/ (function(module, exports, __webpack_require__) {

var global = __webpack_require__(38);
var SHARED = '__core-js_shared__';
var store = global[SHARED] || (global[SHARED] = {});
module.exports = function (key) {
  return store[key] || (store[key] = {});
};


/***/ }),
/* 129 */
/***/ (function(module, exports) {

var id = 0;
var px = Math.random();
module.exports = function (key) {
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};


/***/ }),
/* 130 */
/***/ (function(module, exports) {

// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');


/***/ }),
/* 131 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayProfiler
 * 
 * @format
 */



var aggregateHandlersByName = {
  '*': []
};
var profileHandlersByName = {
  '*': []
};

var NOT_INVOKED = {};
var defaultProfiler = { stop: __webpack_require__(9) };
var shouldInstrument = function shouldInstrument(name) {
  if (process.env.NODE_ENV !== 'production') {
    return true;
  }
  return name.charAt(0) !== '@';
};

/**
 * @public
 *
 * Instruments methods to allow profiling various parts of Relay. Profiling code
 * in Relay consists of three steps:
 *
 *  - Instrument the function to be profiled.
 *  - Attach handlers to the instrumented function.
 *  - Run the code which triggers the handlers.
 *
 * Handlers attached to instrumented methods are called with an instrumentation
 * name and a callback that must be synchronously executed:
 *
 *   instrumentedMethod.attachHandler(function(name, callback) {
 *     const start = performance.now();
 *     callback();
 *     console.log('Duration', performance.now() - start);
 *   });
 *
 * Handlers for profiles are callbacks that return a stop method:
 *
 *   RelayProfiler.attachProfileHandler('profileName', (name, state) => {
 *     const start = performance.now();
 *     return function stop(name, state) {
 *       console.log(`Duration (${name})`, performance.now() - start);
 *     }
 *   });
 *
 * In order to reduce the impact on performance in production, instrumented
 * methods and profilers with names that begin with `@` will only be measured
 * if `__DEV__` is true. This should be used for very hot functions.
 */
var RelayProfiler = {
  /**
   * Instruments methods on a class or object. This re-assigns the method in
   * order to preserve function names in stack traces (which are detected by
   * modern debuggers via heuristics). Example usage:
   *
   *   const RelayStore = { primeCache: function() {...} };
   *   RelayProfiler.instrumentMethods(RelayStore, {
   *     primeCache: 'RelayStore.primeCache'
   *   });
   *
   *   RelayStore.primeCache.attachHandler(...);
   *
   * As a result, the methods will be replaced by wrappers that provide the
   * `attachHandler` and `detachHandler` methods.
   */
  instrumentMethods: function instrumentMethods(object, names) {
    for (var _key in names) {
      if (names.hasOwnProperty(_key)) {
        object[_key] = RelayProfiler.instrument(names[_key], object[_key]);
      }
    }
  },


  /**
   * Wraps the supplied function with one that provides the `attachHandler` and
   * `detachHandler` methods. Example usage:
   *
   *   const printRelayQuery =
   *     RelayProfiler.instrument('printRelayQuery', printRelayQuery);
   *
   *   printRelayQuery.attachHandler(...);
   *
   * NOTE: The instrumentation assumes that no handlers are attached or detached
   * in the course of executing another handler.
   */
  instrument: function instrument(name, originalFunction) {
    if (!shouldInstrument(name)) {
      originalFunction.attachHandler = __webpack_require__(9);
      originalFunction.detachHandler = __webpack_require__(9);
      return originalFunction;
    }
    if (!aggregateHandlersByName.hasOwnProperty(name)) {
      aggregateHandlersByName[name] = [];
    }
    var catchallHandlers = aggregateHandlersByName['*'];
    var aggregateHandlers = aggregateHandlersByName[name];
    var handlers = [];
    var contexts = [];
    var invokeHandlers = function invokeHandlers() {
      var context = contexts[contexts.length - 1];
      if (context[0]) {
        context[0]--;
        catchallHandlers[context[0]](name, invokeHandlers);
      } else if (context[1]) {
        context[1]--;
        aggregateHandlers[context[1]](name, invokeHandlers);
      } else if (context[2]) {
        context[2]--;
        handlers[context[2]](name, invokeHandlers);
      } else {
        context[5] = originalFunction.apply(context[3], context[4]);
      }
    };
    var instrumentedCallback = function instrumentedCallback() {
      var returnValue = void 0;
      if (aggregateHandlers.length === 0 && handlers.length === 0 && catchallHandlers.length === 0) {
        returnValue = originalFunction.apply(this, arguments);
      } else {
        contexts.push([catchallHandlers.length, aggregateHandlers.length, handlers.length, this, arguments, NOT_INVOKED]);
        invokeHandlers();
        var context = contexts.pop();
        returnValue = context[5];
        if (returnValue === NOT_INVOKED) {
          throw new Error('RelayProfiler: Handler did not invoke original function.');
        }
      }
      return returnValue;
    };
    instrumentedCallback.attachHandler = function (handler) {
      handlers.push(handler);
    };
    instrumentedCallback.detachHandler = function (handler) {
      __webpack_require__(34)(handlers, handler);
    };
    instrumentedCallback.displayName = '(instrumented ' + name + ')';
    return instrumentedCallback;
  },


  /**
   * Attaches a handler to all methods instrumented with the supplied name.
   *
   *   function createRenderer() {
   *     return RelayProfiler.instrument('render', function() {...});
   *   }
   *   const renderA = createRenderer();
   *   const renderB = createRenderer();
   *
   *   // Only profiles `renderA`.
   *   renderA.attachHandler(...);
   *
   *   // Profiles both `renderA` and `renderB`.
   *   RelayProfiler.attachAggregateHandler('render', ...);
   *
   */
  attachAggregateHandler: function attachAggregateHandler(name, handler) {
    if (shouldInstrument(name)) {
      if (!aggregateHandlersByName.hasOwnProperty(name)) {
        aggregateHandlersByName[name] = [];
      }
      aggregateHandlersByName[name].push(handler);
    }
  },


  /**
   * Detaches a handler attached via `attachAggregateHandler`.
   */
  detachAggregateHandler: function detachAggregateHandler(name, handler) {
    if (shouldInstrument(name)) {
      if (aggregateHandlersByName.hasOwnProperty(name)) {
        __webpack_require__(34)(aggregateHandlersByName[name], handler);
      }
    }
  },


  /**
   * Instruments profiling for arbitrarily asynchronous code by a name.
   *
   *   const timerProfiler = RelayProfiler.profile('timeout');
   *   setTimeout(function() {
   *     timerProfiler.stop();
   *   }, 1000);
   *
   *   RelayProfiler.attachProfileHandler('timeout', ...);
   *
   * Arbitrary state can also be passed into `profile` as a second argument. The
   * attached profile handlers will receive this as the second argument.
   */
  profile: function profile(name, state) {
    var hasCatchAllHandlers = profileHandlersByName['*'].length > 0;
    var hasNamedHandlers = profileHandlersByName.hasOwnProperty(name);
    if (hasNamedHandlers || hasCatchAllHandlers) {
      var profileHandlers = hasNamedHandlers && hasCatchAllHandlers ? profileHandlersByName[name].concat(profileHandlersByName['*']) : hasNamedHandlers ? profileHandlersByName[name] : profileHandlersByName['*'];
      var stopHandlers = void 0;
      for (var ii = profileHandlers.length - 1; ii >= 0; ii--) {
        var profileHandler = profileHandlers[ii];
        var stopHandler = profileHandler(name, state);
        stopHandlers = stopHandlers || [];
        stopHandlers.unshift(stopHandler);
      }
      return {
        stop: function stop() {
          if (stopHandlers) {
            stopHandlers.forEach(function (stopHandler) {
              return stopHandler();
            });
          }
        }
      };
    }
    return defaultProfiler;
  },


  /**
   * Attaches a handler to profiles with the supplied name. You can also
   * attach to the special name '*' which is a catch all.
   */
  attachProfileHandler: function attachProfileHandler(name, handler) {
    if (shouldInstrument(name)) {
      if (!profileHandlersByName.hasOwnProperty(name)) {
        profileHandlersByName[name] = [];
      }
      profileHandlersByName[name].push(handler);
    }
  },


  /**
   * Detaches a handler attached via `attachProfileHandler`.
   */
  detachProfileHandler: function detachProfileHandler(name, handler) {
    if (shouldInstrument(name)) {
      if (profileHandlersByName.hasOwnProperty(name)) {
        __webpack_require__(34)(profileHandlersByName[name], handler);
      }
    }
  }
};

module.exports = RelayProfiler;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 132 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 * @providesModule RelayConcreteVariables
 * @format
 */



var _extends3 = _interopRequireDefault(__webpack_require__(25));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Determines the variables that are in scope for a fragment given the variables
 * in scope at the root query as well as any arguments applied at the fragment
 * spread via `@arguments`.
 *
 * Note that this is analagous to determining function arguments given a function call.
 */
function getFragmentVariables(fragment, rootVariables, argumentVariables) {
  var variables = void 0;
  fragment.argumentDefinitions.forEach(function (definition) {
    if (argumentVariables.hasOwnProperty(definition.name)) {
      return;
    }
    variables = variables || (0, _extends3['default'])({}, argumentVariables);
    switch (definition.kind) {
      case 'LocalArgument':
        variables[definition.name] = definition.defaultValue;
        break;
      case 'RootArgument':
        __webpack_require__(0)(rootVariables.hasOwnProperty(definition.name), 'RelayConcreteVariables: Expected a defined query variable for `$%s` ' + 'in fragment `%s`.', definition.name, fragment.name);
        variables[definition.name] = rootVariables[definition.name];
        break;
      default:
        __webpack_require__(0)(false, 'RelayConcreteVariables: Unexpected node kind `%s` in fragment `%s`.', definition.kind, fragment.name);
    }
  });
  return variables || argumentVariables;
}

/**
 * Determines the variables that are in scope for a given operation given values
 * for some/all of its arguments. Extraneous input variables are filtered from
 * the output, and missing variables are set to default values (if given in the
 * operation's definition).
 */
function getOperationVariables(operation, variables) {
  var operationVariables = {};
  operation.query.argumentDefinitions.forEach(function (def) {
    var value = def.defaultValue;
    if (variables[def.name] != null) {
      value = variables[def.name];
    }
    operationVariables[def.name] = value;
    if (process.env.NODE_ENV !== 'production') {
      __webpack_require__(2)(value != null || def.type[def.type.length - 1] !== '!', 'RelayConcreteVariables: Expected a value for non-nullable variable ' + '`$%s: %s` on operation `%s`, got `%s`. Make sure you supply a ' + 'value for all non-nullable arguments.', def.name, def.type, operation.name, JSON.stringify(value));
    }
  });
  return operationVariables;
}

module.exports = {
  getFragmentVariables: getFragmentVariables,
  getOperationVariables: getOperationVariables
};
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 133 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayModernSelector
 * 
 * @format
 */



var _require = __webpack_require__(132),
    getFragmentVariables = _require.getFragmentVariables;

var _require2 = __webpack_require__(5),
    FRAGMENTS_KEY = _require2.FRAGMENTS_KEY,
    ID_KEY = _require2.ID_KEY;

/**
 * @public
 *
 * Given the result `item` from a parent that fetched `fragment`, creates a
 * selector that can be used to read the results of that fragment for that item.
 *
 * Example:
 *
 * Given two fragments as follows:
 *
 * ```
 * fragment Parent on User {
 *   id
 *   ...Child
 * }
 * fragment Child on User {
 *   name
 * }
 * ```
 *
 * And given some object `parent` that is the results of `Parent` for id "4",
 * the results of `Child` can be accessed by first getting a selector and then
 * using that selector to `lookup()` the results against the environment:
 *
 * ```
 * const childSelector = getSelector(queryVariables, Child, parent);
 * const childData = environment.lookup(childSelector).data;
 * ```
 */
function getSelector(operationVariables, fragment, item) {
  __webpack_require__(0)(typeof item === 'object' && item !== null && !Array.isArray(item), 'RelayModernSelector: Expected value for fragment `%s` to be an object, got ' + '`%s`.', fragment.name, JSON.stringify(item));
  var dataID = item[ID_KEY];
  var fragments = item[FRAGMENTS_KEY];
  if (typeof dataID === 'string' && typeof fragments === 'object' && fragments !== null && typeof fragments[fragment.name] === 'object' && fragments[fragment.name] !== null) {
    var argumentVariables = fragments[fragment.name];
    var fragmentVariables = getFragmentVariables(fragment, operationVariables, argumentVariables);
    return {
      dataID: dataID,
      node: fragment,
      variables: fragmentVariables
    };
  }
  __webpack_require__(2)(false, 'RelayModernSelector: Expected object to contain data for fragment `%s`, got ' + '`%s`. Make sure that the parent operation/fragment included fragment ' + '`...%s` without `@relay(mask: false)`.', fragment.name, JSON.stringify(item), fragment.name);
  return null;
}

/**
 * @public
 *
 * Given the result `items` from a parent that fetched `fragment`, creates a
 * selector that can be used to read the results of that fragment on those
 * items. This is similar to `getSelector` but for "plural" fragments that
 * expect an array of results and therefore return an array of selectors.
 */
function getSelectorList(operationVariables, fragment, items) {
  var selectors = null;
  items.forEach(function (item) {
    var selector = item != null ? getSelector(operationVariables, fragment, item) : null;
    if (selector != null) {
      selectors = selectors || [];
      selectors.push(selector);
    }
  });
  return selectors;
}

/**
 * @public
 *
 * Given a mapping of keys -> results and a mapping of keys -> fragments,
 * extracts the selectors for those fragments from the results.
 *
 * The canonical use-case for this function is ReactRelayFragmentContainer, which
 * uses this function to convert (props, fragments) into selectors so that it
 * can read the results to pass to the inner component.
 */
function getSelectorsFromObject(operationVariables, fragments, object) {
  var selectors = {};
  for (var _key in fragments) {
    if (fragments.hasOwnProperty(_key)) {
      var fragment = fragments[_key];
      var item = object[_key];
      if (item == null) {
        selectors[_key] = item;
      } else if (fragment.metadata && fragment.metadata.plural === true) {
        __webpack_require__(0)(Array.isArray(item), 'RelayModernSelector: Expected value for key `%s` to be an array, got `%s`. ' + 'Remove `@relay(plural: true)` from fragment `%s` to allow the prop to be an object.', _key, JSON.stringify(item), fragment.name);
        selectors[_key] = getSelectorList(operationVariables, fragment, item);
      } else {
        __webpack_require__(0)(!Array.isArray(item), 'RelayModernFragmentSpecResolver: Expected value for key `%s` to be an object, got `%s`. ' + 'Add `@relay(plural: true)` to fragment `%s` to allow the prop to be an array of items.', _key, JSON.stringify(item), fragment.name);
        selectors[_key] = getSelector(operationVariables, fragment, item);
      }
    }
  }
  return selectors;
}

/**
 * @public
 *
 * Given a mapping of keys -> results and a mapping of keys -> fragments,
 * extracts a mapping of keys -> id(s) of the results.
 *
 * Similar to `getSelectorsFromObject()`, this function can be useful in
 * determining the "identity" of the props passed to a component.
 */
function getDataIDsFromObject(fragments, object) {
  var ids = {};
  for (var _key2 in fragments) {
    if (fragments.hasOwnProperty(_key2)) {
      var fragment = fragments[_key2];
      var item = object[_key2];
      if (item == null) {
        ids[_key2] = item;
      } else if (fragment.metadata && fragment.metadata.plural === true) {
        __webpack_require__(0)(Array.isArray(item), 'RelayModernSelector: Expected value for key `%s` to be an array, got `%s`. ' + 'Remove `@relay(plural: true)` from fragment `%s` to allow the prop to be an object.', _key2, JSON.stringify(item), fragment.name);
        ids[_key2] = getDataIDs(fragment, item);
      } else {
        __webpack_require__(0)(!Array.isArray(item), 'RelayModernFragmentSpecResolver: Expected value for key `%s` to be an object, got `%s`. ' + 'Add `@relay(plural: true)` to fragment `%s` to allow the prop to be an array of items.', _key2, JSON.stringify(item), fragment.name);
        ids[_key2] = getDataID(fragment, item);
      }
    }
  }
  return ids;
}

/**
 * @internal
 */
function getDataIDs(fragment, items) {
  var ids = void 0;
  items.forEach(function (item) {
    var id = item != null ? getDataID(fragment, item) : null;
    if (id != null) {
      ids = ids || [];
      ids.push(id);
    }
  });
  return ids || null;
}

/**
 * @internal
 */
function getDataID(fragment, item) {
  __webpack_require__(0)(typeof item === 'object' && item !== null && !Array.isArray(item), 'RelayModernSelector: Expected value for fragment `%s` to be an object, got ' + '`%s`.', fragment.name, JSON.stringify(item));
  var dataID = item[ID_KEY];
  if (typeof dataID === 'string') {
    return dataID;
  }
  __webpack_require__(2)(false, 'RelayModernSelector: Expected object to contain data for fragment `%s`, got ' + '`%s`. Make sure that the parent operation/fragment included fragment ' + '`...%s` without `@relay(mask: false)`.', fragment.name, JSON.stringify(item), fragment.name);
  return null;
}

/**
 * @public
 *
 * Given a mapping of keys -> results and a mapping of keys -> fragments,
 * extracts the merged variables that would be in scope for those
 * fragments/results.
 *
 * This can be useful in determing what varaibles were used to fetch the data
 * for a Relay container, for example.
 */
function getVariablesFromObject(operationVariables, fragments, object) {
  var variables = {};
  for (var _key3 in fragments) {
    if (fragments.hasOwnProperty(_key3)) {
      var _ret = function () {
        var fragment = fragments[_key3];
        var item = object[_key3];
        if (item == null) {
          return 'continue';
        } else if (fragment.metadata && fragment.metadata.plural === true) {
          __webpack_require__(0)(Array.isArray(item), 'RelayModernSelector: Expected value for key `%s` to be an array, got `%s`. ' + 'Remove `@relay(plural: true)` from fragment `%s` to allow the prop to be an object.', _key3, JSON.stringify(item), fragment.name);
          item.forEach(function (value) {
            if (value != null) {
              var itemVariables = getVariables(operationVariables, fragment, value);
              if (itemVariables) {
                Object.assign(variables, itemVariables);
              }
            }
          });
        } else {
          __webpack_require__(0)(!Array.isArray(item), 'RelayModernFragmentSpecResolver: Expected value for key `%s` to be an object, got `%s`. ' + 'Add `@relay(plural: true)` to fragment `%s` to allow the prop to be an array of items.', _key3, JSON.stringify(item), fragment.name);
          var itemVariables = getVariables(operationVariables, fragment, item);
          if (itemVariables) {
            Object.assign(variables, itemVariables);
          }
        }
      }();

      if (_ret === 'continue') continue;
    }
  }
  return variables;
}

/**
 * @internal
 */
function getVariables(operationVariables, fragment, item) {
  var selector = getSelector(operationVariables, fragment, item);
  return selector ? selector.variables : null;
}

/**
 * @public
 *
 * Determine if two selectors are equal (represent the same selection). Note
 * that this function returns `false` when the two queries/fragments are
 * different objects, even if they select the same fields.
 */
function areEqualSelectors(thisSelector, thatSelector) {
  return thisSelector.dataID === thatSelector.dataID && thisSelector.node === thatSelector.node && __webpack_require__(18)(thisSelector.variables, thatSelector.variables);
}

module.exports = {
  areEqualSelectors: areEqualSelectors,
  getDataIDsFromObject: getDataIDsFromObject,
  getSelector: getSelector,
  getSelectorList: getSelectorList,
  getSelectorsFromObject: getSelectorsFromObject,
  getVariablesFromObject: getVariablesFromObject
};

/***/ }),
/* 134 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */



var hasOwnProperty = Object.prototype.hasOwnProperty;

/**
 * Executes the provided `callback` once for each enumerable own property in the
 * object and constructs a new object from the results. The `callback` is
 * invoked with three arguments:
 *
 *  - the property value
 *  - the property name
 *  - the object being traversed
 *
 * Properties that are added after the call to `mapObject` will not be visited
 * by `callback`. If the values of existing properties are changed, the value
 * passed to `callback` will be the value at the time `mapObject` visits them.
 * Properties that are deleted before being visited are not visited.
 *
 * @grep function objectMap()
 * @grep function objMap()
 *
 * @param {?object} object
 * @param {function} callback
 * @param {*} context
 * @return {?object}
 */
function mapObject(object, callback, context) {
  if (!object) {
    return null;
  }
  var result = {};
  for (var name in object) {
    if (hasOwnProperty.call(object, name)) {
      result[name] = callback.call(context, object[name], name, object);
    }
  }
  return result;
}

module.exports = mapObject;

/***/ }),
/* 135 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule normalizePayload
 * 
 * @format
 */



var _extends3 = _interopRequireDefault(__webpack_require__(25));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = __webpack_require__(5),
    ROOT_ID = _require.ROOT_ID;

function normalizePayload(operation, variables, payload) {
  var data = payload.data,
      errors = payload.errors;

  if (data != null) {
    return __webpack_require__(42)({
      dataID: ROOT_ID,
      node: operation.query,
      variables: payload.rerunVariables ? (0, _extends3['default'])({}, variables, payload.rerunVariables) : variables
    }, data, errors, { handleStrippedNulls: true });
  }
  var error = __webpack_require__(214).create('RelayNetwork', 'No data returned for operation `%s`, got error(s):\n%s\n\nSee the error ' + '`source` property for more information.', operation.name, errors ? errors.map(function (_ref) {
    var message = _ref.message;
    return message;
  }).join('\n') : '(No errors)');
  error.source = { errors: errors, operation: operation, variables: variables };
  throw error;
}

module.exports = normalizePayload;

/***/ }),
/* 136 */
/***/ (function(module, exports, __webpack_require__) {

var def = __webpack_require__(40).f;
var has = __webpack_require__(56);
var TAG = __webpack_require__(26)('toStringTag');

module.exports = function (it, tag, stat) {
  if (it && !has(it = stat ? it : it.prototype, TAG)) def(it, TAG, { configurable: true, value: tag });
};


/***/ }),
/* 137 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayDataLoader
 * 
 * @format
 */



var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = __webpack_require__(33),
    EXISTENT = _require.EXISTENT,
    UNKNOWN = _require.UNKNOWN;

var CONDITION = __webpack_require__(3).CONDITION,
    INLINE_FRAGMENT = __webpack_require__(3).INLINE_FRAGMENT,
    LINKED_FIELD = __webpack_require__(3).LINKED_FIELD,
    LINKED_HANDLE = __webpack_require__(3).LINKED_HANDLE,
    SCALAR_FIELD = __webpack_require__(3).SCALAR_FIELD;

var getStorageKey = __webpack_require__(5).getStorageKey,
    getArgumentValues = __webpack_require__(5).getArgumentValues;

/**
 * Synchronously check whether the records required to fulfill the
 * given `selector` are present in `source`.
 *
 * If a field is missing, it uses the provided handlers to attempt to substitute
 * data. The `target` will store all records that are modified because of a
 * successful substitution.
 *
 * If all records are present, returns `true`, otherwise `false`.
 */


function check(source, target, selector, handlers) {
  var dataID = selector.dataID,
      node = selector.node,
      variables = selector.variables;

  var loader = new RelayDataLoader(source, target, variables, handlers);
  return loader.check(node, dataID);
}

/**
 * @private
 */

var RelayDataLoader = function () {
  function RelayDataLoader(source, target, variables, handlers) {
    (0, _classCallCheck3['default'])(this, RelayDataLoader);

    this._source = source;
    this._variables = variables;
    this._recordWasMissing = false;
    this._handlers = handlers;
    this._mutator = new (__webpack_require__(55))(source, target);
  }

  RelayDataLoader.prototype.check = function check(node, dataID) {
    this._traverse(node, dataID);
    return !this._recordWasMissing;
  };

  RelayDataLoader.prototype._getVariableValue = function _getVariableValue(name) {
    __webpack_require__(0)(this._variables.hasOwnProperty(name), 'RelayAsyncLoader(): Undefined variable `%s`.', name);
    return this._variables[name];
  };

  RelayDataLoader.prototype._handleMissing = function _handleMissing() {
    this._recordWasMissing = true;
  };

  RelayDataLoader.prototype._getDataForHandlers = function _getDataForHandlers(field, dataID) {
    return {
      args: field.args ? getArgumentValues(field.args, this._variables) : {},
      // Getting a snapshot of the record state is potentially expensive since
      // we will need to merge the sink and source records. Since we do not create
      // any new records in this process, it is probably reasonable to provide
      // handlers with a copy of the source record.
      // The only thing that the provided record will not contain is fields
      // added by previous handlers.
      record: this._source.get(dataID)
    };
  };

  RelayDataLoader.prototype._handleMissingScalarField = function _handleMissingScalarField(field, dataID) {
    var _getDataForHandlers2 = this._getDataForHandlers(field, dataID),
        args = _getDataForHandlers2.args,
        record = _getDataForHandlers2.record;

    var _iteratorNormalCompletion = true;
    var _didIteratorError = false;
    var _iteratorError = undefined;

    try {
      for (var _iterator = this._handlers[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
        var handler = _step.value;

        if (handler.kind === 'scalar') {
          var newValue = handler.handle(field, record, args);
          if (newValue !== undefined) {
            return newValue;
          }
        }
      }
    } catch (err) {
      _didIteratorError = true;
      _iteratorError = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion && _iterator['return']) {
          _iterator['return']();
        }
      } finally {
        if (_didIteratorError) {
          throw _iteratorError;
        }
      }
    }

    this._handleMissing();
  };

  RelayDataLoader.prototype._handleMissingLinkField = function _handleMissingLinkField(field, dataID) {
    var _getDataForHandlers3 = this._getDataForHandlers(field, dataID),
        args = _getDataForHandlers3.args,
        record = _getDataForHandlers3.record;

    var _iteratorNormalCompletion2 = true;
    var _didIteratorError2 = false;
    var _iteratorError2 = undefined;

    try {
      for (var _iterator2 = this._handlers[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
        var handler = _step2.value;

        if (handler.kind === 'linked') {
          var newValue = handler.handle(field, record, args);
          if (newValue != null && this._mutator.getStatus(newValue) === EXISTENT) {
            return newValue;
          }
        }
      }
    } catch (err) {
      _didIteratorError2 = true;
      _iteratorError2 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion2 && _iterator2['return']) {
          _iterator2['return']();
        }
      } finally {
        if (_didIteratorError2) {
          throw _iteratorError2;
        }
      }
    }

    this._handleMissing();
  };

  RelayDataLoader.prototype._handleMissingPluralLinkField = function _handleMissingPluralLinkField(field, dataID) {
    var _this = this;

    var _getDataForHandlers4 = this._getDataForHandlers(field, dataID),
        args = _getDataForHandlers4.args,
        record = _getDataForHandlers4.record;

    var _iteratorNormalCompletion3 = true;
    var _didIteratorError3 = false;
    var _iteratorError3 = undefined;

    try {
      for (var _iterator3 = this._handlers[Symbol.iterator](), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
        var handler = _step3.value;

        if (handler.kind === 'pluralLinked') {
          var newValue = handler.handle(field, record, args);
          if (newValue != null) {
            return newValue.filter(function (linkedID) {
              return linkedID != null && _this._mutator.getStatus(linkedID) === EXISTENT;
            });
          }
        }
      }
    } catch (err) {
      _didIteratorError3 = true;
      _iteratorError3 = err;
    } finally {
      try {
        if (!_iteratorNormalCompletion3 && _iterator3['return']) {
          _iterator3['return']();
        }
      } finally {
        if (_didIteratorError3) {
          throw _iteratorError3;
        }
      }
    }

    this._handleMissing();
  };

  RelayDataLoader.prototype._traverse = function _traverse(node, dataID) {
    var status = this._mutator.getStatus(dataID);
    if (status === UNKNOWN) {
      this._handleMissing();
    }
    if (status === EXISTENT) {
      this._traverseSelections(node.selections, dataID);
    }
  };

  RelayDataLoader.prototype._traverseSelections = function _traverseSelections(selections, dataID) {
    var _this2 = this;

    selections.every(function (selection) {
      switch (selection.kind) {
        case SCALAR_FIELD:
          _this2._prepareScalar(selection, dataID);
          break;
        case LINKED_FIELD:
          if (selection.plural) {
            _this2._preparePluralLink(selection, dataID);
          } else {
            _this2._prepareLink(selection, dataID);
          }
          break;
        case CONDITION:
          var conditionValue = _this2._getVariableValue(selection.condition);
          if (conditionValue === selection.passingValue) {
            _this2._traverseSelections(selection.selections, dataID);
          }
          break;
        case INLINE_FRAGMENT:
          var typeName = _this2._mutator.getType(dataID);
          if (typeName != null && typeName === selection.type) {
            _this2._traverseSelections(selection.selections, dataID);
          }
          break;
        case LINKED_HANDLE:
          // Handles have no selections themselves; traverse the original field
          // where the handle was set-up instead.
          var handleField = __webpack_require__(138)(selection, selections, _this2._variables);
          if (handleField.plural) {
            _this2._preparePluralLink(handleField, dataID);
          } else {
            _this2._prepareLink(handleField, dataID);
          }
          break;
        default:
          __webpack_require__(0)(selection.kind === SCALAR_FIELD, 'RelayAsyncLoader(): Unexpected ast kind `%s`.', selection.kind);
      }
      return !_this2._done;
    });
  };

  RelayDataLoader.prototype._prepareScalar = function _prepareScalar(field, dataID) {
    var storageKey = getStorageKey(field, this._variables);
    var fieldValue = this._mutator.getValue(dataID, storageKey);
    if (fieldValue === undefined) {
      fieldValue = this._handleMissingScalarField(field, dataID);
      if (fieldValue !== undefined) {
        this._mutator.setValue(dataID, storageKey, fieldValue);
      }
    }
  };

  RelayDataLoader.prototype._prepareLink = function _prepareLink(field, dataID) {
    var storageKey = getStorageKey(field, this._variables);
    var linkedID = this._mutator.getLinkedRecordID(dataID, storageKey);

    if (linkedID === undefined) {
      linkedID = this._handleMissingLinkField(field, dataID);
      if (linkedID != null) {
        this._mutator.setLinkedRecordID(dataID, storageKey, linkedID);
      }
    }
    if (linkedID != null) {
      this._traverse(field, linkedID);
    }
  };

  RelayDataLoader.prototype._preparePluralLink = function _preparePluralLink(field, dataID) {
    var _this3 = this;

    var storageKey = getStorageKey(field, this._variables);
    var linkedIDs = this._mutator.getLinkedRecordIDs(dataID, storageKey);

    if (linkedIDs === undefined) {
      linkedIDs = this._handleMissingPluralLinkField(field, dataID);
      if (linkedIDs != null) {
        this._mutator.setLinkedRecordIDs(dataID, storageKey, linkedIDs);
      }
    }
    if (linkedIDs) {
      linkedIDs.forEach(function (linkedID) {
        if (linkedID != null) {
          _this3._traverse(field, linkedID);
        }
      });
    }
  };

  return RelayDataLoader;
}();

module.exports = {
  check: check
};

/***/ }),
/* 138 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule cloneRelayHandleSourceField
 * 
 * @format
 */



var _extends3 = _interopRequireDefault(__webpack_require__(25));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = __webpack_require__(5),
    getHandleFilterValues = _require.getHandleFilterValues;

var LINKED_FIELD = __webpack_require__(3).LINKED_FIELD;

/**
 * @private
 *
 * Creates a clone of the supplied `handleField` by finding the original linked
 * field (on which the handle was declared) among the sibling `selections`, and
 * copying its selections into the clone.
 */


function cloneRelayHandleSourceField(handleField, selections, variables) {
  var sourceField = selections.find(function (source) {
    return source.kind === LINKED_FIELD && source.name === handleField.name && source.alias === handleField.alias && __webpack_require__(18)(source.args, handleField.args);
  });
  __webpack_require__(0)(sourceField && sourceField.kind === LINKED_FIELD, 'cloneRelayHandleSourceField: Expected a corresponding source field for ' + 'handle `%s`.', handleField.handle);
  var handleKey = __webpack_require__(54)(handleField.handle, handleField.key, handleField.name);
  if (handleField.filters && handleField.filters.length > 0) {
    var filterValues = getHandleFilterValues(handleField.args || [], handleField.filters, variables);
    handleKey = __webpack_require__(8)(handleKey, filterValues);
  }

  var clonedField = (0, _extends3['default'])({}, sourceField, {
    args: null,
    name: handleKey,
    storageKey: handleKey
  });
  return clonedField;
}

module.exports = cloneRelayHandleSourceField;

/***/ }),
/* 139 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {

// Use the fastest means possible to execute a task in its own turn, with
// priority over other events including IO, animation, reflow, and redraw
// events in browsers.
//
// An exception thrown by a task will permanently interrupt the processing of
// subsequent tasks. The higher level `asap` function ensures that if an
// exception is thrown by a task, that the task queue will continue flushing as
// soon as possible, but if you use `rawAsap` directly, you are responsible to
// either ensure that no exceptions are thrown from your task, or to manually
// call `rawAsap.requestFlush` if an exception is thrown.
module.exports = rawAsap;
function rawAsap(task) {
    if (!queue.length) {
        requestFlush();
        flushing = true;
    }
    // Equivalent to push, but avoids a function call.
    queue[queue.length] = task;
}

var queue = [];
// Once a flush has been requested, no further calls to `requestFlush` are
// necessary until the next `flush` completes.
var flushing = false;
// `requestFlush` is an implementation-specific method that attempts to kick
// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
// the event queue before yielding to the browser's own event loop.
var requestFlush;
// The position of the next task to execute in the task queue. This is
// preserved between calls to `flush` so that it can be resumed if
// a task throws an exception.
var index = 0;
// If a task schedules additional tasks recursively, the task queue can grow
// unbounded. To prevent memory exhaustion, the task queue will periodically
// truncate already-completed tasks.
var capacity = 1024;

// The flush function processes all tasks that have been scheduled with
// `rawAsap` unless and until one of those tasks throws an exception.
// If a task throws an exception, `flush` ensures that its state will remain
// consistent and will resume where it left off when called again.
// However, `flush` does not make any arrangements to be called again if an
// exception is thrown.
function flush() {
    while (index < queue.length) {
        var currentIndex = index;
        // Advance the index before calling the task. This ensures that we will
        // begin flushing on the next task the task throws an error.
        index = index + 1;
        queue[currentIndex].call();
        // Prevent leaking memory for long chains of recursive calls to `asap`.
        // If we call `asap` within tasks scheduled by `asap`, the queue will
        // grow, but to avoid an O(n) walk for every task we execute, we don't
        // shift tasks off the queue after they have been executed.
        // Instead, we periodically shift 1024 tasks off the queue.
        if (index > capacity) {
            // Manually shift all values starting at the index back to the
            // beginning of the queue.
            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
                queue[scan] = queue[scan + index];
            }
            queue.length -= index;
            index = 0;
        }
    }
    queue.length = 0;
    index = 0;
    flushing = false;
}

// `requestFlush` is implemented using a strategy based on data collected from
// every available SauceLabs Selenium web driver worker at time of writing.
// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593

// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
// have WebKitMutationObserver but not un-prefixed MutationObserver.
// Must use `global` or `self` instead of `window` to work in both frames and web
// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.

/* globals self */
var scope = typeof global !== "undefined" ? global : self;
var BrowserMutationObserver = scope.MutationObserver || scope.WebKitMutationObserver;

// MutationObservers are desirable because they have high priority and work
// reliably everywhere they are implemented.
// They are implemented in all modern browsers.
//
// - Android 4-4.3
// - Chrome 26-34
// - Firefox 14-29
// - Internet Explorer 11
// - iPad Safari 6-7.1
// - iPhone Safari 7-7.1
// - Safari 6-7
if (typeof BrowserMutationObserver === "function") {
    requestFlush = makeRequestCallFromMutationObserver(flush);

// MessageChannels are desirable because they give direct access to the HTML
// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
// 11-12, and in web workers in many engines.
// Although message channels yield to any queued rendering and IO tasks, they
// would be better than imposing the 4ms delay of timers.
// However, they do not work reliably in Internet Explorer or Safari.

// Internet Explorer 10 is the only browser that has setImmediate but does
// not have MutationObservers.
// Although setImmediate yields to the browser's renderer, it would be
// preferrable to falling back to setTimeout since it does not have
// the minimum 4ms penalty.
// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
// Desktop to a lesser extent) that renders both setImmediate and
// MessageChannel useless for the purposes of ASAP.
// https://github.com/kriskowal/q/issues/396

// Timers are implemented universally.
// We fall back to timers in workers in most engines, and in foreground
// contexts in the following browsers.
// However, note that even this simple case requires nuances to operate in a
// broad spectrum of browsers.
//
// - Firefox 3-13
// - Internet Explorer 6-9
// - iPad Safari 4.3
// - Lynx 2.8.7
} else {
    requestFlush = makeRequestCallFromTimer(flush);
}

// `requestFlush` requests that the high priority event queue be flushed as
// soon as possible.
// This is useful to prevent an error thrown in a task from stalling the event
// queue if the exception handled by Node.js’s
// `process.on("uncaughtException")` or by a domain.
rawAsap.requestFlush = requestFlush;

// To request a high priority event, we induce a mutation observer by toggling
// the text of a text node between "1" and "-1".
function makeRequestCallFromMutationObserver(callback) {
    var toggle = 1;
    var observer = new BrowserMutationObserver(callback);
    var node = document.createTextNode("");
    observer.observe(node, {characterData: true});
    return function requestCall() {
        toggle = -toggle;
        node.data = toggle;
    };
}

// The message channel technique was discovered by Malte Ubl and was the
// original foundation for this library.
// http://www.nonblocking.io/2011/06/windownexttick.html

// Safari 6.0.5 (at least) intermittently fails to create message ports on a
// page's first load. Thankfully, this version of Safari supports
// MutationObservers, so we don't need to fall back in that case.

// function makeRequestCallFromMessageChannel(callback) {
//     var channel = new MessageChannel();
//     channel.port1.onmessage = callback;
//     return function requestCall() {
//         channel.port2.postMessage(0);
//     };
// }

// For reasons explained above, we are also unable to use `setImmediate`
// under any circumstances.
// Even if we were, there is another bug in Internet Explorer 10.
// It is not sufficient to assign `setImmediate` to `requestFlush` because
// `setImmediate` must be called *by name* and therefore must be wrapped in a
// closure.
// Never forget.

// function makeRequestCallFromSetImmediate(callback) {
//     return function requestCall() {
//         setImmediate(callback);
//     };
// }

// Safari 6.0 has a problem where timers will get lost while the user is
// scrolling. This problem does not impact ASAP because Safari 6.0 supports
// mutation observers, so that implementation is used instead.
// However, if we ever elect to use timers in Safari, the prevalent work-around
// is to add a scroll event listener that calls for a flush.

// `setTimeout` does not call the passed callback if the delay is less than
// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
// even then.

function makeRequestCallFromTimer(callback) {
    return function requestCall() {
        // We dispatch a timeout with a specified delay of 0 for engines that
        // can reliably accommodate that request. This will usually be snapped
        // to a 4 milisecond delay, but once we're flushing, there's no delay
        // between events.
        var timeoutHandle = setTimeout(handleTimer, 0);
        // However, since this timer gets frequently dropped in Firefox
        // workers, we enlist an interval handle that will try to fire
        // an event 20 times per second until it succeeds.
        var intervalHandle = setInterval(handleTimer, 50);

        function handleTimer() {
            // Whichever timer succeeds will cancel both timers and
            // execute the callback.
            clearTimeout(timeoutHandle);
            clearInterval(intervalHandle);
            callback();
        }
    };
}

// This is for `asap.js` only.
// Its name will be periodically randomized to break any code that depends on
// its existence.
rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;

// ASAP was originally a nextTick shim included in Q. This was factored out
// into this ASAP package. It was later adapted to RSVP which made further
// amendments. These decisions, particularly to marginalize MessageChannel and
// to capture the MutationObserver implementation in a closure, were integrated
// back into ASAP proper.
// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(82)))

/***/ }),
/* 140 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isClassicRelayEnvironment
 * 
 * @format
 */



/**
 * Determine if a given value is an object that implements the `RelayEnvironment`
 * interface.
 */

function isClassicRelayEnvironment(environment) {
  return typeof environment === 'object' && environment !== null && typeof environment.applyMutation === 'function' && typeof environment.sendMutation === 'function' && typeof environment.forceFetch === 'function' && typeof environment.getFragmentResolver === 'function' && typeof environment.getStoreData === 'function' && typeof environment.primeCache === 'function';
}

module.exports = isClassicRelayEnvironment;

/***/ }),
/* 141 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isRelayEnvironment
 * 
 * @format
 */



/**
 * Determine if a given value is an object that implements the `Environment`
 * interface defined in `RelayEnvironmentTypes`.
 */

function isRelayEnvironment(environment) {
  return typeof environment === 'object' && environment !== null &&
  // TODO: add applyMutation/sendMutation once ready in both cores
  typeof environment.lookup === 'function' && typeof environment.retain === 'function' && typeof environment.sendQuery === 'function' && typeof environment.execute === 'function' && typeof environment.subscribe === 'function';
}

module.exports = isRelayEnvironment;

/***/ }),
/* 142 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperties = __webpack_require__(272);

var _defineProperties2 = _interopRequireDefault(_defineProperties);

var _freeze = __webpack_require__(275);

var _freeze2 = _interopRequireDefault(_freeze);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (strings, raw) {
  return (0, _freeze2.default)((0, _defineProperties2.default)(strings, {
    raw: {
      value: (0, _freeze2.default)(raw)
    }
  }));
};

/***/ }),
/* 143 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var _react = __webpack_require__(7);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(148);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _App = __webpack_require__(149);

var _App2 = _interopRequireDefault(_App);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var ES6Promise = __webpack_require__(279); /**
                                         * This file gets bundled and rendered by babel-loader and webpack to public/main.js
                                         **/

ES6Promise.polyfill();
var jsonData = null;

// Renders Table component from App.jsx
_reactDom2.default.render(_react2.default.createElement(_App2.default, null), document.getElementById('app'));

/***/ }),
/* 144 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
function e(e){for(var t=arguments.length-1,r="Minified React error #"+e+"; visit http://facebook.github.io/react/docs/error-decoder.html?invariant="+e,n=0;n<t;n++)r+="&args[]="+encodeURIComponent(arguments[n+1]);r+=" for the full message or use the non-minified dev environment for full errors and additional helpful warnings.";var o=new Error(r);throw o.name="Invariant Violation",o.framesToPop=1,o}function t(e,t){}function r(e,t,r){this.props=e,this.context=t,this.refs=A,this.updater=r||T}function n(e,t,r){this.props=e,this.context=t,this.refs=A,this.updater=r||T}function o(){}function i(e){return void 0!==e.ref}function a(e){return void 0!==e.key}function l(e){var t=e&&(Z&&e[Z]||e[ee]);if("function"==typeof t)return t}function u(e){var t={"=":"=0",":":"=2"};return"$"+(""+e).replace(/[=:]/g,function(e){return t[e]})}function c(e){var t={"=0":"=","=2":":"};return(""+("."===e[0]&&"$"===e[1]?e.substring(2):e.substring(1))).replace(/(=0|=2)/g,function(e){return t[e]})}function s(e,t){return"object"==typeof e&&null!==e&&null!=e.key?ne.escape(e.key):t.toString(36)}function p(e,t,r,n){var o=typeof e;if("undefined"!==o&&"boolean"!==o||(e=null),null===e||"string"===o||"number"===o||"object"===o&&e.$$typeof===Y)return r(n,e,""===t?oe+s(e,0):t),1;var i,a,l=0,u=""===t?oe:t+ie;if(Array.isArray(e))for(var c=0;c<e.length;c++)i=e[c],a=u+s(i,c),l+=p(i,a,r,n);else{var f=te(e);if(f)for(var d,h=f.call(e),y=0;!(d=h.next()).done;)i=d.value,a=u+s(i,y++),l+=p(i,a,r,n);else if("object"===o){var m=""+e;R("31","[object Object]"===m?"object with keys {"+Object.keys(e).join(", ")+"}":m,"")}}return l}function f(e,t,r){return null==e?0:p(e,"",t,r)}function d(e){return(""+e).replace(ce,"$&/")}function h(e,t){this.func=e,this.context=t,this.count=0}function y(e,t,r){var n=e.func,o=e.context;n.call(o,t,e.count++)}function m(e,t,r){if(null==e)return e;var n=h.getPooled(t,r);ae(e,y,n),h.release(n)}function b(e,t,r,n){this.result=e,this.keyPrefix=t,this.func=r,this.context=n,this.count=0}function v(e,t,r){var n=e.result,o=e.keyPrefix,i=e.func,a=e.context,l=i.call(a,t,e.count++);Array.isArray(l)?g(l,n,r,j.thatReturnsArgument):null!=l&&(X.isValidElement(l)&&(l=X.cloneAndReplaceKey(l,o+(!l.key||t&&t.key===l.key?"":d(l.key)+"/")+r)),n.push(l))}function g(e,t,r,n,o){var i="";null!=r&&(i=d(r)+"/");var a=b.getPooled(t,i,n,o);ae(e,v,a),b.release(a)}function P(e,t,r){if(null==e)return e;var n=[];return g(e,n,null,t,r),n}function k(e,t,r){return null}function _(e,t){return ae(e,k,null)}function E(e){var t=[];return g(e,t,null,j.thatReturnsArgument),t}function w(e){return X.isValidElement(e)||R("143"),e}var S=__webpack_require__(45);__webpack_require__(2);var A=__webpack_require__(63);__webpack_require__(0);var j=__webpack_require__(9),x=__webpack_require__(27),q=__webpack_require__(65),C=__webpack_require__(102),R=e,O={isMounted:function(e){return!1},enqueueForceUpdate:function(e,r,n){t(e,"forceUpdate")},enqueueReplaceState:function(e,r,n,o){t(e,"replaceState")},enqueueSetState:function(e,r,n,o){t(e,"setState")}},T=O;r.prototype.isReactComponent={},r.prototype.setState=function(e,t){"object"!=typeof e&&"function"!=typeof e&&null!=e&&R("85"),this.updater.enqueueSetState(this,e,t,"setState")},r.prototype.forceUpdate=function(e){this.updater.enqueueForceUpdate(this,e,"forceUpdate")},o.prototype=r.prototype,n.prototype=new o,n.prototype.constructor=n,S(n.prototype,r.prototype),n.prototype.isPureReactComponent=!0;var $={Component:r,PureComponent:n},F=function(e){var t=this;if(t.instancePool.length){var r=t.instancePool.pop();return t.call(r,e),r}return new t(e)},U=function(e,t){var r=this;if(r.instancePool.length){var n=r.instancePool.pop();return r.call(n,e,t),n}return new r(e,t)},I=function(e,t,r){var n=this;if(n.instancePool.length){var o=n.instancePool.pop();return n.call(o,e,t,r),o}return new n(e,t,r)},V=function(e,t,r,n){var o=this;if(o.instancePool.length){var i=o.instancePool.pop();return o.call(i,e,t,r,n),i}return new o(e,t,r,n)},G=function(e){var t=this;e instanceof t||R("25"),e.destructor(),t.instancePool.length<t.poolSize&&t.instancePool.push(e)},M=10,z=F,D=function(e,t){var r=e;return r.instancePool=[],r.getPooled=t||z,r.poolSize||(r.poolSize=M),r.release=G,r},K={addPoolingTo:D,oneArgumentPooler:F,twoArgumentPooler:U,threeArgumentPooler:I,fourArgumentPooler:V},L=K,N={current:null},W=N,B="function"==typeof Symbol&&Symbol.for&&Symbol.for("react.element")||60103,Y=B,H=Object.prototype.hasOwnProperty,J={key:!0,ref:!0,__self:!0,__source:!0},Q=function(e,t,r,n,o,i,a){return{$$typeof:Y,type:e,key:t,ref:r,props:a,_owner:i}};Q.createElement=function(e,t,r){var n,o={},l=null,u=null,c=null,s=null;if(null!=t){i(t)&&(u=t.ref),a(t)&&(l=""+t.key),c=void 0===t.__self?null:t.__self,s=void 0===t.__source?null:t.__source;for(n in t)H.call(t,n)&&!J.hasOwnProperty(n)&&(o[n]=t[n])}var p=arguments.length-2;if(1===p)o.children=r;else if(p>1){for(var f=Array(p),d=0;d<p;d++)f[d]=arguments[d+2];o.children=f}if(e&&e.defaultProps){var h=e.defaultProps;for(n in h)void 0===o[n]&&(o[n]=h[n])}return Q(e,l,u,c,s,W.current,o)},Q.createFactory=function(e){var t=Q.createElement.bind(null,e);return t.type=e,t},Q.cloneAndReplaceKey=function(e,t){return Q(e.type,t,e.ref,e._self,e._source,e._owner,e.props)},Q.cloneElement=function(e,t,r){var n,o=S({},e.props),l=e.key,u=e.ref,c=e._self,s=e._source,p=e._owner;if(null!=t){i(t)&&(u=t.ref,p=W.current),a(t)&&(l=""+t.key);var f;e.type&&e.type.defaultProps&&(f=e.type.defaultProps);for(n in t)H.call(t,n)&&!J.hasOwnProperty(n)&&(void 0===t[n]&&void 0!==f?o[n]=f[n]:o[n]=t[n])}var d=arguments.length-2;if(1===d)o.children=r;else if(d>1){for(var h=Array(d),y=0;y<d;y++)h[y]=arguments[y+2];o.children=h}return Q(e.type,l,u,c,s,p,o)},Q.isValidElement=function(e){return"object"==typeof e&&null!==e&&e.$$typeof===Y};var X=Q,Z="function"==typeof Symbol&&Symbol.iterator,ee="@@iterator",te=l,re={escape:u,unescape:c},ne=re,oe=".",ie=":",ae=f,le=L.twoArgumentPooler,ue=L.fourArgumentPooler,ce=/\/+/g;h.prototype.destructor=function(){this.func=null,this.context=null,this.count=0},L.addPoolingTo(h,le),b.prototype.destructor=function(){this.result=null,this.keyPrefix=null,this.func=null,this.context=null,this.count=0},L.addPoolingTo(b,ue);var se={forEach:m,map:P,mapIntoWithKeyPrefixInternal:g,count:_,toArray:E},pe=se,fe=X.createFactory,de={a:fe("a"),abbr:fe("abbr"),address:fe("address"),area:fe("area"),article:fe("article"),aside:fe("aside"),audio:fe("audio"),b:fe("b"),base:fe("base"),bdi:fe("bdi"),bdo:fe("bdo"),big:fe("big"),blockquote:fe("blockquote"),body:fe("body"),br:fe("br"),button:fe("button"),canvas:fe("canvas"),caption:fe("caption"),cite:fe("cite"),code:fe("code"),col:fe("col"),colgroup:fe("colgroup"),data:fe("data"),datalist:fe("datalist"),dd:fe("dd"),del:fe("del"),details:fe("details"),dfn:fe("dfn"),dialog:fe("dialog"),div:fe("div"),dl:fe("dl"),dt:fe("dt"),em:fe("em"),embed:fe("embed"),fieldset:fe("fieldset"),figcaption:fe("figcaption"),figure:fe("figure"),footer:fe("footer"),form:fe("form"),h1:fe("h1"),h2:fe("h2"),h3:fe("h3"),h4:fe("h4"),h5:fe("h5"),h6:fe("h6"),head:fe("head"),header:fe("header"),hgroup:fe("hgroup"),hr:fe("hr"),html:fe("html"),i:fe("i"),iframe:fe("iframe"),img:fe("img"),input:fe("input"),ins:fe("ins"),kbd:fe("kbd"),keygen:fe("keygen"),label:fe("label"),legend:fe("legend"),li:fe("li"),link:fe("link"),main:fe("main"),map:fe("map"),mark:fe("mark"),menu:fe("menu"),menuitem:fe("menuitem"),meta:fe("meta"),meter:fe("meter"),nav:fe("nav"),noscript:fe("noscript"),object:fe("object"),ol:fe("ol"),optgroup:fe("optgroup"),option:fe("option"),output:fe("output"),p:fe("p"),param:fe("param"),picture:fe("picture"),pre:fe("pre"),progress:fe("progress"),q:fe("q"),rp:fe("rp"),rt:fe("rt"),ruby:fe("ruby"),s:fe("s"),samp:fe("samp"),script:fe("script"),section:fe("section"),select:fe("select"),small:fe("small"),source:fe("source"),span:fe("span"),strong:fe("strong"),style:fe("style"),sub:fe("sub"),summary:fe("summary"),sup:fe("sup"),table:fe("table"),tbody:fe("tbody"),td:fe("td"),textarea:fe("textarea"),tfoot:fe("tfoot"),th:fe("th"),thead:fe("thead"),time:fe("time"),title:fe("title"),tr:fe("tr"),track:fe("track"),u:fe("u"),ul:fe("ul"),var:fe("var"),video:fe("video"),wbr:fe("wbr"),circle:fe("circle"),clipPath:fe("clipPath"),defs:fe("defs"),ellipse:fe("ellipse"),g:fe("g"),image:fe("image"),line:fe("line"),linearGradient:fe("linearGradient"),mask:fe("mask"),path:fe("path"),pattern:fe("pattern"),polygon:fe("polygon"),polyline:fe("polyline"),radialGradient:fe("radialGradient"),rect:fe("rect"),stop:fe("stop"),svg:fe("svg"),text:fe("text"),tspan:fe("tspan")},he=de,ye=x,me="16.0.0-alpha.12",be=w,ve=$.Component,ge=X.isValidElement,Pe=C(ve,ge,T),ke=X.createElement,_e=X.createFactory,Ee=X.cloneElement,we=function(e){return e},Se={Children:{map:pe.map,forEach:pe.forEach,count:pe.count,toArray:pe.toArray,only:be},Component:$.Component,PureComponent:$.PureComponent,createElement:ke,cloneElement:Ee,isValidElement:X.isValidElement,PropTypes:ye,checkPropTypes:q,createClass:Pe,createFactory:_e,createMixin:we,DOM:he,version:me,__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED:{ReactCurrentOwner:W}},Ae=Se;module.exports=Ae;


/***/ }),
/* 145 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var emptyFunction = __webpack_require__(9);
var invariant = __webpack_require__(0);
var warning = __webpack_require__(2);
var assign = __webpack_require__(45);

var ReactPropTypesSecret = __webpack_require__(64);
var checkPropTypes = __webpack_require__(65);

module.exports = function(isValidElement, throwOnDirectAccess) {
  /* global Symbol */
  var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
  var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

  /**
   * Returns the iterator method function contained on the iterable object.
   *
   * Be sure to invoke the function with the iterable as context:
   *
   *     var iteratorFn = getIteratorFn(myIterable);
   *     if (iteratorFn) {
   *       var iterator = iteratorFn.call(myIterable);
   *       ...
   *     }
   *
   * @param {?object} maybeIterable
   * @return {?function}
   */
  function getIteratorFn(maybeIterable) {
    var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
    if (typeof iteratorFn === 'function') {
      return iteratorFn;
    }
  }

  /**
   * Collection of methods that allow declaration and validation of props that are
   * supplied to React components. Example usage:
   *
   *   var Props = require('ReactPropTypes');
   *   var MyArticle = React.createClass({
   *     propTypes: {
   *       // An optional string prop named "description".
   *       description: Props.string,
   *
   *       // A required enum prop named "category".
   *       category: Props.oneOf(['News','Photos']).isRequired,
   *
   *       // A prop named "dialog" that requires an instance of Dialog.
   *       dialog: Props.instanceOf(Dialog).isRequired
   *     },
   *     render: function() { ... }
   *   });
   *
   * A more formal specification of how these methods are used:
   *
   *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
   *   decl := ReactPropTypes.{type}(.isRequired)?
   *
   * Each and every declaration produces a function with the same signature. This
   * allows the creation of custom validation functions. For example:
   *
   *  var MyLink = React.createClass({
   *    propTypes: {
   *      // An optional string or URI prop named "href".
   *      href: function(props, propName, componentName) {
   *        var propValue = props[propName];
   *        if (propValue != null && typeof propValue !== 'string' &&
   *            !(propValue instanceof URI)) {
   *          return new Error(
   *            'Expected a string or an URI for ' + propName + ' in ' +
   *            componentName
   *          );
   *        }
   *      }
   *    },
   *    render: function() {...}
   *  });
   *
   * @internal
   */

  var ANONYMOUS = '<<anonymous>>';

  // Important!
  // Keep this list in sync with production version in `./factoryWithThrowingShims.js`.
  var ReactPropTypes = {
    array: createPrimitiveTypeChecker('array'),
    bool: createPrimitiveTypeChecker('boolean'),
    func: createPrimitiveTypeChecker('function'),
    number: createPrimitiveTypeChecker('number'),
    object: createPrimitiveTypeChecker('object'),
    string: createPrimitiveTypeChecker('string'),
    symbol: createPrimitiveTypeChecker('symbol'),

    any: createAnyTypeChecker(),
    arrayOf: createArrayOfTypeChecker,
    element: createElementTypeChecker(),
    instanceOf: createInstanceTypeChecker,
    node: createNodeChecker(),
    objectOf: createObjectOfTypeChecker,
    oneOf: createEnumTypeChecker,
    oneOfType: createUnionTypeChecker,
    shape: createShapeTypeChecker,
    exact: createStrictShapeTypeChecker,
  };

  /**
   * inlined Object.is polyfill to avoid requiring consumers ship their own
   * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
   */
  /*eslint-disable no-self-compare*/
  function is(x, y) {
    // SameValue algorithm
    if (x === y) {
      // Steps 1-5, 7-10
      // Steps 6.b-6.e: +0 != -0
      return x !== 0 || 1 / x === 1 / y;
    } else {
      // Step 6.a: NaN == NaN
      return x !== x && y !== y;
    }
  }
  /*eslint-enable no-self-compare*/

  /**
   * We use an Error-like object for backward compatibility as people may call
   * PropTypes directly and inspect their output. However, we don't use real
   * Errors anymore. We don't inspect their stack anyway, and creating them
   * is prohibitively expensive if they are created too often, such as what
   * happens in oneOfType() for any type before the one that matched.
   */
  function PropTypeError(message) {
    this.message = message;
    this.stack = '';
  }
  // Make `instanceof Error` still work for returned errors.
  PropTypeError.prototype = Error.prototype;

  function createChainableTypeChecker(validate) {
    if (process.env.NODE_ENV !== 'production') {
      var manualPropTypeCallCache = {};
      var manualPropTypeWarningCount = 0;
    }
    function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
      componentName = componentName || ANONYMOUS;
      propFullName = propFullName || propName;

      if (secret !== ReactPropTypesSecret) {
        if (throwOnDirectAccess) {
          // New behavior only for users of `prop-types` package
          invariant(
            false,
            'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
            'Use `PropTypes.checkPropTypes()` to call them. ' +
            'Read more at http://fb.me/use-check-prop-types'
          );
        } else if (process.env.NODE_ENV !== 'production' && typeof console !== 'undefined') {
          // Old behavior for people using React.PropTypes
          var cacheKey = componentName + ':' + propName;
          if (
            !manualPropTypeCallCache[cacheKey] &&
            // Avoid spamming the console because they are often not actionable except for lib authors
            manualPropTypeWarningCount < 3
          ) {
            warning(
              false,
              'You are manually calling a React.PropTypes validation ' +
              'function for the `%s` prop on `%s`. This is deprecated ' +
              'and will throw in the standalone `prop-types` package. ' +
              'You may be seeing this warning due to a third-party PropTypes ' +
              'library. See https://fb.me/react-warning-dont-call-proptypes ' + 'for details.',
              propFullName,
              componentName
            );
            manualPropTypeCallCache[cacheKey] = true;
            manualPropTypeWarningCount++;
          }
        }
      }
      if (props[propName] == null) {
        if (isRequired) {
          if (props[propName] === null) {
            return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required ' + ('in `' + componentName + '`, but its value is `null`.'));
          }
          return new PropTypeError('The ' + location + ' `' + propFullName + '` is marked as required in ' + ('`' + componentName + '`, but its value is `undefined`.'));
        }
        return null;
      } else {
        return validate(props, propName, componentName, location, propFullName);
      }
    }

    var chainedCheckType = checkType.bind(null, false);
    chainedCheckType.isRequired = checkType.bind(null, true);

    return chainedCheckType;
  }

  function createPrimitiveTypeChecker(expectedType) {
    function validate(props, propName, componentName, location, propFullName, secret) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== expectedType) {
        // `propValue` being instance of, say, date/regexp, pass the 'object'
        // check, but we can offer a more precise error message here rather than
        // 'of type `object`'.
        var preciseType = getPreciseType(propValue);

        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createAnyTypeChecker() {
    return createChainableTypeChecker(emptyFunction.thatReturnsNull);
  }

  function createArrayOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
      }
      var propValue = props[propName];
      if (!Array.isArray(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
      }
      for (var i = 0; i < propValue.length; i++) {
        var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createElementTypeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      if (!isValidElement(propValue)) {
        var propType = getPropType(propValue);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createInstanceTypeChecker(expectedClass) {
    function validate(props, propName, componentName, location, propFullName) {
      if (!(props[propName] instanceof expectedClass)) {
        var expectedClassName = expectedClass.name || ANONYMOUS;
        var actualClassName = getClassName(props[propName]);
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createEnumTypeChecker(expectedValues) {
    if (!Array.isArray(expectedValues)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      for (var i = 0; i < expectedValues.length; i++) {
        if (is(propValue, expectedValues[i])) {
          return null;
        }
      }

      var valuesString = JSON.stringify(expectedValues);
      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createObjectOfTypeChecker(typeChecker) {
    function validate(props, propName, componentName, location, propFullName) {
      if (typeof typeChecker !== 'function') {
        return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
      }
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
      }
      for (var key in propValue) {
        if (propValue.hasOwnProperty(key)) {
          var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
          if (error instanceof Error) {
            return error;
          }
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createUnionTypeChecker(arrayOfTypeCheckers) {
    if (!Array.isArray(arrayOfTypeCheckers)) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
      return emptyFunction.thatReturnsNull;
    }

    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (typeof checker !== 'function') {
        warning(
          false,
          'Invalid argument supplied to oneOfType. Expected an array of check functions, but ' +
          'received %s at index %s.',
          getPostfixForTypeWarning(checker),
          i
        );
        return emptyFunction.thatReturnsNull;
      }
    }

    function validate(props, propName, componentName, location, propFullName) {
      for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
        var checker = arrayOfTypeCheckers[i];
        if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
          return null;
        }
      }

      return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
    }
    return createChainableTypeChecker(validate);
  }

  function createNodeChecker() {
    function validate(props, propName, componentName, location, propFullName) {
      if (!isNode(props[propName])) {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      for (var key in shapeTypes) {
        var checker = shapeTypes[key];
        if (!checker) {
          continue;
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }
    return createChainableTypeChecker(validate);
  }

  function createStrictShapeTypeChecker(shapeTypes) {
    function validate(props, propName, componentName, location, propFullName) {
      var propValue = props[propName];
      var propType = getPropType(propValue);
      if (propType !== 'object') {
        return new PropTypeError('Invalid ' + location + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
      }
      // We need to check all keys in case some are required but missing from
      // props.
      var allKeys = assign({}, props[propName], shapeTypes);
      for (var key in allKeys) {
        var checker = shapeTypes[key];
        if (!checker) {
          return new PropTypeError(
            'Invalid ' + location + ' `' + propFullName + '` key `' + key + '` supplied to `' + componentName + '`.' +
            '\nBad object: ' + JSON.stringify(props[propName], null, '  ') +
            '\nValid keys: ' +  JSON.stringify(Object.keys(shapeTypes), null, '  ')
          );
        }
        var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error) {
          return error;
        }
      }
      return null;
    }

    return createChainableTypeChecker(validate);
  }

  function isNode(propValue) {
    switch (typeof propValue) {
      case 'number':
      case 'string':
      case 'undefined':
        return true;
      case 'boolean':
        return !propValue;
      case 'object':
        if (Array.isArray(propValue)) {
          return propValue.every(isNode);
        }
        if (propValue === null || isValidElement(propValue)) {
          return true;
        }

        var iteratorFn = getIteratorFn(propValue);
        if (iteratorFn) {
          var iterator = iteratorFn.call(propValue);
          var step;
          if (iteratorFn !== propValue.entries) {
            while (!(step = iterator.next()).done) {
              if (!isNode(step.value)) {
                return false;
              }
            }
          } else {
            // Iterator will provide entry [k,v] tuples rather than values.
            while (!(step = iterator.next()).done) {
              var entry = step.value;
              if (entry) {
                if (!isNode(entry[1])) {
                  return false;
                }
              }
            }
          }
        } else {
          return false;
        }

        return true;
      default:
        return false;
    }
  }

  function isSymbol(propType, propValue) {
    // Native Symbol.
    if (propType === 'symbol') {
      return true;
    }

    // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
    if (propValue['@@toStringTag'] === 'Symbol') {
      return true;
    }

    // Fallback for non-spec compliant Symbols which are polyfilled.
    if (typeof Symbol === 'function' && propValue instanceof Symbol) {
      return true;
    }

    return false;
  }

  // Equivalent of `typeof` but with special handling for array and regexp.
  function getPropType(propValue) {
    var propType = typeof propValue;
    if (Array.isArray(propValue)) {
      return 'array';
    }
    if (propValue instanceof RegExp) {
      // Old webkits (at least until Android 4.0) return 'function' rather than
      // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
      // passes PropTypes.object.
      return 'object';
    }
    if (isSymbol(propType, propValue)) {
      return 'symbol';
    }
    return propType;
  }

  // This handles more types than `getPropType`. Only used for error messages.
  // See `createPrimitiveTypeChecker`.
  function getPreciseType(propValue) {
    if (typeof propValue === 'undefined' || propValue === null) {
      return '' + propValue;
    }
    var propType = getPropType(propValue);
    if (propType === 'object') {
      if (propValue instanceof Date) {
        return 'date';
      } else if (propValue instanceof RegExp) {
        return 'regexp';
      }
    }
    return propType;
  }

  // Returns a string that is postfixed to a warning about an invalid type.
  // For example, "undefined" or "of type array"
  function getPostfixForTypeWarning(value) {
    var type = getPreciseType(value);
    switch (type) {
      case 'array':
      case 'object':
        return 'an ' + type;
      case 'boolean':
      case 'date':
      case 'regexp':
        return 'a ' + type;
      default:
        return type;
    }
  }

  // Returns class name of the object, if any.
  function getClassName(propValue) {
    if (!propValue.constructor || !propValue.constructor.name) {
      return ANONYMOUS;
    }
    return propValue.constructor.name;
  }

  ReactPropTypes.checkPropTypes = checkPropTypes;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 146 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */



var emptyFunction = __webpack_require__(9);
var invariant = __webpack_require__(0);
var ReactPropTypesSecret = __webpack_require__(64);

module.exports = function() {
  function shim(props, propName, componentName, location, propFullName, secret) {
    if (secret === ReactPropTypesSecret) {
      // It is still safe when called from React.
      return;
    }
    invariant(
      false,
      'Calling PropTypes validators directly is not supported by the `prop-types` package. ' +
      'Use PropTypes.checkPropTypes() to call them. ' +
      'Read more at http://fb.me/use-check-prop-types'
    );
  };
  shim.isRequired = shim;
  function getShim() {
    return shim;
  };
  // Important!
  // Keep this list in sync with production version in `./factoryWithTypeCheckers.js`.
  var ReactPropTypes = {
    array: shim,
    bool: shim,
    func: shim,
    number: shim,
    object: shim,
    string: shim,
    symbol: shim,

    any: shim,
    arrayOf: getShim,
    element: shim,
    instanceOf: getShim,
    node: shim,
    objectOf: getShim,
    oneOf: getShim,
    oneOfType: getShim,
    shape: getShim,
    exact: getShim
  };

  ReactPropTypes.checkPropTypes = emptyFunction;
  ReactPropTypes.PropTypes = ReactPropTypes;

  return ReactPropTypes;
};


/***/ }),
/* 147 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var objectAssign$1 = __webpack_require__(45);
var warning = __webpack_require__(2);
var emptyObject = __webpack_require__(63);
var invariant = __webpack_require__(0);
var emptyFunction = __webpack_require__(9);
var checkPropTypes = __webpack_require__(65);
var propTypes = __webpack_require__(27);
var factory = __webpack_require__(102);

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule reactProdInvariant
 * 
 */

function warnNoop(publicInstance, callerName) {
  {
    var constructor = publicInstance.constructor;
    warning(false, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op.\n\nPlease check the code for the %s component.', callerName, callerName, constructor && (constructor.displayName || constructor.name) || 'ReactClass');
  }
}

/**
 * This is the abstract API for an update queue.
 */
var ReactNoopUpdateQueue = {
  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance, callback, callerName) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState, callback, callerName) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @param {?function} callback Called after component is updated.
   * @param {?string} Name of the calling function in the public API.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState, callback, callerName) {
    warnNoop(publicInstance, 'setState');
  }
};

var ReactNoopUpdateQueue_1 = ReactNoopUpdateQueue;

/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 * @providesModule canDefineProperty
 */

var canDefineProperty$1 = false;
{
  try {
    // $FlowFixMe https://github.com/facebook/flow/issues/285
    Object.defineProperty({}, 'x', { get: function () {} });
    canDefineProperty$1 = true;
  } catch (x) {
    // IE will fail on defineProperty
  }
}

var canDefineProperty_1 = canDefineProperty$1;

/**
 * Base class helpers for the updating state of a component.
 */
function ReactComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue_1;
}

ReactComponent.prototype.isReactComponent = {};

/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
ReactComponent.prototype.setState = function (partialState, callback) {
  !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : void 0;
  this.updater.enqueueSetState(this, partialState, callback, 'setState');
};

/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */
ReactComponent.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this, callback, 'forceUpdate');
};

/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */
{
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };
  var defineDeprecationWarning = function (methodName, info) {
    if (canDefineProperty_1) {
      Object.defineProperty(ReactComponent.prototype, methodName, {
        get: function () {
          warning(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]);
          return undefined;
        }
      });
    }
  };
  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

/**
 * Base class helpers for the updating state of a component.
 */
function ReactPureComponent(props, context, updater) {
  // Duplicated from ReactComponent.
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue_1;
}

function ComponentDummy() {}
ComponentDummy.prototype = ReactComponent.prototype;
ReactPureComponent.prototype = new ComponentDummy();
ReactPureComponent.prototype.constructor = ReactPureComponent;
// Avoid an extra prototype jump for these methods.
objectAssign$1(ReactPureComponent.prototype, ReactComponent.prototype);
ReactPureComponent.prototype.isPureReactComponent = true;

var ReactBaseClasses = {
  Component: ReactComponent,
  PureComponent: ReactPureComponent
};

/**
 * Static poolers. Several custom versions for each potential number of
 * arguments. A completely generic pooler is easy to implement, but would
 * require accessing the `arguments` object. In each of these, `this` refers to
 * the Class itself, not an instance. If any others are needed, simply add them
 * here, or in their own files.
 */
var oneArgumentPooler = function (copyFieldsFrom) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};

var twoArgumentPooler$1 = function (a1, a2) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2);
    return instance;
  } else {
    return new Klass(a1, a2);
  }
};

var threeArgumentPooler = function (a1, a2, a3) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3);
    return instance;
  } else {
    return new Klass(a1, a2, a3);
  }
};

var fourArgumentPooler$1 = function (a1, a2, a3, a4) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4);
  }
};

var standardReleaser = function (instance) {
  var Klass = this;
  !(instance instanceof Klass) ? invariant(false, 'Trying to release an instance into a pool of a different type.') : void 0;
  instance.destructor();
  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

var DEFAULT_POOL_SIZE = 10;
var DEFAULT_POOLER = oneArgumentPooler;

/**
 * Augments `CopyConstructor` to be a poolable class, augmenting only the class
 * itself (statically) not adding any prototypical fields. Any CopyConstructor
 * you give this may have a `poolSize` property, and will look for a
 * prototypical `destructor` on instances.
 *
 * @param {Function} CopyConstructor Constructor that can be used to reset.
 * @param {Function} pooler Customizable pooler.
 */
var addPoolingTo = function (CopyConstructor, pooler) {
  // Casting as any so that flow ignores the actual implementation and trusts
  // it to match the type we declared
  var NewKlass = CopyConstructor;
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER;
  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE;
  }
  NewKlass.release = standardReleaser;
  return NewKlass;
};

var PooledClass = {
  addPoolingTo: addPoolingTo,
  oneArgumentPooler: oneArgumentPooler,
  twoArgumentPooler: twoArgumentPooler$1,
  threeArgumentPooler: threeArgumentPooler,
  fourArgumentPooler: fourArgumentPooler$1
};

var PooledClass_1 = PooledClass;

/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactCurrentOwner
 * 
 */

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */
var ReactCurrentOwner = {
  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null
};

var ReactCurrentOwner_1 = ReactCurrentOwner;

/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactElementSymbol
 * 
 */

// The Symbol used to tag the ReactElement type. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.

var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

var ReactElementSymbol = REACT_ELEMENT_TYPE;

var hasOwnProperty = Object.prototype.hasOwnProperty;



var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};

var specialPropKeyWarningShown;
var specialPropRefWarningShown;

function hasValidRef(config) {
  {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.ref !== undefined;
}

function hasValidKey(config) {
  {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  var warnAboutAccessingKey = function () {
    if (!specialPropKeyWarningShown) {
      specialPropKeyWarningShown = true;
      warning(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
    }
  };
  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    if (!specialPropRefWarningShown) {
      specialPropRefWarningShown = true;
      warning(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName);
    }
  };
  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, no instanceof check
 * will work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} key
 * @param {string|object} ref
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @param {*} owner
 * @param {*} props
 * @internal
 */
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allow us to uniquely identify this as a React Element
    $$typeof: ReactElementSymbol,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner
  };

  {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    if (canDefineProperty_1) {
      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      });
      // self and source are DEV only properties.
      Object.defineProperty(element, '_self', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      });
      // Two elements created in two different places should be considered
      // equal for testing purposes and therefore we hide it from enumeration.
      Object.defineProperty(element, '_source', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });
    } else {
      element._store.validated = false;
      element._self = self;
      element._source = source;
    }
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};

/**
 * Create and return a new ReactElement of the given type.
 * See https://facebook.github.io/react/docs/react-api.html#createelement
 */
ReactElement.createElement = function (type, config, children) {
  var propName;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    {
      if (Object.freeze) {
        Object.freeze(childArray);
      }
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  {
    if (key || ref) {
      if (typeof props.$$typeof === 'undefined' || props.$$typeof !== ReactElementSymbol) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }
  }
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner_1.current, props);
};

/**
 * Return a function that produces ReactElements of a given type.
 * See https://facebook.github.io/react/docs/react-api.html#createfactory
 */
ReactElement.createFactory = function (type) {
  var factory$$1 = ReactElement.createElement.bind(null, type);
  // Expose the type on the factory and the prototype so that it can be
  // easily accessed on elements. E.g. `<Foo />.type === Foo`.
  // This should not be named `constructor` since this may not be the function
  // that created the element, and it may not even be a constructor.
  // Legacy hook TODO: Warn if this is accessed
  factory$$1.type = type;
  return factory$$1;
};

ReactElement.cloneAndReplaceKey = function (oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

  return newElement;
};

/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://facebook.github.io/react/docs/react-api.html#cloneelement
 */
ReactElement.cloneElement = function (element, config, children) {
  var propName;

  // Original props are copied
  var props = objectAssign$1({}, element.props);

  // Reserved names are extracted
  var key = element.key;
  var ref = element.ref;
  // Self is preserved since the owner is preserved.
  var self = element._self;
  // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.
  var source = element._source;

  // Owner will be preserved, unless ref is overridden
  var owner = element._owner;

  if (config != null) {
    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner_1.current;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    // Remaining properties override existing props
    var defaultProps;
    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
};

/**
 * Verifies the object is a ReactElement.
 * See https://facebook.github.io/react/docs/react-api.html#isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a valid component.
 * @final
 */
ReactElement.isValidElement = function (object) {
  return typeof object === 'object' && object !== null && object.$$typeof === ReactElementSymbol;
};

var ReactElement_1 = ReactElement;

/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getIteratorFn
 * 
 */

/* global Symbol */

var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

/**
 * Returns the iterator method function contained on the iterable object.
 *
 * Be sure to invoke the function with the iterable as context:
 *
 *     var iteratorFn = getIteratorFn(myIterable);
 *     if (iteratorFn) {
 *       var iterator = iteratorFn.call(myIterable);
 *       ...
 *     }
 *
 * @param {?object} maybeIterable
 * @return {?function}
 */
function getIteratorFn(maybeIterable) {
  var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }
}

var getIteratorFn_1 = getIteratorFn;

/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule KeyEscapeUtils
 * 
 */

/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */

function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

/**
 * Unescape and unwrap key for human-readable display
 *
 * @param {string} key to unescape.
 * @return {string} the unescaped key.
 */
function unescape(key) {
  var unescapeRegex = /(=0|=2)/g;
  var unescaperLookup = {
    '=0': '=',
    '=2': ':'
  };
  var keySubstring = key[0] === '.' && key[1] === '$' ? key.substring(2) : key.substring(1);

  return ('' + keySubstring).replace(unescapeRegex, function (match) {
    return unescaperLookup[match];
  });
}

var KeyEscapeUtils = {
  escape: escape,
  unescape: unescape
};

var KeyEscapeUtils_1 = KeyEscapeUtils;

/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactTypeOfWork
 * 
 */

var ReactTypeOfWork = {
  IndeterminateComponent: 0, // Before we know whether it is functional or class
  FunctionalComponent: 1,
  ClassComponent: 2,
  HostRoot: 3, // Root of a host tree. Could be nested inside another node.
  HostPortal: 4, // A subtree. Could be an entry point to a different renderer.
  HostComponent: 5,
  HostText: 6,
  CoroutineComponent: 7,
  CoroutineHandlerPhase: 8,
  YieldComponent: 9,
  Fragment: 10
};

/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getComponentName
 * 
 */

function getComponentName(instanceOrFiber) {
  if (typeof instanceOrFiber.getName === 'function') {
    // Stack reconciler
    var instance = instanceOrFiber;
    return instance.getName();
  }
  if (typeof instanceOrFiber.tag === 'number') {
    // Fiber reconciler
    var fiber = instanceOrFiber;
    var type = fiber.type;

    if (typeof type === 'string') {
      return type;
    }
    if (typeof type === 'function') {
      return type.displayName || type.name;
    }
  }
  return null;
}

var getComponentName_1 = getComponentName;

var IndeterminateComponent = ReactTypeOfWork.IndeterminateComponent;
var FunctionalComponent = ReactTypeOfWork.FunctionalComponent;
var ClassComponent = ReactTypeOfWork.ClassComponent;
var HostComponent = ReactTypeOfWork.HostComponent;



function describeComponentFrame$1(name, source, ownerName) {
  return '\n    in ' + (name || 'Unknown') + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
}

function describeFiber(fiber) {
  switch (fiber.tag) {
    case IndeterminateComponent:
    case FunctionalComponent:
    case ClassComponent:
    case HostComponent:
      var owner = fiber._debugOwner;
      var source = fiber._debugSource;
      var name = getComponentName_1(fiber);
      var ownerName = null;
      if (owner) {
        ownerName = getComponentName_1(owner);
      }
      return describeComponentFrame$1(name, source, ownerName);
    default:
      return '';
  }
}

// This function can only be called with a work-in-progress fiber and
// only during begin or complete phase. Do not call it under any other
// circumstances.
function getStackAddendumByWorkInProgressFiber$1(workInProgress) {
  var info = '';
  var node = workInProgress;
  do {
    info += describeFiber(node);
    // Otherwise this return pointer might point to the wrong tree:
    node = node['return'];
  } while (node);
  return info;
}

var ReactFiberComponentTreeHook = {
  getStackAddendumByWorkInProgressFiber: getStackAddendumByWorkInProgressFiber$1,
  describeComponentFrame: describeComponentFrame$1
};

var getStackAddendumByWorkInProgressFiber = ReactFiberComponentTreeHook.getStackAddendumByWorkInProgressFiber;
var describeComponentFrame = ReactFiberComponentTreeHook.describeComponentFrame;





function isNative(fn) {
  // Based on isNative() from Lodash
  var funcToString = Function.prototype.toString;
  var reIsNative = RegExp('^' + funcToString
  // Take an example native function source for comparison
  .call(Object.prototype.hasOwnProperty)
  // Strip regex characters so we can use it for regex
  .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  // Remove hasOwnProperty from the template to make it generic
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
  try {
    var source = funcToString.call(fn);
    return reIsNative.test(source);
  } catch (err) {
    return false;
  }
}

var canUseCollections =
// Array.from
typeof Array.from === 'function' &&
// Map
typeof Map === 'function' && isNative(Map) &&
// Map.prototype.keys
Map.prototype != null && typeof Map.prototype.keys === 'function' && isNative(Map.prototype.keys) &&
// Set
typeof Set === 'function' && isNative(Set) &&
// Set.prototype.keys
Set.prototype != null && typeof Set.prototype.keys === 'function' && isNative(Set.prototype.keys);

var setItem;
var getItem;
var removeItem;
var getItemIDs;
var addRoot;
var removeRoot;
var getRootIDs;

if (canUseCollections) {
  var itemMap = new Map();
  var rootIDSet = new Set();

  setItem = function (id, item) {
    itemMap.set(id, item);
  };
  getItem = function (id) {
    return itemMap.get(id);
  };
  removeItem = function (id) {
    itemMap['delete'](id);
  };
  getItemIDs = function () {
    return Array.from(itemMap.keys());
  };

  addRoot = function (id) {
    rootIDSet.add(id);
  };
  removeRoot = function (id) {
    rootIDSet['delete'](id);
  };
  getRootIDs = function () {
    return Array.from(rootIDSet.keys());
  };
} else {
  var itemByKey = {};
  var rootByKey = {};

  // Use non-numeric keys to prevent V8 performance issues:
  // https://github.com/facebook/react/pull/7232
  var getKeyFromID = function (id) {
    return '.' + id;
  };
  var getIDFromKey = function (key) {
    return parseInt(key.substr(1), 10);
  };

  setItem = function (id, item) {
    var key = getKeyFromID(id);
    itemByKey[key] = item;
  };
  getItem = function (id) {
    var key = getKeyFromID(id);
    return itemByKey[key];
  };
  removeItem = function (id) {
    var key = getKeyFromID(id);
    delete itemByKey[key];
  };
  getItemIDs = function () {
    return Object.keys(itemByKey).map(getIDFromKey);
  };

  addRoot = function (id) {
    var key = getKeyFromID(id);
    rootByKey[key] = true;
  };
  removeRoot = function (id) {
    var key = getKeyFromID(id);
    delete rootByKey[key];
  };
  getRootIDs = function () {
    return Object.keys(rootByKey).map(getIDFromKey);
  };
}

var unmountedIDs = [];

function purgeDeep(id) {
  var item = getItem(id);
  if (item) {
    var childIDs = item.childIDs;

    removeItem(id);
    childIDs.forEach(purgeDeep);
  }
}

function getDisplayName(element) {
  if (element == null) {
    return '#empty';
  } else if (typeof element === 'string' || typeof element === 'number') {
    return '#text';
  } else if (typeof element.type === 'string') {
    return element.type;
  } else {
    return element.type.displayName || element.type.name || 'Unknown';
  }
}

function describeID(id) {
  var name = ReactComponentTreeHook.getDisplayName(id);
  var element = ReactComponentTreeHook.getElement(id);
  var ownerID = ReactComponentTreeHook.getOwnerID(id);
  var ownerName = void 0;

  if (ownerID) {
    ownerName = ReactComponentTreeHook.getDisplayName(ownerID);
  }
  warning(element, 'ReactComponentTreeHook: Missing React element for debugID %s when ' + 'building stack', id);
  return describeComponentFrame(name || '', element && element._source, ownerName || '');
}

var ReactComponentTreeHook = {
  onSetChildren: function (id, nextChildIDs) {
    var item = getItem(id);
    invariant(item, 'Item must have been set');
    item.childIDs = nextChildIDs;

    for (var i = 0; i < nextChildIDs.length; i++) {
      var nextChildID = nextChildIDs[i];
      var nextChild = getItem(nextChildID);
      !nextChild ? invariant(false, 'Expected hook events to fire for the child before its parent includes it in onSetChildren().') : void 0;
      !(nextChild.childIDs != null || typeof nextChild.element !== 'object' || nextChild.element == null) ? invariant(false, 'Expected onSetChildren() to fire for a container child before its parent includes it in onSetChildren().') : void 0;
      !nextChild.isMounted ? invariant(false, 'Expected onMountComponent() to fire for the child before its parent includes it in onSetChildren().') : void 0;
      if (nextChild.parentID == null) {
        nextChild.parentID = id;
        // TODO: This shouldn't be necessary but mounting a new root during in
        // componentWillMount currently causes not-yet-mounted components to
        // be purged from our tree data so their parent id is missing.
      }
      !(nextChild.parentID === id) ? invariant(false, 'Expected onBeforeMountComponent() parent and onSetChildren() to be consistent (%s has parents %s and %s).', nextChildID, nextChild.parentID, id) : void 0;
    }
  },
  onBeforeMountComponent: function (id, element, parentID) {
    var item = {
      element: element,
      parentID: parentID,
      text: null,
      childIDs: [],
      isMounted: false,
      updateCount: 0
    };
    setItem(id, item);
  },
  onBeforeUpdateComponent: function (id, element) {
    var item = getItem(id);
    if (!item || !item.isMounted) {
      // We may end up here as a result of setState() in componentWillUnmount().
      // In this case, ignore the element.
      return;
    }
    item.element = element;
  },
  onMountComponent: function (id) {
    var item = getItem(id);
    invariant(item, 'Item must have been set');
    item.isMounted = true;
    var isRoot = item.parentID === 0;
    if (isRoot) {
      addRoot(id);
    }
  },
  onUpdateComponent: function (id) {
    var item = getItem(id);
    if (!item || !item.isMounted) {
      // We may end up here as a result of setState() in componentWillUnmount().
      // In this case, ignore the element.
      return;
    }
    item.updateCount++;
  },
  onUnmountComponent: function (id) {
    var item = getItem(id);
    if (item) {
      // We need to check if it exists.
      // `item` might not exist if it is inside an error boundary, and a sibling
      // error boundary child threw while mounting. Then this instance never
      // got a chance to mount, but it still gets an unmounting event during
      // the error boundary cleanup.
      item.isMounted = false;
      var isRoot = item.parentID === 0;
      if (isRoot) {
        removeRoot(id);
      }
    }
    unmountedIDs.push(id);
  },
  purgeUnmountedComponents: function () {
    if (ReactComponentTreeHook._preventPurging) {
      // Should only be used for testing.
      return;
    }

    for (var i = 0; i < unmountedIDs.length; i++) {
      var id = unmountedIDs[i];
      purgeDeep(id);
    }
    unmountedIDs.length = 0;
  },
  isMounted: function (id) {
    var item = getItem(id);
    return item ? item.isMounted : false;
  },
  getCurrentStackAddendum: function (topElement) {
    var info = '';
    if (topElement) {
      var name = getDisplayName(topElement);
      var owner = topElement._owner;
      info += describeComponentFrame(name, topElement._source, owner && getComponentName_1(owner));
    }

    var currentOwner = ReactCurrentOwner_1.current;
    if (currentOwner) {
      if (typeof currentOwner.tag === 'number') {
        var workInProgress = currentOwner;
        // Safe because if current owner exists, we are reconciling,
        // and it is guaranteed to be the work-in-progress version.
        info += getStackAddendumByWorkInProgressFiber(workInProgress);
      } else if (typeof currentOwner._debugID === 'number') {
        info += ReactComponentTreeHook.getStackAddendumByID(currentOwner._debugID);
      }
    }
    return info;
  },
  getStackAddendumByID: function (id) {
    var info = '';
    while (id) {
      info += describeID(id);
      id = ReactComponentTreeHook.getParentID(id);
    }
    return info;
  },
  getChildIDs: function (id) {
    var item = getItem(id);
    return item ? item.childIDs : [];
  },
  getDisplayName: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (!element) {
      return null;
    }
    return getDisplayName(element);
  },
  getElement: function (id) {
    var item = getItem(id);
    return item ? item.element : null;
  },
  getOwnerID: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (!element || !element._owner) {
      return null;
    }
    return element._owner._debugID;
  },
  getParentID: function (id) {
    var item = getItem(id);
    return item ? item.parentID : null;
  },
  getSource: function (id) {
    var item = getItem(id);
    var element = item ? item.element : null;
    var source = element != null ? element._source : null;
    return source;
  },
  getText: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (typeof element === 'string') {
      return element;
    } else if (typeof element === 'number') {
      return '' + element;
    } else {
      return null;
    }
  },
  getUpdateCount: function (id) {
    var item = getItem(id);
    return item ? item.updateCount : 0;
  },


  getRootIDs: getRootIDs,
  getRegisteredIDs: getItemIDs
};

var ReactComponentTreeHook_1 = ReactComponentTreeHook;

{
  var _require = ReactComponentTreeHook_1,
      getCurrentStackAddendum = _require.getCurrentStackAddendum;
}

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

/**
 * This is inlined from ReactElement since this file is shared between
 * isomorphic and renderers. We could extract this to a
 *
 */

/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */

var didWarnAboutMaps = false;

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (typeof component === 'object' && component !== null && component.key != null) {
    // Explicit key
    return KeyEscapeUtils_1.escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  if (children === null || type === 'string' || type === 'number' ||
  // The following is inlined from ReactElement. This means we can optimize
  // some checks. React Fiber also inlines this logic for similar purposes.
  type === 'object' && children.$$typeof === ReactElementSymbol) {
    callback(traverseContext, children,
    // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = getIteratorFn_1(children);
    if (iteratorFn) {
      {
        // Warn about using Maps as children
        if (iteratorFn === children.entries) {
          warning(didWarnAboutMaps, 'Using Maps as children is unsupported and will likely yield ' + 'unexpected results. Convert it to a sequence/iterable of keyed ' + 'ReactElements instead.%s', getCurrentStackAddendum());
          didWarnAboutMaps = true;
        }
      }

      var iterator = iteratorFn.call(children);
      var step;
      var ii = 0;
      while (!(step = iterator.next()).done) {
        child = step.value;
        nextName = nextNamePrefix + getComponentKey(child, ii++);
        subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
      }
    } else if (type === 'object') {
      var addendum = '';
      {
        addendum = ' If you meant to render a collection of children, use an array ' + 'instead.' + getCurrentStackAddendum();
      }
      var childrenString = '' + children;
      invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum);
    }
  }

  return subtreeCount;
}

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

var traverseAllChildren_1 = traverseAllChildren;

var twoArgumentPooler = PooledClass_1.twoArgumentPooler;
var fourArgumentPooler = PooledClass_1.fourArgumentPooler;

var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * traversal. Allows avoiding binding callbacks.
 *
 * @constructor ForEachBookKeeping
 * @param {!function} forEachFunction Function to perform traversal with.
 * @param {?*} forEachContext Context to perform context with.
 */
function ForEachBookKeeping(forEachFunction, forEachContext) {
  this.func = forEachFunction;
  this.context = forEachContext;
  this.count = 0;
}
ForEachBookKeeping.prototype.destructor = function () {
  this.func = null;
  this.context = null;
  this.count = 0;
};
PooledClass_1.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);

function forEachSingleChild(bookKeeping, child, name) {
  var func = bookKeeping.func,
      context = bookKeeping.context;

  func.call(context, child, bookKeeping.count++);
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://facebook.github.io/react/docs/react-api.html#react.children.foreach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }
  var traverseContext = ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
  traverseAllChildren_1(children, forEachSingleChild, traverseContext);
  ForEachBookKeeping.release(traverseContext);
}

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * mapping. Allows avoiding binding callbacks.
 *
 * @constructor MapBookKeeping
 * @param {!*} mapResult Object containing the ordered map of results.
 * @param {!function} mapFunction Function to perform mapping with.
 * @param {?*} mapContext Context to perform mapping with.
 */
function MapBookKeeping(mapResult, keyPrefix, mapFunction, mapContext) {
  this.result = mapResult;
  this.keyPrefix = keyPrefix;
  this.func = mapFunction;
  this.context = mapContext;
  this.count = 0;
}
MapBookKeeping.prototype.destructor = function () {
  this.result = null;
  this.keyPrefix = null;
  this.func = null;
  this.context = null;
  this.count = 0;
};
PooledClass_1.addPoolingTo(MapBookKeeping, fourArgumentPooler);

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result,
      keyPrefix = bookKeeping.keyPrefix,
      func = bookKeeping.func,
      context = bookKeeping.context;


  var mappedChild = func.call(context, child, bookKeeping.count++);
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
  } else if (mappedChild != null) {
    if (ReactElement_1.isValidElement(mappedChild)) {
      mappedChild = ReactElement_1.cloneAndReplaceKey(mappedChild,
      // Keep both the (mapped) and old keys if they differ, just as
      // traverseAllChildren used to do for objects as children
      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
    }
    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = MapBookKeeping.getPooled(array, escapedPrefix, func, context);
  traverseAllChildren_1(children, mapSingleChildIntoContext, traverseContext);
  MapBookKeeping.release(traverseContext);
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://facebook.github.io/react/docs/react-api.html#react.children.map
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}

function forEachSingleChildDummy(traverseContext, child, name) {
  return null;
}

/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://facebook.github.io/react/docs/react-api.html#react.children.count
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children, context) {
  return traverseAllChildren_1(children, forEachSingleChildDummy, null);
}

/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://facebook.github.io/react/docs/react-api.html#react.children.toarray
 */
function toArray(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
  return result;
}

var ReactChildren = {
  forEach: forEachChildren,
  map: mapChildren,
  mapIntoWithKeyPrefixInternal: mapIntoWithKeyPrefixInternal,
  count: countChildren,
  toArray: toArray
};

var ReactChildren_1 = ReactChildren;

var ReactDebugCurrentFrame$1 = {};

{
  var _require$2 = ReactComponentTreeHook_1,
      getStackAddendumByID = _require$2.getStackAddendumByID,
      getCurrentStackAddendum$2 = _require$2.getCurrentStackAddendum;

  var _require2$1 = ReactFiberComponentTreeHook,
      getStackAddendumByWorkInProgressFiber$2 = _require2$1.getStackAddendumByWorkInProgressFiber;

  // Component that is being worked on


  ReactDebugCurrentFrame$1.current = null;

  // Element that is being cloned or created
  ReactDebugCurrentFrame$1.element = null;

  ReactDebugCurrentFrame$1.getStackAddendum = function () {
    var stack = null;
    var current = ReactDebugCurrentFrame$1.current;
    var element = ReactDebugCurrentFrame$1.element;
    if (current !== null) {
      if (typeof current === 'number') {
        // DebugID from Stack.
        var debugID = current;
        stack = getStackAddendumByID(debugID);
      } else if (typeof current.tag === 'number') {
        // This is a Fiber.
        // The stack will only be correct if this is a work in progress
        // version and we're calling it during reconciliation.
        var workInProgress = current;
        stack = getStackAddendumByWorkInProgressFiber$2(workInProgress);
      }
    } else if (element !== null) {
      stack = getCurrentStackAddendum$2(element);
    }
    return stack;
  };
}

var ReactDebugCurrentFrame_1 = ReactDebugCurrentFrame$1;

{
  var checkPropTypes$1 = checkPropTypes;
  var warning$2 = warning;
  var ReactDebugCurrentFrame = ReactDebugCurrentFrame_1;

  var _require$1 = ReactComponentTreeHook_1,
      getCurrentStackAddendum$1 = _require$1.getCurrentStackAddendum;
}

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner_1.current) {
    var name = getComponentName_1(ReactCurrentOwner_1.current);
    if (name) {
      return '\n\nCheck the render method of `' + name + '`.';
    }
  }
  return '';
}

function getSourceInfoErrorAddendum(elementProps) {
  if (elementProps !== null && elementProps !== undefined && elementProps.__source !== undefined) {
    var source = elementProps.__source;
    var fileName = source.fileName.replace(/^.*[\\\/]/, '');
    var lineNumber = source.lineNumber;
    return '\n\nCheck your code at ' + fileName + ':' + lineNumber + '.';
  }
  return '';
}

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */
var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
    if (parentName) {
      info = '\n\nCheck the top-level render call using <' + parentName + '>.';
    }
  }
  return info;
}

/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */
function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }
  element._store.validated = true;

  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
  if (ownerHasKeyUseWarning[currentComponentErrorInfo]) {
    return;
  }
  ownerHasKeyUseWarning[currentComponentErrorInfo] = true;

  // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.
  var childOwner = '';
  if (element && element._owner && element._owner !== ReactCurrentOwner_1.current) {
    // Give the component that originally created this child.
    childOwner = ' It was passed a child from ' + getComponentName_1(element._owner) + '.';
  }

  warning$2(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.%s', currentComponentErrorInfo, childOwner, getCurrentStackAddendum$1(element));
}

/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */
function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }
  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];
      if (ReactElement_1.isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (ReactElement_1.isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    var iteratorFn = getIteratorFn_1(node);
    // Entry iterators provide implicit keys.
    if (iteratorFn) {
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step;
        while (!(step = iterator.next()).done) {
          if (ReactElement_1.isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}

/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */
function validatePropTypes(element) {
  var componentClass = element.type;
  if (typeof componentClass !== 'function') {
    return;
  }
  var name = componentClass.displayName || componentClass.name;

  // ReactNative `View.propTypes` have been deprecated in favor of `ViewPropTypes`.
  // In their place a temporary getter has been added with a deprecated warning message.
  // Avoid triggering that warning during validation using the temporary workaround,
  // __propTypesSecretDontUseThesePlease.
  // TODO (bvaughn) Revert this particular change any time after April 1 ReactNative tag.
  var propTypes$$1 = typeof componentClass.__propTypesSecretDontUseThesePlease === 'object' ? componentClass.__propTypesSecretDontUseThesePlease : componentClass.propTypes;

  if (propTypes$$1) {
    checkPropTypes$1(propTypes$$1, element.props, 'prop', name, ReactDebugCurrentFrame.getStackAddendum);
  }
  if (typeof componentClass.getDefaultProps === 'function') {
    warning$2(componentClass.getDefaultProps.isReactClassApproved, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.');
  }
}

var ReactElementValidator$2 = {
  createElement: function (type, props, children) {
    var validType = typeof type === 'string' || typeof type === 'function';
    // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.
    if (!validType) {
      var info = '';
      if (type === undefined || typeof type === 'object' && type !== null && Object.keys(type).length === 0) {
        info += ' You likely forgot to export your component from the file ' + "it's defined in.";
      }

      var sourceInfo = getSourceInfoErrorAddendum(props);
      if (sourceInfo) {
        info += sourceInfo;
      } else {
        info += getDeclarationErrorAddendum();
      }

      info += getCurrentStackAddendum$1();

      warning$2(false, 'React.createElement: type is invalid -- expected a string (for ' + 'built-in components) or a class/function (for composite ' + 'components) but got: %s.%s', type == null ? type : typeof type, info);
    }

    var element = ReactElement_1.createElement.apply(this, arguments);

    // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.
    if (element == null) {
      return element;
    }

    {
      ReactDebugCurrentFrame.element = element;
    }

    // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)
    if (validType) {
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
    }

    validatePropTypes(element);

    {
      ReactDebugCurrentFrame.element = null;
    }

    return element;
  },

  createFactory: function (type) {
    var validatedFactory = ReactElementValidator$2.createElement.bind(null, type);
    // Legacy hook TODO: Warn if this is accessed
    validatedFactory.type = type;

    {
      if (canDefineProperty_1) {
        Object.defineProperty(validatedFactory, 'type', {
          enumerable: false,
          get: function () {
            warning$2(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.');
            Object.defineProperty(this, 'type', {
              value: type
            });
            return type;
          }
        });
      }
    }

    return validatedFactory;
  },

  cloneElement: function (element, props, children) {
    var newElement = ReactElement_1.cloneElement.apply(this, arguments);
    {
      ReactDebugCurrentFrame.element = newElement;
    }
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], newElement.type);
    }
    validatePropTypes(newElement);
    {
      ReactDebugCurrentFrame.element = null;
    }
    return newElement;
  }
};

var ReactElementValidator_1 = ReactElementValidator$2;

/**
 * Create a factory that creates HTML tag elements.
 *
 * @private
 */
var createDOMFactory = ReactElement_1.createFactory;
{
  var ReactElementValidator$1 = ReactElementValidator_1;
  createDOMFactory = ReactElementValidator$1.createFactory;
}

/**
 * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
 *
 * @public
 */
var ReactDOMFactories = {
  a: createDOMFactory('a'),
  abbr: createDOMFactory('abbr'),
  address: createDOMFactory('address'),
  area: createDOMFactory('area'),
  article: createDOMFactory('article'),
  aside: createDOMFactory('aside'),
  audio: createDOMFactory('audio'),
  b: createDOMFactory('b'),
  base: createDOMFactory('base'),
  bdi: createDOMFactory('bdi'),
  bdo: createDOMFactory('bdo'),
  big: createDOMFactory('big'),
  blockquote: createDOMFactory('blockquote'),
  body: createDOMFactory('body'),
  br: createDOMFactory('br'),
  button: createDOMFactory('button'),
  canvas: createDOMFactory('canvas'),
  caption: createDOMFactory('caption'),
  cite: createDOMFactory('cite'),
  code: createDOMFactory('code'),
  col: createDOMFactory('col'),
  colgroup: createDOMFactory('colgroup'),
  data: createDOMFactory('data'),
  datalist: createDOMFactory('datalist'),
  dd: createDOMFactory('dd'),
  del: createDOMFactory('del'),
  details: createDOMFactory('details'),
  dfn: createDOMFactory('dfn'),
  dialog: createDOMFactory('dialog'),
  div: createDOMFactory('div'),
  dl: createDOMFactory('dl'),
  dt: createDOMFactory('dt'),
  em: createDOMFactory('em'),
  embed: createDOMFactory('embed'),
  fieldset: createDOMFactory('fieldset'),
  figcaption: createDOMFactory('figcaption'),
  figure: createDOMFactory('figure'),
  footer: createDOMFactory('footer'),
  form: createDOMFactory('form'),
  h1: createDOMFactory('h1'),
  h2: createDOMFactory('h2'),
  h3: createDOMFactory('h3'),
  h4: createDOMFactory('h4'),
  h5: createDOMFactory('h5'),
  h6: createDOMFactory('h6'),
  head: createDOMFactory('head'),
  header: createDOMFactory('header'),
  hgroup: createDOMFactory('hgroup'),
  hr: createDOMFactory('hr'),
  html: createDOMFactory('html'),
  i: createDOMFactory('i'),
  iframe: createDOMFactory('iframe'),
  img: createDOMFactory('img'),
  input: createDOMFactory('input'),
  ins: createDOMFactory('ins'),
  kbd: createDOMFactory('kbd'),
  keygen: createDOMFactory('keygen'),
  label: createDOMFactory('label'),
  legend: createDOMFactory('legend'),
  li: createDOMFactory('li'),
  link: createDOMFactory('link'),
  main: createDOMFactory('main'),
  map: createDOMFactory('map'),
  mark: createDOMFactory('mark'),
  menu: createDOMFactory('menu'),
  menuitem: createDOMFactory('menuitem'),
  meta: createDOMFactory('meta'),
  meter: createDOMFactory('meter'),
  nav: createDOMFactory('nav'),
  noscript: createDOMFactory('noscript'),
  object: createDOMFactory('object'),
  ol: createDOMFactory('ol'),
  optgroup: createDOMFactory('optgroup'),
  option: createDOMFactory('option'),
  output: createDOMFactory('output'),
  p: createDOMFactory('p'),
  param: createDOMFactory('param'),
  picture: createDOMFactory('picture'),
  pre: createDOMFactory('pre'),
  progress: createDOMFactory('progress'),
  q: createDOMFactory('q'),
  rp: createDOMFactory('rp'),
  rt: createDOMFactory('rt'),
  ruby: createDOMFactory('ruby'),
  s: createDOMFactory('s'),
  samp: createDOMFactory('samp'),
  script: createDOMFactory('script'),
  section: createDOMFactory('section'),
  select: createDOMFactory('select'),
  small: createDOMFactory('small'),
  source: createDOMFactory('source'),
  span: createDOMFactory('span'),
  strong: createDOMFactory('strong'),
  style: createDOMFactory('style'),
  sub: createDOMFactory('sub'),
  summary: createDOMFactory('summary'),
  sup: createDOMFactory('sup'),
  table: createDOMFactory('table'),
  tbody: createDOMFactory('tbody'),
  td: createDOMFactory('td'),
  textarea: createDOMFactory('textarea'),
  tfoot: createDOMFactory('tfoot'),
  th: createDOMFactory('th'),
  thead: createDOMFactory('thead'),
  time: createDOMFactory('time'),
  title: createDOMFactory('title'),
  tr: createDOMFactory('tr'),
  track: createDOMFactory('track'),
  u: createDOMFactory('u'),
  ul: createDOMFactory('ul'),
  'var': createDOMFactory('var'),
  video: createDOMFactory('video'),
  wbr: createDOMFactory('wbr'),

  // SVG
  circle: createDOMFactory('circle'),
  clipPath: createDOMFactory('clipPath'),
  defs: createDOMFactory('defs'),
  ellipse: createDOMFactory('ellipse'),
  g: createDOMFactory('g'),
  image: createDOMFactory('image'),
  line: createDOMFactory('line'),
  linearGradient: createDOMFactory('linearGradient'),
  mask: createDOMFactory('mask'),
  path: createDOMFactory('path'),
  pattern: createDOMFactory('pattern'),
  polygon: createDOMFactory('polygon'),
  polyline: createDOMFactory('polyline'),
  radialGradient: createDOMFactory('radialGradient'),
  rect: createDOMFactory('rect'),
  stop: createDOMFactory('stop'),
  svg: createDOMFactory('svg'),
  text: createDOMFactory('text'),
  tspan: createDOMFactory('tspan')
};

var ReactDOMFactories_1 = ReactDOMFactories;

var ReactPropTypes = propTypes;

/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactVersion
 */

var ReactVersion = '16.0.0-alpha.12';

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://facebook.github.io/react/docs/react-api.html#react.children.only
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */
function onlyChild(children) {
  !ReactElement_1.isValidElement(children) ? invariant(false, 'React.Children.only expected to receive a single React element child.') : void 0;
  return children;
}

var onlyChild_1 = onlyChild;

var Component = ReactBaseClasses.Component;

var isValidElement = ReactElement_1.isValidElement;




var createClass = factory(Component, isValidElement, ReactNoopUpdateQueue_1);

var createElement = ReactElement_1.createElement;
var createFactory = ReactElement_1.createFactory;
var cloneElement = ReactElement_1.cloneElement;

{
  var warning$1 = warning;
  var canDefineProperty = canDefineProperty_1;
  var ReactElementValidator = ReactElementValidator_1;
  createElement = ReactElementValidator.createElement;
  createFactory = ReactElementValidator.createFactory;
  cloneElement = ReactElementValidator.cloneElement;
}

var createMixin = function (mixin) {
  return mixin;
};

var React = {
  // Modern

  Children: {
    map: ReactChildren_1.map,
    forEach: ReactChildren_1.forEach,
    count: ReactChildren_1.count,
    toArray: ReactChildren_1.toArray,
    only: onlyChild_1
  },

  Component: ReactBaseClasses.Component,
  PureComponent: ReactBaseClasses.PureComponent,

  createElement: createElement,
  cloneElement: cloneElement,
  isValidElement: ReactElement_1.isValidElement,

  // TODO (bvaughn) Remove these getters before 16.0.0
  PropTypes: ReactPropTypes,
  checkPropTypes: checkPropTypes,
  createClass: createClass,

  // Classic

  createFactory: createFactory,
  createMixin: createMixin,

  // This looks DOM specific but these are actually isomorphic helpers
  // since they are just generating DOM strings.
  DOM: ReactDOMFactories_1,

  version: ReactVersion,

  __SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED: {
    ReactCurrentOwner: ReactCurrentOwner_1
  }
};

{
  objectAssign$1(React.__SECRET_INTERNALS_DO_NOT_USE_OR_YOU_WILL_BE_FIRED, {
    // These should not be included in production.
    ReactComponentTreeHook: ReactComponentTreeHook_1,
    ReactDebugCurrentFrame: ReactDebugCurrentFrame_1
  });

  var warnedForCheckPropTypes = false;
  var warnedForCreateMixin = false;
  var warnedForCreateClass = false;
  var warnedForPropTypes = false;

  React.createMixin = function (mixin) {
    warning$1(warnedForCreateMixin, 'React.createMixin is deprecated and should not be used. You ' + 'can use this mixin directly instead.');
    warnedForCreateMixin = true;
    return mixin;
  };

  // TODO (bvaughn) Remove all of these accessors before 16.0.0
  if (canDefineProperty) {
    Object.defineProperty(React, 'checkPropTypes', {
      get: function () {
        warning$1(warnedForCheckPropTypes, 'checkPropTypes has been moved to a separate package. ' + 'Accessing React.checkPropTypes is no longer supported ' + 'and will be removed completely in React 16. ' + 'Use the prop-types package on npm instead. ' + '(https://fb.me/migrating-from-react-proptypes)');
        warnedForCheckPropTypes = true;
        return checkPropTypes;
      }
    });

    Object.defineProperty(React, 'createClass', {
      get: function () {
        warning$1(warnedForCreateClass, 'React.createClass is no longer supported. Use a plain JavaScript ' + "class instead. If you're not yet ready to migrate, " + 'create-react-class is available on npm as a drop-in replacement. ' + '(https://fb.me/migrating-from-react-create-class)');
        warnedForCreateClass = true;
        return createClass;
      }
    });

    Object.defineProperty(React, 'PropTypes', {
      get: function () {
        warning$1(warnedForPropTypes, 'PropTypes has been moved to a separate package. ' + 'Accessing React.PropTypes is no longer supported ' + 'and will be removed completely in React 16. ' + 'Use the prop-types package on npm instead. ' + '(https://fb.me/migrating-from-react-proptypes)');
        warnedForPropTypes = true;
        return ReactPropTypes;
      }
    });
  }

  // React.DOM factories are deprecated. Wrap these methods so that
  // invocations of the React.DOM namespace and alert users to switch
  // to the `react-addons-dom-factories` package.
  React.DOM = {};
  var warnedForFactories = false;
  Object.keys(ReactDOMFactories_1).forEach(function (factory$$1) {
    React.DOM[factory$$1] = function () {
      if (!warnedForFactories) {
        warning$1(false, 'Accessing factories like React.DOM.%s has been deprecated ' + 'and will be removed in the future. Use the ' + 'react-addons-dom-factories package instead.', factory$$1);
        warnedForFactories = true;
      }
      return ReactDOMFactories_1[factory$$1].apply(ReactDOMFactories_1, arguments);
    };
  });
}

var React_1 = React;

module.exports = React_1;


/***/ }),
/* 148 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(!(function webpackMissingModule() { var e = new Error("Cannot find module \"react/lib/ReactDOM\""); e.code = 'MODULE_NOT_FOUND'; throw e; }()));


/***/ }),
/* 149 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = __webpack_require__(66);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(21);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(108);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(22);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(23);

var _inherits3 = _interopRequireDefault(_inherits2);

var _react = __webpack_require__(7);

var _react2 = _interopRequireDefault(_react);

var _reactRelay = __webpack_require__(81);

var _reactRelay2 = _interopRequireDefault(_reactRelay);

var _Table = __webpack_require__(271);

var _AppRoute = __webpack_require__(278);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var App = function (_React$Component) {
  (0, _inherits3.default)(App, _React$Component);

  function App() {
    (0, _classCallCheck3.default)(this, App);
    return (0, _possibleConstructorReturn3.default)(this, (App.__proto__ || (0, _getPrototypeOf2.default)(App)).apply(this, arguments));
  }

  (0, _createClass3.default)(App, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(_reactRelay2.default.RootContainer, { Component: _Table.Table, route: new _AppRoute.AppRoute() });
    }
  }]);
  return App;
}(_react2.default.Component);

exports.default = App;

/***/ }),
/* 150 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(151);
module.exports = __webpack_require__(10).Object.getPrototypeOf;


/***/ }),
/* 151 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 Object.getPrototypeOf(O)
var toObject = __webpack_require__(67);
var $getPrototypeOf = __webpack_require__(103);

__webpack_require__(104)('getPrototypeOf', function () {
  return function getPrototypeOf(it) {
    return $getPrototypeOf(toObject(it));
  };
});


/***/ }),
/* 152 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 153 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(154);
var $Object = __webpack_require__(10).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),
/* 154 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(13);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(14), 'Object', { defineProperty: __webpack_require__(20).f });


/***/ }),
/* 155 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(156), __esModule: true };

/***/ }),
/* 156 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(157);
__webpack_require__(164);
module.exports = __webpack_require__(78).f('iterator');


/***/ }),
/* 157 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(158)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(111)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 158 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(72);
var defined = __webpack_require__(68);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 159 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(75);
var descriptor = __webpack_require__(47);
var setToStringTag = __webpack_require__(77);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(28)(IteratorPrototype, __webpack_require__(32)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 160 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(31);
var toLength = __webpack_require__(161);
var toAbsoluteIndex = __webpack_require__(162);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 161 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.15 ToLength
var toInteger = __webpack_require__(72);
var min = Math.min;
module.exports = function (it) {
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};


/***/ }),
/* 162 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(72);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 163 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(12).document;
module.exports = document && document.documentElement;


/***/ }),
/* 164 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(165);
var global = __webpack_require__(12);
var hide = __webpack_require__(28);
var Iterators = __webpack_require__(74);
var TO_STRING_TAG = __webpack_require__(32)('toStringTag');

var DOMIterables = ('CSSRuleList,CSSStyleDeclaration,CSSValueList,ClientRectList,DOMRectList,DOMStringList,' +
  'DOMTokenList,DataTransferItemList,FileList,HTMLAllCollection,HTMLCollection,HTMLFormElement,HTMLSelectElement,' +
  'MediaList,MimeTypeArray,NamedNodeMap,NodeList,PaintRequestList,Plugin,PluginArray,SVGLengthList,SVGNumberList,' +
  'SVGPathSegList,SVGPointList,SVGStringList,SVGTransformList,SourceBufferList,StyleSheetList,TextTrackCueList,' +
  'TextTrackList,TouchList').split(',');

for (var i = 0; i < DOMIterables.length; i++) {
  var NAME = DOMIterables[i];
  var Collection = global[NAME];
  var proto = Collection && Collection.prototype;
  if (proto && !proto[TO_STRING_TAG]) hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}


/***/ }),
/* 165 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var addToUnscopables = __webpack_require__(166);
var step = __webpack_require__(167);
var Iterators = __webpack_require__(74);
var toIObject = __webpack_require__(31);

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = __webpack_require__(111)(Array, 'Array', function (iterated, kind) {
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var kind = this._k;
  var index = this._i++;
  if (!O || index >= O.length) {
    this._t = undefined;
    return step(1);
  }
  if (kind == 'keys') return step(0, index);
  if (kind == 'values') return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');


/***/ }),
/* 166 */
/***/ (function(module, exports) {

module.exports = function () { /* empty */ };


/***/ }),
/* 167 */
/***/ (function(module, exports) {

module.exports = function (done, value) {
  return { value: value, done: !!done };
};


/***/ }),
/* 168 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(169), __esModule: true };

/***/ }),
/* 169 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(170);
__webpack_require__(174);
__webpack_require__(175);
__webpack_require__(176);
module.exports = __webpack_require__(10).Symbol;


/***/ }),
/* 170 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// ECMAScript 6 symbols shim
var global = __webpack_require__(12);
var has = __webpack_require__(19);
var DESCRIPTORS = __webpack_require__(14);
var $export = __webpack_require__(13);
var redefine = __webpack_require__(112);
var META = __webpack_require__(117).KEY;
var $fails = __webpack_require__(30);
var shared = __webpack_require__(70);
var setToStringTag = __webpack_require__(77);
var uid = __webpack_require__(46);
var wks = __webpack_require__(32);
var wksExt = __webpack_require__(78);
var wksDefine = __webpack_require__(79);
var enumKeys = __webpack_require__(171);
var isArray = __webpack_require__(172);
var anObject = __webpack_require__(37);
var toIObject = __webpack_require__(31);
var toPrimitive = __webpack_require__(71);
var createDesc = __webpack_require__(47);
var _create = __webpack_require__(75);
var gOPNExt = __webpack_require__(173);
var $GOPD = __webpack_require__(119);
var $DP = __webpack_require__(20);
var $keys = __webpack_require__(48);
var gOPD = $GOPD.f;
var dP = $DP.f;
var gOPN = gOPNExt.f;
var $Symbol = global.Symbol;
var $JSON = global.JSON;
var _stringify = $JSON && $JSON.stringify;
var PROTOTYPE = 'prototype';
var HIDDEN = wks('_hidden');
var TO_PRIMITIVE = wks('toPrimitive');
var isEnum = {}.propertyIsEnumerable;
var SymbolRegistry = shared('symbol-registry');
var AllSymbols = shared('symbols');
var OPSymbols = shared('op-symbols');
var ObjectProto = Object[PROTOTYPE];
var USE_NATIVE = typeof $Symbol == 'function';
var QObject = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function () {
  return _create(dP({}, 'a', {
    get: function () { return dP(this, 'a', { value: 7 }).a; }
  })).a != 7;
}) ? function (it, key, D) {
  var protoDesc = gOPD(ObjectProto, key);
  if (protoDesc) delete ObjectProto[key];
  dP(it, key, D);
  if (protoDesc && it !== ObjectProto) dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function (tag) {
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function (it) {
  return typeof it == 'symbol';
} : function (it) {
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D) {
  if (it === ObjectProto) $defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if (has(AllSymbols, key)) {
    if (!D.enumerable) {
      if (!has(it, HIDDEN)) dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if (has(it, HIDDEN) && it[HIDDEN][key]) it[HIDDEN][key] = false;
      D = _create(D, { enumerable: createDesc(0, false) });
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P) {
  anObject(it);
  var keys = enumKeys(P = toIObject(P));
  var i = 0;
  var l = keys.length;
  var key;
  while (l > i) $defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P) {
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key) {
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if (this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key) {
  it = toIObject(it);
  key = toPrimitive(key, true);
  if (it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key)) return;
  var D = gOPD(it, key);
  if (D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key])) D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it) {
  var names = gOPN(toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META) result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it) {
  var IS_OP = it === ObjectProto;
  var names = gOPN(IS_OP ? OPSymbols : toIObject(it));
  var result = [];
  var i = 0;
  var key;
  while (names.length > i) {
    if (has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true)) result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if (!USE_NATIVE) {
  $Symbol = function Symbol() {
    if (this instanceof $Symbol) throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function (value) {
      if (this === ObjectProto) $set.call(OPSymbols, value);
      if (has(this, HIDDEN) && has(this[HIDDEN], tag)) this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if (DESCRIPTORS && setter) setSymbolDesc(ObjectProto, tag, { configurable: true, set: $set });
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString() {
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f = $defineProperty;
  __webpack_require__(118).f = gOPNExt.f = $getOwnPropertyNames;
  __webpack_require__(49).f = $propertyIsEnumerable;
  __webpack_require__(80).f = $getOwnPropertySymbols;

  if (DESCRIPTORS && !__webpack_require__(73)) {
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function (name) {
    return wrap(wks(name));
  };
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, { Symbol: $Symbol });

for (var es6Symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), j = 0; es6Symbols.length > j;)wks(es6Symbols[j++]);

for (var wellKnownSymbols = $keys(wks.store), k = 0; wellKnownSymbols.length > k;) wksDefine(wellKnownSymbols[k++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function (key) {
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(sym) {
    if (!isSymbol(sym)) throw TypeError(sym + ' is not a symbol!');
    for (var key in SymbolRegistry) if (SymbolRegistry[key] === sym) return key;
  },
  useSetter: function () { setter = true; },
  useSimple: function () { setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function () {
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({ a: S }) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it) {
    if (it === undefined || isSymbol(it)) return; // IE8 returns string on undefined
    var args = [it];
    var i = 1;
    var replacer, $replacer;
    while (arguments.length > i) args.push(arguments[i++]);
    replacer = args[1];
    if (typeof replacer == 'function') $replacer = replacer;
    if ($replacer || !isArray(replacer)) replacer = function (key, value) {
      if ($replacer) value = $replacer.call(this, key, value);
      if (!isSymbol(value)) return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || __webpack_require__(28)($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);


/***/ }),
/* 171 */
/***/ (function(module, exports, __webpack_require__) {

// all enumerable object keys, includes symbols
var getKeys = __webpack_require__(48);
var gOPS = __webpack_require__(80);
var pIE = __webpack_require__(49);
module.exports = function (it) {
  var result = getKeys(it);
  var getSymbols = gOPS.f;
  if (getSymbols) {
    var symbols = getSymbols(it);
    var isEnum = pIE.f;
    var i = 0;
    var key;
    while (symbols.length > i) if (isEnum.call(it, key = symbols[i++])) result.push(key);
  } return result;
};


/***/ }),
/* 172 */
/***/ (function(module, exports, __webpack_require__) {

// 7.2.2 IsArray(argument)
var cof = __webpack_require__(116);
module.exports = Array.isArray || function isArray(arg) {
  return cof(arg) == 'Array';
};


/***/ }),
/* 173 */
/***/ (function(module, exports, __webpack_require__) {

// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = __webpack_require__(31);
var gOPN = __webpack_require__(118).f;
var toString = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function (it) {
  try {
    return gOPN(it);
  } catch (e) {
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it) {
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};


/***/ }),
/* 174 */
/***/ (function(module, exports) {



/***/ }),
/* 175 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(79)('asyncIterator');


/***/ }),
/* 176 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(79)('observable');


/***/ }),
/* 177 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(178), __esModule: true };

/***/ }),
/* 178 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(179);
module.exports = __webpack_require__(10).Object.setPrototypeOf;


/***/ }),
/* 179 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = __webpack_require__(13);
$export($export.S, 'Object', { setPrototypeOf: __webpack_require__(180).set });


/***/ }),
/* 180 */
/***/ (function(module, exports, __webpack_require__) {

// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = __webpack_require__(29);
var anObject = __webpack_require__(37);
var check = function (O, proto) {
  anObject(O);
  if (!isObject(proto) && proto !== null) throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function (test, buggy, set) {
      try {
        set = __webpack_require__(105)(Function.call, __webpack_require__(119).f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch (e) { buggy = true; }
      return function setPrototypeOf(O, proto) {
        check(O, proto);
        if (buggy) O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};


/***/ }),
/* 181 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(182), __esModule: true };

/***/ }),
/* 182 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(183);
var $Object = __webpack_require__(10).Object;
module.exports = function create(P, D) {
  return $Object.create(P, D);
};


/***/ }),
/* 183 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(13);
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', { create: __webpack_require__(75) });


/***/ }),
/* 184 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactRelayPublic
 * 
 * @format
 */



var _require = __webpack_require__(50),
    commitLocalUpdate = _require.commitLocalUpdate,
    commitMutation = _require.commitMutation,
    fetchQuery = _require.fetchQuery,
    graphql = _require.graphql,
    requestSubscription = _require.requestSubscription;

/**
 * The public interface to React Relay.
 */
module.exports = {
  QueryRenderer: __webpack_require__(258),
  createFragmentContainer: __webpack_require__(266).createContainer,
  createPaginationContainer: __webpack_require__(268).createContainer,
  createRefetchContainer: __webpack_require__(270).createContainer,
  commitLocalUpdate: commitLocalUpdate,
  commitMutation: commitMutation,
  fetchQuery: fetchQuery,
  graphql: graphql,
  requestSubscription: requestSubscription
};

/***/ }),
/* 185 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayRuntime
 * 
 * @format
 */



// As early as possible, check for the existence of the JavaScript globals which
// Relay Runtime relies upon, and produce a clear message if they do not exist.
if (process.env.NODE_ENV !== 'production') {
  if (typeof Map !== 'function' || typeof Set !== 'function' || typeof Promise !== 'function' || typeof Object.assign !== 'function') {
    throw new Error('relay-runtime requires Map, Set, Promise, and Object.assign to exist. ' + 'Use a polyfill to provide these for older browsers.');
  }
}

/**
 * The public interface to Relay Runtime.
 */
module.exports = {
  // Core API
  Environment: __webpack_require__(186),
  Network: __webpack_require__(235),
  Observable: __webpack_require__(59),
  QueryResponseCache: __webpack_require__(238),
  RecordSource: __webpack_require__(24),
  Store: __webpack_require__(239),

  areEqualSelectors: __webpack_require__(11).areEqualSelectors,
  createFragmentSpecResolver: __webpack_require__(11).createFragmentSpecResolver,
  createOperationSelector: __webpack_require__(11).createOperationSelector,
  getDataIDsFromObject: __webpack_require__(11).getDataIDsFromObject,
  getFragment: __webpack_require__(58).getFragment,
  getOperation: __webpack_require__(58).getOperation,
  getSelector: __webpack_require__(11).getSelector,
  getSelectorList: __webpack_require__(11).getSelectorList,
  getSelectorsFromObject: __webpack_require__(11).getSelectorsFromObject,
  getVariablesFromObject: __webpack_require__(11).getVariablesFromObject,
  graphql: __webpack_require__(58).graphql,

  // Extensions
  ConnectionHandler: __webpack_require__(15),
  ViewerHandler: __webpack_require__(122),

  // Helpers (can be implemented via the above API)
  applyOptimisticMutation: __webpack_require__(253),
  commitLocalUpdate: __webpack_require__(254),
  commitMutation: __webpack_require__(255),
  fetchQuery: __webpack_require__(256),
  isRelayModernEnvironment: __webpack_require__(96),
  requestSubscription: __webpack_require__(257),

  // Configuration interface for legacy or special uses
  ConnectionInterface: __webpack_require__(16)
};

if (process.env.NODE_ENV !== 'production') {
  var RelayRecordSourceInspector = __webpack_require__(94);

  // Debugging-related symbols exposed only in development
  Object.assign(module.exports, {
    RecordSourceInspector: RelayRecordSourceInspector
  });
}
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 186 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, global) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayModernEnvironment
 * 
 * @format
 */



var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var RelayModernEnvironment = function () {
  function RelayModernEnvironment(config) {
    var _this = this;

    (0, _classCallCheck3['default'])(this, RelayModernEnvironment);

    this.configName = config.configName;
    var handlerProvider = config.handlerProvider ? config.handlerProvider : __webpack_require__(187);
    this._network = config.network;
    this._publishQueue = new (__webpack_require__(196))(config.store, handlerProvider);
    this._store = config.store;
    this.unstable_internal = __webpack_require__(11);

    this.__setNet = function (newNet) {
      return _this._network = newNet;
    };

    // TODO(#21781004): This adds support for the older Relay Debugger, which
    // has been replaced with the Relay DevTools global hook below. This logic
    // should stick around for a release or two to not break support for the
    // existing debugger. After allowing time to migrate to latest versions,
    // this code can be removed.
    if (process.env.NODE_ENV !== 'production') {
      var g = typeof global !== 'undefined' ? global : window;

      // Attach the debugger symbol to the global symbol so it can be accessed by
      // devtools extension.
      if (!g.__RELAY_DEBUGGER__) {
        var _require = __webpack_require__(211),
            RelayDebugger = _require.RelayDebugger;

        g.__RELAY_DEBUGGER__ = new RelayDebugger();
      }

      // Setup the runtime part for Native
      if (typeof g.registerDevtoolsPlugin === 'function') {
        try {
          g.registerDevtoolsPlugin(__webpack_require__(213));
        } catch (error) {
          // No debugger for you.
        }
      }

      var envId = g.__RELAY_DEBUGGER__.registerEnvironment(this);
      this._debugger = g.__RELAY_DEBUGGER__.getEnvironmentDebugger(envId);
    } else {
      this._debugger = null;
    }

    // Register this Relay Environment with Relay DevTools if it exists.
    // Note: this must always be the last step in the constructor.
    var _global = typeof global !== 'undefined' ? global : typeof window !== 'undefined' ? window : undefined;
    var devToolsHook = _global && _global.__RELAY_DEVTOOLS_HOOK__;
    if (devToolsHook) {
      devToolsHook.registerEnvironment(this);
    }
  }

  RelayModernEnvironment.prototype.getStore = function getStore() {
    return this._store;
  };

  RelayModernEnvironment.prototype.getNetwork = function getNetwork() {
    return this._network;
  };

  RelayModernEnvironment.prototype.getDebugger = function getDebugger() {
    return this._debugger;
  };

  RelayModernEnvironment.prototype.applyUpdate = function applyUpdate(optimisticUpdate) {
    var _this2 = this;

    var dispose = function dispose() {
      _this2._publishQueue.revertUpdate(optimisticUpdate);
      _this2._publishQueue.run();
    };
    this._publishQueue.applyUpdate(optimisticUpdate);
    this._publishQueue.run();
    return { dispose: dispose };
  };

  RelayModernEnvironment.prototype.revertUpdate = function revertUpdate(update) {
    this._publishQueue.revertUpdate(update);
    this._publishQueue.run();
  };

  RelayModernEnvironment.prototype.replaceUpdate = function replaceUpdate(update, newUpdate) {
    this._publishQueue.revertUpdate(update);
    this._publishQueue.applyUpdate(newUpdate);
    this._publishQueue.run();
  };

  RelayModernEnvironment.prototype.applyMutation = function applyMutation(_ref) {
    var operation = _ref.operation,
        optimisticResponse = _ref.optimisticResponse,
        optimisticUpdater = _ref.optimisticUpdater;

    return this.applyUpdate({
      operation: operation,
      selectorStoreUpdater: optimisticUpdater,
      response: optimisticResponse || null
    });
  };

  RelayModernEnvironment.prototype.check = function check(readSelector) {
    return this._store.check(readSelector);
  };

  RelayModernEnvironment.prototype.commitPayload = function commitPayload(operationSelector, payload) {
    // Do not handle stripped nulls when commiting a payload
    var relayPayload = __webpack_require__(42)(operationSelector.root, payload);
    this._publishQueue.commitPayload(operationSelector, relayPayload);
    this._publishQueue.run();
  };

  RelayModernEnvironment.prototype.commitUpdate = function commitUpdate(updater) {
    this._publishQueue.commitUpdate(updater);
    this._publishQueue.run();
  };

  RelayModernEnvironment.prototype.lookup = function lookup(readSelector) {
    return this._store.lookup(readSelector);
  };

  RelayModernEnvironment.prototype.subscribe = function subscribe(snapshot, callback) {
    return this._store.subscribe(snapshot, callback);
  };

  RelayModernEnvironment.prototype.retain = function retain(selector) {
    return this._store.retain(selector);
  };

  /**
   * Returns an Observable of RelayResponsePayload resulting from executing the
   * provided Query or Subscription operation, each result of which is then
   * normalized and committed to the publish queue.
   *
   * Note: Observables are lazy, so calling this method will do nothing until
   * the result is subscribed to: environment.execute({...}).subscribe({...}).
   */


  RelayModernEnvironment.prototype.execute = function execute(_ref2) {
    var _this3 = this;

    var operation = _ref2.operation,
        cacheConfig = _ref2.cacheConfig,
        updater = _ref2.updater;
    var node = operation.node,
        variables = operation.variables;

    return this._network.execute(node, variables, cacheConfig || {}).map(function (payload) {
      return __webpack_require__(135)(node, variables, payload);
    })['do']({
      next: function next(payload) {
        _this3._publishQueue.commitPayload(operation, payload, updater);
        _this3._publishQueue.run();
      }
    });
  };

  /**
   * Returns an Observable of RelayResponsePayload resulting from executing the
   * provided Mutation operation, the result of which is then normalized and
   * committed to the publish queue along with an optional optimistic response
   * or updater.
   *
   * Note: Observables are lazy, so calling this method will do nothing until
   * the result is subscribed to:
   * environment.executeMutation({...}).subscribe({...}).
   */


  RelayModernEnvironment.prototype.executeMutation = function executeMutation(_ref3) {
    var _this4 = this;

    var operation = _ref3.operation,
        optimisticResponse = _ref3.optimisticResponse,
        optimisticUpdater = _ref3.optimisticUpdater,
        updater = _ref3.updater,
        uploadables = _ref3.uploadables;
    var node = operation.node,
        variables = operation.variables;

    var mutationUid = nextMutationUid();

    var optimisticUpdate = void 0;
    if (optimisticResponse || optimisticUpdater) {
      optimisticUpdate = {
        operation: operation,
        selectorStoreUpdater: optimisticUpdater,
        response: optimisticResponse || null
      };
    }

    return this._network.execute(node, variables, { force: true }, uploadables).map(function (payload) {
      return __webpack_require__(135)(node, variables, payload);
    })['do']({
      start: function start() {
        if (optimisticUpdate) {
          _this4._recordDebuggerEvent({
            eventName: 'optimistic_update',
            mutationUid: mutationUid,
            operation: operation,
            fn: function fn() {
              if (optimisticUpdate) {
                _this4._publishQueue.applyUpdate(optimisticUpdate);
              }
              _this4._publishQueue.run();
            }
          });
        }
      },
      next: function next(payload) {
        _this4._recordDebuggerEvent({
          eventName: 'request_commit',
          mutationUid: mutationUid,
          operation: operation,
          payload: payload,
          fn: function fn() {
            if (optimisticUpdate) {
              _this4._publishQueue.revertUpdate(optimisticUpdate);
              optimisticUpdate = undefined;
            }
            _this4._publishQueue.commitPayload(operation, payload, updater);
            _this4._publishQueue.run();
          }
        });
      },
      error: function (_error) {
        function error(_x) {
          return _error.apply(this, arguments);
        }

        error.toString = function () {
          return _error.toString();
        };

        return error;
      }(function (error) {
        _this4._recordDebuggerEvent({
          eventName: 'request_error',
          mutationUid: mutationUid,
          operation: operation,
          payload: error,
          fn: function fn() {
            if (optimisticUpdate) {
              _this4._publishQueue.revertUpdate(optimisticUpdate);
            }
            _this4._publishQueue.run();
          }
        });
      }),
      unsubscribe: function unsubscribe() {
        if (optimisticUpdate) {
          _this4._recordDebuggerEvent({
            eventName: 'optimistic_revert',
            mutationUid: mutationUid,
            operation: operation,
            fn: function fn() {
              if (optimisticUpdate) {
                _this4._publishQueue.revertUpdate(optimisticUpdate);
              }
              _this4._publishQueue.run();
            }
          });
        }
      }
    });
  };

  /**
   * @deprecated Use Environment.execute().subscribe()
   */


  RelayModernEnvironment.prototype.sendQuery = function sendQuery(_ref4) {
    var cacheConfig = _ref4.cacheConfig,
        onCompleted = _ref4.onCompleted,
        onError = _ref4.onError,
        onNext = _ref4.onNext,
        operation = _ref4.operation;

    __webpack_require__(2)(false, 'environment.sendQuery() is deprecated. Update to the latest ' + 'version of react-relay, and use environment.execute().');
    return this.execute({ operation: operation, cacheConfig: cacheConfig }).subscribeLegacy({
      onNext: onNext,
      onError: onError,
      onCompleted: onCompleted
    });
  };

  /**
   * @deprecated Use Environment.execute().subscribe()
   */


  RelayModernEnvironment.prototype.streamQuery = function streamQuery(_ref5) {
    var cacheConfig = _ref5.cacheConfig,
        onCompleted = _ref5.onCompleted,
        onError = _ref5.onError,
        onNext = _ref5.onNext,
        operation = _ref5.operation;

    __webpack_require__(2)(false, 'environment.streamQuery() is deprecated. Update to the latest ' + 'version of react-relay, and use environment.execute().');
    return this.execute({ operation: operation, cacheConfig: cacheConfig }).subscribeLegacy({
      onNext: onNext,
      onError: onError,
      onCompleted: onCompleted
    });
  };

  /**
   * @deprecated Use Environment.executeMutation().subscribe()
   */


  RelayModernEnvironment.prototype.sendMutation = function sendMutation(_ref6) {
    var onCompleted = _ref6.onCompleted,
        onError = _ref6.onError,
        operation = _ref6.operation,
        optimisticResponse = _ref6.optimisticResponse,
        optimisticUpdater = _ref6.optimisticUpdater,
        updater = _ref6.updater,
        uploadables = _ref6.uploadables;

    __webpack_require__(2)(false, 'environment.sendMutation() is deprecated. Update to the latest ' + 'version of react-relay, and use environment.executeMutation().');
    return this.executeMutation({
      operation: operation,
      optimisticResponse: optimisticResponse,
      optimisticUpdater: optimisticUpdater,
      updater: updater,
      uploadables: uploadables
    }).subscribeLegacy({
      // NOTE: sendMutation has a non-standard use of onCompleted() by passing
      // it a value. When switching to use executeMutation(), the next()
      // Observer should be used to preserve behavior.
      onNext: function onNext(payload) {
        onCompleted && onCompleted(payload.errors);
      },
      onError: onError,
      onCompleted: onCompleted
    });
  };

  /**
   * @deprecated Use Environment.execute().subscribe()
   */


  RelayModernEnvironment.prototype.sendSubscription = function sendSubscription(_ref7) {
    var onCompleted = _ref7.onCompleted,
        onNext = _ref7.onNext,
        onError = _ref7.onError,
        operation = _ref7.operation,
        updater = _ref7.updater;

    __webpack_require__(2)(false, 'environment.sendSubscription() is deprecated. Update to the latest ' + 'version of react-relay, and use environment.execute().');
    return this.execute({
      operation: operation,
      updater: updater,
      cacheConfig: { force: true }
    }).subscribeLegacy({ onNext: onNext, onError: onError, onCompleted: onCompleted });
  };

  RelayModernEnvironment.prototype._recordDebuggerEvent = function _recordDebuggerEvent(_ref8) {
    var eventName = _ref8.eventName,
        mutationUid = _ref8.mutationUid,
        operation = _ref8.operation,
        payload = _ref8.payload,
        fn = _ref8.fn;

    if (this._debugger) {
      this._debugger.recordMutationEvent({
        eventName: eventName,
        payload: payload,
        fn: fn,
        mutation: operation,
        seriesId: mutationUid
      });
    } else {
      fn();
    }
  };

  RelayModernEnvironment.prototype.checkSelectorAndUpdateStore = function checkSelectorAndUpdateStore(selector, handlers) {
    var target = new (__webpack_require__(24))();
    var result = __webpack_require__(137).check(this._store.getSource(), target, selector, handlers);
    if (target.size() > 0) {
      this._publishQueue.commitSource(target);
      this._publishQueue.run();
    }
    return result;
  };

  return RelayModernEnvironment;
}();

var mutationUidCounter = 0;
var mutationUidPrefix = Math.random().toString();
function nextMutationUid() {
  return mutationUidPrefix + mutationUidCounter++;
}

// Add a sigil for detection by `isRelayModernEnvironment()` to avoid a
// realm-specific instanceof check, and to aid in module tree-shaking to
// avoid requiring all of RelayRuntime just to detect its environment.
RelayModernEnvironment.prototype['@@RelayModernEnvironment'] = true;

module.exports = RelayModernEnvironment;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(82)))

/***/ }),
/* 187 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayDefaultHandlerProvider
 * 
 * @format
 */



function RelayDefaultHandlerProvider(handle) {
  switch (handle) {
    case 'connection':
      return __webpack_require__(15);
    case 'viewer':
      return __webpack_require__(122);
  }
  __webpack_require__(0)(false, 'RelayDefaultHandlerProvider: No handler provided for `%s`.', handle);
}

module.exports = RelayDefaultHandlerProvider;

/***/ }),
/* 188 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(189);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

/***/ }),
/* 189 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(190), __esModule: true };

/***/ }),
/* 190 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(191);
var $Object = __webpack_require__(39).Object;
module.exports = function defineProperty(it, key, desc) {
  return $Object.defineProperty(it, key, desc);
};


/***/ }),
/* 191 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(51);
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !__webpack_require__(41), 'Object', { defineProperty: __webpack_require__(40).f });


/***/ }),
/* 192 */
/***/ (function(module, exports) {

module.exports = function (it) {
  if (typeof it != 'function') throw TypeError(it + ' is not a function!');
  return it;
};


/***/ }),
/* 193 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = !__webpack_require__(41) && !__webpack_require__(84)(function () {
  return Object.defineProperty(__webpack_require__(121)('div'), 'a', { get: function () { return 7; } }).a != 7;
});


/***/ }),
/* 194 */
/***/ (function(module, exports, __webpack_require__) {

// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = __webpack_require__(83);
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function (it, S) {
  if (!isObject(it)) return it;
  var fn, val;
  if (S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  if (typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it))) return val;
  if (!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it))) return val;
  throw TypeError("Can't convert object to primitive value");
};


/***/ }),
/* 195 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayDefaultHandleKey
 * 
 * @format
 */



module.exports = {
  DEFAULT_HANDLE_KEY: ''
};

/***/ }),
/* 196 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 * @providesModule RelayPublishQueue
 * @format
 */



var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * Coordinates the concurrent modification of a `Store` due to optimistic and
 * non-revertable client updates and server payloads:
 * - Applies optimistic updates.
 * - Reverts optimistic updates, rebasing any subsequent updates.
 * - Commits client updates (typically for client schema extensions).
 * - Commits server updates:
 *   - Normalizes query/mutation/subscription responses.
 *   - Executes handlers for "handle" fields.
 *   - Reverts and reapplies pending optimistic updates.
 */
var RelayPublishQueue = function () {
  // Optimistic updaters to add with the next `run()`.

  // Payloads to apply or Sources to publish to the store with the next `run()`.


  // A "negative" of all applied updaters. It can be published to the store to
  // undo them in order to re-apply some of them for a rebase.
  function RelayPublishQueue(store, handlerProvider) {
    (0, _classCallCheck3['default'])(this, RelayPublishQueue);

    this._backup = new (__webpack_require__(24))();
    this._handlerProvider = handlerProvider || null;
    this._pendingBackupRebase = false;
    this._pendingUpdaters = new Set();
    this._pendingData = new Set();
    this._pendingOptimisticUpdates = new Set();
    this._store = store;
    this._appliedOptimisticUpdates = new Set();
  }

  /**
   * Schedule applying an optimistic updates on the next `run()`.
   */

  // Optimistic updaters that are already added and might be rerun in order to
  // rebase them.

  // Updaters to apply with the next `run()`. These mutate the store and should
  // typically only mutate client schema extensions.

  // True if the next `run()` should apply the backup and rerun all optimistic
  // updates performing a rebase.


  RelayPublishQueue.prototype.applyUpdate = function applyUpdate(updater) {
    __webpack_require__(0)(!this._appliedOptimisticUpdates.has(updater) && !this._pendingOptimisticUpdates.has(updater), 'RelayPublishQueue: Cannot apply the same update function more than ' + 'once concurrently.');
    this._pendingOptimisticUpdates.add(updater);
  };

  /**
   * Schedule reverting an optimistic updates on the next `run()`.
   */


  RelayPublishQueue.prototype.revertUpdate = function revertUpdate(updater) {
    if (this._pendingOptimisticUpdates.has(updater)) {
      // Reverted before it was applied
      this._pendingOptimisticUpdates['delete'](updater);
    } else if (this._appliedOptimisticUpdates.has(updater)) {
      this._pendingBackupRebase = true;
      this._appliedOptimisticUpdates['delete'](updater);
    }
  };

  /**
   * Schedule a revert of all optimistic updates on the next `run()`.
   */


  RelayPublishQueue.prototype.revertAll = function revertAll() {
    this._pendingBackupRebase = true;
    this._pendingOptimisticUpdates.clear();
    this._appliedOptimisticUpdates.clear();
  };

  /**
   * Schedule applying a payload to the store on the next `run()`.
   */


  RelayPublishQueue.prototype.commitPayload = function commitPayload(operation, _ref, updater) {
    var fieldPayloads = _ref.fieldPayloads,
        source = _ref.source;

    this._pendingBackupRebase = true;
    this._pendingData.add({
      kind: 'payload',
      payload: { fieldPayloads: fieldPayloads, operation: operation, source: source, updater: updater }
    });
  };

  /**
   * Schedule an updater to mutate the store on the next `run()` typically to
   * update client schema fields.
   */


  RelayPublishQueue.prototype.commitUpdate = function commitUpdate(updater) {
    this._pendingBackupRebase = true;
    this._pendingUpdaters.add(updater);
  };

  /**
   * Schedule a publish to the store from the provided source on the next
   * `run()`. As an example, to update the store with substituted fields that
   * are missing in the store.
   */


  RelayPublishQueue.prototype.commitSource = function commitSource(source) {
    this._pendingBackupRebase = true;
    this._pendingData.add({ kind: 'source', source: source });
  };

  /**
   * Execute all queued up operations from the other public methods.
   */


  RelayPublishQueue.prototype.run = function run() {
    if (this._pendingBackupRebase && this._backup.size()) {
      this._store.publish(this._backup);
      this._backup = new (__webpack_require__(24))();
    }
    this._commitData();
    this._commitUpdaters();
    this._applyUpdates();
    this._pendingBackupRebase = false;
    this._store.notify();
  };

  RelayPublishQueue.prototype._getSourceFromPayload = function _getSourceFromPayload(payload) {
    var _this = this;

    var fieldPayloads = payload.fieldPayloads,
        operation = payload.operation,
        source = payload.source,
        updater = payload.updater;

    var mutator = new (__webpack_require__(55))(this._store.getSource(), source);
    var store = new (__webpack_require__(91))(mutator);
    var selectorStore = new (__webpack_require__(92))(store, operation.fragment);
    if (fieldPayloads && fieldPayloads.length) {
      fieldPayloads.forEach(function (fieldPayload) {
        var handler = _this._handlerProvider && _this._handlerProvider(fieldPayload.handle);
        __webpack_require__(0)(handler, 'RelayModernEnvironment: Expected a handler to be provided for ' + 'handle `%s`.', fieldPayload.handle);
        handler.update(store, fieldPayload);
      });
    }
    if (updater) {
      var selectorData = lookupSelector(source, operation.fragment);
      updater(selectorStore, selectorData);
    }
    return source;
  };

  RelayPublishQueue.prototype._commitData = function _commitData() {
    var _this2 = this;

    if (!this._pendingData.size) {
      return;
    }
    this._pendingData.forEach(function (data) {
      var source = void 0;
      if (data.kind === 'payload') {
        source = _this2._getSourceFromPayload(data.payload);
      } else {
        source = data.source;
      }
      _this2._store.publish(source);
    });
    this._pendingData.clear();
  };

  RelayPublishQueue.prototype._commitUpdaters = function _commitUpdaters() {
    var _this3 = this;

    if (!this._pendingUpdaters.size) {
      return;
    }
    var sink = new (__webpack_require__(24))();
    this._pendingUpdaters.forEach(function (updater) {
      var mutator = new (__webpack_require__(55))(_this3._store.getSource(), sink);
      var store = new (__webpack_require__(91))(mutator);
      updater(store);
    });
    this._store.publish(sink);
    this._pendingUpdaters.clear();
  };

  RelayPublishQueue.prototype._applyUpdates = function _applyUpdates() {
    var _this4 = this;

    if (this._pendingOptimisticUpdates.size || this._pendingBackupRebase && this._appliedOptimisticUpdates.size) {
      var sink = new (__webpack_require__(24))();
      var mutator = new (__webpack_require__(55))(this._store.getSource(), sink, this._backup);
      var store = new (__webpack_require__(91))(mutator, this._handlerProvider);

      // rerun all updaters in case we are running a rebase
      if (this._pendingBackupRebase && this._appliedOptimisticUpdates.size) {
        this._appliedOptimisticUpdates.forEach(function (optimisticUpdate) {
          if (optimisticUpdate.operation) {
            var selectorStoreUpdater = optimisticUpdate.selectorStoreUpdater,
                _operation = optimisticUpdate.operation,
                response = optimisticUpdate.response;

            var selectorStore = store.commitPayload(_operation, response);
            // TODO: Fix commitPayload so we don't have to run normalize twice
            var selectorData = void 0,
                _source = void 0;
            if (response) {
              var _normalizeRelayPayloa = __webpack_require__(42)(_operation.root, response);

              _source = _normalizeRelayPayloa.source;

              selectorData = lookupSelector(_source, _operation.fragment);
            }
            selectorStoreUpdater && selectorStoreUpdater(selectorStore, selectorData);
          } else {
            var storeUpdater = optimisticUpdate.storeUpdater;

            storeUpdater(store);
          }
        });
      }

      // apply any new updaters
      if (this._pendingOptimisticUpdates.size) {
        this._pendingOptimisticUpdates.forEach(function (optimisticUpdate) {
          if (optimisticUpdate.operation) {
            var selectorStoreUpdater = optimisticUpdate.selectorStoreUpdater,
                _operation2 = optimisticUpdate.operation,
                response = optimisticUpdate.response;

            var selectorStore = store.commitPayload(_operation2, response);
            // TODO: Fix commitPayload so we don't have to run normalize twice
            var selectorData = void 0,
                _source2 = void 0;
            if (response) {
              var _normalizeRelayPayloa2 = __webpack_require__(42)(_operation2.root, response);

              _source2 = _normalizeRelayPayloa2.source;

              selectorData = lookupSelector(_source2, _operation2.fragment);
            }
            selectorStoreUpdater && selectorStoreUpdater(selectorStore, selectorData);
          } else {
            var storeUpdater = optimisticUpdate.storeUpdater;

            storeUpdater(store);
          }
          _this4._appliedOptimisticUpdates.add(optimisticUpdate);
        });
        this._pendingOptimisticUpdates.clear();
      }

      this._store.publish(sink);
    }
  };

  return RelayPublishQueue;
}();

function lookupSelector(source, selector) {
  var selectorData = __webpack_require__(93).read(source, selector).data;
  if (process.env.NODE_ENV !== 'production') {
    var deepFreeze = __webpack_require__(57);
    if (selectorData) {
      deepFreeze(selectorData);
    }
  }
  return selectorData;
}

module.exports = RelayPublishQueue;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 197 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(198), __esModule: true };

/***/ }),
/* 198 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(199);
module.exports = __webpack_require__(39).Object.assign;


/***/ }),
/* 199 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(51);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(200) });


/***/ }),
/* 200 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(123);
var gOPS = __webpack_require__(204);
var pIE = __webpack_require__(205);
var toObject = __webpack_require__(90);
var IObject = __webpack_require__(125);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(84)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),
/* 201 */
/***/ (function(module, exports, __webpack_require__) {

var has = __webpack_require__(56);
var toIObject = __webpack_require__(124);
var arrayIndexOf = __webpack_require__(202)(false);
var IE_PROTO = __webpack_require__(89)('IE_PROTO');

module.exports = function (object, names) {
  var O = toIObject(object);
  var i = 0;
  var result = [];
  var key;
  for (key in O) if (key != IE_PROTO) has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while (names.length > i) if (has(O, key = names[i++])) {
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};


/***/ }),
/* 202 */
/***/ (function(module, exports, __webpack_require__) {

// false -> Array#indexOf
// true  -> Array#includes
var toIObject = __webpack_require__(124);
var toLength = __webpack_require__(127);
var toAbsoluteIndex = __webpack_require__(203);
module.exports = function (IS_INCLUDES) {
  return function ($this, el, fromIndex) {
    var O = toIObject($this);
    var length = toLength(O.length);
    var index = toAbsoluteIndex(fromIndex, length);
    var value;
    // Array#includes uses SameValueZero equality algorithm
    // eslint-disable-next-line no-self-compare
    if (IS_INCLUDES && el != el) while (length > index) {
      value = O[index++];
      // eslint-disable-next-line no-self-compare
      if (value != value) return true;
    // Array#indexOf ignores holes, Array#includes - not
    } else for (;length > index; index++) if (IS_INCLUDES || index in O) {
      if (O[index] === el) return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};


/***/ }),
/* 203 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(88);
var max = Math.max;
var min = Math.min;
module.exports = function (index, length) {
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};


/***/ }),
/* 204 */
/***/ (function(module, exports) {

exports.f = Object.getOwnPropertySymbols;


/***/ }),
/* 205 */
/***/ (function(module, exports) {

exports.f = {}.propertyIsEnumerable;


/***/ }),
/* 206 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayResponseNormalizer
 * 
 * @format
 */



var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = __webpack_require__(5),
    getHandleFilterValues = _require.getHandleFilterValues,
    getArgumentValues = _require.getArgumentValues,
    getStorageKey = _require.getStorageKey,
    TYPENAME_KEY = _require.TYPENAME_KEY;

var CONDITION = __webpack_require__(3).CONDITION,
    INLINE_FRAGMENT = __webpack_require__(3).INLINE_FRAGMENT,
    LINKED_FIELD = __webpack_require__(3).LINKED_FIELD,
    LINKED_HANDLE = __webpack_require__(3).LINKED_HANDLE,
    SCALAR_FIELD = __webpack_require__(3).SCALAR_FIELD,
    SCALAR_HANDLE = __webpack_require__(3).SCALAR_HANDLE;

/**
 * Normalizes the results of a query and standard GraphQL response, writing the
 * normalized records/fields into the given MutableRecordSource.
 *
 * If handleStrippedNulls is true, will replace fields on the Selector that
 * are not present in the response with null. Otherwise will leave fields unset.
 */
function normalize(recordSource, selector, response) {
  var options = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : { handleStrippedNulls: false };
  var dataID = selector.dataID,
      node = selector.node,
      variables = selector.variables;

  var normalizer = new RelayResponseNormalizer(recordSource, variables, options);
  return normalizer.normalizeResponse(node, dataID, response);
}

/**
 * @private
 *
 * Helper for handling payloads.
 */

var RelayResponseNormalizer = function () {
  function RelayResponseNormalizer(recordSource, variables, options) {
    (0, _classCallCheck3['default'])(this, RelayResponseNormalizer);

    this._handleFieldPayloads = [];
    this._recordSource = recordSource;
    this._variables = variables;
    this._handleStrippedNulls = options.handleStrippedNulls;
  }

  RelayResponseNormalizer.prototype.normalizeResponse = function normalizeResponse(node, dataID, data) {
    var record = this._recordSource.get(dataID);
    __webpack_require__(0)(record, 'RelayResponseNormalizer(): Expected root record `%s` to exist.', dataID);
    this._traverseSelections(node.selections, record, data);
    return this._handleFieldPayloads;
  };

  RelayResponseNormalizer.prototype._getVariableValue = function _getVariableValue(name) {
    __webpack_require__(0)(this._variables.hasOwnProperty(name), 'RelayResponseNormalizer(): Undefined variable `%s`.', name);
    return this._variables[name];
  };

  RelayResponseNormalizer.prototype._getRecordType = function _getRecordType(data) {
    var typeName = data[TYPENAME_KEY];
    __webpack_require__(0)(typeName != null, 'RelayResponseNormalizer(): Expected a typename for record `%s`.', JSON.stringify(data, null, 2));
    return typeName;
  };

  RelayResponseNormalizer.prototype._traverseSelections = function _traverseSelections(selections, record, data) {
    var _this = this;

    selections.forEach(function (selection) {
      if (selection.kind === SCALAR_FIELD || selection.kind === LINKED_FIELD) {
        _this._normalizeField(selection, record, data);
      } else if (selection.kind === CONDITION) {
        var conditionValue = _this._getVariableValue(selection.condition);
        if (conditionValue === selection.passingValue) {
          _this._traverseSelections(selection.selections, record, data);
        }
      } else if (selection.kind === INLINE_FRAGMENT) {
        var typeName = __webpack_require__(1).getType(record);
        if (typeName === selection.type) {
          _this._traverseSelections(selection.selections, record, data);
        }
      } else if (selection.kind === LINKED_HANDLE || selection.kind === SCALAR_HANDLE) {
        var args = selection.args ? getArgumentValues(selection.args, _this._variables) : {};

        var fieldKey = __webpack_require__(8)(selection.name, args);
        var handleKey = __webpack_require__(54)(selection.handle, selection.key, selection.name);
        if (selection.filters) {
          var filterValues = getHandleFilterValues(selection.args || [], selection.filters, _this._variables);
          handleKey = __webpack_require__(8)(handleKey, filterValues);
        }
        _this._handleFieldPayloads.push({
          args: args,
          dataID: __webpack_require__(1).getDataID(record),
          fieldKey: fieldKey,
          handle: selection.handle,
          handleKey: handleKey
        });
      } else {
        __webpack_require__(0)(false, 'RelayResponseNormalizer(): Unexpected ast kind `%s`.', selection.kind);
      }
    });
  };

  RelayResponseNormalizer.prototype._normalizeField = function _normalizeField(selection, record, data) {
    __webpack_require__(0)(typeof data === 'object' && data, 'writeField(): Expected data for field `%s` to be an object.', selection.name);
    var responseKey = selection.alias || selection.name;
    var storageKey = getStorageKey(selection, this._variables);
    var fieldValue = data[responseKey];
    if (fieldValue == null) {
      if (fieldValue === undefined && !this._handleStrippedNulls) {
        // If we're not stripping nulls, undefined fields are unset
        return;
      }
      if (process.env.NODE_ENV !== 'production') {
        __webpack_require__(2)(Object.prototype.hasOwnProperty.call(data, responseKey), 'RelayResponseNormalizer(): Payload did not contain a value ' + 'for field `%s: %s`. Check that you are parsing with the same ' + 'query that was used to fetch the payload.', responseKey, storageKey);
      }
      __webpack_require__(1).setValue(record, storageKey, null);
      return;
    }

    if (selection.kind === SCALAR_FIELD) {
      __webpack_require__(1).setValue(record, storageKey, fieldValue);
    } else if (selection.plural) {
      this._normalizePluralLink(selection, record, storageKey, fieldValue);
    } else {
      this._normalizeLink(selection, record, storageKey, fieldValue);
    }
  };

  RelayResponseNormalizer.prototype._normalizeLink = function _normalizeLink(field, record, storageKey, fieldValue) {
    __webpack_require__(0)(typeof fieldValue === 'object' && fieldValue, 'RelayResponseNormalizer: Expected data for field `%s` to be an object.', storageKey);
    var nextID = fieldValue.id ||
    // Reuse previously generated client IDs
    __webpack_require__(1).getLinkedRecordID(record, storageKey) || __webpack_require__(17)(__webpack_require__(1).getDataID(record), storageKey);
    __webpack_require__(0)(typeof nextID === 'string', 'RelayResponseNormalizer: Expected id on field `%s` to be a string.', storageKey);
    __webpack_require__(1).setLinkedRecordID(record, storageKey, nextID);
    var nextRecord = this._recordSource.get(nextID);
    if (!nextRecord) {
      var typeName = field.concreteType || this._getRecordType(fieldValue);
      nextRecord = __webpack_require__(1).create(nextID, typeName);
      this._recordSource.set(nextID, nextRecord);
    } else if (process.env.NODE_ENV !== 'production') {
      this._validateRecordType(nextRecord, field, fieldValue);
    }
    this._traverseSelections(field.selections, nextRecord, fieldValue);
  };

  RelayResponseNormalizer.prototype._normalizePluralLink = function _normalizePluralLink(field, record, storageKey, fieldValue) {
    var _this2 = this;

    __webpack_require__(0)(Array.isArray(fieldValue), 'RelayResponseNormalizer: Expected data for field `%s` to be an array ' + 'of objects.', storageKey);
    var prevIDs = __webpack_require__(1).getLinkedRecordIDs(record, storageKey);
    var nextIDs = [];
    fieldValue.forEach(function (item, nextIndex) {
      // validate response data
      if (item == null) {
        nextIDs.push(item);
        return;
      }
      __webpack_require__(0)(typeof item === 'object', 'RelayResponseNormalizer: Expected elements for field `%s` to be ' + 'objects.', storageKey);

      var nextID = item.id || prevIDs && prevIDs[nextIndex] || // Reuse previously generated client IDs
      __webpack_require__(17)(__webpack_require__(1).getDataID(record), storageKey, nextIndex);
      __webpack_require__(0)(typeof nextID === 'string', 'RelayResponseNormalizer: Expected id of elements of field `%s` to ' + 'be strings.', storageKey);

      nextIDs.push(nextID);
      var nextRecord = _this2._recordSource.get(nextID);
      if (!nextRecord) {
        var typeName = field.concreteType || _this2._getRecordType(item);
        nextRecord = __webpack_require__(1).create(nextID, typeName);
        _this2._recordSource.set(nextID, nextRecord);
      } else if (process.env.NODE_ENV !== 'production') {
        _this2._validateRecordType(nextRecord, field, item);
      }
      _this2._traverseSelections(field.selections, nextRecord, item);
    });
    __webpack_require__(1).setLinkedRecordIDs(record, storageKey, nextIDs);
  };

  /**
   * Warns if the type of the record does not match the type of the field/payload.
   */


  RelayResponseNormalizer.prototype._validateRecordType = function _validateRecordType(record, field, payload) {
    var typeName = field.concreteType || this._getRecordType(payload);
    __webpack_require__(2)(__webpack_require__(1).getType(record) === typeName, 'RelayResponseNormalizer: Invalid record `%s`. Expected %s to be ' + 'be consistent, but the record was assigned conflicting types `%s` ' + 'and `%s`. The GraphQL server likely violated the globally unique ' + 'id requirement by returning the same id for different objects.', __webpack_require__(1).getDataID(record), TYPENAME_KEY, __webpack_require__(1).getType(record), typeName);
  };

  return RelayResponseNormalizer;
}();

// eslint-disable-next-line no-func-assign


normalize = __webpack_require__(131).instrument('RelayResponseNormalizer.normalize', normalize);

module.exports = { normalize: normalize };
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 207 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayRecordProxy
 * 
 * @format
 */



var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * @internal
 *
 * A helper class for manipulating a given record from a record source via an
 * imperative/OO-style API.
 */
var RelayRecordProxy = function () {
  function RelayRecordProxy(source, mutator, dataID) {
    (0, _classCallCheck3['default'])(this, RelayRecordProxy);

    this._dataID = dataID;
    this._mutator = mutator;
    this._source = source;
  }

  RelayRecordProxy.prototype.copyFieldsFrom = function copyFieldsFrom(source) {
    this._mutator.copyFields(source.getDataID(), this._dataID);
  };

  RelayRecordProxy.prototype.getDataID = function getDataID() {
    return this._dataID;
  };

  RelayRecordProxy.prototype.getType = function getType() {
    var type = this._mutator.getType(this._dataID);
    __webpack_require__(0)(type != null, 'RelayRecordProxy: Cannot get the type of deleted record `%s`.', this._dataID);
    return type;
  };

  RelayRecordProxy.prototype.getValue = function getValue(name, args) {
    var storageKey = args ? __webpack_require__(8)(name, args) : name;
    return this._mutator.getValue(this._dataID, storageKey);
  };

  RelayRecordProxy.prototype.setValue = function setValue(value, name, args) {
    __webpack_require__(0)(isValidLeafValue(value), 'RelayRecordProxy#setValue(): Expected a scalar or array of scalars, ' + 'got `%s`.', JSON.stringify(value));
    var storageKey = args ? __webpack_require__(8)(name, args) : name;
    this._mutator.setValue(this._dataID, storageKey, value);
    return this;
  };

  RelayRecordProxy.prototype.getLinkedRecord = function getLinkedRecord(name, args) {
    var storageKey = args ? __webpack_require__(8)(name, args) : name;
    var linkedID = this._mutator.getLinkedRecordID(this._dataID, storageKey);
    return linkedID != null ? this._source.get(linkedID) : linkedID;
  };

  RelayRecordProxy.prototype.setLinkedRecord = function setLinkedRecord(record, name, args) {
    __webpack_require__(0)(record instanceof RelayRecordProxy, 'RelayRecordProxy#setLinkedRecord(): Expected a record, got `%s`.', record);
    var storageKey = args ? __webpack_require__(8)(name, args) : name;
    var linkedID = record.getDataID();
    this._mutator.setLinkedRecordID(this._dataID, storageKey, linkedID);
    return this;
  };

  RelayRecordProxy.prototype.getOrCreateLinkedRecord = function getOrCreateLinkedRecord(name, typeName, args) {
    var linkedRecord = this.getLinkedRecord(name, args);
    if (!linkedRecord) {
      var storageKey = args ? __webpack_require__(8)(name, args) : name;
      var clientID = __webpack_require__(17)(this.getDataID(), storageKey);
      linkedRecord = this._source.create(clientID, typeName);
      this.setLinkedRecord(linkedRecord, name, args);
    }
    return linkedRecord;
  };

  RelayRecordProxy.prototype.getLinkedRecords = function getLinkedRecords(name, args) {
    var _this = this;

    var storageKey = args ? __webpack_require__(8)(name, args) : name;
    var linkedIDs = this._mutator.getLinkedRecordIDs(this._dataID, storageKey);
    if (linkedIDs == null) {
      return linkedIDs;
    }
    return linkedIDs.map(function (linkedID) {
      return linkedID != null ? _this._source.get(linkedID) : linkedID;
    });
  };

  RelayRecordProxy.prototype.setLinkedRecords = function setLinkedRecords(records, name, args) {
    __webpack_require__(0)(Array.isArray(records), 'RelayRecordProxy#setLinkedRecords(): Expected records to be an array, got `%s`.', records);
    var storageKey = args ? __webpack_require__(8)(name, args) : name;
    var linkedIDs = records.map(function (record) {
      return record && record.getDataID();
    });
    this._mutator.setLinkedRecordIDs(this._dataID, storageKey, linkedIDs);
    return this;
  };

  return RelayRecordProxy;
}();

function isValidLeafValue(value) {
  return value == null || typeof value !== 'object' || Array.isArray(value) && value.every(isValidLeafValue);
}

module.exports = RelayRecordProxy;

/***/ }),
/* 208 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayModernOperationSelector
 * 
 * @format
 */



var _require = __webpack_require__(132),
    getOperationVariables = _require.getOperationVariables;

var _require2 = __webpack_require__(5),
    ROOT_ID = _require2.ROOT_ID;

/**
 * Creates an instance of the `OperationSelector` type defined in
 * `RelayStoreTypes` given an operation and some variables. The input variables
 * are filtered to exclude variables that do not match defined arguments on the
 * operation, and default values are populated for null values.
 */
function createOperationSelector(operation, variables) {
  var operationVariables = getOperationVariables(operation, variables);
  var dataID = ROOT_ID;
  return {
    fragment: {
      dataID: dataID,
      node: operation.fragment,
      variables: operationVariables
    },
    node: operation,
    root: {
      dataID: dataID,
      node: operation.query,
      variables: operationVariables
    },
    variables: operationVariables
  };
}

module.exports = {
  createOperationSelector: createOperationSelector
};

/***/ }),
/* 209 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayModernFragmentSpecResolver
 * 
 * @format
 */



var _extends3 = _interopRequireDefault(__webpack_require__(25));

var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = __webpack_require__(133),
    areEqualSelectors = _require.areEqualSelectors,
    getSelectorsFromObject = _require.getSelectorsFromObject;

/**
 * A utility for resolving and subscribing to the results of a fragment spec
 * (key -> fragment mapping) given some "props" that determine the root ID
 * and variables to use when reading each fragment. When props are changed via
 * `setProps()`, the resolver will update its results and subscriptions
 * accordingly. Internally, the resolver:
 * - Converts the fragment map & props map into a map of `Selector`s.
 * - Removes any resolvers for any props that became null.
 * - Creates resolvers for any props that became non-null.
 * - Updates resolvers with the latest props.
 *
 * This utility is implemented as an imperative, stateful API for performance
 * reasons: reusing previous resolvers, callback functions, and subscriptions
 * all helps to reduce object allocation and thereby decrease GC time.
 *
 * The `resolve()` function is also lazy and memoized: changes in the store mark
 * the resolver as stale and notify the caller, and the actual results are
 * recomputed the first time `resolve()` is called.
 */
var RelayModernFragmentSpecResolver = function () {
  function RelayModernFragmentSpecResolver(context, fragments, props, callback) {
    var _this = this;

    (0, _classCallCheck3['default'])(this, RelayModernFragmentSpecResolver);

    this._onChange = function () {
      _this._stale = true;
      _this._callback();
    };

    this._callback = callback;
    this._context = context;
    this._data = {};
    this._fragments = fragments;
    this._props = props;
    this._resolvers = {};
    this._stale = false;

    this.setProps(props);
  }

  RelayModernFragmentSpecResolver.prototype.dispose = function dispose() {
    for (var _key in this._resolvers) {
      if (this._resolvers.hasOwnProperty(_key)) {
        disposeCallback(this._resolvers[_key]);
      }
    }
  };

  RelayModernFragmentSpecResolver.prototype.resolve = function resolve() {
    if (this._stale) {
      // Avoid mapping the object multiple times, which could occur if data for
      // multiple keys changes in the same event loop.
      var prevData = this._data;
      var nextData = void 0;
      for (var _key2 in this._resolvers) {
        if (this._resolvers.hasOwnProperty(_key2)) {
          var resolver = this._resolvers[_key2];
          var prevItem = prevData[_key2];
          if (resolver) {
            var nextItem = resolver.resolve();
            if (nextData || nextItem !== prevItem) {
              nextData = nextData || (0, _extends3['default'])({}, prevData);
              nextData[_key2] = nextItem;
            }
          } else {
            var prop = this._props[_key2];
            var _nextItem = prop !== undefined ? prop : null;
            if (nextData || !__webpack_require__(210)(_nextItem, prevItem)) {
              nextData = nextData || (0, _extends3['default'])({}, prevData);
              nextData[_key2] = _nextItem;
            }
          }
        }
      }
      this._data = nextData || prevData;
      this._stale = false;
    }
    return this._data;
  };

  RelayModernFragmentSpecResolver.prototype.setProps = function setProps(props) {
    var selectors = getSelectorsFromObject(this._context.variables, this._fragments, props);
    for (var _key3 in selectors) {
      if (selectors.hasOwnProperty(_key3)) {
        var selector = selectors[_key3];
        var resolver = this._resolvers[_key3];
        if (selector == null) {
          if (resolver != null) {
            resolver.dispose();
          }
          resolver = null;
        } else if (Array.isArray(selector)) {
          if (resolver == null) {
            resolver = new SelectorListResolver(this._context.environment, selector, this._onChange);
          } else {
            __webpack_require__(0)(resolver instanceof SelectorListResolver, 'RelayModernFragmentSpecResolver: Expected prop `%s` to always be an array.', _key3);
            resolver.setSelectors(selector);
          }
        } else {
          if (resolver == null) {
            resolver = new SelectorResolver(this._context.environment, selector, this._onChange);
          } else {
            __webpack_require__(0)(resolver instanceof SelectorResolver, 'RelayModernFragmentSpecResolver: Expected prop `%s` to always be an object.', _key3);
            resolver.setSelector(selector);
          }
        }
        this._resolvers[_key3] = resolver;
      }
    }
    this._props = props;
    this._stale = true;
  };

  RelayModernFragmentSpecResolver.prototype.setVariables = function setVariables(variables) {
    for (var _key4 in this._resolvers) {
      if (this._resolvers.hasOwnProperty(_key4)) {
        var resolver = this._resolvers[_key4];
        if (resolver) {
          resolver.setVariables(variables);
        }
      }
    }
    this._stale = true;
  };

  return RelayModernFragmentSpecResolver;
}();

/**
 * A resolver for a single Selector.
 */


var SelectorResolver = function () {
  function SelectorResolver(environment, selector, callback) {
    (0, _classCallCheck3['default'])(this, SelectorResolver);

    _initialiseProps.call(this);

    var snapshot = environment.lookup(selector);
    this._callback = callback;
    this._data = snapshot.data;
    this._environment = environment;
    this._selector = selector;
    this._subscription = environment.subscribe(snapshot, this._onChange);
  }

  SelectorResolver.prototype.dispose = function dispose() {
    if (this._subscription) {
      this._subscription.dispose();
      this._subscription = null;
    }
  };

  SelectorResolver.prototype.resolve = function resolve() {
    return this._data;
  };

  SelectorResolver.prototype.setSelector = function setSelector(selector) {
    if (this._subscription != null && areEqualSelectors(selector, this._selector)) {
      return;
    }
    this.dispose();
    var snapshot = this._environment.lookup(selector);
    this._data = snapshot.data;
    this._selector = selector;
    this._subscription = this._environment.subscribe(snapshot, this._onChange);
  };

  SelectorResolver.prototype.setVariables = function setVariables(variables) {
    var selector = (0, _extends3['default'])({}, this._selector, {
      variables: variables
    });
    this.setSelector(selector);
  };

  return SelectorResolver;
}();

/**
 * A resolver for an array of Selectors.
 */


var _initialiseProps = function _initialiseProps() {
  var _this3 = this;

  this._onChange = function (snapshot) {
    _this3._data = snapshot.data;
    _this3._callback();
  };
};

var SelectorListResolver = function () {
  function SelectorListResolver(environment, selectors, callback) {
    var _this2 = this;

    (0, _classCallCheck3['default'])(this, SelectorListResolver);

    this._onChange = function (data) {
      _this2._stale = true;
      _this2._callback();
    };

    this._callback = callback;
    this._data = [];
    this._environment = environment;
    this._resolvers = [];
    this._stale = true;

    this.setSelectors(selectors);
  }

  SelectorListResolver.prototype.dispose = function dispose() {
    this._resolvers.forEach(disposeCallback);
  };

  SelectorListResolver.prototype.resolve = function resolve() {
    if (this._stale) {
      // Avoid mapping the array multiple times, which could occur if data for
      // multiple indices changes in the same event loop.
      var prevData = this._data;
      var nextData = void 0;
      for (var ii = 0; ii < this._resolvers.length; ii++) {
        var prevItem = prevData[ii];
        var nextItem = this._resolvers[ii].resolve();
        if (nextData || nextItem !== prevItem) {
          nextData = nextData || prevData.slice(0, ii);
          nextData.push(nextItem);
        }
      }
      if (!nextData && this._resolvers.length !== prevData.length) {
        nextData = prevData.slice(0, this._resolvers.length);
      }
      this._data = nextData || prevData;
      this._stale = false;
    }
    return this._data;
  };

  SelectorListResolver.prototype.setSelectors = function setSelectors(selectors) {
    while (this._resolvers.length > selectors.length) {
      var resolver = this._resolvers.pop();
      resolver.dispose();
    }
    for (var ii = 0; ii < selectors.length; ii++) {
      if (ii < this._resolvers.length) {
        this._resolvers[ii].setSelector(selectors[ii]);
      } else {
        this._resolvers[ii] = new SelectorResolver(this._environment, selectors[ii], this._onChange);
      }
    }
    this._stale = true;
  };

  SelectorListResolver.prototype.setVariables = function setVariables(variables) {
    this._resolvers.forEach(function (resolver) {
      return resolver.setVariables(variables);
    });
    this._stale = true;
  };

  return SelectorListResolver;
}();

function disposeCallback(disposable) {
  disposable && disposable.dispose();
}

module.exports = RelayModernFragmentSpecResolver;

/***/ }),
/* 210 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 * @providesModule isScalarAndEqual
 * @format
 */



/**
 * A fast test to determine if two values are equal scalars:
 * - compares scalars such as booleans, strings, numbers by value
 * - compares functions by identity
 * - returns false for complex values, since these cannot be cheaply tested for
 *   equality (use `areEquals` instead)
 */

function isScalarAndEqual(valueA, valueB) {
  return valueA === valueB && (valueA === null || typeof valueA !== 'object');
}

module.exports = isScalarAndEqual;

/***/ }),
/* 211 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayDebugger
 * 
 * @format
 */



var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var RelayDebugger = function () {
  function RelayDebugger() {
    (0, _classCallCheck3['default'])(this, RelayDebugger);

    this._idCounter = 1;
    this._envDebuggers = new Map();
  }

  RelayDebugger.prototype.registerEnvironment = function registerEnvironment(env) {
    var idString = 'RelayModernEnvironment' + this._idCounter++;
    this._envDebuggers.set(idString, new EnvironmentDebugger(env, idString));
    return idString;
  };

  RelayDebugger.prototype.getEnvironmentDebugger = function getEnvironmentDebugger(id) {
    var envDebugger = this._envDebuggers.get(id);
    if (!envDebugger) {
      throw new Error('No registered environment: ' + id);
    }

    return envDebugger;
  };

  RelayDebugger.prototype.getRegisteredEnvironmentIds = function getRegisteredEnvironmentIds() {
    return Array.from(this._envDebuggers.keys());
  };

  return RelayDebugger;
}();

var EnvironmentDebugger = function () {
  function EnvironmentDebugger(environment, id) {
    (0, _classCallCheck3['default'])(this, EnvironmentDebugger);

    this._environment = environment;
    this._id = id;
    this._envIsDirty = false;
    this._monkeyPatchSource();

    this._recordedMutationEvents = [];
    this._isRecordingMutationEvents = false;
  }

  EnvironmentDebugger.prototype.getEnvironment = function getEnvironment() {
    return this._environment;
  };

  EnvironmentDebugger.prototype.getId = function getId() {
    return this._id;
  };

  EnvironmentDebugger.prototype.getMatchingRecords = function getMatchingRecords(matchStr, matchType) {
    var inspector = __webpack_require__(94).getForEnvironment(this._environment);

    function isMatching(record) {
      if (matchType === 'idtype') {
        return record.id.includes(matchStr) || !!record.type && record.type.includes(matchStr);
      }
      if (matchType === 'id') {
        return record.id.includes(matchStr);
      }
      if (matchType === 'type') {
        return !!record.type && record.type.includes(matchStr);
      }
      if (matchType === 'predicate') {
        var recordInspector = inspector.get(record.id);
        var fields = recordInspector && recordInspector.inspect();
        if (typeof fields === 'object' && fields !== null) {
          throw new Error('Not implemented');
        }
        return false;
      }
      throw new Error('Unknown match type: ' + matchType);
    }

    return inspector.getRecords().filter(isMatching);
  };

  EnvironmentDebugger.prototype.getRecord = function getRecord(id) {
    var inspector = __webpack_require__(94).getForEnvironment(this._environment);
    var recordInspector = inspector.get(id);
    return recordInspector && recordInspector.inspect();
  };

  EnvironmentDebugger.prototype._monkeyPatchSource = function _monkeyPatchSource() {
    var _this = this;

    var source = this._environment.getStore().getSource();
    var originalSet = source.set;
    var originalRemove = source.remove;

    source.set = function () {
      for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      originalSet.apply(source, args);
      _this.triggerDirty();
    };
    source.remove = function () {
      for (var _len2 = arguments.length, args = Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
      }

      originalRemove.apply(source, args);
      _this.triggerDirty();
    };
  };

  EnvironmentDebugger.prototype.triggerDirty = function triggerDirty() {
    this._envIsDirty = true;
  };

  EnvironmentDebugger.prototype.isDirty = function isDirty() {
    return this._envIsDirty;
  };

  EnvironmentDebugger.prototype.resetDirty = function resetDirty() {
    this._envIsDirty = false;
  };

  EnvironmentDebugger.prototype.startRecordingMutationEvents = function startRecordingMutationEvents() {
    this._isRecordingMutationEvents = true;
    this._recordedMutationEvents = [];
  };

  EnvironmentDebugger.prototype.stopRecordingMutationEvents = function stopRecordingMutationEvents() {
    this._isRecordingMutationEvents = false;
  };

  EnvironmentDebugger.prototype.getRecordedMutationEvents = function getRecordedMutationEvents() {
    return this._recordedMutationEvents;
  };

  EnvironmentDebugger.prototype.recordMutationEvent = function recordMutationEvent(_ref) {
    var eventName = _ref.eventName,
        seriesId = _ref.seriesId,
        payload = _ref.payload,
        mutation = _ref.mutation,
        fn = _ref.fn;

    if (this._isRecordingMutationEvents) {
      var getSnapshot = function getSnapshot() {
        var snapshot = {};
        var ids = source.getRecordIDs();
        ids.forEach(function (id) {
          snapshot[id] = source.get(id);
        });
        return snapshot;
      };

      var source = this._environment.getStore().getSource();


      var _snapshotBefore = getSnapshot();
      fn();
      var _snapshotAfter = getSnapshot();

      var event = {
        eventName: eventName,
        seriesId: seriesId,
        payload: payload,
        snapshotBefore: _snapshotBefore,
        snapshotAfter: _snapshotAfter,
        mutation: mutation
      };

      this._recordedMutationEvents.push(event);
    } else {
      fn();
    }
  };

  return EnvironmentDebugger;
}();

module.exports = {
  RelayDebugger: RelayDebugger,
  EnvironmentDebugger: EnvironmentDebugger
};

/***/ }),
/* 212 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule simpleClone
 * 
 * @format
 */



/**
 * A helper to create a deep clone of a value, plain Object, or array of such.
 *
 * Does not support RegExp, Date, other classes, or self-referential values.
 */
function simpleClone(value) {
  if (Array.isArray(value)) {
    return value.map(simpleClone);
  } else if (value && typeof value === 'object') {
    return __webpack_require__(134)(value, simpleClone);
  } else {
    return value;
  }
}

module.exports = simpleClone;

/***/ }),
/* 213 */
/***/ (function(module, exports) {

module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// identity function for calling harmony imports with the correct context
/******/ 	__webpack_require__.i = function(value) { return value; };
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.connectToDevTools = connectToDevTools;\n\nvar _bridge = __webpack_require__(1);\n\nvar _setupRelayDebugger = __webpack_require__(2);\n\n/**\n * Copyright (c) 2017-present, Facebook, Inc.\n * All rights reserved.\n *\n * This source code is licensed under the BSD-style license found in the\n * LICENSE file in the root directory of this source tree. An additional grant\n * of patent rights can be found in the PATENTS file in the same directory.\n */\n\n/* eslint-disable no-console */\nfunction connectToDevTools(options) {\n  var _ref = options || {},\n      _ref$host = _ref.host,\n      host = _ref$host === undefined ? 'localhost' : _ref$host,\n      _ref$port = _ref.port,\n      port = _ref$port === undefined ? 8098 : _ref$port,\n      _ref$isAppActive = _ref.isAppActive,\n      isAppActive = _ref$isAppActive === undefined ? function () {\n    return true;\n  } : _ref$isAppActive;\n\n  function scheduleRetry() {\n    setTimeout(function () {\n      return connectToDevTools(options);\n    }, 2000);\n  }\n\n  if (!isAppActive()) {\n    // If the app is in background, maybe retry later.\n    // Don't actually attempt to connect until we're in foreground.\n    scheduleRetry();\n    return;\n  }\n\n  var messageListeners = [];\n  var closeListeners = [];\n  var uri = 'ws://' + host + ':' + port;\n  var ws = new window.WebSocket(uri);\n  ws.onclose = handleClose;\n  ws.onerror = handleClose;\n  ws.onmessage = handleMessage;\n  ws.onopen = function () {\n    var wall = {\n      listen: function listen(fn) {\n        messageListeners.push(fn);\n      },\n      onClose: function onClose(fn) {\n        closeListeners.push(fn);\n      },\n      send: function send(data) {\n        ws.send(JSON.stringify(data));\n      }\n    };\n    setupBackend(wall);\n  };\n\n  var hasClosed = false;\n  function handleClose() {\n    if (!hasClosed) {\n      hasClosed = true;\n      scheduleRetry();\n      closeListeners.forEach(function (fn) {\n        return fn();\n      });\n    }\n  }\n\n  function handleMessage(evt) {\n    var data = void 0;\n    try {\n      data = JSON.parse(evt.data);\n    } catch (e) {\n      console.error('failed to parse json: ' + evt.data);\n      return;\n    }\n    messageListeners.forEach(function (fn) {\n      try {\n        fn(data);\n      } catch (e) {\n        // jsc doesn't play so well with tracebacks that go into eval'd code,\n        // so the stack trace here will stop at the `eval()` call. Getting the\n        // message that caused the error is the best we can do for now.\n        console.log(data);\n        throw e;\n      }\n    });\n  }\n}\n\nfunction setupBackend(wall) {\n  var bridge = new _bridge.Bridge(wall);\n  (0, _setupRelayDebugger.setupRelayDebugger)(bridge, window.__RELAY_DEBUGGER__);\n}\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/index.js\n// module id = 0\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\n\nvar _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if (\"value\" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();\n\nfunction _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }\n\nfunction _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError(\"Cannot call a class as a function\"); } }\n\n/**\n * Copyright (c) 2015-present, Facebook, Inc.\n * All rights reserved.\n *\n * This source code is licensed under the BSD-style license found in the\n * LICENSE file in the root directory of this source tree. An additional grant\n * of patent rights can be found in the PATENTS file in the same directory.\n */\n\n// A simplified version of Bridge copied from react-devtools\n\n// Use the polyfill if the function is not native implementation\nfunction getWindowFunction(name, polyfill) {\n  if (String(window[name]).indexOf('[native code]') === -1) {\n    return polyfill;\n  }\n  return window[name];\n}\n\n// Custom polyfill that runs the queue with a backoff.\n// If you change it, make sure it behaves reasonably well in Firefox.\nvar cancelIdleCallback = getWindowFunction('cancelIdleCallback', clearTimeout);\n\nvar requestIdleCallback = getWindowFunction('requestIdleCallback', function (cb) {\n  return setTimeout(function () {\n    cb({\n      didTimeout: false,\n      timeRemaining: function timeRemaining() {\n        return Infinity;\n      }\n    });\n  }, 500);\n});\n\nvar Bridge = exports.Bridge = function () {\n  function Bridge(wall) {\n    _classCallCheck(this, Bridge);\n\n    this._cbs = new Map();\n    this._inspectables = new Map();\n    this._cid = 0;\n    this._listeners = {};\n    this._buffer = [];\n    this._flushHandle = null;\n    this._callers = {};\n    this._paused = false;\n    this._wall = wall;\n\n    wall.listen(this._handleMessage.bind(this));\n  }\n\n  _createClass(Bridge, [{\n    key: 'call',\n    value: function call(name, args, cb) {\n      var _cid = this._cid++;\n      this._cbs.set(_cid, cb);\n\n      this._wall.send({\n        type: 'call',\n        callback: _cid,\n        args: args,\n        name: name\n      });\n    }\n  }, {\n    key: 'onCall',\n    value: function onCall(name, handler) {\n      if (this._callers[name]) {\n        throw new Error('only one call handler per call name allowed');\n      }\n      this._callers[name] = handler;\n    }\n  }, {\n    key: 'pause',\n    value: function pause() {\n      this._wall.send({\n        type: 'pause'\n      });\n    }\n  }, {\n    key: 'resume',\n    value: function resume() {\n      this._wall.send({\n        type: 'resume'\n      });\n    }\n  }, {\n    key: 'send',\n    value: function send(evt, data) {\n      this._buffer.push({ evt: evt, data: data });\n      this.scheduleFlush();\n    }\n  }, {\n    key: 'scheduleFlush',\n    value: function scheduleFlush() {\n      if (!this._flushHandle && this._buffer.length) {\n        var timeout = this._paused ? 5000 : 500;\n        this._flushHandle = requestIdleCallback(this.flushBufferWhileIdle.bind(this), { timeout: timeout });\n      }\n    }\n  }, {\n    key: 'cancelFlush',\n    value: function cancelFlush() {\n      if (this._flushHandle) {\n        cancelIdleCallback(this._flushHandle);\n        this._flushHandle = null;\n      }\n    }\n  }, {\n    key: 'flushBufferWhileIdle',\n    value: function flushBufferWhileIdle(deadline) {\n      this._flushHandle = null;\n\n      // Magic numbers were determined by tweaking in a heavy UI and seeing\n      // what performs reasonably well both when DevTools are hidden and visible.\n      // The goal is that we try to catch up but avoid blocking the UI.\n      // When paused, it's okay to lag more, but not forever because otherwise\n      // when user activates React tab, it will freeze syncing.\n      var chunkCount = this._paused ? 20 : 10;\n      var chunkSize = Math.round(this._buffer.length / chunkCount);\n      var minChunkSize = this._paused ? 50 : 100;\n\n      while (this._buffer.length && (deadline.timeRemaining() > 0 || deadline.didTimeout)) {\n        var take = Math.min(this._buffer.length, Math.max(minChunkSize, chunkSize));\n        var currentBuffer = this._buffer.splice(0, take);\n        this.flushBufferSlice(currentBuffer);\n      }\n\n      if (this._buffer.length) {\n        this.scheduleFlush();\n      }\n    }\n  }, {\n    key: 'flushBufferSlice',\n    value: function flushBufferSlice(bufferSlice) {\n      var events = bufferSlice.map(function (_ref) {\n        var evt = _ref.evt,\n            data = _ref.data;\n\n        return { type: 'event', evt: evt, data: data };\n      });\n      this._wall.send({ type: 'many-events', events: events });\n    }\n  }, {\n    key: 'on',\n    value: function on(evt, fn) {\n      if (!this._listeners[evt]) {\n        this._listeners[evt] = [fn];\n      } else {\n        this._listeners[evt].push(fn);\n      }\n    }\n  }, {\n    key: 'off',\n    value: function off(evt, fn) {\n      if (!this._listeners[evt]) {\n        return;\n      }\n      var ix = this._listeners[evt].indexOf(fn);\n      if (ix !== -1) {\n        this._listeners[evt].splice(ix, 1);\n      }\n    }\n  }, {\n    key: 'once',\n    value: function once(evt, fn) {\n      var self = this;\n      var listener = function listener() {\n        fn.apply(this, arguments);\n        self.off(evt, listener);\n      };\n      this.on(evt, listener);\n    }\n  }, {\n    key: '_handleMessage',\n    value: function _handleMessage(payload) {\n      var _this = this;\n\n      if (payload.type === 'resume') {\n        this._paused = false;\n        this.scheduleFlush();\n        return;\n      }\n\n      if (payload.type === 'pause') {\n        this._paused = true;\n        this.cancelFlush();\n        return;\n      }\n\n      if (payload.type === 'callback') {\n        var callback = this._cbs.get(payload.id);\n        if (callback) {\n          callback.apply(undefined, _toConsumableArray(payload.args));\n          this._cbs.delete(payload.id);\n        }\n        return;\n      }\n\n      if (payload.type === 'call') {\n        this._handleCall(payload.name, payload.args, payload.callback);\n        return;\n      }\n\n      if (payload.type === 'event') {\n        var fns = this._listeners[payload.evt];\n        var data = payload.data;\n        if (fns) {\n          fns.forEach(function (fn) {\n            return fn(data);\n          });\n        }\n      }\n\n      if (payload.type === 'many-events') {\n        payload.events.forEach(function (event) {\n          var handlers = _this._listeners[event.evt];\n          if (handlers) {\n            handlers.forEach(function (fn) {\n              return fn(event.data);\n            });\n          }\n        });\n      }\n    }\n  }, {\n    key: '_handleCall',\n    value: function _handleCall(name, args, callback) {\n      if (!this._callers[name]) {\n        // eslint-disable-next-line no-console\n        console.warn('unknown call: \"' + name + '\"');\n        return;\n      }\n      var argsList = !Array.isArray(args) ? [args] : args;\n      var result = void 0;\n      try {\n        result = this._callers[name].apply(null, argsList);\n      } catch (e) {\n        // eslint-disable-next-line no-console\n        console.error('Failed to call', e);\n        return;\n      }\n      this._wall.send({\n        type: 'callback',\n        id: callback,\n        args: [result]\n      });\n    }\n  }]);\n\n  return Bridge;\n}();\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/bridge.js\n// module id = 1\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/bridge.js?");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
eval("\n\nObject.defineProperty(exports, \"__esModule\", {\n  value: true\n});\nexports.setupRelayDebugger = setupRelayDebugger;\n/**\n * Copyright (c) 2017-present, Facebook, Inc.\n * All rights reserved.\n *\n * This source code is licensed under the BSD-style license found in the\n * LICENSE file in the root directory of this source tree. An additional grant\n * of patent rights can be found in the PATENTS file in the same directory.\n */\n\nfunction setupRelayDebugger(bridge, debuggerObject) {\n  var shouldEnable = Boolean(debuggerObject);\n\n  bridge.onCall('relayDebugger:check', function () {\n    return shouldEnable;\n  });\n\n  if (!shouldEnable) {\n    return;\n  }\n\n  bridge.onCall('relayDebugger:getEnvironments', function () {\n    return debuggerObject.getRegisteredEnvironmentIds();\n  });\n\n  bridge.onCall('relayDebugger:getRecord', function (env, id) {\n    return debuggerObject.getEnvironmentDebugger(env).getRecord(id);\n  });\n\n  bridge.onCall('relayDebugger:getMatchingRecords', function (env, search, type) {\n    return debuggerObject.getEnvironmentDebugger(env).getMatchingRecords(search, type);\n  });\n\n  bridge.onCall('relayDebugger:checkDirty', function (env) {\n    var envDebugger = debuggerObject.getEnvironmentDebugger(env);\n    var isDirty = envDebugger.isDirty();\n    envDebugger.resetDirty();\n    return isDirty;\n  });\n\n  bridge.onCall('relayDebugger:startRecording', function (env) {\n    debuggerObject.getEnvironmentDebugger(env).startRecordingMutationEvents();\n  });\n\n  bridge.onCall('relayDebugger:stopRecording', function (env) {\n    debuggerObject.getEnvironmentDebugger(env).stopRecordingMutationEvents();\n  });\n\n  bridge.onCall('relayDebugger:getRecordedEvents', function (env) {\n    var events = debuggerObject.getEnvironmentDebugger(env).getRecordedMutationEvents();\n\n    // serialize errors\n    events.forEach(function (event) {\n      if (event.payload instanceof Error) {\n        event.payload = { isError: true, message: event.payload.message };\n      }\n    });\n\n    return events;\n  });\n}\n\n//////////////////\n// WEBPACK FOOTER\n// ./src/setupRelayDebugger.js\n// module id = 2\n// module chunks = 0\n\n//# sourceURL=webpack:///./src/setupRelayDebugger.js?");

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

eval("module.exports = __webpack_require__(0);\n\n\n//////////////////\n// WEBPACK FOOTER\n// multi ./src/index.js\n// module id = 3\n// module chunks = 0\n\n//# sourceURL=webpack:///multi_./src/index.js?");

/***/ })
/******/ ]);

/***/ }),
/* 214 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayError
 * 
 * @format
 */



var _toConsumableArray3 = _interopRequireDefault(__webpack_require__(215));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * @internal
 *
 * Factory methods for constructing errors in Relay.
 */
var RelayError = {
  create: function create(name, format) {
    for (var _len = arguments.length, args = Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      args[_key - 2] = arguments[_key];
    }

    return createError('mustfix', name, format, args);
  },
  createWarning: function createWarning(name, format) {
    for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
      args[_key2 - 2] = arguments[_key2];
    }

    return createError('warn', name, format, args);
  }
};

/**
 * @private
 */
function createError(type, name, format, args) {
  var error = new Error(__webpack_require__(35).apply(undefined, [format].concat((0, _toConsumableArray3['default'])(args))));
  error.name = name;
  error.type = type;
  error.framesToPop = 2;
  return error;
}

module.exports = RelayError;

/***/ }),
/* 215 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _from = __webpack_require__(216);

var _from2 = _interopRequireDefault(_from);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) {
      arr2[i] = arr[i];
    }

    return arr2;
  } else {
    return (0, _from2.default)(arr);
  }
};

/***/ }),
/* 216 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(217), __esModule: true };

/***/ }),
/* 217 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(218);
__webpack_require__(228);
module.exports = __webpack_require__(39).Array.from;


/***/ }),
/* 218 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $at = __webpack_require__(219)(true);

// 21.1.3.27 String.prototype[@@iterator]()
__webpack_require__(220)(String, 'String', function (iterated) {
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function () {
  var O = this._t;
  var index = this._i;
  var point;
  if (index >= O.length) return { value: undefined, done: true };
  point = $at(O, index);
  this._i += point.length;
  return { value: point, done: false };
});


/***/ }),
/* 219 */
/***/ (function(module, exports, __webpack_require__) {

var toInteger = __webpack_require__(88);
var defined = __webpack_require__(87);
// true  -> String#at
// false -> String#codePointAt
module.exports = function (TO_STRING) {
  return function (that, pos) {
    var s = String(defined(that));
    var i = toInteger(pos);
    var l = s.length;
    var a, b;
    if (i < 0 || i >= l) return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};


/***/ }),
/* 220 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var LIBRARY = __webpack_require__(221);
var $export = __webpack_require__(51);
var redefine = __webpack_require__(222);
var hide = __webpack_require__(52);
var has = __webpack_require__(56);
var Iterators = __webpack_require__(95);
var $iterCreate = __webpack_require__(223);
var setToStringTag = __webpack_require__(136);
var getPrototypeOf = __webpack_require__(227);
var ITERATOR = __webpack_require__(26)('iterator');
var BUGGY = !([].keys && 'next' in [].keys()); // Safari has buggy iterators w/o `next`
var FF_ITERATOR = '@@iterator';
var KEYS = 'keys';
var VALUES = 'values';

var returnThis = function () { return this; };

module.exports = function (Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED) {
  $iterCreate(Constructor, NAME, next);
  var getMethod = function (kind) {
    if (!BUGGY && kind in proto) return proto[kind];
    switch (kind) {
      case KEYS: return function keys() { return new Constructor(this, kind); };
      case VALUES: return function values() { return new Constructor(this, kind); };
    } return function entries() { return new Constructor(this, kind); };
  };
  var TAG = NAME + ' Iterator';
  var DEF_VALUES = DEFAULT == VALUES;
  var VALUES_BUG = false;
  var proto = Base.prototype;
  var $native = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT];
  var $default = $native || getMethod(DEFAULT);
  var $entries = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined;
  var $anyNative = NAME == 'Array' ? proto.entries || $native : $native;
  var methods, key, IteratorPrototype;
  // Fix native
  if ($anyNative) {
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base()));
    if (IteratorPrototype !== Object.prototype && IteratorPrototype.next) {
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if (!LIBRARY && !has(IteratorPrototype, ITERATOR)) hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if (DEF_VALUES && $native && $native.name !== VALUES) {
    VALUES_BUG = true;
    $default = function values() { return $native.call(this); };
  }
  // Define iterator
  if ((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])) {
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG] = returnThis;
  if (DEFAULT) {
    methods = {
      values: DEF_VALUES ? $default : getMethod(VALUES),
      keys: IS_SET ? $default : getMethod(KEYS),
      entries: $entries
    };
    if (FORCED) for (key in methods) {
      if (!(key in proto)) redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};


/***/ }),
/* 221 */
/***/ (function(module, exports) {

module.exports = true;


/***/ }),
/* 222 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(52);


/***/ }),
/* 223 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var create = __webpack_require__(224);
var descriptor = __webpack_require__(85);
var setToStringTag = __webpack_require__(136);
var IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
__webpack_require__(52)(IteratorPrototype, __webpack_require__(26)('iterator'), function () { return this; });

module.exports = function (Constructor, NAME, next) {
  Constructor.prototype = create(IteratorPrototype, { next: descriptor(1, next) });
  setToStringTag(Constructor, NAME + ' Iterator');
};


/***/ }),
/* 224 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject = __webpack_require__(53);
var dPs = __webpack_require__(225);
var enumBugKeys = __webpack_require__(130);
var IE_PROTO = __webpack_require__(89)('IE_PROTO');
var Empty = function () { /* empty */ };
var PROTOTYPE = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function () {
  // Thrash, waste and sodomy: IE GC bug
  var iframe = __webpack_require__(121)('iframe');
  var i = enumBugKeys.length;
  var lt = '<';
  var gt = '>';
  var iframeDocument;
  iframe.style.display = 'none';
  __webpack_require__(226).appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while (i--) delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties) {
  var result;
  if (O !== null) {
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty();
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};


/***/ }),
/* 225 */
/***/ (function(module, exports, __webpack_require__) {

var dP = __webpack_require__(40);
var anObject = __webpack_require__(53);
var getKeys = __webpack_require__(123);

module.exports = __webpack_require__(41) ? Object.defineProperties : function defineProperties(O, Properties) {
  anObject(O);
  var keys = getKeys(Properties);
  var length = keys.length;
  var i = 0;
  var P;
  while (length > i) dP.f(O, P = keys[i++], Properties[P]);
  return O;
};


/***/ }),
/* 226 */
/***/ (function(module, exports, __webpack_require__) {

var document = __webpack_require__(38).document;
module.exports = document && document.documentElement;


/***/ }),
/* 227 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has = __webpack_require__(56);
var toObject = __webpack_require__(90);
var IE_PROTO = __webpack_require__(89)('IE_PROTO');
var ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function (O) {
  O = toObject(O);
  if (has(O, IE_PROTO)) return O[IE_PROTO];
  if (typeof O.constructor == 'function' && O instanceof O.constructor) {
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};


/***/ }),
/* 228 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ctx = __webpack_require__(120);
var $export = __webpack_require__(51);
var toObject = __webpack_require__(90);
var call = __webpack_require__(229);
var isArrayIter = __webpack_require__(230);
var toLength = __webpack_require__(127);
var createProperty = __webpack_require__(231);
var getIterFn = __webpack_require__(232);

$export($export.S + $export.F * !__webpack_require__(234)(function (iter) { Array.from(iter); }), 'Array', {
  // 22.1.2.1 Array.from(arrayLike, mapfn = undefined, thisArg = undefined)
  from: function from(arrayLike /* , mapfn = undefined, thisArg = undefined */) {
    var O = toObject(arrayLike);
    var C = typeof this == 'function' ? this : Array;
    var aLen = arguments.length;
    var mapfn = aLen > 1 ? arguments[1] : undefined;
    var mapping = mapfn !== undefined;
    var index = 0;
    var iterFn = getIterFn(O);
    var length, result, step, iterator;
    if (mapping) mapfn = ctx(mapfn, aLen > 2 ? arguments[2] : undefined, 2);
    // if object isn't iterable or it's array with default iterator - use simple case
    if (iterFn != undefined && !(C == Array && isArrayIter(iterFn))) {
      for (iterator = iterFn.call(O), result = new C(); !(step = iterator.next()).done; index++) {
        createProperty(result, index, mapping ? call(iterator, mapfn, [step.value, index], true) : step.value);
      }
    } else {
      length = toLength(O.length);
      for (result = new C(length); length > index; index++) {
        createProperty(result, index, mapping ? mapfn(O[index], index) : O[index]);
      }
    }
    result.length = index;
    return result;
  }
});


/***/ }),
/* 229 */
/***/ (function(module, exports, __webpack_require__) {

// call something on iterator step with safe closing on error
var anObject = __webpack_require__(53);
module.exports = function (iterator, fn, value, entries) {
  try {
    return entries ? fn(anObject(value)[0], value[1]) : fn(value);
  // 7.4.6 IteratorClose(iterator, completion)
  } catch (e) {
    var ret = iterator['return'];
    if (ret !== undefined) anObject(ret.call(iterator));
    throw e;
  }
};


/***/ }),
/* 230 */
/***/ (function(module, exports, __webpack_require__) {

// check on default Array iterator
var Iterators = __webpack_require__(95);
var ITERATOR = __webpack_require__(26)('iterator');
var ArrayProto = Array.prototype;

module.exports = function (it) {
  return it !== undefined && (Iterators.Array === it || ArrayProto[ITERATOR] === it);
};


/***/ }),
/* 231 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var $defineProperty = __webpack_require__(40);
var createDesc = __webpack_require__(85);

module.exports = function (object, index, value) {
  if (index in object) $defineProperty.f(object, index, createDesc(0, value));
  else object[index] = value;
};


/***/ }),
/* 232 */
/***/ (function(module, exports, __webpack_require__) {

var classof = __webpack_require__(233);
var ITERATOR = __webpack_require__(26)('iterator');
var Iterators = __webpack_require__(95);
module.exports = __webpack_require__(39).getIteratorMethod = function (it) {
  if (it != undefined) return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};


/***/ }),
/* 233 */
/***/ (function(module, exports, __webpack_require__) {

// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = __webpack_require__(126);
var TAG = __webpack_require__(26)('toStringTag');
// ES3 wrong here
var ARG = cof(function () { return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function (it, key) {
  try {
    return it[key];
  } catch (e) { /* empty */ }
};

module.exports = function (it) {
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};


/***/ }),
/* 234 */
/***/ (function(module, exports, __webpack_require__) {

var ITERATOR = __webpack_require__(26)('iterator');
var SAFE_CLOSING = false;

try {
  var riter = [7][ITERATOR]();
  riter['return'] = function () { SAFE_CLOSING = true; };
  // eslint-disable-next-line no-throw-literal
  Array.from(riter, function () { throw 2; });
} catch (e) { /* empty */ }

module.exports = function (exec, skipClosing) {
  if (!skipClosing && !SAFE_CLOSING) return false;
  var safe = false;
  try {
    var arr = [7];
    var iter = arr[ITERATOR]();
    iter.next = function () { return { done: safe = true }; };
    arr[ITERATOR] = function () { return iter; };
    exec(arr);
  } catch (e) { /* empty */ }
  return safe;
};


/***/ }),
/* 235 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayNetwork
 * 
 * @format
 */



var _require = __webpack_require__(236),
    convertFetch = _require.convertFetch,
    convertSubscribe = _require.convertSubscribe;

/**
 * Creates an implementation of the `Network` interface defined in
 * `RelayNetworkTypes` given `fetch` and `subscribe` functions.
 */
function create(fetchFn, subscribeFn) {
  // Convert to functions that returns RelayObservable.
  var observeFetch = convertFetch(fetchFn);
  var observeSubscribe = subscribeFn ? convertSubscribe(subscribeFn) : undefined;

  function execute(operation, variables, cacheConfig, uploadables) {
    if (operation.query.operation === 'subscription') {
      __webpack_require__(0)(observeSubscribe, 'RelayNetwork: This network layer does not support Subscriptions. ' + 'To use Subscriptions, provide a custom network layer.');

      __webpack_require__(0)(!uploadables, 'RelayNetwork: Cannot provide uploadables while subscribing.');
      return observeSubscribe(operation, variables, cacheConfig);
    }

    var pollInterval = cacheConfig.poll;
    if (pollInterval != null) {
      __webpack_require__(0)(!uploadables, 'RelayNetwork: Cannot provide uploadables while polling.');
      return observeFetch(operation, variables, { force: true }).poll(pollInterval);
    }

    return observeFetch(operation, variables, cacheConfig, uploadables);
  }

  return { execute: execute };
}

module.exports = { create: create };

/***/ }),
/* 236 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ConvertToExecuteFunction
 * 
 * @format
 */



/**
 * Converts a FetchFunction into an ExecuteFunction for use by RelayNetwork.
 */
function convertFetch(fn) {
  return function fetch(operation, variables, cacheConfig, uploadables) {
    var result = fn(operation, variables, cacheConfig, uploadables);
    // Note: We allow FetchFunction to directly return Error to indicate
    // a failure to fetch. To avoid handling this special case throughout the
    // Relay codebase, it is explicitly handled here.
    if (result instanceof Error) {
      return new (__webpack_require__(59))(function (sink) {
        return sink.error(result);
      });
    }
    return __webpack_require__(59).from(result);
  };
}

/**
 * Converts a SubscribeFunction into an ExecuteFunction for use by RelayNetwork.
 */
function convertSubscribe(fn) {
  return function subscribe(operation, variables, cacheConfig) {
    return __webpack_require__(59).fromLegacy(function (observer) {
      return fn(operation, variables, cacheConfig, observer);
    });
  };
}

module.exports = {
  convertFetch: convertFetch,
  convertSubscribe: convertSubscribe
};

/***/ }),
/* 237 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isPromise
 * 
 * @format
 */



function isPromise(p) {
  return !!p && typeof p.then === 'function';
}

module.exports = isPromise;

/***/ }),
/* 238 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayQueryResponseCache
 * 
 * @format
 */



var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * A cache for storing query responses, featuring:
 * - `get` with TTL
 * - cache size limiting, with least-recently *updated* entries purged first
 */
var RelayQueryResponseCache = function () {
  function RelayQueryResponseCache(_ref) {
    var size = _ref.size,
        ttl = _ref.ttl;
    (0, _classCallCheck3['default'])(this, RelayQueryResponseCache);

    __webpack_require__(0)(size > 0, 'RelayQueryResponseCache: Expected the max cache size to be > 0, got ' + '`%s`.', size);
    __webpack_require__(0)(ttl > 0, 'RelayQueryResponseCache: Expected the max ttl to be > 0, got `%s`.', ttl);
    this._responses = new Map();
    this._size = size;
    this._ttl = ttl;
  }

  RelayQueryResponseCache.prototype.clear = function clear() {
    this._responses.clear();
  };

  RelayQueryResponseCache.prototype.get = function get(queryID, variables) {
    var _this = this;

    var cacheKey = getCacheKey(queryID, variables);
    this._responses.forEach(function (response, key) {
      if (!isCurrent(response.fetchTime, _this._ttl)) {
        _this._responses['delete'](key);
      }
    });
    var response = this._responses.get(cacheKey);
    return response != null ? response.payload : null;
  };

  RelayQueryResponseCache.prototype.set = function set(queryID, variables, payload) {
    var fetchTime = Date.now();
    var cacheKey = getCacheKey(queryID, variables);
    this._responses['delete'](cacheKey); // deletion resets key ordering
    this._responses.set(cacheKey, {
      fetchTime: fetchTime,
      payload: payload
    });
    // Purge least-recently updated key when max size reached
    if (this._responses.size > this._size) {
      var firstKey = this._responses.keys().next();
      if (!firstKey.done) {
        this._responses['delete'](firstKey.value);
      }
    }
  };

  return RelayQueryResponseCache;
}();

function getCacheKey(queryID, variables) {
  return __webpack_require__(86)({ queryID: queryID, variables: variables });
}

/**
 * Determine whether a response fetched at `fetchTime` is still valid given
 * some `ttl`.
 */
function isCurrent(fetchTime, ttl) {
  return fetchTime + ttl >= Date.now();
}

module.exports = RelayQueryResponseCache;

/***/ }),
/* 239 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayMarkSweepStore
 * 
 * @format
 */



var _extends3 = _interopRequireDefault(__webpack_require__(25));

var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = __webpack_require__(5),
    UNPUBLISH_RECORD_SENTINEL = _require.UNPUBLISH_RECORD_SENTINEL;

/**
 * @public
 *
 * An implementation of the `Store` interface defined in `RelayStoreTypes`.
 *
 * Note that a Store takes ownership of all records provided to it: other
 * objects may continue to hold a reference to such records but may not mutate
 * them. The static Relay core is architected to avoid mutating records that may have been
 * passed to a store: operations that mutate records will either create fresh
 * records or clone existing records and modify the clones. Record immutability
 * is also enforced in development mode by freezing all records passed to a store.
 */
var RelayMarkSweepStore = function () {
  function RelayMarkSweepStore(source) {
    (0, _classCallCheck3['default'])(this, RelayMarkSweepStore);

    // Prevent mutation of a record from outside the store.
    if (process.env.NODE_ENV !== 'production') {
      var storeIDs = source.getRecordIDs();
      for (var ii = 0; ii < storeIDs.length; ii++) {
        var record = source.get(storeIDs[ii]);
        if (record) {
          __webpack_require__(1).freeze(record);
        }
      }
    }
    this._hasScheduledGC = false;
    this._index = 0;
    this._recordSource = source;
    this._roots = new Map();
    this._subscriptions = new Set();
    this._updatedRecordIDs = {};
  }

  RelayMarkSweepStore.prototype.getSource = function getSource() {
    return this._recordSource;
  };

  RelayMarkSweepStore.prototype.check = function check(selector) {
    return __webpack_require__(137).check(this._recordSource, this._recordSource, selector, []);
  };

  RelayMarkSweepStore.prototype.retain = function retain(selector) {
    var _this = this;

    var index = this._index++;
    var dispose = function dispose() {
      _this._roots['delete'](index);
      _this._scheduleGC();
    };
    this._roots.set(index, selector);
    return { dispose: dispose };
  };

  RelayMarkSweepStore.prototype.lookup = function lookup(selector) {
    var snapshot = __webpack_require__(93).read(this._recordSource, selector);
    if (process.env.NODE_ENV !== 'production') {
      __webpack_require__(57)(snapshot);
    }
    return snapshot;
  };

  RelayMarkSweepStore.prototype.notify = function notify() {
    var _this2 = this;

    this._subscriptions.forEach(function (subscription) {
      _this2._updateSubscription(subscription);
    });
    this._updatedRecordIDs = {};
  };

  RelayMarkSweepStore.prototype.publish = function publish(source) {
    updateTargetFromSource(this._recordSource, source, this._updatedRecordIDs);
  };

  RelayMarkSweepStore.prototype.subscribe = function subscribe(snapshot, callback) {
    var _this3 = this;

    var subscription = { callback: callback, snapshot: snapshot };
    var dispose = function dispose() {
      _this3._subscriptions['delete'](subscription);
    };
    this._subscriptions.add(subscription);
    return { dispose: dispose };
  };

  // Internal API


  RelayMarkSweepStore.prototype.__getUpdatedRecordIDs = function __getUpdatedRecordIDs() {
    return this._updatedRecordIDs;
  };

  RelayMarkSweepStore.prototype._updateSubscription = function _updateSubscription(subscription) {
    var callback = subscription.callback,
        snapshot = subscription.snapshot;

    if (!__webpack_require__(240)(snapshot, this._updatedRecordIDs)) {
      return;
    }

    var _RelayReader$read = __webpack_require__(93).read(this._recordSource, snapshot),
        data = _RelayReader$read.data,
        seenRecords = _RelayReader$read.seenRecords;

    var nextData = __webpack_require__(241)(snapshot.data, data);
    var nextSnapshot = (0, _extends3['default'])({}, snapshot, {
      data: nextData,
      seenRecords: seenRecords
    });
    if (process.env.NODE_ENV !== 'production') {
      __webpack_require__(57)(nextSnapshot);
    }
    subscription.snapshot = nextSnapshot;
    if (nextSnapshot.data !== snapshot.data) {
      callback(nextSnapshot);
    }
  };

  RelayMarkSweepStore.prototype._scheduleGC = function _scheduleGC() {
    var _this4 = this;

    if (this._hasScheduledGC) {
      return;
    }
    this._hasScheduledGC = true;
    __webpack_require__(242)(function () {
      _this4._gc();
      _this4._hasScheduledGC = false;
    });
  };

  RelayMarkSweepStore.prototype._gc = function _gc() {
    var _this5 = this;

    var references = new Set();
    // Mark all records that are traversable from a root
    this._roots.forEach(function (selector) {
      __webpack_require__(252).mark(_this5._recordSource, selector, references);
    });
    // Short-circuit if *nothing* is referenced
    if (!references.size) {
      this._recordSource.clear();
      return;
    }
    // Evict any unreferenced nodes
    var storeIDs = this._recordSource.getRecordIDs();
    for (var ii = 0; ii < storeIDs.length; ii++) {
      var dataID = storeIDs[ii];
      if (!references.has(dataID)) {
        this._recordSource.remove(dataID);
      }
    }
  };

  return RelayMarkSweepStore;
}();

/**
 * Updates the target with information from source, also updating a mapping of
 * which records in the target were changed as a result.
 */


function updateTargetFromSource(target, source, updatedRecordIDs) {
  var dataIDs = source.getRecordIDs();
  for (var ii = 0; ii < dataIDs.length; ii++) {
    var dataID = dataIDs[ii];
    var sourceRecord = source.get(dataID);
    var targetRecord = target.get(dataID);
    // Prevent mutation of a record from outside the store.
    if (process.env.NODE_ENV !== 'production') {
      if (sourceRecord) {
        __webpack_require__(1).freeze(sourceRecord);
      }
    }
    if (sourceRecord === UNPUBLISH_RECORD_SENTINEL) {
      // Unpublish a record
      target.remove(dataID);
      updatedRecordIDs[dataID] = true;
    } else if (sourceRecord && targetRecord) {
      var nextRecord = __webpack_require__(1).update(targetRecord, sourceRecord);
      if (nextRecord !== targetRecord) {
        // Prevent mutation of a record from outside the store.
        if (process.env.NODE_ENV !== 'production') {
          __webpack_require__(1).freeze(nextRecord);
        }
        updatedRecordIDs[dataID] = true;
        target.set(dataID, nextRecord);
      }
    } else if (sourceRecord === null) {
      target['delete'](dataID);
      if (targetRecord !== null) {
        updatedRecordIDs[dataID] = true;
      }
    } else if (sourceRecord) {
      target.set(dataID, sourceRecord);
      updatedRecordIDs[dataID] = true;
    } // don't add explicit undefined
  }
}

__webpack_require__(131).instrumentMethods(RelayMarkSweepStore.prototype, {
  lookup: 'RelayMarkSweepStore.prototype.lookup',
  notify: 'RelayMarkSweepStore.prototype.notify',
  publish: 'RelayMarkSweepStore.prototype.publish',
  retain: 'RelayMarkSweepStore.prototype.retain',
  subscribe: 'RelayMarkSweepStore.prototype.subscribe'
});

module.exports = RelayMarkSweepStore;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 240 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule hasOverlappingIDs
 * 
 * @format
 */



function hasOverlappingIDs(snapshot, updatedRecordIDs) {
  var keys = Object.keys(snapshot.seenRecords);
  for (var ii = 0; ii < keys.length; ii++) {
    if (updatedRecordIDs.hasOwnProperty(keys[ii])) {
      return true;
    }
  }
  return false;
}

module.exports = hasOverlappingIDs;

/***/ }),
/* 241 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule recycleNodesInto
 * 
 * @format
 */



/**
 * Recycles subtrees from `prevData` by replacing equal subtrees in `nextData`.
 */

function recycleNodesInto(prevData, nextData) {
  if (prevData === nextData || typeof prevData !== 'object' || !prevData || typeof nextData !== 'object' || !nextData) {
    return nextData;
  }
  var canRecycle = false;

  // Assign local variables to preserve Flow type refinement.
  var prevArray = Array.isArray(prevData) ? prevData : null;
  var nextArray = Array.isArray(nextData) ? nextData : null;
  if (prevArray && nextArray) {
    canRecycle = nextArray.reduce(function (wasEqual, nextItem, ii) {
      var prevValue = prevArray[ii];
      var nextValue = recycleNodesInto(prevValue, nextItem);
      if (nextValue !== nextArray[ii]) {
        nextArray[ii] = nextValue;
      }
      return wasEqual && nextArray[ii] === prevArray[ii];
    }, true) && prevArray.length === nextArray.length;
  } else if (!prevArray && !nextArray) {
    // Assign local variables to preserve Flow type refinement.
    var prevObject = prevData;
    var nextObject = nextData;
    var prevKeys = Object.keys(prevObject);
    var nextKeys = Object.keys(nextObject);
    canRecycle = nextKeys.reduce(function (wasEqual, key) {
      var prevValue = prevObject[key];
      var nextValue = recycleNodesInto(prevValue, nextObject[key]);
      if (nextValue !== nextObject[key]) {
        nextObject[key] = nextValue;
      }
      return wasEqual && nextObject[key] === prevObject[key];
    }, true) && prevKeys.length === nextKeys.length;
  }
  return canRecycle ? prevData : nextData;
}

module.exports = recycleNodesInto;

/***/ }),
/* 242 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Promise = __webpack_require__(243);

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * 
 */

var resolvedPromise = Promise.resolve();

/**
 * An alternative to setImmediate based on Promise.
 */
function resolveImmediate(callback) {
  resolvedPromise.then(callback)["catch"](throwNext);
}

function throwNext(error) {
  setTimeout(function () {
    throw error;
  }, 0);
}

module.exports = resolveImmediate;

/***/ }),
/* 243 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Copyright (c) 2013-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */

module.exports = __webpack_require__(244);

/***/ }),
/* 244 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(245)


/***/ }),
/* 245 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = __webpack_require__(36);
__webpack_require__(246);
__webpack_require__(247);
__webpack_require__(248);
__webpack_require__(249);
__webpack_require__(251);


/***/ }),
/* 246 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Promise = __webpack_require__(36);

module.exports = Promise;
Promise.prototype.done = function (onFulfilled, onRejected) {
  var self = arguments.length ? this.then.apply(this, arguments) : this;
  self.then(null, function (err) {
    setTimeout(function () {
      throw err;
    }, 0);
  });
};


/***/ }),
/* 247 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Promise = __webpack_require__(36);

module.exports = Promise;
Promise.prototype['finally'] = function (f) {
  return this.then(function (value) {
    return Promise.resolve(f()).then(function () {
      return value;
    });
  }, function (err) {
    return Promise.resolve(f()).then(function () {
      throw err;
    });
  });
};


/***/ }),
/* 248 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


//This file contains the ES6 extensions to the core Promises/A+ API

var Promise = __webpack_require__(36);

module.exports = Promise;

/* Static Functions */

var TRUE = valuePromise(true);
var FALSE = valuePromise(false);
var NULL = valuePromise(null);
var UNDEFINED = valuePromise(undefined);
var ZERO = valuePromise(0);
var EMPTYSTRING = valuePromise('');

function valuePromise(value) {
  var p = new Promise(Promise._61);
  p._65 = 1;
  p._55 = value;
  return p;
}
Promise.resolve = function (value) {
  if (value instanceof Promise) return value;

  if (value === null) return NULL;
  if (value === undefined) return UNDEFINED;
  if (value === true) return TRUE;
  if (value === false) return FALSE;
  if (value === 0) return ZERO;
  if (value === '') return EMPTYSTRING;

  if (typeof value === 'object' || typeof value === 'function') {
    try {
      var then = value.then;
      if (typeof then === 'function') {
        return new Promise(then.bind(value));
      }
    } catch (ex) {
      return new Promise(function (resolve, reject) {
        reject(ex);
      });
    }
  }
  return valuePromise(value);
};

Promise.all = function (arr) {
  var args = Array.prototype.slice.call(arr);

  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([]);
    var remaining = args.length;
    function res(i, val) {
      if (val && (typeof val === 'object' || typeof val === 'function')) {
        if (val instanceof Promise && val.then === Promise.prototype.then) {
          while (val._65 === 3) {
            val = val._55;
          }
          if (val._65 === 1) return res(i, val._55);
          if (val._65 === 2) reject(val._55);
          val.then(function (val) {
            res(i, val);
          }, reject);
          return;
        } else {
          var then = val.then;
          if (typeof then === 'function') {
            var p = new Promise(then.bind(val));
            p.then(function (val) {
              res(i, val);
            }, reject);
            return;
          }
        }
      }
      args[i] = val;
      if (--remaining === 0) {
        resolve(args);
      }
    }
    for (var i = 0; i < args.length; i++) {
      res(i, args[i]);
    }
  });
};

Promise.reject = function (value) {
  return new Promise(function (resolve, reject) {
    reject(value);
  });
};

Promise.race = function (values) {
  return new Promise(function (resolve, reject) {
    values.forEach(function(value){
      Promise.resolve(value).then(resolve, reject);
    });
  });
};

/* Prototype Methods */

Promise.prototype['catch'] = function (onRejected) {
  return this.then(null, onRejected);
};


/***/ }),
/* 249 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// This file contains then/promise specific extensions that are only useful
// for node.js interop

var Promise = __webpack_require__(36);
var asap = __webpack_require__(250);

module.exports = Promise;

/* Static Functions */

Promise.denodeify = function (fn, argumentCount) {
  if (
    typeof argumentCount === 'number' && argumentCount !== Infinity
  ) {
    return denodeifyWithCount(fn, argumentCount);
  } else {
    return denodeifyWithoutCount(fn);
  }
};

var callbackFn = (
  'function (err, res) {' +
  'if (err) { rj(err); } else { rs(res); }' +
  '}'
);
function denodeifyWithCount(fn, argumentCount) {
  var args = [];
  for (var i = 0; i < argumentCount; i++) {
    args.push('a' + i);
  }
  var body = [
    'return function (' + args.join(',') + ') {',
    'var self = this;',
    'return new Promise(function (rs, rj) {',
    'var res = fn.call(',
    ['self'].concat(args).concat([callbackFn]).join(','),
    ');',
    'if (res &&',
    '(typeof res === "object" || typeof res === "function") &&',
    'typeof res.then === "function"',
    ') {rs(res);}',
    '});',
    '};'
  ].join('');
  return Function(['Promise', 'fn'], body)(Promise, fn);
}
function denodeifyWithoutCount(fn) {
  var fnLength = Math.max(fn.length - 1, 3);
  var args = [];
  for (var i = 0; i < fnLength; i++) {
    args.push('a' + i);
  }
  var body = [
    'return function (' + args.join(',') + ') {',
    'var self = this;',
    'var args;',
    'var argLength = arguments.length;',
    'if (arguments.length > ' + fnLength + ') {',
    'args = new Array(arguments.length + 1);',
    'for (var i = 0; i < arguments.length; i++) {',
    'args[i] = arguments[i];',
    '}',
    '}',
    'return new Promise(function (rs, rj) {',
    'var cb = ' + callbackFn + ';',
    'var res;',
    'switch (argLength) {',
    args.concat(['extra']).map(function (_, index) {
      return (
        'case ' + (index) + ':' +
        'res = fn.call(' + ['self'].concat(args.slice(0, index)).concat('cb').join(',') + ');' +
        'break;'
      );
    }).join(''),
    'default:',
    'args[argLength] = cb;',
    'res = fn.apply(self, args);',
    '}',
    
    'if (res &&',
    '(typeof res === "object" || typeof res === "function") &&',
    'typeof res.then === "function"',
    ') {rs(res);}',
    '});',
    '};'
  ].join('');

  return Function(
    ['Promise', 'fn'],
    body
  )(Promise, fn);
}

Promise.nodeify = function (fn) {
  return function () {
    var args = Array.prototype.slice.call(arguments);
    var callback =
      typeof args[args.length - 1] === 'function' ? args.pop() : null;
    var ctx = this;
    try {
      return fn.apply(this, arguments).nodeify(callback, ctx);
    } catch (ex) {
      if (callback === null || typeof callback == 'undefined') {
        return new Promise(function (resolve, reject) {
          reject(ex);
        });
      } else {
        asap(function () {
          callback.call(ctx, ex);
        })
      }
    }
  }
};

Promise.prototype.nodeify = function (callback, ctx) {
  if (typeof callback != 'function') return this;

  this.then(function (value) {
    asap(function () {
      callback.call(ctx, null, value);
    });
  }, function (err) {
    asap(function () {
      callback.call(ctx, err);
    });
  });
};


/***/ }),
/* 250 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


// rawAsap provides everything we need except exception management.
var rawAsap = __webpack_require__(139);
// RawTasks are recycled to reduce GC churn.
var freeTasks = [];
// We queue errors to ensure they are thrown in right order (FIFO).
// Array-as-queue is good enough here, since we are just dealing with exceptions.
var pendingErrors = [];
var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);

function throwFirstError() {
    if (pendingErrors.length) {
        throw pendingErrors.shift();
    }
}

/**
 * Calls a task as soon as possible after returning, in its own event, with priority
 * over other events like animation, reflow, and repaint. An error thrown from an
 * event will not interrupt, nor even substantially slow down the processing of
 * other events, but will be rather postponed to a lower priority event.
 * @param {{call}} task A callable object, typically a function that takes no
 * arguments.
 */
module.exports = asap;
function asap(task) {
    var rawTask;
    if (freeTasks.length) {
        rawTask = freeTasks.pop();
    } else {
        rawTask = new RawTask();
    }
    rawTask.task = task;
    rawAsap(rawTask);
}

// We wrap tasks with recyclable task objects.  A task object implements
// `call`, just like a function.
function RawTask() {
    this.task = null;
}

// The sole purpose of wrapping the task is to catch the exception and recycle
// the task object after its single use.
RawTask.prototype.call = function () {
    try {
        this.task.call();
    } catch (error) {
        if (asap.onerror) {
            // This hook exists purely for testing purposes.
            // Its name will be periodically randomized to break any code that
            // depends on its existence.
            asap.onerror(error);
        } else {
            // In a web browser, exceptions are not fatal. However, to avoid
            // slowing down the queue of pending tasks, we rethrow the error in a
            // lower priority turn.
            pendingErrors.push(error);
            requestErrorThrow();
        }
    } finally {
        this.task = null;
        freeTasks[freeTasks.length] = this;
    }
};


/***/ }),
/* 251 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


var Promise = __webpack_require__(36);

module.exports = Promise;
Promise.enableSynchronous = function () {
  Promise.prototype.isPending = function() {
    return this.getState() == 0;
  };

  Promise.prototype.isFulfilled = function() {
    return this.getState() == 1;
  };

  Promise.prototype.isRejected = function() {
    return this.getState() == 2;
  };

  Promise.prototype.getValue = function () {
    if (this._65 === 3) {
      return this._55.getValue();
    }

    if (!this.isFulfilled()) {
      throw new Error('Cannot get a value of an unfulfilled promise.');
    }

    return this._55;
  };

  Promise.prototype.getReason = function () {
    if (this._65 === 3) {
      return this._55.getReason();
    }

    if (!this.isRejected()) {
      throw new Error('Cannot get a rejection reason of a non-rejected promise.');
    }

    return this._55;
  };

  Promise.prototype.getState = function () {
    if (this._65 === 3) {
      return this._55.getState();
    }
    if (this._65 === -1 || this._65 === -2) {
      return 0;
    }

    return this._65;
  };
};

Promise.disableSynchronous = function() {
  Promise.prototype.isPending = undefined;
  Promise.prototype.isFulfilled = undefined;
  Promise.prototype.isRejected = undefined;
  Promise.prototype.getValue = undefined;
  Promise.prototype.getReason = undefined;
  Promise.prototype.getState = undefined;
};


/***/ }),
/* 252 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RelayReferenceMarker
 * 
 * @format
 */



var _classCallCheck3 = _interopRequireDefault(__webpack_require__(6));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var CONDITION = __webpack_require__(3).CONDITION,
    FRAGMENT_SPREAD = __webpack_require__(3).FRAGMENT_SPREAD,
    INLINE_FRAGMENT = __webpack_require__(3).INLINE_FRAGMENT,
    LINKED_FIELD = __webpack_require__(3).LINKED_FIELD,
    LINKED_HANDLE = __webpack_require__(3).LINKED_HANDLE,
    SCALAR_FIELD = __webpack_require__(3).SCALAR_FIELD,
    SCALAR_HANDLE = __webpack_require__(3).SCALAR_HANDLE;

var getStorageKey = __webpack_require__(5).getStorageKey;

function mark(recordSource, selector, references) {
  var dataID = selector.dataID,
      node = selector.node,
      variables = selector.variables;

  var marker = new RelayReferenceMarker(recordSource, variables, references);
  marker.mark(node, dataID);
}

/**
 * @private
 */

var RelayReferenceMarker = function () {
  function RelayReferenceMarker(recordSource, variables, references) {
    (0, _classCallCheck3['default'])(this, RelayReferenceMarker);

    this._references = references;
    this._recordSource = recordSource;
    this._variables = variables;
  }

  RelayReferenceMarker.prototype.mark = function mark(node, dataID) {
    this._traverse(node, dataID);
  };

  RelayReferenceMarker.prototype._traverse = function _traverse(node, dataID) {
    this._references.add(dataID);
    var record = this._recordSource.get(dataID);
    if (record == null) {
      return;
    }
    this._traverseSelections(node.selections, record);
  };

  RelayReferenceMarker.prototype._getVariableValue = function _getVariableValue(name) {
    __webpack_require__(0)(this._variables.hasOwnProperty(name), 'RelayReferenceMarker(): Undefined variable `%s`.', name);
    return this._variables[name];
  };

  RelayReferenceMarker.prototype._traverseSelections = function _traverseSelections(selections, record) {
    var _this = this;

    selections.forEach(function (selection) {
      if (selection.kind === LINKED_FIELD) {
        if (selection.plural) {
          _this._traversePluralLink(selection, record);
        } else {
          _this._traverseLink(selection, record);
        }
      } else if (selection.kind === CONDITION) {
        var conditionValue = _this._getVariableValue(selection.condition);
        if (conditionValue === selection.passingValue) {
          _this._traverseSelections(selection.selections, record);
        }
      } else if (selection.kind === INLINE_FRAGMENT) {
        var typeName = __webpack_require__(1).getType(record);
        if (typeName != null && typeName === selection.type) {
          _this._traverseSelections(selection.selections, record);
        }
      } else if (selection.kind === FRAGMENT_SPREAD) {
        __webpack_require__(0)(false, 'RelayReferenceMarker(): Unexpected fragment spread `...%s`, ' + 'expected all fragments to be inlined.', selection.name);
      } else if (selection.kind === LINKED_HANDLE) {
        // The selections for a "handle" field are the same as those of the
        // original linked field where the handle was applied. Reference marking
        // therefore requires traversing the original field selections against
        // the synthesized client field.
        //
        // TODO: Instead of finding the source field in `selections`, change
        // the concrete structure to allow shared subtrees, and have the linked
        // handle directly refer to the same selections as the LinkedField that
        // it was split from.
        var handleField = __webpack_require__(138)(selection, selections, _this._variables);
        if (handleField.plural) {
          _this._traversePluralLink(handleField, record);
        } else {
          _this._traverseLink(handleField, record);
        }
      } else {
        __webpack_require__(0)(selection.kind === SCALAR_FIELD || selection.kind === SCALAR_HANDLE, 'RelayReferenceMarker(): Unexpected ast kind `%s`.', selection.kind);
      }
    });
  };

  RelayReferenceMarker.prototype._traverseLink = function _traverseLink(field, record) {
    var storageKey = getStorageKey(field, this._variables);
    var linkedID = __webpack_require__(1).getLinkedRecordID(record, storageKey);

    if (linkedID == null) {
      return;
    }
    this._traverse(field, linkedID);
  };

  RelayReferenceMarker.prototype._traversePluralLink = function _traversePluralLink(field, record) {
    var _this2 = this;

    var storageKey = getStorageKey(field, this._variables);
    var linkedIDs = __webpack_require__(1).getLinkedRecordIDs(record, storageKey);

    if (linkedIDs == null) {
      return;
    }
    linkedIDs.forEach(function (linkedID) {
      if (linkedID != null) {
        _this2._traverse(field, linkedID);
      }
    });
  };

  return RelayReferenceMarker;
}();

module.exports = { mark: mark };

/***/ }),
/* 253 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule applyRelayModernOptimisticMutation
 * 
 * @format
 */



/**
 * Higher-level helper function to execute a mutation against a specific
 * environment.
 */
function applyRelayModernOptimisticMutation(environment, config) {
  __webpack_require__(0)(__webpack_require__(96)(environment), 'commitRelayModernMutation: expect `environment` to be an instance of ' + '`RelayModernEnvironment`.');
  var _environment$unstable = environment.unstable_internal,
      createOperationSelector = _environment$unstable.createOperationSelector,
      getOperation = _environment$unstable.getOperation;

  var mutation = getOperation(config.mutation);
  var optimisticUpdater = config.optimisticUpdater;
  var configs = config.configs,
      optimisticResponse = config.optimisticResponse,
      variables = config.variables;

  var operation = createOperationSelector(mutation, variables);
  if (configs) {
    var _setRelayModernMutati = __webpack_require__(97)(configs, mutation, optimisticUpdater);

    optimisticUpdater = _setRelayModernMutati.optimisticUpdater;
  }

  return environment.applyUpdate({
    operation: operation,
    selectorStoreUpdater: optimisticUpdater,
    response: optimisticResponse
  });
}

module.exports = applyRelayModernOptimisticMutation;

/***/ }),
/* 254 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule commitLocalUpdate
 * 
 * @format
 */



function commitLocalUpdate(environment, updater) {
  environment.commitUpdate(updater);
}

module.exports = commitLocalUpdate;

/***/ }),
/* 255 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule commitRelayModernMutation
 * 
 * @format
 */



/**
 * Higher-level helper function to execute a mutation against a specific
 * environment.
 */
function commitRelayModernMutation(environment, config) {
  __webpack_require__(0)(__webpack_require__(96)(environment), 'commitRelayModernMutation: expect `environment` to be an instance of ' + '`RelayModernEnvironment`.');
  var _environment$unstable = environment.unstable_internal,
      createOperationSelector = _environment$unstable.createOperationSelector,
      getOperation = _environment$unstable.getOperation;

  var mutation = getOperation(config.mutation);
  var optimisticResponse = config.optimisticResponse,
      optimisticUpdater = config.optimisticUpdater,
      updater = config.updater;
  var configs = config.configs,
      onError = config.onError,
      variables = config.variables,
      uploadables = config.uploadables;

  var operation = createOperationSelector(mutation, variables);
  // TODO: remove this check after we fix flow.
  if (typeof optimisticResponse === 'function') {
    optimisticResponse = optimisticResponse();
    __webpack_require__(2)(false, 'commitRelayModernMutation: Expected `optimisticResponse` to be an object, ' + 'received a function.');
  }
  if (optimisticResponse && mutation.query.selections && mutation.query.selections.length === 1 && mutation.query.selections[0].kind === 'LinkedField') {
    var mutationRoot = mutation.query.selections[0].name;
    __webpack_require__(2)(optimisticResponse[mutationRoot], 'commitRelayModernMutation: Expected `optimisticResponse` to be wrapped ' + 'in mutation name `%s`', mutationRoot);
  }
  if (configs) {
    var _setRelayModernMutati = __webpack_require__(97)(configs, mutation, optimisticUpdater, updater);

    optimisticUpdater = _setRelayModernMutati.optimisticUpdater;
    updater = _setRelayModernMutati.updater;
  }
  return environment.executeMutation({
    operation: operation,
    optimisticResponse: optimisticResponse,
    optimisticUpdater: optimisticUpdater,
    updater: updater,
    uploadables: uploadables
  }).subscribeLegacy({
    onNext: function onNext(payload) {
      // NOTE: commitRelayModernMutation has a non-standard use of
      // onCompleted() by calling it on every next value. It may be called
      // multiple times if a network request produces multiple responses.
      var onCompleted = config.onCompleted;

      if (onCompleted) {
        var snapshot = environment.lookup(operation.fragment);
        onCompleted(snapshot.data, payload.errors);
      }
    },
    onError: onError
  });
}

module.exports = commitRelayModernMutation;

/***/ }),
/* 256 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule fetchRelayModernQuery
 * 
 * @format
 */



/**
 * A helper function to fetch the results of a query. Note that results for
 * fragment spreads are masked: fields must be explicitly listed in the query in
 * order to be accessible in the result object.
 *
 * NOTE: This module is primarily intended for integrating with classic APIs.
 * Most product code should use a Renderer or Container.
 *
 * TODO(t16875667): The return type should be `Promise<?SelectorData>`, but
 * that's not really helpful as `SelectorData` is essentially just `mixed`. We
 * can probably leverage generated flow types here to return the real expected
 * shape.
 */
function fetchRelayModernQuery(environment, taggedNode, variables, cacheConfig) {
  __webpack_require__(0)(environment.unstable_internal, 'fetchRelayModernQuery: Expected a valid Relay environment, got `%s`.', environment);
  var _environment$unstable = environment.unstable_internal,
      createOperationSelector = _environment$unstable.createOperationSelector,
      getOperation = _environment$unstable.getOperation;

  var query = getOperation(taggedNode);
  var operation = createOperationSelector(query, variables);

  return environment.execute({ operation: operation, cacheConfig: cacheConfig }).map(function () {
    return environment.lookup(operation.fragment).data;
  }).toPromise();
}

module.exports = fetchRelayModernQuery;

/***/ }),
/* 257 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule requestRelaySubscription
 * 
 * @format
 */



function requestRelaySubscription(environment, config) {
  var _environment$unstable = environment.unstable_internal,
      createOperationSelector = _environment$unstable.createOperationSelector,
      getOperation = _environment$unstable.getOperation;

  var subscription = getOperation(config.subscription);
  var configs = config.configs,
      onCompleted = config.onCompleted,
      onError = config.onError,
      onNext = config.onNext,
      variables = config.variables;

  var operation = createOperationSelector(subscription, variables);

  __webpack_require__(2)(!(config.updater && configs), 'requestRelaySubscription: Expected only one of `updater` and `configs` to be provided');

  var _ref = configs ? __webpack_require__(97)(configs, subscription, null /* optimisticUpdater */
  , config.updater) : config,
      updater = _ref.updater;

  return environment.execute({
    operation: operation,
    updater: updater,
    cacheConfig: { force: true }
  }).map(function () {
    return environment.lookup(operation.fragment).data;
  }).subscribeLegacy({
    onNext: onNext,
    onError: onError,
    onCompleted: onCompleted
  });
}

module.exports = requestRelaySubscription;

/***/ }),
/* 258 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process) {/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactRelayQueryRenderer
 * 
 * @format
 */



var _extends3 = _interopRequireDefault(__webpack_require__(60));

var _classCallCheck3 = _interopRequireDefault(__webpack_require__(21));

var _possibleConstructorReturn3 = _interopRequireDefault(__webpack_require__(22));

var _inherits3 = _interopRequireDefault(__webpack_require__(23));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

/**
 * @public
 *
 * Orchestrates fetching and rendering data for a single view or view hierarchy:
 * - Fetches the query/variables using the given network implementation.
 * - Normalizes the response(s) to that query, publishing them to the given
 *   store.
 * - Renders the pending/fail/success states with the provided render function.
 * - Subscribes for updates to the root data and re-renders with any changes.
 */
var ReactRelayQueryRenderer = function (_React$Component) {
  (0, _inherits3['default'])(ReactRelayQueryRenderer, _React$Component);

  function ReactRelayQueryRenderer(props, context) {
    (0, _classCallCheck3['default'])(this, ReactRelayQueryRenderer);

    var _this = (0, _possibleConstructorReturn3['default'])(this, _React$Component.call(this, props, context));

    _this._onChange = function (snapshot) {
      _this.setState({
        readyState: (0, _extends3['default'])({}, _this.state.readyState, {
          props: snapshot.data
        })
      });
    };

    _this._pendingFetch = null;
    _this._rootSubscription = null;
    _this._selectionReference = null;

    _this.state = {
      readyState: _this._fetchForProps(props)
    };
    return _this;
  }

  ReactRelayQueryRenderer.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps) {
    if (nextProps.query !== this.props.query || nextProps.environment !== this.props.environment || !__webpack_require__(18)(nextProps.variables, this.props.variables)) {
      this.setState({
        readyState: this._fetchForProps(nextProps)
      });
    }
  };

  ReactRelayQueryRenderer.prototype.componentWillUnmount = function componentWillUnmount() {
    this._release();
  };

  ReactRelayQueryRenderer.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState) {
    return nextProps.render !== this.props.render || nextState.readyState !== this.state.readyState;
  };

  ReactRelayQueryRenderer.prototype._release = function _release() {
    if (this._pendingFetch) {
      this._pendingFetch.dispose();
      this._pendingFetch = null;
    }
    if (this._rootSubscription) {
      this._rootSubscription.dispose();
      this._rootSubscription = null;
    }
    if (this._selectionReference) {
      this._selectionReference.dispose();
      this._selectionReference = null;
    }
  };

  ReactRelayQueryRenderer.prototype._fetchForProps = function _fetchForProps(props) {
    // TODO (#16225453) QueryRenderer works with old and new environment, but
    // the flow typing doesn't quite work abstracted.
    var environment = props.environment;

    var query = props.query,
        variables = props.variables;

    if (query) {
      var _environment$unstable = environment.unstable_internal,
          createOperationSelector = _environment$unstable.createOperationSelector,
          getOperation = _environment$unstable.getOperation;

      var operation = createOperationSelector(getOperation(query), variables);
      this._relayContext = {
        environment: environment,
        variables: operation.variables
      };
      return this._fetch(operation, props.cacheConfig) || getDefaultState();
    } else {
      this._relayContext = {
        environment: environment,
        variables: variables
      };
      this._release();
      return {
        error: null,
        props: {},
        retry: null
      };
    }
  };

  ReactRelayQueryRenderer.prototype._fetch = function _fetch(operation, cacheConfig) {
    var _this2 = this;

    var environment = this._relayContext.environment;

    // Immediately retain the results of the new query to prevent relevant data
    // from being freed. This is not strictly required if all new data is
    // fetched in a single step, but is necessary if the network could attempt
    // to incrementally load data (ex: multiple query entries or incrementally
    // loading records from disk cache).

    var nextReference = environment.retain(operation.root);

    var readyState = getDefaultState();
    var snapshot = void 0; // results of the root fragment
    var hasSyncResult = false;
    var hasFunctionReturned = false;

    if (this._pendingFetch) {
      this._pendingFetch.dispose();
    }
    if (this._rootSubscription) {
      this._rootSubscription.dispose();
    }

    var request = environment.execute({ operation: operation, cacheConfig: cacheConfig })['finally'](function () {
      _this2._pendingFetch = null;
    }).subscribe({
      next: function next() {
        // `next` can be called multiple times by network layers that support
        // data subscriptions. Wait until the first payload to render `props`
        // and subscribe for data updates.
        if (snapshot) {
          return;
        }
        snapshot = environment.lookup(operation.fragment);
        readyState = {
          error: null,
          props: snapshot.data,
          retry: function retry() {
            // Do not reset the default state if refetching after success,
            // handling the case where _fetch may return syncronously instead
            // of calling setState.
            var syncReadyState = _this2._fetch(operation, cacheConfig);
            if (syncReadyState) {
              _this2.setState({ readyState: syncReadyState });
            }
          }
        };

        if (_this2._selectionReference) {
          _this2._selectionReference.dispose();
        }
        _this2._rootSubscription = environment.subscribe(snapshot, _this2._onChange);
        _this2._selectionReference = nextReference;
        // This line should be called only once.
        hasSyncResult = true;
        if (hasFunctionReturned) {
          _this2.setState({ readyState: readyState });
        }
      },
      error: function (_error) {
        function error(_x) {
          return _error.apply(this, arguments);
        }

        error.toString = function () {
          return _error.toString();
        };

        return error;
      }(function (error) {
        readyState = {
          error: error,
          props: null,
          retry: function retry() {
            // Return to the default state when retrying after an error,
            // handling the case where _fetch may return syncronously instead
            // of calling setState.
            var syncReadyState = _this2._fetch(operation, cacheConfig);
            _this2.setState({ readyState: syncReadyState || getDefaultState() });
          }
        };
        if (_this2._selectionReference) {
          _this2._selectionReference.dispose();
        }
        _this2._selectionReference = nextReference;
        hasSyncResult = true;
        if (hasFunctionReturned) {
          _this2.setState({ readyState: readyState });
        }
      })
    });

    this._pendingFetch = {
      dispose: function dispose() {
        request.unsubscribe();
        nextReference.dispose();
      }
    };
    hasFunctionReturned = true;
    return hasSyncResult ? readyState : null;
  };

  ReactRelayQueryRenderer.prototype.getChildContext = function getChildContext() {
    return {
      relay: this._relayContext
    };
  };

  ReactRelayQueryRenderer.prototype.render = function render() {
    // Note that the root fragment results in `readyState.props` is already
    // frozen by the store; this call is to freeze the readyState object and
    // error property if set.
    if (process.env.NODE_ENV !== 'production') {
      __webpack_require__(263)(this.state.readyState);
    }
    return this.props.render(this.state.readyState);
  };

  return ReactRelayQueryRenderer;
}(__webpack_require__(7).Component);

ReactRelayQueryRenderer.childContextTypes = {
  relay: __webpack_require__(43).Relay
};

function getDefaultState() {
  return {
    error: null,
    props: null,
    retry: null
  };
}

module.exports = ReactRelayQueryRenderer;
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4)))

/***/ }),
/* 259 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(260), __esModule: true };

/***/ }),
/* 260 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(261);
module.exports = __webpack_require__(10).Object.assign;


/***/ }),
/* 261 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.3.1 Object.assign(target, source)
var $export = __webpack_require__(13);

$export($export.S + $export.F, 'Object', { assign: __webpack_require__(262) });


/***/ }),
/* 262 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

// 19.1.2.1 Object.assign(target, source, ...)
var getKeys = __webpack_require__(48);
var gOPS = __webpack_require__(80);
var pIE = __webpack_require__(49);
var toObject = __webpack_require__(67);
var IObject = __webpack_require__(115);
var $assign = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || __webpack_require__(30)(function () {
  var A = {};
  var B = {};
  // eslint-disable-next-line no-undef
  var S = Symbol();
  var K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function (k) { B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source) { // eslint-disable-line no-unused-vars
  var T = toObject(target);
  var aLen = arguments.length;
  var index = 1;
  var getSymbols = gOPS.f;
  var isEnum = pIE.f;
  while (aLen > index) {
    var S = IObject(arguments[index++]);
    var keys = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S);
    var length = keys.length;
    var j = 0;
    var key;
    while (length > j) if (isEnum.call(S, key = keys[j++])) T[key] = S[key];
  } return T;
} : $assign;


/***/ }),
/* 263 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 * @providesModule deepFreeze
 * @format
 */



/**
 * Recursively "deep" freezes the supplied object.
 *
 * For convenience, and for consistency with the behavior of `Object.freeze`,
 * returns the now-frozen original object.
 */

function deepFreeze(object) {
  Object.freeze(object);
  Object.getOwnPropertyNames(object).forEach(function (name) {
    var property = object[name];
    if (property && typeof property === 'object' && !Object.isFrozen(property)) {
      deepFreeze(property);
    }
  });
  return object;
}

module.exports = deepFreeze;

/***/ }),
/* 264 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isRelayContainer
 * 
 * @format
 */



function isRelayContainer(component) {
  return !!(component && component.getFragmentNames && component.getFragment && component.hasFragment && component.hasVariable);
}

module.exports = isRelayContainer;

/***/ }),
/* 265 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule isRelayVariables
 * 
 * @format
 */



/**
 * Determine if the object is a plain object that matches the `Variables` type.
 */

function isRelayVariables(variables) {
  return typeof variables === 'object' && variables !== null && !Array.isArray(variables);
}

module.exports = isRelayVariables;

/***/ }),
/* 266 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactRelayFragmentContainer
 * 
 * @format
 */



var _extends3 = _interopRequireDefault(__webpack_require__(60));

var _classCallCheck3 = _interopRequireDefault(__webpack_require__(21));

var _possibleConstructorReturn3 = _interopRequireDefault(__webpack_require__(22));

var _inherits3 = _interopRequireDefault(__webpack_require__(23));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = __webpack_require__(98),
    profileContainer = _require.profileContainer;

var _require2 = __webpack_require__(62),
    getComponentName = _require2.getComponentName,
    getReactComponent = _require2.getReactComponent;

var containerContextTypes = {
  relay: __webpack_require__(43).Relay
};

/**
 * Composes a React component class, returning a new class that intercepts
 * props, resolving them with the provided fragments and subscribing for
 * updates.
 */
function createContainerWithFragments(Component, fragments) {
  var ComponentClass = getReactComponent(Component);
  var componentName = getComponentName(Component);
  var containerName = 'Relay(' + componentName + ')';

  var Container = function (_React$Component) {
    (0, _inherits3['default'])(Container, _React$Component);

    function Container(props, context) {
      (0, _classCallCheck3['default'])(this, Container);

      var _this = (0, _possibleConstructorReturn3['default'])(this, _React$Component.call(this, props, context));

      _this._handleFragmentDataUpdate = function () {
        var data = _this._resolver.resolve();
        var profiler = __webpack_require__(61).profile('ReactRelayFragmentContainer.handleFragmentDataUpdate');
        _this.setState({ data: data }, profiler.stop);
      };

      var relay = assertRelayContext(context.relay);
      var createFragmentSpecResolver = relay.environment.unstable_internal.createFragmentSpecResolver;

      _this._resolver = createFragmentSpecResolver(relay, containerName, fragments, props, _this._handleFragmentDataUpdate);
      _this.state = {
        data: _this._resolver.resolve(),
        relayProp: {
          environment: relay.environment
        }
      };
      return _this;
    }

    /**
     * When new props are received, read data for the new props and subscribe
     * for updates. Props may be the same in which case previous data and
     * subscriptions can be reused.
     */


    Container.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
      var context = __webpack_require__(99)(nextContext);
      var relay = assertRelayContext(context.relay);
      var _relay$environment$un = relay.environment.unstable_internal,
          createFragmentSpecResolver = _relay$environment$un.createFragmentSpecResolver,
          getDataIDsFromObject = _relay$environment$un.getDataIDsFromObject;

      var prevIDs = getDataIDsFromObject(fragments, this.props);
      var nextIDs = getDataIDsFromObject(fragments, nextProps);
      // If the environment has changed or props point to new records then
      // previously fetched data and any pending fetches no longer apply:
      // - Existing references are on the old environment.
      // - Existing references are based on old variables.
      // - Pending fetches are for the previous records.
      if (this.context.relay.environment !== relay.environment || this.context.relay.variables !== relay.variables || !__webpack_require__(18)(prevIDs, nextIDs)) {
        this._resolver.dispose();
        this._resolver = createFragmentSpecResolver(relay, containerName, fragments, nextProps, this._handleFragmentDataUpdate);
        var _relayProp = {
          environment: relay.environment
        };
        this.setState({ relayProp: _relayProp });
      } else {
        this._resolver.setProps(nextProps);
      }
      var data = this._resolver.resolve();
      if (data !== this.state.data) {
        this.setState({ data: data });
      }
    };

    Container.prototype.componentWillUnmount = function componentWillUnmount() {
      this._resolver.dispose();
    };

    Container.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState, nextContext) {
      // Short-circuit if any Relay-related data has changed
      if (nextContext.relay !== this.context.relay || nextState.data !== this.state.data) {
        return true;
      }
      // Otherwise, for convenience short-circuit if all non-Relay props
      // are scalar and equal
      var keys = Object.keys(nextProps);
      for (var ii = 0; ii < keys.length; ii++) {
        var _key = keys[ii];
        if (!fragments.hasOwnProperty(_key) && !__webpack_require__(100)(nextProps[_key], this.props[_key])) {
          return true;
        }
      }
      return false;
    };

    /**
     * Render new data for the existing props/context.
     */


    Container.prototype.render = function render() {
      if (ComponentClass) {
        return __webpack_require__(7).createElement(ComponentClass, (0, _extends3['default'])({}, this.props, this.state.data, {
          // TODO: Remove the string ref fallback.
          ref: this.props.componentRef || 'component',
          relay: this.state.relayProp
        }));
      } else {
        // Stateless functional, doesn't support `ref`
        return __webpack_require__(7).createElement(Component, (0, _extends3['default'])({}, this.props, this.state.data, {
          relay: this.state.relayProp
        }));
      }
    };

    return Container;
  }(__webpack_require__(7).Component);

  profileContainer(Container, 'ReactRelayFragmentContainer');
  Container.contextTypes = containerContextTypes;
  Container.displayName = containerName;

  return Container;
}

function assertRelayContext(relay) {
  __webpack_require__(0)(__webpack_require__(44)(relay), 'ReactRelayFragmentContainer: Expected `context.relay` to be an object ' + 'conforming to the `RelayContext` interface, got `%s`.', relay);
  return relay;
}

/**
 * Wrap the basic `createContainer()` function with logic to adapt to the
 * `context.relay.environment` in which it is rendered. Specifically, the
 * extraction of the environment-specific version of fragments in the
 * `fragmentSpec` is memoized once per environment, rather than once per
 * instance of the container constructed/rendered.
 */
function createContainer(Component, fragmentSpec) {
  return __webpack_require__(101)(Component, fragmentSpec, createContainerWithFragments);
}

module.exports = { createContainer: createContainer, createContainerWithFragments: createContainerWithFragments };

/***/ }),
/* 267 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule assertFragmentMap
 * 
 * @format
 */



/**
 * Fail fast if the user supplies invalid fragments as input.
 */
function assertFragmentMap(componentName, fragments) {
  __webpack_require__(0)(fragments && typeof fragments === 'object', 'Could not create Relay Container for `%s`. ' + 'Expected a set of GraphQL fragments, got `%s` instead.', componentName, fragments);

  for (var key in fragments) {
    if (fragments.hasOwnProperty(key)) {
      var fragment = fragments[key];
      __webpack_require__(0)(fragment && (typeof fragment === 'object' || typeof fragment === 'function'), 'Could not create Relay Container for `%s`. ' + 'The value of fragment `%s` was expected to be a fragment, got `%s` instead.', componentName, key, fragment);
    }
  }
}

module.exports = assertFragmentMap;

/***/ }),
/* 268 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactRelayPaginationContainer
 * 
 * @format
 */



var _classCallCheck3 = _interopRequireDefault(__webpack_require__(21));

var _possibleConstructorReturn3 = _interopRequireDefault(__webpack_require__(22));

var _inherits3 = _interopRequireDefault(__webpack_require__(23));

var _defineProperty3 = _interopRequireDefault(__webpack_require__(269));

var _extends4 = _interopRequireDefault(__webpack_require__(60));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = __webpack_require__(98),
    profileContainer = _require.profileContainer;

var _require2 = __webpack_require__(62),
    getComponentName = _require2.getComponentName,
    getReactComponent = _require2.getReactComponent;

var _require3 = __webpack_require__(50),
    ConnectionInterface = _require3.ConnectionInterface,
    Observable = _require3.Observable;

var containerContextTypes = {
  relay: __webpack_require__(43).Relay
};

var FORWARD = 'forward';

/**
 * Extends the functionality of RelayFragmentContainer by providing a mechanism
 * to load more data from a connection.
 *
 * # Configuring a PaginationContainer
 *
 * PaginationContainer accepts the standard FragmentContainer arguments and an
 * additional `connectionConfig` argument:
 *
 * - `Component`: the component to be wrapped/rendered.
 * - `fragments`: an object whose values are `graphql` fragments. The object
 *   keys determine the prop names by which fragment data is available.
 * - `connectionConfig`: an object that determines how to load more connection
 *   data. Details below.
 *
 * # Loading More Data
 *
 * Use `props.relay.hasMore()` to determine if there are more items to load.
 *
 * ```
 * hasMore(): boolean
 * ```
 *
 * Use `props.relay.isLoading()` to determine if a previous call to `loadMore()`
 * is still pending. This is convenient for avoiding duplicate load calls.
 *
 * ```
 * isLoading(): boolean
 * ```
 *
 * Use `props.relay.loadMore()` to load more items. This will return null if
 * there are no more items to fetch, otherwise it will fetch more items and
 * return a Disposable that can be used to cancel the fetch.
 *
 * `pageSize` should be the number of *additional* items to fetch (not the
 * total).
 *
 * ```
 * loadMore(pageSize: number, callback: ?(error: ?Error) => void): ?Disposable
 * ```
 *
 * A complete example:
 *
 * ```
 * class Foo extends React.Component {
 *   ...
 *   _onEndReached() {
 *     if (!this.props.relay.hasMore() || this.props.relay.isLoading()) {
 *       return;
 *     }
 *     this.props.relay.loadMore(10);
 *   }
 *   ...
 * }
 * ```
 *
 * # Connection Config
 *
 * Here's an example, followed by details of each config property:
 *
 * ```
 * ReactRelayPaginationContainer.createContainer(
 *   Component,
 *   {
 *     user: graphql`fragment FriendsFragment on User {
 *       friends(after: $afterCursor first: $count) @connection {
 *         edges { ... }
 *         pageInfo {
 *           startCursor
 *           endCursor
 *           hasNextPage
 *           hasPreviousPage
 *         }
 *       }
 *     }`,
 *   },
 *   {
 *     direction: 'forward',
 *     getConnectionFromProps(props) {
 *       return props.user && props.user.friends;
 *     },
 *     getFragmentVariables(vars, totalCount) {
 *       // The component presumably wants *all* edges, not just those after
 *       // the cursor, so notice that we don't set $afterCursor here.
 *       return {
 *         ...vars,
 *         count: totalCount,
 *       };
 *     },
 *     getVariables(props, {count, cursor}, fragmentVariables) {
 *       return {
 *         ...RelayFBCompatQueryConstants.get(),
 *         id: props.user.id,
 *         afterCursor: cursor,
 *         count,
 *       },
 *     },
 *     query: graphql`
 *       query FriendsQuery($id: ID!, $afterCursor: ID, $count: Int!) {
 *         node(id: $id) {
 *           ...FriendsFragment
 *         }
 *       }
 *     `,
 *   }
 * );
 * ```
 *
 * ## Config Properties
 *
 * - `direction`: Either "forward" to indicate forward pagination using
 *   after/first, or "backward" to indicate backward pagination using
 *   before/last.
 * - `getConnectionFromProps(props)`: PaginationContainer doesn't magically know
 *   which connection data you mean to fetch more of (a container might fetch
 *   multiple connections, but can only paginate one of them). This function is
 *   given the fragment props only (not full props), and should return the
 *   connection data. See the above example that returns the friends data via
 *   `props.user.friends`.
 * - `getFragmentVariables(previousVars, totalCount)`: Given the previous variables
 *   and the new total number of items, get the variables to use when reading
 *   your fragments. Typically this means setting whatever your local "count"
 *   variable is to the value of `totalCount`. See the example.
 * - `getVariables(props, {count, cursor})`: Get the variables to use when
 *   fetching the pagination `query`. You may determine the root object id from
 *   props (see the example that uses `props.user.id`) and may also set whatever
 *   variables you use for the after/first/before/last calls based on the count
 *   and cursor.
 * - `query`: A query to use when fetching more connection data. This should
 *   typically reference one of the container's fragment (as in the example)
 *   to ensure that all the necessary fields for sub-components are fetched.
 */

function createGetConnectionFromProps(metadata) {
  var path = metadata.path;
  __webpack_require__(0)(path, 'ReactRelayPaginationContainer: Unable to synthesize a ' + 'getConnectionFromProps function.');
  return function (props) {
    var data = props[metadata.fragmentName];
    for (var i = 0; i < path.length; i++) {
      if (!data || typeof data !== 'object') {
        return null;
      }
      data = data[path[i]];
    }
    return data;
  };
}

function createGetFragmentVariables(metadata) {
  var countVariable = metadata.count;
  __webpack_require__(0)(countVariable, 'ReactRelayPaginationContainer: Unable to synthesize a ' + 'getFragmentVariables function.');
  return function (prevVars, totalCount) {
    return (0, _extends4['default'])({}, prevVars, (0, _defineProperty3['default'])({}, countVariable, totalCount));
  };
}

function findConnectionMetadata(fragments) {
  var foundConnectionMetadata = null;
  var isRelayModern = false;
  for (var _fragmentName in fragments) {
    var fragment = fragments[_fragmentName];
    var connectionMetadata = fragment.metadata && fragment.metadata.connection;
    // HACK: metadata is always set to `undefined` in classic. In modern, even
    // if empty, it is set to null (never undefined). We use that knowlege to
    // check if we're dealing with classic or modern
    if (fragment.metadata !== undefined) {
      isRelayModern = true;
    }
    if (connectionMetadata) {
      __webpack_require__(0)(connectionMetadata.length === 1, 'ReactRelayPaginationContainer: Only a single @connection is ' + 'supported, `%s` has %s.', _fragmentName, connectionMetadata.length);
      __webpack_require__(0)(!foundConnectionMetadata, 'ReactRelayPaginationContainer: Only a single fragment with ' + '@connection is supported.');
      foundConnectionMetadata = (0, _extends4['default'])({}, connectionMetadata[0], {
        fragmentName: _fragmentName
      });
    }
  }
  __webpack_require__(0)(!isRelayModern || foundConnectionMetadata !== null, 'ReactRelayPaginationContainer: A @connection directive must be present.');
  return foundConnectionMetadata || {};
}

function toObserver(observerOrCallback) {
  return typeof observerOrCallback === 'function' ? { error: observerOrCallback, complete: observerOrCallback } : observerOrCallback || {};
}

function createContainerWithFragments(Component, fragments, connectionConfig) {
  var ComponentClass = getReactComponent(Component);
  var componentName = getComponentName(Component);
  var containerName = 'Relay(' + componentName + ')';

  var metadata = findConnectionMetadata(fragments);

  var getConnectionFromProps = connectionConfig.getConnectionFromProps || createGetConnectionFromProps(metadata);

  var direction = connectionConfig.direction || metadata.direction;
  __webpack_require__(0)(direction, 'ReactRelayPaginationContainer: Unable to infer direction of the ' + 'connection, possibly because both first and last are provided.');

  var getFragmentVariables = connectionConfig.getFragmentVariables || createGetFragmentVariables(metadata);

  var Container = function (_React$Component) {
    (0, _inherits3['default'])(Container, _React$Component);

    function Container(props, context) {
      (0, _classCallCheck3['default'])(this, Container);

      var _this = (0, _possibleConstructorReturn3['default'])(this, _React$Component.call(this, props, context));

      _this._handleFragmentDataUpdate = function () {
        var profiler = __webpack_require__(61).profile('ReactRelayPaginationContainer.handleFragmentDataUpdate');
        _this.setState({ data: _this._resolver.resolve() }, profiler.stop);
      };

      _this._hasMore = function () {
        var connectionData = _this._getConnectionData();
        return !!connectionData && connectionData.hasMore;
      };

      _this._isLoading = function () {
        return !!_this._refetchSubscription;
      };

      _this._refetchConnection = function (totalCount, observerOrCallback, refetchVariables) {
        var paginatingVariables = {
          count: totalCount,
          cursor: null,
          totalCount: totalCount
        };
        var fetch = _this._fetchPage(paginatingVariables, toObserver(observerOrCallback), { force: true }, refetchVariables);
        return fetch ? { dispose: fetch.unsubscribe } : null;
      };

      _this._loadMore = function (pageSize, observerOrCallback, options) {
        var connectionData = _this._getConnectionData();
        if (!connectionData) {
          return null;
        }
        var totalCount = connectionData.edgeCount + pageSize;
        if (options && options.force) {
          return _this._refetchConnection(totalCount, observerOrCallback);
        }
        var paginatingVariables = {
          count: pageSize,
          cursor: connectionData.cursor,
          totalCount: totalCount
        };
        var fetch = _this._fetchPage(paginatingVariables, toObserver(observerOrCallback), options);
        return fetch ? { dispose: fetch.unsubscribe } : null;
      };

      var relay = assertRelayContext(context.relay);
      var createFragmentSpecResolver = relay.environment.unstable_internal.createFragmentSpecResolver;

      _this._isARequestInFlight = false;
      _this._localVariables = null;
      _this._refetchSubscription = null;
      _this._references = [];
      _this._resolver = createFragmentSpecResolver(relay, containerName, fragments, props, _this._handleFragmentDataUpdate);
      _this._relayContext = {
        environment: _this.context.relay.environment,
        variables: _this.context.relay.variables
      };
      _this.state = {
        data: _this._resolver.resolve(),
        relayProp: _this._buildRelayProp(relay)
      };
      return _this;
    }

    /**
     * When new props are received, read data for the new props and subscribe
     * for updates. Props may be the same in which case previous data and
     * subscriptions can be reused.
     */


    Container.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
      var context = __webpack_require__(99)(nextContext);
      var relay = assertRelayContext(context.relay);
      var _relay$environment$un = relay.environment.unstable_internal,
          createFragmentSpecResolver = _relay$environment$un.createFragmentSpecResolver,
          getDataIDsFromObject = _relay$environment$un.getDataIDsFromObject;

      var prevIDs = getDataIDsFromObject(fragments, this.props);
      var nextIDs = getDataIDsFromObject(fragments, nextProps);

      // If the environment has changed or props point to new records then
      // previously fetched data and any pending fetches no longer apply:
      // - Existing references are on the old environment.
      // - Existing references are based on old variables.
      // - Pending fetches are for the previous records.
      if (this.context.relay.environment !== relay.environment || this.context.relay.variables !== relay.variables || !__webpack_require__(18)(prevIDs, nextIDs)) {
        this._release();
        this._localVariables = null;
        this._relayContext = {
          environment: relay.environment,
          variables: relay.variables
        };
        this._resolver = createFragmentSpecResolver(relay, containerName, fragments, nextProps, this._handleFragmentDataUpdate);
        this.setState({ relayProp: this._buildRelayProp(relay) });
      } else if (!this._localVariables) {
        this._resolver.setProps(nextProps);
      }
      var data = this._resolver.resolve();
      if (data !== this.state.data) {
        this.setState({ data: data });
      }
    };

    Container.prototype.componentWillUnmount = function componentWillUnmount() {
      this._release();
    };

    Container.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState, nextContext) {
      // Short-circuit if any Relay-related data has changed
      if (nextContext.relay !== this.context.relay || nextState.data !== this.state.data || nextState.relayProp !== this.state.relayProp) {
        return true;
      }
      // Otherwise, for convenience short-circuit if all non-Relay props
      // are scalar and equal
      var keys = Object.keys(nextProps);
      for (var ii = 0; ii < keys.length; ii++) {
        var _key = keys[ii];
        if (!fragments.hasOwnProperty(_key) && !__webpack_require__(100)(nextProps[_key], this.props[_key])) {
          return true;
        }
      }
      return false;
    };

    Container.prototype._buildRelayProp = function _buildRelayProp(relay) {
      return {
        hasMore: this._hasMore,
        isLoading: this._isLoading,
        loadMore: this._loadMore,
        refetchConnection: this._refetchConnection,
        environment: relay.environment
      };
    };

    /**
     * Render new data for the existing props/context.
     */


    Container.prototype._getConnectionData = function _getConnectionData() {
      // Extract connection data and verify there are more edges to fetch
      var props = (0, _extends4['default'])({}, this.props, this.state.data);
      var connectionData = getConnectionFromProps(props);
      if (connectionData == null) {
        return null;
      }

      var _ConnectionInterface$ = ConnectionInterface.get(),
          EDGES = _ConnectionInterface$.EDGES,
          PAGE_INFO = _ConnectionInterface$.PAGE_INFO,
          HAS_NEXT_PAGE = _ConnectionInterface$.HAS_NEXT_PAGE,
          HAS_PREV_PAGE = _ConnectionInterface$.HAS_PREV_PAGE,
          END_CURSOR = _ConnectionInterface$.END_CURSOR,
          START_CURSOR = _ConnectionInterface$.START_CURSOR;

      __webpack_require__(0)(typeof connectionData === 'object', 'ReactRelayPaginationContainer: Expected `getConnectionFromProps()` in `%s`' + 'to return `null` or a plain object with %s and %s properties, got `%s`.' + componentName, EDGES, PAGE_INFO, connectionData);
      var edges = connectionData[EDGES];
      var pageInfo = connectionData[PAGE_INFO];
      if (edges == null || pageInfo == null) {
        return null;
      }
      __webpack_require__(0)(Array.isArray(edges), 'ReactRelayPaginationContainer: Expected `getConnectionFromProps()` in `%s`' + 'to return an object with %s: Array, got `%s`.', componentName, EDGES, edges);
      __webpack_require__(0)(typeof pageInfo === 'object', 'ReactRelayPaginationContainer: Expected `getConnectionFromProps()` in `%s`' + 'to return an object with %s: Object, got `%s`.', componentName, PAGE_INFO, pageInfo);
      var hasMore = direction === FORWARD ? pageInfo[HAS_NEXT_PAGE] : pageInfo[HAS_PREV_PAGE];
      var cursor = direction === FORWARD ? pageInfo[END_CURSOR] : pageInfo[START_CURSOR];
      if (typeof hasMore !== 'boolean' || typeof cursor !== 'string') {
        __webpack_require__(2)(false, 'ReactRelayPaginationContainer: Cannot paginate without %s fields in `%s`. ' + 'Be sure to fetch %s (got `%s`) and %s (got `%s`).', PAGE_INFO, componentName, direction === FORWARD ? HAS_NEXT_PAGE : HAS_PREV_PAGE, hasMore, direction === FORWARD ? END_CURSOR : START_CURSOR, cursor);
        return null;
      }
      return {
        cursor: cursor,
        edgeCount: edges.length,
        hasMore: hasMore
      };
    };

    Container.prototype._fetchPage = function _fetchPage(paginatingVariables, observer, options, refetchVariables) {
      var _this2 = this;

      var _assertRelayContext = assertRelayContext(this.context.relay),
          environment = _assertRelayContext.environment;

      var _environment$unstable = environment.unstable_internal,
          createOperationSelector = _environment$unstable.createOperationSelector,
          getOperation = _environment$unstable.getOperation,
          getVariablesFromObject = _environment$unstable.getVariablesFromObject;

      var props = (0, _extends4['default'])({}, this.props, this.state.data);
      var fragmentVariables = getVariablesFromObject(this._relayContext.variables, fragments, this.props);
      fragmentVariables = (0, _extends4['default'])({}, fragmentVariables, refetchVariables);
      var fetchVariables = connectionConfig.getVariables(props, {
        count: paginatingVariables.count,
        cursor: paginatingVariables.cursor
      },
      // Pass the variables used to fetch the fragments initially
      fragmentVariables);
      __webpack_require__(0)(typeof fetchVariables === 'object' && fetchVariables !== null, 'ReactRelayPaginationContainer: Expected `getVariables()` to ' + 'return an object, got `%s` in `%s`.', fetchVariables, componentName);
      fetchVariables = (0, _extends4['default'])({}, fetchVariables, refetchVariables);
      this._localVariables = fetchVariables;

      var cacheConfig = options ? { force: !!options.force } : undefined;
      if (cacheConfig && options && options.rerunParamExperimental) {
        cacheConfig.rerunParamExperimental = options.rerunParamExperimental;
      }
      var query = getOperation(connectionConfig.query);
      var operation = createOperationSelector(query, fetchVariables);

      var refetchSubscription = null;

      // Immediately retain the results of the query to prevent cached
      // data from being evicted
      var reference = environment.retain(operation.root);
      this._references.push(reference);

      if (this._refetchSubscription) {
        this._refetchSubscription.unsubscribe();
      }

      var onNext = function onNext(payload, complete) {
        _this2._relayContext = {
          environment: _this2.context.relay.environment,
          variables: (0, _extends4['default'])({}, _this2.context.relay.variables, fragmentVariables)
        };
        var prevData = _this2._resolver.resolve();
        _this2._resolver.setVariables(getFragmentVariables(fragmentVariables, paginatingVariables.totalCount));
        var nextData = _this2._resolver.resolve();

        // Workaround slightly different handling for connection in different
        // core implementations:
        // - Classic core requires the count to be explicitly incremented
        // - Modern core automatically appends new items, updating the count
        //   isn't required to see new data.
        //
        // `setState` is only required if changing the variables would change the
        // resolved data.
        // TODO #14894725: remove PaginationContainer equal check
        if (!__webpack_require__(18)(prevData, nextData)) {
          _this2.setState({ data: nextData }, complete);
        } else {
          complete();
        }
      };

      var cleanup = function cleanup() {
        if (_this2._refetchSubscription === refetchSubscription) {
          _this2._refetchSubscription = null;
          _this2._isARequestInFlight = false;
        }
      };

      this._isARequestInFlight = true;
      refetchSubscription = environment.execute({ operation: operation, cacheConfig: cacheConfig }).mergeMap(function (payload) {
        return new Observable(function (sink) {
          onNext(payload, function () {
            sink.next(); // pass void to public observer's `next`
            sink.complete();
          });
        });
      })
      // use do instead of finally so that observer's `complete` fires after cleanup
      ['do']({
        error: cleanup,
        complete: cleanup,
        unsubscribe: cleanup
      }).subscribe(observer || {});

      this._refetchSubscription = this._isARequestInFlight ? refetchSubscription : null;

      return refetchSubscription;
    };

    Container.prototype._release = function _release() {
      this._resolver.dispose();
      this._references.forEach(function (disposable) {
        return disposable.dispose();
      });
      this._references.length = 0;
      if (this._refetchSubscription) {
        this._refetchSubscription.unsubscribe();
        this._refetchSubscription = null;
        this._isARequestInFlight = false;
      }
    };

    Container.prototype.getChildContext = function getChildContext() {
      return { relay: this._relayContext };
    };

    Container.prototype.render = function render() {
      if (ComponentClass) {
        return __webpack_require__(7).createElement(ComponentClass, (0, _extends4['default'])({}, this.props, this.state.data, {
          // TODO: Remove the string ref fallback.
          ref: this.props.componentRef || 'component',
          relay: this.state.relayProp
        }));
      } else {
        // Stateless functional, doesn't support `ref`
        return __webpack_require__(7).createElement(Component, (0, _extends4['default'])({}, this.props, this.state.data, {
          relay: this.state.relayProp
        }));
      }
    };

    return Container;
  }(__webpack_require__(7).Component);

  profileContainer(Container, 'ReactRelayPaginationContainer');
  Container.contextTypes = containerContextTypes;
  Container.displayName = containerName;

  return Container;
}

function assertRelayContext(relay) {
  __webpack_require__(0)(__webpack_require__(44)(relay), 'ReactRelayPaginationContainer: Expected `context.relay` to be an object ' + 'conforming to the `RelayContext` interface, got `%s`.', relay);
  return relay;
}

/**
 * Wrap the basic `createContainer()` function with logic to adapt to the
 * `context.relay.environment` in which it is rendered. Specifically, the
 * extraction of the environment-specific version of fragments in the
 * `fragmentSpec` is memoized once per environment, rather than once per
 * instance of the container constructed/rendered.
 */
function createContainer(Component, fragmentSpec, connectionConfig) {
  var Container = __webpack_require__(101)(Component, fragmentSpec, function (ComponentClass, fragments) {
    return createContainerWithFragments(ComponentClass, fragments, connectionConfig);
  });
  /* $FlowFixMe(>=0.53.0) This comment suppresses an error
   * when upgrading Flow's support for React. Common errors found when
   * upgrading Flow's React support are documented at
   * https://fburl.com/eq7bs81w */
  Container.childContextTypes = containerContextTypes;
  return Container;
}

module.exports = { createContainer: createContainer, createContainerWithFragments: createContainerWithFragments };

/***/ }),
/* 269 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.__esModule = true;

var _defineProperty = __webpack_require__(109);

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (obj, key, value) {
  if (key in obj) {
    (0, _defineProperty2.default)(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

/***/ }),
/* 270 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactRelayRefetchContainer
 * 
 * @format
 */



var _extends3 = _interopRequireDefault(__webpack_require__(60));

var _classCallCheck3 = _interopRequireDefault(__webpack_require__(21));

var _possibleConstructorReturn3 = _interopRequireDefault(__webpack_require__(22));

var _inherits3 = _interopRequireDefault(__webpack_require__(23));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _require = __webpack_require__(98),
    profileContainer = _require.profileContainer;

var _require2 = __webpack_require__(62),
    getComponentName = _require2.getComponentName,
    getReactComponent = _require2.getReactComponent;

var _require3 = __webpack_require__(50),
    Observable = _require3.Observable;

var containerContextTypes = {
  relay: __webpack_require__(43).Relay
};

/**
 * Composes a React component class, returning a new class that intercepts
 * props, resolving them with the provided fragments and subscribing for
 * updates.
 */
function createContainerWithFragments(Component, fragments, taggedNode) {
  var ComponentClass = getReactComponent(Component);
  var componentName = getComponentName(Component);
  var containerName = 'Relay(' + componentName + ')';

  var Container = function (_React$Component) {
    (0, _inherits3['default'])(Container, _React$Component);

    function Container(props, context) {
      (0, _classCallCheck3['default'])(this, Container);

      var _this = (0, _possibleConstructorReturn3['default'])(this, _React$Component.call(this, props, context));

      _this._handleFragmentDataUpdate = function () {
        var profiler = __webpack_require__(61).profile('ReactRelayRefetchContainer.handleFragmentDataUpdate');
        _this.setState({ data: _this._resolver.resolve() }, profiler.stop);
      };

      _this._refetch = function (refetchVariables, renderVariables, callback, options) {
        var _assertRelayContext = assertRelayContext(_this.context.relay),
            environment = _assertRelayContext.environment,
            rootVariables = _assertRelayContext.variables;

        var fetchVariables = typeof refetchVariables === 'function' ? refetchVariables(_this._getFragmentVariables()) : refetchVariables;
        fetchVariables = (0, _extends3['default'])({}, rootVariables, fetchVariables);
        var fragmentVariables = renderVariables ? (0, _extends3['default'])({}, rootVariables, renderVariables) : fetchVariables;
        var cacheConfig = options ? { force: !!options.force } : undefined;
        var _this$context$relay$e = _this.context.relay.environment.unstable_internal,
            createOperationSelector = _this$context$relay$e.createOperationSelector,
            getOperation = _this$context$relay$e.getOperation;

        var query = getOperation(taggedNode);
        var operation = createOperationSelector(query, fetchVariables);

        // Immediately retain the results of the query to prevent cached
        // data from being evicted
        var reference = environment.retain(operation.root);
        _this._references.push(reference);

        _this._localVariables = fetchVariables;

        // Cancel any previously running refetch.
        _this._refetchSubscription && _this._refetchSubscription.unsubscribe();

        // Declare refetchSubscription before assigning it in .start(), since
        // synchronous completion may call callbacks .subscribe() returns.
        var refetchSubscription = void 0;
        environment.execute({ operation: operation, cacheConfig: cacheConfig }).mergeMap(function (response) {
          _this._relayContext = {
            environment: _this.context.relay.environment,
            variables: fragmentVariables
          };
          _this._resolver.setVariables(fragmentVariables);
          return new Observable(function (sink) {
            return _this.setState({ data: _this._resolver.resolve() }, function () {
              sink.next();
              sink.complete();
            });
          });
        })['finally'](function () {
          // Finalizing a refetch should only clear this._refetchSubscription
          // if the finizing subscription is the most recent call.
          if (_this._refetchSubscription === refetchSubscription) {
            _this._refetchSubscription = null;
          }
        }).subscribe({
          start: function start(subscription) {
            _this._refetchSubscription = refetchSubscription = subscription;
          },
          next: callback,
          error: callback
        });

        return {
          dispose: function dispose() {
            refetchSubscription && refetchSubscription.unsubscribe();
          }
        };
      };

      var relay = assertRelayContext(context.relay);
      var createFragmentSpecResolver = relay.environment.unstable_internal.createFragmentSpecResolver;

      _this._localVariables = null;
      _this._refetchSubscription = null;
      _this._references = [];
      _this._resolver = createFragmentSpecResolver(relay, containerName, fragments, props, _this._handleFragmentDataUpdate);
      _this._relayContext = {
        environment: _this.context.relay.environment,
        variables: _this.context.relay.variables
      };
      _this.state = {
        data: _this._resolver.resolve(),
        relayProp: _this._buildRelayProp(relay)
      };
      return _this;
    }

    /**
     * When new props are received, read data for the new props and subscribe
     * for updates. Props may be the same in which case previous data and
     * subscriptions can be reused.
     */


    Container.prototype.componentWillReceiveProps = function componentWillReceiveProps(nextProps, nextContext) {
      var context = __webpack_require__(99)(nextContext);
      var relay = assertRelayContext(context.relay);
      var _relay$environment$un = relay.environment.unstable_internal,
          createFragmentSpecResolver = _relay$environment$un.createFragmentSpecResolver,
          getDataIDsFromObject = _relay$environment$un.getDataIDsFromObject;

      var prevIDs = getDataIDsFromObject(fragments, this.props);
      var nextIDs = getDataIDsFromObject(fragments, nextProps);

      // If the environment has changed or props point to new records then
      // previously fetched data and any pending fetches no longer apply:
      // - Existing references are on the old environment.
      // - Existing references are based on old variables.
      // - Pending fetches are for the previous records.
      if (this.context.relay.environment !== relay.environment || this.context.relay.variables !== relay.variables || !__webpack_require__(18)(prevIDs, nextIDs)) {
        this._release();
        this._localVariables = null;
        this._relayContext = {
          environment: relay.environment,
          variables: relay.variables
        };
        this._resolver = createFragmentSpecResolver(relay, containerName, fragments, nextProps, this._handleFragmentDataUpdate);
        this.setState({ relayProp: this._buildRelayProp(relay) });
      } else if (!this._localVariables) {
        this._resolver.setProps(nextProps);
      }
      var data = this._resolver.resolve();
      if (data !== this.state.data) {
        this.setState({ data: data });
      }
    };

    Container.prototype.componentWillUnmount = function componentWillUnmount() {
      this._release();
    };

    Container.prototype.shouldComponentUpdate = function shouldComponentUpdate(nextProps, nextState, nextContext) {
      // Short-circuit if any Relay-related data has changed
      if (nextContext.relay !== this.context.relay || nextState.data !== this.state.data || nextState.relayProp !== this.state.relayProp) {
        return true;
      }
      // Otherwise, for convenience short-circuit if all non-Relay props
      // are scalar and equal
      var keys = Object.keys(nextProps);
      for (var ii = 0; ii < keys.length; ii++) {
        var _key = keys[ii];
        if (!fragments.hasOwnProperty(_key) && !__webpack_require__(100)(nextProps[_key], this.props[_key])) {
          return true;
        }
      }
      return false;
    };

    Container.prototype._release = function _release() {
      this._resolver.dispose();
      this._references.forEach(function (disposable) {
        return disposable.dispose();
      });
      this._references.length = 0;
      this._refetchSubscription && this._refetchSubscription.unsubscribe();
    };

    Container.prototype._buildRelayProp = function _buildRelayProp(relay) {
      return {
        environment: relay.environment,
        refetch: this._refetch
      };
    };

    /**
     * Render new data for the existing props/context.
     */


    Container.prototype._getFragmentVariables = function _getFragmentVariables() {
      var getVariablesFromObject = this.context.relay.environment.unstable_internal.getVariablesFromObject;

      return getVariablesFromObject(this.context.relay.variables, fragments, this.props);
    };

    Container.prototype.getChildContext = function getChildContext() {
      return { relay: this._relayContext };
    };

    Container.prototype.render = function render() {
      if (ComponentClass) {
        return __webpack_require__(7).createElement(ComponentClass, (0, _extends3['default'])({}, this.props, this.state.data, {
          // TODO: Remove the string ref fallback.
          ref: this.props.componentRef || 'component',
          relay: this.state.relayProp
        }));
      } else {
        // Stateless functional, doesn't support `ref`
        return __webpack_require__(7).createElement(Component, (0, _extends3['default'])({}, this.props, this.state.data, {
          relay: this.state.relayProp
        }));
      }
    };

    return Container;
  }(__webpack_require__(7).Component);

  profileContainer(Container, 'ReactRelayRefetchContainer');
  Container.contextTypes = containerContextTypes;
  Container.displayName = containerName;

  return Container;
}

function assertRelayContext(relay) {
  __webpack_require__(0)(__webpack_require__(44)(relay), 'ReactRelayRefetchContainer: Expected `context.relay` to be an object ' + 'conforming to the `RelayContext` interface, got `%s`.', relay);
  return relay;
}

/**
 * Wrap the basic `createContainer()` function with logic to adapt to the
 * `context.relay.environment` in which it is rendered. Specifically, the
 * extraction of the environment-specific version of fragments in the
 * `fragmentSpec` is memoized once per environment, rather than once per
 * instance of the container constructed/rendered.
 */
function createContainer(Component, fragmentSpec, taggedNode) {
  var Container = __webpack_require__(101)(Component, fragmentSpec, function (ComponentClass, fragments) {
    return createContainerWithFragments(ComponentClass, fragments, taggedNode);
  });
  /* $FlowFixMe(>=0.53.0) This comment suppresses an error
   * when upgrading Flow's support for React. Common errors found when
   * upgrading Flow's React support are documented at
   * https://fburl.com/eq7bs81w */
  Container.childContextTypes = containerContextTypes;
  return Container;
}

module.exports = { createContainer: createContainer, createContainerWithFragments: createContainerWithFragments };

/***/ }),
/* 271 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteral2 = __webpack_require__(142);

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _getPrototypeOf = __webpack_require__(66);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(21);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = __webpack_require__(108);

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = __webpack_require__(22);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(23);

var _inherits3 = _interopRequireDefault(_inherits2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['\n      fragment Table on Viewer {\n        title\n      }\n    '], ['\n      fragment Table on Viewer {\n        title\n      }\n    ']);

var _react = __webpack_require__(7);

var _react2 = _interopRequireDefault(_react);

var _reactRelay = __webpack_require__(81);

var _reactRelay2 = _interopRequireDefault(_reactRelay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Table = function (_React$Component) {
  (0, _inherits3.default)(Table, _React$Component);

  function Table(props) {
    (0, _classCallCheck3.default)(this, Table);

    var _this = (0, _possibleConstructorReturn3.default)(this, (Table.__proto__ || (0, _getPrototypeOf2.default)(Table)).call(this, props));

    console.log(props);
    return _this;
  }

  (0, _createClass3.default)(Table, [{
    key: 'render',
    value: function render() {
      return _react2.default.createElement(
        'p',
        null,
        'item: ',
        this.props
      );
    }
  }]);
  return Table;
}(_react2.default.Component);

;

exports.default = _reactRelay2.default.createFragmentContainer(Table, (0, _reactRelay.graphql)(_templateObject));

/***/ }),
/* 272 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(273), __esModule: true };

/***/ }),
/* 273 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(274);
var $Object = __webpack_require__(10).Object;
module.exports = function defineProperties(T, D) {
  return $Object.defineProperties(T, D);
};


/***/ }),
/* 274 */
/***/ (function(module, exports, __webpack_require__) {

var $export = __webpack_require__(13);
// 19.1.2.3 / 15.2.3.7 Object.defineProperties(O, Properties)
$export($export.S + $export.F * !__webpack_require__(14), 'Object', { defineProperties: __webpack_require__(113) });


/***/ }),
/* 275 */
/***/ (function(module, exports, __webpack_require__) {

module.exports = { "default": __webpack_require__(276), __esModule: true };

/***/ }),
/* 276 */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(277);
module.exports = __webpack_require__(10).Object.freeze;


/***/ }),
/* 277 */
/***/ (function(module, exports, __webpack_require__) {

// 19.1.2.5 Object.freeze(O)
var isObject = __webpack_require__(29);
var meta = __webpack_require__(117).onFreeze;

__webpack_require__(104)('freeze', function ($freeze) {
  return function freeze(it) {
    return $freeze && isObject(it) ? $freeze(meta(it)) : it;
  };
});


/***/ }),
/* 278 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _taggedTemplateLiteral2 = __webpack_require__(142);

var _taggedTemplateLiteral3 = _interopRequireDefault(_taggedTemplateLiteral2);

var _getPrototypeOf = __webpack_require__(66);

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = __webpack_require__(21);

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _possibleConstructorReturn2 = __webpack_require__(22);

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _inherits2 = __webpack_require__(23);

var _inherits3 = _interopRequireDefault(_inherits2);

var _templateObject = (0, _taggedTemplateLiteral3.default)(['query{publications}'], ['query{publications}']);

var _reactRelay = __webpack_require__(81);

var _reactRelay2 = _interopRequireDefault(_reactRelay);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var _class = function (_Relay$Route) {
  (0, _inherits3.default)(_class, _Relay$Route);

  function _class() {
    (0, _classCallCheck3.default)(this, _class);
    return (0, _possibleConstructorReturn3.default)(this, (_class.__proto__ || (0, _getPrototypeOf2.default)(_class)).apply(this, arguments));
  }

  return _class;
}(_reactRelay2.default.Route);

_class.queries = {
  viewer: function viewer() {
    return _reactRelay2.default.QL(_templateObject);
  }
};
_class.routeName = 'AppRoute';
exports.default = _class;
;

/***/ }),
/* 279 */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(process, global) {var require;/*!
 * @overview es6-promise - a tiny implementation of Promises/A+.
 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
 * @license   Licensed under MIT license
 *            See https://raw.githubusercontent.com/stefanpenner/es6-promise/master/LICENSE
 * @version   4.1.1
 */

(function (global, factory) {
	 true ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(global.ES6Promise = factory());
}(this, (function () { 'use strict';

function objectOrFunction(x) {
  var type = typeof x;
  return x !== null && (type === 'object' || type === 'function');
}

function isFunction(x) {
  return typeof x === 'function';
}

var _isArray = undefined;
if (Array.isArray) {
  _isArray = Array.isArray;
} else {
  _isArray = function (x) {
    return Object.prototype.toString.call(x) === '[object Array]';
  };
}

var isArray = _isArray;

var len = 0;
var vertxNext = undefined;
var customSchedulerFn = undefined;

var asap = function asap(callback, arg) {
  queue[len] = callback;
  queue[len + 1] = arg;
  len += 2;
  if (len === 2) {
    // If len is 2, that means that we need to schedule an async flush.
    // If additional callbacks are queued before the queue is flushed, they
    // will be processed by this flush that we are scheduling.
    if (customSchedulerFn) {
      customSchedulerFn(flush);
    } else {
      scheduleFlush();
    }
  }
};

function setScheduler(scheduleFn) {
  customSchedulerFn = scheduleFn;
}

function setAsap(asapFn) {
  asap = asapFn;
}

var browserWindow = typeof window !== 'undefined' ? window : undefined;
var browserGlobal = browserWindow || {};
var BrowserMutationObserver = browserGlobal.MutationObserver || browserGlobal.WebKitMutationObserver;
var isNode = typeof self === 'undefined' && typeof process !== 'undefined' && ({}).toString.call(process) === '[object process]';

// test for web worker but not in IE10
var isWorker = typeof Uint8ClampedArray !== 'undefined' && typeof importScripts !== 'undefined' && typeof MessageChannel !== 'undefined';

// node
function useNextTick() {
  // node version 0.10.x displays a deprecation warning when nextTick is used recursively
  // see https://github.com/cujojs/when/issues/410 for details
  return function () {
    return process.nextTick(flush);
  };
}

// vertx
function useVertxTimer() {
  if (typeof vertxNext !== 'undefined') {
    return function () {
      vertxNext(flush);
    };
  }

  return useSetTimeout();
}

function useMutationObserver() {
  var iterations = 0;
  var observer = new BrowserMutationObserver(flush);
  var node = document.createTextNode('');
  observer.observe(node, { characterData: true });

  return function () {
    node.data = iterations = ++iterations % 2;
  };
}

// web worker
function useMessageChannel() {
  var channel = new MessageChannel();
  channel.port1.onmessage = flush;
  return function () {
    return channel.port2.postMessage(0);
  };
}

function useSetTimeout() {
  // Store setTimeout reference so es6-promise will be unaffected by
  // other code modifying setTimeout (like sinon.useFakeTimers())
  var globalSetTimeout = setTimeout;
  return function () {
    return globalSetTimeout(flush, 1);
  };
}

var queue = new Array(1000);
function flush() {
  for (var i = 0; i < len; i += 2) {
    var callback = queue[i];
    var arg = queue[i + 1];

    callback(arg);

    queue[i] = undefined;
    queue[i + 1] = undefined;
  }

  len = 0;
}

function attemptVertx() {
  try {
    var r = require;
    var vertx = __webpack_require__(280);
    vertxNext = vertx.runOnLoop || vertx.runOnContext;
    return useVertxTimer();
  } catch (e) {
    return useSetTimeout();
  }
}

var scheduleFlush = undefined;
// Decide what async method to use to triggering processing of queued callbacks:
if (isNode) {
  scheduleFlush = useNextTick();
} else if (BrowserMutationObserver) {
  scheduleFlush = useMutationObserver();
} else if (isWorker) {
  scheduleFlush = useMessageChannel();
} else if (browserWindow === undefined && "function" === 'function') {
  scheduleFlush = attemptVertx();
} else {
  scheduleFlush = useSetTimeout();
}

function then(onFulfillment, onRejection) {
  var _arguments = arguments;

  var parent = this;

  var child = new this.constructor(noop);

  if (child[PROMISE_ID] === undefined) {
    makePromise(child);
  }

  var _state = parent._state;

  if (_state) {
    (function () {
      var callback = _arguments[_state - 1];
      asap(function () {
        return invokeCallback(_state, child, callback, parent._result);
      });
    })();
  } else {
    subscribe(parent, child, onFulfillment, onRejection);
  }

  return child;
}

/**
  `Promise.resolve` returns a promise that will become resolved with the
  passed `value`. It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    resolve(1);
  });

  promise.then(function(value){
    // value === 1
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.resolve(1);

  promise.then(function(value){
    // value === 1
  });
  ```

  @method resolve
  @static
  @param {Any} value value that the returned promise will be resolved with
  Useful for tooling.
  @return {Promise} a promise that will become fulfilled with the given
  `value`
*/
function resolve$1(object) {
  /*jshint validthis:true */
  var Constructor = this;

  if (object && typeof object === 'object' && object.constructor === Constructor) {
    return object;
  }

  var promise = new Constructor(noop);
  resolve(promise, object);
  return promise;
}

var PROMISE_ID = Math.random().toString(36).substring(16);

function noop() {}

var PENDING = void 0;
var FULFILLED = 1;
var REJECTED = 2;

var GET_THEN_ERROR = new ErrorObject();

function selfFulfillment() {
  return new TypeError("You cannot resolve a promise with itself");
}

function cannotReturnOwn() {
  return new TypeError('A promises callback cannot return that same promise.');
}

function getThen(promise) {
  try {
    return promise.then;
  } catch (error) {
    GET_THEN_ERROR.error = error;
    return GET_THEN_ERROR;
  }
}

function tryThen(then$$1, value, fulfillmentHandler, rejectionHandler) {
  try {
    then$$1.call(value, fulfillmentHandler, rejectionHandler);
  } catch (e) {
    return e;
  }
}

function handleForeignThenable(promise, thenable, then$$1) {
  asap(function (promise) {
    var sealed = false;
    var error = tryThen(then$$1, thenable, function (value) {
      if (sealed) {
        return;
      }
      sealed = true;
      if (thenable !== value) {
        resolve(promise, value);
      } else {
        fulfill(promise, value);
      }
    }, function (reason) {
      if (sealed) {
        return;
      }
      sealed = true;

      reject(promise, reason);
    }, 'Settle: ' + (promise._label || ' unknown promise'));

    if (!sealed && error) {
      sealed = true;
      reject(promise, error);
    }
  }, promise);
}

function handleOwnThenable(promise, thenable) {
  if (thenable._state === FULFILLED) {
    fulfill(promise, thenable._result);
  } else if (thenable._state === REJECTED) {
    reject(promise, thenable._result);
  } else {
    subscribe(thenable, undefined, function (value) {
      return resolve(promise, value);
    }, function (reason) {
      return reject(promise, reason);
    });
  }
}

function handleMaybeThenable(promise, maybeThenable, then$$1) {
  if (maybeThenable.constructor === promise.constructor && then$$1 === then && maybeThenable.constructor.resolve === resolve$1) {
    handleOwnThenable(promise, maybeThenable);
  } else {
    if (then$$1 === GET_THEN_ERROR) {
      reject(promise, GET_THEN_ERROR.error);
      GET_THEN_ERROR.error = null;
    } else if (then$$1 === undefined) {
      fulfill(promise, maybeThenable);
    } else if (isFunction(then$$1)) {
      handleForeignThenable(promise, maybeThenable, then$$1);
    } else {
      fulfill(promise, maybeThenable);
    }
  }
}

function resolve(promise, value) {
  if (promise === value) {
    reject(promise, selfFulfillment());
  } else if (objectOrFunction(value)) {
    handleMaybeThenable(promise, value, getThen(value));
  } else {
    fulfill(promise, value);
  }
}

function publishRejection(promise) {
  if (promise._onerror) {
    promise._onerror(promise._result);
  }

  publish(promise);
}

function fulfill(promise, value) {
  if (promise._state !== PENDING) {
    return;
  }

  promise._result = value;
  promise._state = FULFILLED;

  if (promise._subscribers.length !== 0) {
    asap(publish, promise);
  }
}

function reject(promise, reason) {
  if (promise._state !== PENDING) {
    return;
  }
  promise._state = REJECTED;
  promise._result = reason;

  asap(publishRejection, promise);
}

function subscribe(parent, child, onFulfillment, onRejection) {
  var _subscribers = parent._subscribers;
  var length = _subscribers.length;

  parent._onerror = null;

  _subscribers[length] = child;
  _subscribers[length + FULFILLED] = onFulfillment;
  _subscribers[length + REJECTED] = onRejection;

  if (length === 0 && parent._state) {
    asap(publish, parent);
  }
}

function publish(promise) {
  var subscribers = promise._subscribers;
  var settled = promise._state;

  if (subscribers.length === 0) {
    return;
  }

  var child = undefined,
      callback = undefined,
      detail = promise._result;

  for (var i = 0; i < subscribers.length; i += 3) {
    child = subscribers[i];
    callback = subscribers[i + settled];

    if (child) {
      invokeCallback(settled, child, callback, detail);
    } else {
      callback(detail);
    }
  }

  promise._subscribers.length = 0;
}

function ErrorObject() {
  this.error = null;
}

var TRY_CATCH_ERROR = new ErrorObject();

function tryCatch(callback, detail) {
  try {
    return callback(detail);
  } catch (e) {
    TRY_CATCH_ERROR.error = e;
    return TRY_CATCH_ERROR;
  }
}

function invokeCallback(settled, promise, callback, detail) {
  var hasCallback = isFunction(callback),
      value = undefined,
      error = undefined,
      succeeded = undefined,
      failed = undefined;

  if (hasCallback) {
    value = tryCatch(callback, detail);

    if (value === TRY_CATCH_ERROR) {
      failed = true;
      error = value.error;
      value.error = null;
    } else {
      succeeded = true;
    }

    if (promise === value) {
      reject(promise, cannotReturnOwn());
      return;
    }
  } else {
    value = detail;
    succeeded = true;
  }

  if (promise._state !== PENDING) {
    // noop
  } else if (hasCallback && succeeded) {
      resolve(promise, value);
    } else if (failed) {
      reject(promise, error);
    } else if (settled === FULFILLED) {
      fulfill(promise, value);
    } else if (settled === REJECTED) {
      reject(promise, value);
    }
}

function initializePromise(promise, resolver) {
  try {
    resolver(function resolvePromise(value) {
      resolve(promise, value);
    }, function rejectPromise(reason) {
      reject(promise, reason);
    });
  } catch (e) {
    reject(promise, e);
  }
}

var id = 0;
function nextId() {
  return id++;
}

function makePromise(promise) {
  promise[PROMISE_ID] = id++;
  promise._state = undefined;
  promise._result = undefined;
  promise._subscribers = [];
}

function Enumerator$1(Constructor, input) {
  this._instanceConstructor = Constructor;
  this.promise = new Constructor(noop);

  if (!this.promise[PROMISE_ID]) {
    makePromise(this.promise);
  }

  if (isArray(input)) {
    this.length = input.length;
    this._remaining = input.length;

    this._result = new Array(this.length);

    if (this.length === 0) {
      fulfill(this.promise, this._result);
    } else {
      this.length = this.length || 0;
      this._enumerate(input);
      if (this._remaining === 0) {
        fulfill(this.promise, this._result);
      }
    }
  } else {
    reject(this.promise, validationError());
  }
}

function validationError() {
  return new Error('Array Methods must be provided an Array');
}

Enumerator$1.prototype._enumerate = function (input) {
  for (var i = 0; this._state === PENDING && i < input.length; i++) {
    this._eachEntry(input[i], i);
  }
};

Enumerator$1.prototype._eachEntry = function (entry, i) {
  var c = this._instanceConstructor;
  var resolve$$1 = c.resolve;

  if (resolve$$1 === resolve$1) {
    var _then = getThen(entry);

    if (_then === then && entry._state !== PENDING) {
      this._settledAt(entry._state, i, entry._result);
    } else if (typeof _then !== 'function') {
      this._remaining--;
      this._result[i] = entry;
    } else if (c === Promise$2) {
      var promise = new c(noop);
      handleMaybeThenable(promise, entry, _then);
      this._willSettleAt(promise, i);
    } else {
      this._willSettleAt(new c(function (resolve$$1) {
        return resolve$$1(entry);
      }), i);
    }
  } else {
    this._willSettleAt(resolve$$1(entry), i);
  }
};

Enumerator$1.prototype._settledAt = function (state, i, value) {
  var promise = this.promise;

  if (promise._state === PENDING) {
    this._remaining--;

    if (state === REJECTED) {
      reject(promise, value);
    } else {
      this._result[i] = value;
    }
  }

  if (this._remaining === 0) {
    fulfill(promise, this._result);
  }
};

Enumerator$1.prototype._willSettleAt = function (promise, i) {
  var enumerator = this;

  subscribe(promise, undefined, function (value) {
    return enumerator._settledAt(FULFILLED, i, value);
  }, function (reason) {
    return enumerator._settledAt(REJECTED, i, reason);
  });
};

/**
  `Promise.all` accepts an array of promises, and returns a new promise which
  is fulfilled with an array of fulfillment values for the passed promises, or
  rejected with the reason of the first passed promise to be rejected. It casts all
  elements of the passed iterable to promises as it runs this algorithm.

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = resolve(2);
  let promise3 = resolve(3);
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // The array here would be [ 1, 2, 3 ];
  });
  ```

  If any of the `promises` given to `all` are rejected, the first promise
  that is rejected will be given as an argument to the returned promises's
  rejection handler. For example:

  Example:

  ```javascript
  let promise1 = resolve(1);
  let promise2 = reject(new Error("2"));
  let promise3 = reject(new Error("3"));
  let promises = [ promise1, promise2, promise3 ];

  Promise.all(promises).then(function(array){
    // Code here never runs because there are rejected promises!
  }, function(error) {
    // error.message === "2"
  });
  ```

  @method all
  @static
  @param {Array} entries array of promises
  @param {String} label optional string for labeling the promise.
  Useful for tooling.
  @return {Promise} promise that is fulfilled when all `promises` have been
  fulfilled, or rejected if any of them become rejected.
  @static
*/
function all$1(entries) {
  return new Enumerator$1(this, entries).promise;
}

/**
  `Promise.race` returns a new promise which is settled in the same way as the
  first passed promise to settle.

  Example:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 2');
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // result === 'promise 2' because it was resolved before promise1
    // was resolved.
  });
  ```

  `Promise.race` is deterministic in that only the state of the first
  settled promise matters. For example, even if other promises given to the
  `promises` array argument are resolved, but the first settled promise has
  become rejected before the other promises became fulfilled, the returned
  promise will become rejected:

  ```javascript
  let promise1 = new Promise(function(resolve, reject){
    setTimeout(function(){
      resolve('promise 1');
    }, 200);
  });

  let promise2 = new Promise(function(resolve, reject){
    setTimeout(function(){
      reject(new Error('promise 2'));
    }, 100);
  });

  Promise.race([promise1, promise2]).then(function(result){
    // Code here never runs
  }, function(reason){
    // reason.message === 'promise 2' because promise 2 became rejected before
    // promise 1 became fulfilled
  });
  ```

  An example real-world use case is implementing timeouts:

  ```javascript
  Promise.race([ajax('foo.json'), timeout(5000)])
  ```

  @method race
  @static
  @param {Array} promises array of promises to observe
  Useful for tooling.
  @return {Promise} a promise which settles in the same way as the first passed
  promise to settle.
*/
function race$1(entries) {
  /*jshint validthis:true */
  var Constructor = this;

  if (!isArray(entries)) {
    return new Constructor(function (_, reject) {
      return reject(new TypeError('You must pass an array to race.'));
    });
  } else {
    return new Constructor(function (resolve, reject) {
      var length = entries.length;
      for (var i = 0; i < length; i++) {
        Constructor.resolve(entries[i]).then(resolve, reject);
      }
    });
  }
}

/**
  `Promise.reject` returns a promise rejected with the passed `reason`.
  It is shorthand for the following:

  ```javascript
  let promise = new Promise(function(resolve, reject){
    reject(new Error('WHOOPS'));
  });

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  Instead of writing the above, your code now simply becomes the following:

  ```javascript
  let promise = Promise.reject(new Error('WHOOPS'));

  promise.then(function(value){
    // Code here doesn't run because the promise is rejected!
  }, function(reason){
    // reason.message === 'WHOOPS'
  });
  ```

  @method reject
  @static
  @param {Any} reason value that the returned promise will be rejected with.
  Useful for tooling.
  @return {Promise} a promise rejected with the given `reason`.
*/
function reject$1(reason) {
  /*jshint validthis:true */
  var Constructor = this;
  var promise = new Constructor(noop);
  reject(promise, reason);
  return promise;
}

function needsResolver() {
  throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
}

function needsNew() {
  throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
}

/**
  Promise objects represent the eventual result of an asynchronous operation. The
  primary way of interacting with a promise is through its `then` method, which
  registers callbacks to receive either a promise's eventual value or the reason
  why the promise cannot be fulfilled.

  Terminology
  -----------

  - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
  - `thenable` is an object or function that defines a `then` method.
  - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
  - `exception` is a value that is thrown using the throw statement.
  - `reason` is a value that indicates why a promise was rejected.
  - `settled` the final resting state of a promise, fulfilled or rejected.

  A promise can be in one of three states: pending, fulfilled, or rejected.

  Promises that are fulfilled have a fulfillment value and are in the fulfilled
  state.  Promises that are rejected have a rejection reason and are in the
  rejected state.  A fulfillment value is never a thenable.

  Promises can also be said to *resolve* a value.  If this value is also a
  promise, then the original promise's settled state will match the value's
  settled state.  So a promise that *resolves* a promise that rejects will
  itself reject, and a promise that *resolves* a promise that fulfills will
  itself fulfill.


  Basic Usage:
  ------------

  ```js
  let promise = new Promise(function(resolve, reject) {
    // on success
    resolve(value);

    // on failure
    reject(reason);
  });

  promise.then(function(value) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Advanced Usage:
  ---------------

  Promises shine when abstracting away asynchronous interactions such as
  `XMLHttpRequest`s.

  ```js
  function getJSON(url) {
    return new Promise(function(resolve, reject){
      let xhr = new XMLHttpRequest();

      xhr.open('GET', url);
      xhr.onreadystatechange = handler;
      xhr.responseType = 'json';
      xhr.setRequestHeader('Accept', 'application/json');
      xhr.send();

      function handler() {
        if (this.readyState === this.DONE) {
          if (this.status === 200) {
            resolve(this.response);
          } else {
            reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
          }
        }
      };
    });
  }

  getJSON('/posts.json').then(function(json) {
    // on fulfillment
  }, function(reason) {
    // on rejection
  });
  ```

  Unlike callbacks, promises are great composable primitives.

  ```js
  Promise.all([
    getJSON('/posts'),
    getJSON('/comments')
  ]).then(function(values){
    values[0] // => postsJSON
    values[1] // => commentsJSON

    return values;
  });
  ```

  @class Promise
  @param {function} resolver
  Useful for tooling.
  @constructor
*/
function Promise$2(resolver) {
  this[PROMISE_ID] = nextId();
  this._result = this._state = undefined;
  this._subscribers = [];

  if (noop !== resolver) {
    typeof resolver !== 'function' && needsResolver();
    this instanceof Promise$2 ? initializePromise(this, resolver) : needsNew();
  }
}

Promise$2.all = all$1;
Promise$2.race = race$1;
Promise$2.resolve = resolve$1;
Promise$2.reject = reject$1;
Promise$2._setScheduler = setScheduler;
Promise$2._setAsap = setAsap;
Promise$2._asap = asap;

Promise$2.prototype = {
  constructor: Promise$2,

  /**
    The primary way of interacting with a promise is through its `then` method,
    which registers callbacks to receive either a promise's eventual value or the
    reason why the promise cannot be fulfilled.
  
    ```js
    findUser().then(function(user){
      // user is available
    }, function(reason){
      // user is unavailable, and you are given the reason why
    });
    ```
  
    Chaining
    --------
  
    The return value of `then` is itself a promise.  This second, 'downstream'
    promise is resolved with the return value of the first promise's fulfillment
    or rejection handler, or rejected if the handler throws an exception.
  
    ```js
    findUser().then(function (user) {
      return user.name;
    }, function (reason) {
      return 'default name';
    }).then(function (userName) {
      // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
      // will be `'default name'`
    });
  
    findUser().then(function (user) {
      throw new Error('Found user, but still unhappy');
    }, function (reason) {
      throw new Error('`findUser` rejected and we're unhappy');
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
      // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
    });
    ```
    If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
  
    ```js
    findUser().then(function (user) {
      throw new PedagogicalException('Upstream error');
    }).then(function (value) {
      // never reached
    }).then(function (value) {
      // never reached
    }, function (reason) {
      // The `PedgagocialException` is propagated all the way down to here
    });
    ```
  
    Assimilation
    ------------
  
    Sometimes the value you want to propagate to a downstream promise can only be
    retrieved asynchronously. This can be achieved by returning a promise in the
    fulfillment or rejection handler. The downstream promise will then be pending
    until the returned promise is settled. This is called *assimilation*.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // The user's comments are now available
    });
    ```
  
    If the assimliated promise rejects, then the downstream promise will also reject.
  
    ```js
    findUser().then(function (user) {
      return findCommentsByAuthor(user);
    }).then(function (comments) {
      // If `findCommentsByAuthor` fulfills, we'll have the value here
    }, function (reason) {
      // If `findCommentsByAuthor` rejects, we'll have the reason here
    });
    ```
  
    Simple Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let result;
  
    try {
      result = findResult();
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
    findResult(function(result, err){
      if (err) {
        // failure
      } else {
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findResult().then(function(result){
      // success
    }, function(reason){
      // failure
    });
    ```
  
    Advanced Example
    --------------
  
    Synchronous Example
  
    ```javascript
    let author, books;
  
    try {
      author = findAuthor();
      books  = findBooksByAuthor(author);
      // success
    } catch(reason) {
      // failure
    }
    ```
  
    Errback Example
  
    ```js
  
    function foundBooks(books) {
  
    }
  
    function failure(reason) {
  
    }
  
    findAuthor(function(author, err){
      if (err) {
        failure(err);
        // failure
      } else {
        try {
          findBoooksByAuthor(author, function(books, err) {
            if (err) {
              failure(err);
            } else {
              try {
                foundBooks(books);
              } catch(reason) {
                failure(reason);
              }
            }
          });
        } catch(error) {
          failure(err);
        }
        // success
      }
    });
    ```
  
    Promise Example;
  
    ```javascript
    findAuthor().
      then(findBooksByAuthor).
      then(function(books){
        // found books
    }).catch(function(reason){
      // something went wrong
    });
    ```
  
    @method then
    @param {Function} onFulfilled
    @param {Function} onRejected
    Useful for tooling.
    @return {Promise}
  */
  then: then,

  /**
    `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
    as the catch block of a try/catch statement.
  
    ```js
    function findAuthor(){
      throw new Error('couldn't find that author');
    }
  
    // synchronous
    try {
      findAuthor();
    } catch(reason) {
      // something went wrong
    }
  
    // async with promises
    findAuthor().catch(function(reason){
      // something went wrong
    });
    ```
  
    @method catch
    @param {Function} onRejection
    Useful for tooling.
    @return {Promise}
  */
  'catch': function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

/*global self*/
function polyfill$1() {
    var local = undefined;

    if (typeof global !== 'undefined') {
        local = global;
    } else if (typeof self !== 'undefined') {
        local = self;
    } else {
        try {
            local = Function('return this')();
        } catch (e) {
            throw new Error('polyfill failed because global object is unavailable in this environment');
        }
    }

    var P = local.Promise;

    if (P) {
        var promiseToString = null;
        try {
            promiseToString = Object.prototype.toString.call(P.resolve());
        } catch (e) {
            // silently ignored
        }

        if (promiseToString === '[object Promise]' && !P.cast) {
            return;
        }
    }

    local.Promise = Promise$2;
}

// Strange compat..
Promise$2.polyfill = polyfill$1;
Promise$2.Promise = Promise$2;

return Promise$2;

})));

//# sourceMappingURL=es6-promise.map

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(4), __webpack_require__(82)))

/***/ }),
/* 280 */
/***/ (function(module, exports) {

/* (ignored) */

/***/ })
/******/ ]);