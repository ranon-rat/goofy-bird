export function argmax(array) {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}
const relu = (x) => Math.max(x, 0);
const devRelu = (x) => Math.max(1, 0);
const sigmoid = (x) => 1 / (1 + Math.exp(-x));
const devSigmoid = (x) => x * (1 - x);
export const fps = 30;
export function gaussianRand() {
    var rand = 0;
    for (var i = 0; i < 20; i++) {
        rand += (Math.random());
    }
    return rand / 20;
}
export function mathFuncs(x, name, dev) {
    switch (name) {
        case "sigmoid":
            return dev ? devSigmoid(x) : sigmoid(x);
        case "relu":
            return dev ? devRelu(x) : relu(x);
    }
    return x;
}