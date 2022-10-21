export function argmax(array: number[]): number {
    return array.map((x, i) => [x, i]).reduce((r, a) => (a[0] > r[0] ? a : r))[1];

}
export function relu(x: number): number {
    return Math.max(x,0)
}
export function devRelu(x: number): number {
    return Math.max(1, 0)
}
export function sigmoid(x:number):number{
    return 1/(1+Math.exp(-x))
}
export const fps=15
export function gaussianRand() {
    var rand = 0;
  
    for (var i = 0; i < 8; i += 1) {
      rand += (Math.random()-0.5);
    }
  
    return rand / 8;
  }
  