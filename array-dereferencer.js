let star = {
    TYPED_VIEWS: {
        "int8": "Int8Array",
        "uint8": "Uint8Array",
        "int16": "Int16Array",
        "uint16": "Uint16Array",
        "int32": "Int16Array",
        "uint32": "Uint16Array",
        "float32": "Float32Array"
    },

    dereferenceArray: function(ptr, length, type) {
        let arrayViewType = star.TYPED_VIEWS[type];
        if (arrayViewType === undefined) {
            throw Error("Can't dereference an array of type " + type);
        }

        let g = window || global;
        return new g[arrayViewType](Module.HEAP8.buffer, ptr, length);
    }
};


