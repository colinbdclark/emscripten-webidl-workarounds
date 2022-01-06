#include <stddef.h>

#ifdef __EMSCRIPTEN__
    typedef void* float_array_ptr;
#else
    typedef float* float_array_ptr;
#endif

struct AudioBuffer {
    size_t length;
    float_array_ptr samples;
};

struct AudioBuffer* AudioBuffer_new(size_t length);
void AudioBuffer_fill(struct AudioBuffer* buffer, float value);
void AudioBuffer_clear(struct AudioBuffer* buffer);
void AudioBuffer_destroy(struct AudioBuffer* buffer);

class AudioBufferWrapper {
    public:
        AudioBufferWrapper();
        float_array_ptr array_alloc(size_t length);
        struct AudioBuffer* alloc(size_t length);
        void clear(struct AudioBuffer* buffer);
        void fill(struct AudioBuffer* buffer, float value);
        void print(struct AudioBuffer* buffer);
};

