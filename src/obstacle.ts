import { Game } from "./game.js";
import { Bird } from "./bird.js"
import { fps } from "./mathfuncs.js";
export class Obstacle {
    freeSpaceY: number;
    freeSpaceHeight: number = 120;
    width: number;
    x: number;
    velX: number;
    scoreToGive=1;

    up:HTMLImageElement=new Image();
    down:HTMLImageElement=new Image();
    constructor(width: number, height: number,) {
        this.x = width;
        this.freeSpaceY = (height / 3) + (height / 4) * Math.random()
        this.velX = 200 / fps
     
        this.up.src="assets/pipe-green-up.png"
        this.down.src="assets/pipe-green-down.png" 
        this.width=this.up.width

    }
    public move() {
        this.x -= this.velX

    }
    public show(game: Game) {
        game.ctx.fillStyle = "green"
        //up
        game.ctx.drawImage(this.up,this.x,this.freeSpaceY+this.freeSpaceHeight)

        //down
        game.ctx.drawImage(this.down,this.x,this.up.height-game.height+this.freeSpaceY-this.freeSpaceHeight)
      //  game.ctx.fillRect(this.x, 0, this.width,this.freeSpaceY)

       

    }
    public collide(bird: Bird): boolean {
        return bird.x + bird.width > this.x && bird.x  < this.x + this.width &&
        !(bird.y>this.freeSpaceY&& bird.y+bird.height<this.freeSpaceY+this.freeSpaceHeight)
    }
    public givePoints(bird:Bird):number{
        if(!this.collide(bird)&& bird.x + bird.width > this.x && bird.x + bird.width < this.x + this.width && this.scoreToGive!=0){
            this.scoreToGive--
            return 10
        }
        return 0
    }
}