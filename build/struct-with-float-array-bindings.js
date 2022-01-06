
// Bindings utilities

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function WrapperObject() {
}
WrapperObject.prototype = Object.create(WrapperObject.prototype);
WrapperObject.prototype.constructor = WrapperObject;
WrapperObject.prototype.__class__ = WrapperObject;
WrapperObject.__cache__ = {};
Module['WrapperObject'] = WrapperObject;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function getCache(__class__) {
  return (__class__ || WrapperObject).__cache__;
}
Module['getCache'] = getCache;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant)
    @param {*=} __class__ */
function wrapPointer(ptr, __class__) {
  var cache = getCache(__class__);
  var ret = cache[ptr];
  if (ret) return ret;
  ret = Object.create((__class__ || WrapperObject).prototype);
  ret.ptr = ptr;
  return cache[ptr] = ret;
}
Module['wrapPointer'] = wrapPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function castObject(obj, __class__) {
  return wrapPointer(obj.ptr, __class__);
}
Module['castObject'] = castObject;

Module['NULL'] = wrapPointer(0);

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function destroy(obj) {
  if (!obj['__destroy__']) throw 'Error: Cannot destroy object. (Did you create it yourself?)';
  obj['__destroy__']();
  // Remove from cache, so the object can be GC'd and refs added onto it released
  delete getCache(obj.__class__)[obj.ptr];
}
Module['destroy'] = destroy;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function compare(obj1, obj2) {
  return obj1.ptr === obj2.ptr;
}
Module['compare'] = compare;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getPointer(obj) {
  return obj.ptr;
}
Module['getPointer'] = getPointer;

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function getClass(obj) {
  return obj.__class__;
}
Module['getClass'] = getClass;

// Converts big (string or array) values into a C-style storage, in temporary space

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
var ensureCache = {
  buffer: 0,  // the main buffer of temporary storage
  size: 0,   // the size of buffer
  pos: 0,    // the next free offset in buffer
  temps: [], // extra allocations
  needed: 0, // the total size we need next time

  prepare: function() {
    if (ensureCache.needed) {
      // clear the temps
      for (var i = 0; i < ensureCache.temps.length; i++) {
        Module['_free'](ensureCache.temps[i]);
      }
      ensureCache.temps.length = 0;
      // prepare to allocate a bigger buffer
      Module['_free'](ensureCache.buffer);
      ensureCache.buffer = 0;
      ensureCache.size += ensureCache.needed;
      // clean up
      ensureCache.needed = 0;
    }
    if (!ensureCache.buffer) { // happens first time, or when we need to grow
      ensureCache.size += 128; // heuristic, avoid many small grow events
      ensureCache.buffer = Module['_malloc'](ensureCache.size);
      assert(ensureCache.buffer);
    }
    ensureCache.pos = 0;
  },
  alloc: function(array, view) {
    assert(ensureCache.buffer);
    var bytes = view.BYTES_PER_ELEMENT;
    var len = array.length * bytes;
    len = (len + 7) & -8; // keep things aligned to 8 byte boundaries
    var ret;
    if (ensureCache.pos + len >= ensureCache.size) {
      // we failed to allocate in the buffer, ensureCache time around :(
      assert(len > 0); // null terminator, at least
      ensureCache.needed += len;
      ret = Module['_malloc'](len);
      ensureCache.temps.push(ret);
    } else {
      // we can allocate in the buffer
      ret = ensureCache.buffer + ensureCache.pos;
      ensureCache.pos += len;
    }
    return ret;
  },
  copy: function(array, view, offset) {
    offset >>>= 0;
    var bytes = view.BYTES_PER_ELEMENT;
    switch (bytes) {
      case 2: offset >>>= 1; break;
      case 4: offset >>>= 2; break;
      case 8: offset >>>= 3; break;
    }
    for (var i = 0; i < array.length; i++) {
      view[offset + i] = array[i];
    }
  },
};

/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureString(value) {
  if (typeof value === 'string') {
    var intArray = intArrayFromString(value);
    var offset = ensureCache.alloc(intArray, HEAP8);
    ensureCache.copy(intArray, HEAP8, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt8(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP8);
    ensureCache.copy(value, HEAP8, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt16(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP16);
    ensureCache.copy(value, HEAP16, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureInt32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAP32);
    ensureCache.copy(value, HEAP32, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat32(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF32);
    ensureCache.copy(value, HEAPF32, offset);
    return offset;
  }
  return value;
}
/** @suppress {duplicate} (TODO: avoid emitting this multiple times, it is redundant) */
function ensureFloat64(value) {
  if (typeof value === 'object') {
    var offset = ensureCache.alloc(value, HEAPF64);
    ensureCache.copy(value, HEAPF64, offset);
    return offset;
  }
  return value;
}


// VoidPtr
/** @suppress {undefinedVars, duplicate} @this{Object} */function VoidPtr() { throw "cannot construct a VoidPtr, no constructor in IDL" }
VoidPtr.prototype = Object.create(WrapperObject.prototype);
VoidPtr.prototype.constructor = VoidPtr;
VoidPtr.prototype.__class__ = VoidPtr;
VoidPtr.__cache__ = {};
Module['VoidPtr'] = VoidPtr;

  VoidPtr.prototype['__destroy__'] = VoidPtr.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_VoidPtr___destroy___0(self);
};
// AudioBuffer
/** @suppress {undefinedVars, duplicate} @this{Object} */function AudioBuffer() { throw "cannot construct a AudioBuffer, no constructor in IDL" }
AudioBuffer.prototype = Object.create(WrapperObject.prototype);
AudioBuffer.prototype.constructor = AudioBuffer;
AudioBuffer.prototype.__class__ = AudioBuffer;
AudioBuffer.__cache__ = {};
Module['AudioBuffer'] = AudioBuffer;

  AudioBuffer.prototype['get_length'] = AudioBuffer.prototype.get_length = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_AudioBuffer_get_length_0(self);
};
    AudioBuffer.prototype['set_length'] = AudioBuffer.prototype.set_length = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_AudioBuffer_set_length_1(self, arg0);
};
    Object.defineProperty(AudioBuffer.prototype, 'length', { get: AudioBuffer.prototype.get_length, set: AudioBuffer.prototype.set_length });
  AudioBuffer.prototype['get_samples'] = AudioBuffer.prototype.get_samples = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  return _emscripten_bind_AudioBuffer_get_samples_0(self);
};
    AudioBuffer.prototype['set_samples'] = AudioBuffer.prototype.set_samples = /** @suppress {undefinedVars, duplicate} @this{Object} */function(arg0) {
  var self = this.ptr;
  if (arg0 && typeof arg0 === 'object') arg0 = arg0.ptr;
  _emscripten_bind_AudioBuffer_set_samples_1(self, arg0);
};
    Object.defineProperty(AudioBuffer.prototype, 'samples', { get: AudioBuffer.prototype.get_samples, set: AudioBuffer.prototype.set_samples });
  AudioBuffer.prototype['__destroy__'] = AudioBuffer.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_AudioBuffer___destroy___0(self);
};
// AudioBufferWrapper
/** @suppress {undefinedVars, duplicate} @this{Object} */function AudioBufferWrapper() {
  this.ptr = _emscripten_bind_AudioBufferWrapper_AudioBufferWrapper_0();
  getCache(AudioBufferWrapper)[this.ptr] = this;
};;
AudioBufferWrapper.prototype = Object.create(WrapperObject.prototype);
AudioBufferWrapper.prototype.constructor = AudioBufferWrapper;
AudioBufferWrapper.prototype.__class__ = AudioBufferWrapper;
AudioBufferWrapper.__cache__ = {};
Module['AudioBufferWrapper'] = AudioBufferWrapper;

AudioBufferWrapper.prototype['array_alloc'] = AudioBufferWrapper.prototype.array_alloc = /** @suppress {undefinedVars, duplicate} @this{Object} */function(length) {
  var self = this.ptr;
  if (length && typeof length === 'object') length = length.ptr;
  return _emscripten_bind_AudioBufferWrapper_array_alloc_1(self, length);
};;

AudioBufferWrapper.prototype['alloc'] = AudioBufferWrapper.prototype.alloc = /** @suppress {undefinedVars, duplicate} @this{Object} */function(length) {
  var self = this.ptr;
  if (length && typeof length === 'object') length = length.ptr;
  return wrapPointer(_emscripten_bind_AudioBufferWrapper_alloc_1(self, length), AudioBuffer);
};;

AudioBufferWrapper.prototype['clear'] = AudioBufferWrapper.prototype.clear = /** @suppress {undefinedVars, duplicate} @this{Object} */function(buffer) {
  var self = this.ptr;
  if (buffer && typeof buffer === 'object') buffer = buffer.ptr;
  _emscripten_bind_AudioBufferWrapper_clear_1(self, buffer);
};;

AudioBufferWrapper.prototype['fill'] = AudioBufferWrapper.prototype.fill = /** @suppress {undefinedVars, duplicate} @this{Object} */function(buffer, value) {
  var self = this.ptr;
  if (buffer && typeof buffer === 'object') buffer = buffer.ptr;
  if (value && typeof value === 'object') value = value.ptr;
  _emscripten_bind_AudioBufferWrapper_fill_2(self, buffer, value);
};;

AudioBufferWrapper.prototype['print'] = AudioBufferWrapper.prototype.print = /** @suppress {undefinedVars, duplicate} @this{Object} */function(buffer) {
  var self = this.ptr;
  if (buffer && typeof buffer === 'object') buffer = buffer.ptr;
  _emscripten_bind_AudioBufferWrapper_print_1(self, buffer);
};;

  AudioBufferWrapper.prototype['__destroy__'] = AudioBufferWrapper.prototype.__destroy__ = /** @suppress {undefinedVars, duplicate} @this{Object} */function() {
  var self = this.ptr;
  _emscripten_bind_AudioBufferWrapper___destroy___0(self);
};