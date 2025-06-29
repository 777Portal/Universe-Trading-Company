import wasm from 'vite-plugin-wasm';

export default {
    // config options
    plugins: [wasm()],
    base: '',
    build:{
        target: "esnext", // or "es2019",
    },    
}