import { fps } from "./mathfuncs.js";
export class Bird {
    constructor(height, width) {
        this.velY = 0;
        this.x = 0;
        this.width = 30;
        this.height = 30;
        this.asset = 0;
        this.assets = [new Image(), new Image(), new Image()];
        this.y = height / 2;
        this.gravity = 25 / fps;
        this.jumpVel = 300 / fps;
        this.x = (width / 4);
        this.assets.map((v, i) => {
            v.src = `assets/yellowbird-${i}.png`;
        });
        this.width = this.assets[0].width;
        this.height = this.assets[0].height;
    }
    jump() {
        this.velY = this.jumpVel;
    }
    move() {
        this.asset++;
        this.asset %= 3;
        if (this.velY > -this.jumpVel) {
            this.velY -= this.gravity;
        }
        this.y += this.velY;
    }
    show(game) {
        game.ctx.drawImage(this.assets[this.asset], this.x, this.y);
    }
}
