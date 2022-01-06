
#include <emscripten.h>

extern "C" {

// Not using size_t for array indices as the values used by the javascript code are signed.

EM_JS(void, array_bounds_check_error, (size_t idx, size_t size), {
  throw 'Array index ' + idx + ' out of bounds: [0,' + size + ')';
});

void array_bounds_check(const int array_size, const int array_idx) {
  if (array_idx < 0 || array_idx >= array_size) {
    array_bounds_check_error(array_idx, array_size);
  }
}

// VoidPtr

void EMSCRIPTEN_KEEPALIVE emscripten_bind_VoidPtr___destroy___0(void** self) {
  delete self;
}

// AudioBuffer

unsigned int EMSCRIPTEN_KEEPALIVE emscripten_bind_AudioBuffer_get_length_0(AudioBuffer* self) {
  return self->length;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_AudioBuffer_set_length_1(AudioBuffer* self, unsigned int arg0) {
  self->length = arg0;
}

void* EMSCRIPTEN_KEEPALIVE emscripten_bind_AudioBuffer_get_samples_0(AudioBuffer* self) {
  return self->samples;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_AudioBuffer_set_samples_1(AudioBuffer* self, void* arg0) {
  self->samples = arg0;
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_AudioBuffer___destroy___0(AudioBuffer* self) {
  delete self;
}

// AudioBufferWrapper

AudioBufferWrapper* EMSCRIPTEN_KEEPALIVE emscripten_bind_AudioBufferWrapper_AudioBufferWrapper_0() {
  return new AudioBufferWrapper();
}

void* EMSCRIPTEN_KEEPALIVE emscripten_bind_AudioBufferWrapper_array_alloc_1(AudioBufferWrapper* self, unsigned int length) {
  return self->array_alloc(length);
}

AudioBuffer* EMSCRIPTEN_KEEPALIVE emscripten_bind_AudioBufferWrapper_alloc_1(AudioBufferWrapper* self, unsigned int length) {
  return self->alloc(length);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_AudioBufferWrapper_clear_1(AudioBufferWrapper* self, AudioBuffer* buffer) {
  self->clear(buffer);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_AudioBufferWrapper_fill_2(AudioBufferWrapper* self, AudioBuffer* buffer, float value) {
  self->fill(buffer, value);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_AudioBufferWrapper_print_1(AudioBufferWrapper* self, AudioBuffer* buffer) {
  self->print(buffer);
}

void EMSCRIPTEN_KEEPALIVE emscripten_bind_AudioBufferWrapper___destroy___0(AudioBufferWrapper* self) {
  delete self;
}

}

