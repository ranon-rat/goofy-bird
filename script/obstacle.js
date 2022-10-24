import { fps } from "./mathfuncs.js";
export class Obstacle {
    constructor(width, height) {
        this.freeSpaceHeight = 120;
        this.scoreToGive = 1;
        this.up = new Image();
        this.down = new Image();
        this.x = width;
        this.freeSpaceY = (height / 3) + (height / 4) * Math.random();
        this.velX = 200 / fps;
        this.up.src = "assets/pipe-green-up.png";
        this.down.src = "assets/pipe-green-down.png";
        this.width = this.up.width;
    }
    move() {
        this.x -= this.velX;
    }
    show(game) {
        game.ctx.fillStyle = "green";
        //up
        game.ctx.drawImage(this.up, this.x, this.freeSpaceY + this.freeSpaceHeight);
        //down
        game.ctx.drawImage(this.down, this.x, this.up.height - game.height + this.freeSpaceY - this.freeSpaceHeight);
        //  game.ctx.fillRect(this.x, 0, this.width,this.freeSpaceY)
    }
    collide(bird) {
        return bird.x + bird.width > this.x && bird.x < this.x + this.width &&
            !(bird.y > this.freeSpaceY && bird.y + bird.height < this.freeSpaceY + this.freeSpaceHeight);
    }
    givePoints(subject) {
        let bird = subject.bird;
        if (!this.collide(bird) && bird.x + bird.width > this.x && bird.x + bird.width < this.x + this.width && this.scoreToGive != 0) {
            this.scoreToGive--;
            return 1;
        }
        return 0;
    }
}
