(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var crossvent = require('static/plugins/drag-and-drop/dragula/crossvent');
// var sortable = $('sortable');



dragula([$('left-defaults'), $('right-defaults')])
.on('drag', function (el) {
  el.className += ' el-drag-ex-1';
}).on('drop', function (el) {
  el.className = el.className.replace('el-drag-ex-1', '');
}).on('cancel', function (el) {
  el.className = el.className.replace('el-drag-ex-1', '');
});


dragula([document.getElementById("left-events"), document.getElementById("right-events")])
  .on('drag', function (el) {
    el.className += ' el-drag-ex-2';
    el.className = el.className.replace('ex-moved', '');
  })
  .on('drop', function (el, target, source, sibling) {
    el.className = el.className.replace('el-drag-ex-2', '');
    el.className += ' ex-moved';
  })
  .on('over', function (el, container) {
    container.className += ' ex-over';
  })
  .on('out', function (el, container) {
    container.className = container.className.replace('ex-over', '');
  })
  .on('cancel', function (el) {
    el.className = el.className.replace('el-drag-ex-2', '');
  });




dragula([$('left-rollbacks'), $('right-rollbacks')], { revertOnSpill: true })
.on('drag', function (el) {
  el.className += ' el-drag-ex-4';
}).on('drop', function (el) {
  el.className = el.className.replace('el-drag-ex-4', '');
}).on('cancel', function (el) {
  el.className = el.className.replace('el-drag-ex-4', '');
});


dragula([$('left-lovehandles'), $('right-lovehandles')], {
  moves: function (el, container, handle) {
    return el;
    return handle.className === 'handle';

  }
}).on('drag', function (el) {
  el.className += ' el-drag-ex-5';
}).on('drop', function (el) {
  el.className = el.className.replace('el-drag-ex-5', '');
}).on('cancel', function (el) {
  el.className = el.className.replace('el-drag-ex-5', '');
})



dragula([$('left-rm-spill'), $('right-rm-spill')], { removeOnSpill: true })
.on('drag', function (el) {
  el.className += ' el-drag-ex-3';
}).on('drop', function (el) {
  el.className = el.className.replace('el-drag-ex-3', '');
}).on('cancel', function (el) {
  el.className = el.className.replace('el-drag-ex-3', '');
});

function $ (id) {
  return document.getElementById(id);
}

},{"crossvent":3}],2:[function(require,module,exports){
(function (global){

var NativeCustomEvent = global.CustomEvent;

function useNative () {
  try {
    var p = new NativeCustomEvent('cat', { detail: { foo: 'bar' } });
    return  'cat' === p.type && 'bar' === p.detail.foo;
  } catch (e) {
  }
  return false;
}

/**
 * Cross-browser `CustomEvent` constructor.
 *
 * https://developer.mozilla.org/en-US/docs/Web/API/CustomEvent.CustomEvent
 *
 * @public
 */

module.exports = useNative() ? NativeCustomEvent :

// IE >= 9
'function' === typeof document.createEvent ? function CustomEvent (type, params) {
  var e = document.createEvent('CustomEvent');
  if (params) {
    e.initCustomEvent(type, params.bubbles, params.cancelable, params.detail);
  } else {
    e.initCustomEvent(type, false, false, void 0);
  }
  return e;
} :

// IE <= 8
function CustomEvent (type, params) {
  var e = document.createEventObject();
  e.type = type;
  if (params) {
    e.bubbles = Boolean(params.bubbles);
    e.cancelable = Boolean(params.cancelable);
    e.detail = params.detail;
  } else {
    e.bubbles = false;
    e.cancelable = false;
    e.detail = void 0;
  }
  return e;
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}],3:[function(require,module,exports){
(function (global){
'use strict';

var customEvent = require('custom-event');
var eventmap = require('./eventmap');
var doc = global.document;
var addEvent = addEventEasy;
var removeEvent = removeEventEasy;
var hardCache = [];

if (!global.addEventListener) {
  addEvent = addEventHard;
  removeEvent = removeEventHard;
}

module.exports = {
  add: addEvent,
  remove: removeEvent,
  fabricate: fabricateEvent
};

function addEventEasy (el, type, fn, capturing) {
  return el.addEventListener(type, fn, capturing);
}

function addEventHard (el, type, fn) {
  return el.attachEvent('on' + type, wrap(el, type, fn));
}

function removeEventEasy (el, type, fn, capturing) {
  return el.removeEventListener(type, fn, capturing);
}

function removeEventHard (el, type, fn) {
  var listener = unwrap(el, type, fn);
  if (listener) {
    return el.detachEvent('on' + type, listener);
  }
}

function fabricateEvent (el, type, model) {
  var e = eventmap.indexOf(type) === -1 ? makeCustomEvent() : makeClassicEvent();
  if (el.dispatchEvent) {
    el.dispatchEvent(e);
  } else {
    el.fireEvent('on' + type, e);
  }
  function makeClassicEvent () {
    var e;
    if (doc.createEvent) {
      e = doc.createEvent('Event');
      e.initEvent(type, true, true);
    } else if (doc.createEventObject) {
      e = doc.createEventObject();
    }
    return e;
  }
  function makeCustomEvent () {
    return new customEvent(type, { detail: model });
  }
}

function wrapperFactory (el, type, fn) {
  return function wrapper (originalEvent) {
    var e = originalEvent || global.event;
    e.target = e.target || e.srcElement;
    e.preventDefault = e.preventDefault || function preventDefault () { e.returnValue = false; };
    e.stopPropagation = e.stopPropagation || function stopPropagation () { e.cancelBubble = true; };
    e.which = e.which || e.keyCode;
    fn.call(el, e);
  };
}

function wrap (el, type, fn) {
  var wrapper = unwrap(el, type, fn) || wrapperFactory(el, type, fn);
  hardCache.push({
    wrapper: wrapper,
    element: el,
    type: type,
    fn: fn
  });
  return wrapper;
}

function unwrap (el, type, fn) {
  var i = find(el, type, fn);
  if (i) {
    var wrapper = hardCache[i].wrapper;
    hardCache.splice(i, 1); // free up a tad of memory
    return wrapper;
  }
}

function find (el, type, fn) {
  var i, item;
  for (i = 0; i < hardCache.length; i++) {
    item = hardCache[i];
    if (item.element === el && item.type === type && item.fn === fn) {
      return i;
    }
  }
}

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"./eventmap":4,"custom-event":2}],4:[function(require,module,exports){
(function (global){
'use strict';

var eventmap = [];
var eventname = '';
var ron = /^on/;

for (eventname in global) {
  if (ron.test(eventname)) {
    eventmap.push(eventname.slice(2));
  }
}

module.exports = eventmap;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])
