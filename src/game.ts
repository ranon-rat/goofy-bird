//@ts-ignore 
import { Agent } from "./agent.js";
import { Bird } from "./bird.js";
import { Obstacle } from "./obstacle.js";

export class Game {
    ctx: CanvasRenderingContext2D;
    width: number=1
    height: number=1
    obstacle: Obstacle;
   // population: Population
    background: HTMLImageElement;
    loaded:boolean=false;
    agent:Agent=new Agent()
    bird:Bird;
    constructor(c: CanvasRenderingContext2D) {
        this.ctx = c
        this.background = new Image()
        this.background.src = "assets/background-day.png"

        this.width = this.background.width
        this.height = this.background.height

        this.obstacle = new Obstacle(this.width, this.height)
        this.bird=new Bird(this.height,this.width)
     //   this.population = new Population(25, this.height, this.width)
        this.background.addEventListener("load",(_)=>this.loaded=true)




    }

    public show() {

        this.ctx.drawImage(this.background, 0, 0)
    
    
        this.agent.doSomething(this)
        this.obstacle.show( this)
        this.bird.show(this)    
        // this.population.doSomething( this)


        if (this.obstacle.x + this.obstacle.width <= 0) {
            this.obstacle = new Obstacle(this.width, this.height)
        }
    


    }

    public restart(){
        this.obstacle = new Obstacle(this.width, this.height)
        this.bird=new Bird(this.height,this.width)
    }


}