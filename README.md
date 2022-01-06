# Workarounds for Emscripten's WebIDL Binder
Emscripten's WebIDL bindings generator seems to be much more suitable for generating JavaScript bindings for a C-style API than its other tool, Embind.

Several workarounds, however, are required due to to limitations and bugs in the implementation:

## Issues
### No Global Functions
You can't bind to global functions. All bound functions have to be methods on a C++ object. This is somewhat funny, since the Emscripten's generated bindings actually take the form of C-style global free functions. So for a C library the chain of invocations is something like this:

C global function -> C++ wrapper object method -> C++ generated global function -> JavaScript generated function -> JavaScript  wrapper object method

### No Support for TypedArrays
Reading and writing values into an WebIDL-defined array requires the use of Emscripten-custom getter and setter methods that appear to involve fairly significant overhead. They are unsuitable for realtime systems like in AudioWorklets, it's important to be able to access an array without any indirection or copying. Interestingly, more recent version of WebIDL (arrays have been removed from the WebIDL spec, but Emscripten's implementation of WebIDL is very old) introduced sequences, which require a copy of to made with no shared backing. Very recently (June 2021), the WebIDL spec has added improved support writable in place typed arrays.

### Functions can't return arrays
There is a bug in Emscripten's WebIDL binder that prevents it from generating valid C++ bindings for functions that return arrays. For example:

C++ method:
```
float* array_alloc(size_t length);
```

WebIDL:
```
float[] array_alloc(unsigned long length);
```

Produces this invalid function:
```
// error: cannot initialize return object of type 'float' with an rvalue of type 'float *'
float EMSCRIPTEN_KEEPALIVE emscripten_bind_AudioBufferWrapper_array_alloc_1(AudioBufferWrapper* self, unsigned int length) {
  return self->array_alloc(length);
}
```

## Workarounds

1. Use wrapper methods on a C++ object to expose C functions
2. Expose performance-critical APIs as raw pointers ("any" in WebIDL speak) and deference them to a typed array view on the JavaScript side.
3. Do the same for functions that return arrays

## Better Approaches

1. Write a custom bridge that can marshall and unmarshall JavaScript objects that mirror their equivalent C structs in wasm's shared heap. This will require sufficient metadata about the types of each object and its layout in wasm memory.
2. Wait for [Web Assembly Interface Types](https://github.com/WebAssembly/interface-types/blob/main/proposals/interface-types/Explainer.md) to be adopted by Emscripten, LLVM, or some other tooling.
