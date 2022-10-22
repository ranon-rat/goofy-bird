//@ts-ignore 
import { Obstacle } from "./obstacle.js";
import { Population } from "./population.js";

export class Game {
    ctx: CanvasRenderingContext2D;
    width: number
    height: number
    obstacle: Obstacle;
    population: Population
    background: HTMLImageElement;
    loaded:boolean=false;
    constructor(c: CanvasRenderingContext2D) {
        this.ctx = c
        this.background = new Image()
        this.background.src = "assets/background-day.png"

        this.width = this.background.width
        this.height = this.background.height

        this.obstacle = new Obstacle(this.width, this.height)
        this.population = new Population(25, this.height, this.width)
        this.background.addEventListener("load",(_)=>this.loaded=true)




    }

    public show() {

        this.ctx.drawImage(this.background, 0, 0)

        this.obstacle.move()

        this.obstacle.show( this)
        this.population.doSomething( this)


        if (this.obstacle.x + this.obstacle.width <= 0) {
            this.obstacle = new Obstacle(this.width, this.height)
        }
    


    }


}