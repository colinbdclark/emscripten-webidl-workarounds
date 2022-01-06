mkdir -p build/

# Generate bindings
~/code/emscripten/tools/webidl_binder binding.idl build/struct-with-float-array-bindings

# Compile
em++ -I./struct-with-float-array.h struct-with-float-array.cpp bindings-wrapper.cpp --post-js build/struct-with-float-array-bindings.js --post-js array-dereferencer.js -o build/struct-with-float-array.html -s EXPORT_ALL=1 -s LINKABLE=1 -s EXPORTED_RUNTIME_METHODS='["ccall", "cwrap", "getValue"]'
