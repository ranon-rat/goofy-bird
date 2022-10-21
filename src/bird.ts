import { Game } from "./game";
import { fps } from "./mathfuncs.js";

export class Bird {
    velY: number = 0;
    y: number;
    x: number = 0;
    gravity: number;
    width = 30;
    height = 30;
    asset: number = 1;
    assets: HTMLImageElement[] = [new Image(), new Image(), new Image()];

    constructor(height: number, width: number) {
        this.y = height / 2
        this.gravity = 300 / fps
        this.x = (width / 4)+Math.random()/2
        this.assets.map((v, i) => {
            v.src = `assets/yellowbird-${i}.png`
        })
        this.width = this.assets[0].width

        this.height = this.assets[0].height



    }
    public jump() {
        this.velY = 10;
    }
    public move() {
        this.asset++
        if (this.velY > -15) {
            this.velY--
        }
        this.y += this.velY
    }
    public show(game: Game) {
        game.ctx.drawImage(this.assets[this.asset % 3], this.x, this.y)

    }

}