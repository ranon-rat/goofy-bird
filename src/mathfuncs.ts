
export function argmax(array: number[]): number {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];
}
const relu = (x: number): number =>Math.max(0,x)
const devRelu = (x: number): number => Number( x>0)

const sigmoid = (x: number): number =>
    1 / (1 + Math.exp(-x))

const devSigmoid = (x: number): number => x * (1 - x)
export function shuffle<T>(arr: T[]): T[] {
    for (let i = 0; i < arr.length; i++) {
        let index = Math.floor(Math.random() * arr.length)
        let copy = arr[i]
        arr[i] = arr[index]
        arr[index] = copy
    }
    return arr
}
export const fps =30
export function gaussianRand() {
    var rand = 0;
    for (var i = 0; i < 20; i ++) {
        rand += (Math.random() );
    }
    return rand / 20;
}

export function mathFuncs(x: number, name: string, dev: boolean):number {
    switch (name) {
        case "sigmoid":
            return dev ? devSigmoid(x) : sigmoid(x);
        case "relu":
            return dev ? devRelu(x) : relu(x);
    }
    return x
}