#include <stdlib.h>
#include <stdio.h>

extern "C" {
#ifdef __EMSCRIPTEN__
    #define FLOAT_AT(array, i) ((float*)array)[i]
#else
    #define FLOAT_AT(array, i) array[i]
#endif

#include "struct-with-float-array.h"

float_array_ptr array_new(size_t length) {
    return (float_array_ptr) malloc(sizeof(float) * length);
}

void AudioBuffer_fill(struct AudioBuffer* buffer, float value) {
    for (size_t i = 0; i < buffer->length; i++) {
        FLOAT_AT(buffer->samples, i) = value;
    }
}

void AudioBuffer_clear(struct AudioBuffer* buffer) {
    AudioBuffer_fill(buffer, 0.0f);
}

struct AudioBuffer* AudioBuffer_new(size_t length) {
    struct AudioBuffer* buffer = (struct AudioBuffer*)
        malloc(sizeof(struct AudioBuffer));

    buffer->length = length;
    buffer->samples = (float_array_ptr) malloc(sizeof(float) * length);
    AudioBuffer_clear(buffer);

    return buffer;
}

void AudioBuffer_destroy(struct AudioBuffer* buffer) {
    free(buffer->samples);
    free(buffer);
}
}


AudioBufferWrapper::AudioBufferWrapper() {}

float_array_ptr AudioBufferWrapper::array_alloc(size_t length) {
    return array_new(length);
}

struct AudioBuffer* AudioBufferWrapper::alloc(size_t length) {
    return AudioBuffer_new(length);
}

void AudioBufferWrapper::clear(struct AudioBuffer* buffer) {
    return AudioBuffer_clear(buffer);
}

void AudioBufferWrapper::fill(struct AudioBuffer* buffer, float value) {
    return AudioBuffer_fill(buffer, value);
}

void AudioBufferWrapper::print(struct AudioBuffer* buffer) {
    for (size_t i = 0; i < buffer->length - 1; i++) {
        printf("%.8f", FLOAT_AT(buffer->samples, i));
        printf(" ");
    }
}
