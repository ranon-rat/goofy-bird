import { Bird } from "./bird.js";
import { Obstacle } from "./obstacle.js";

export class Game{
    fps:number=30;
    ctx:CanvasRenderingContext2D;
    width:number;
    height:number;
    obstacle:Obstacle;
    bird:Bird;
    background:HTMLImageElement;
    constructor(c:CanvasRenderingContext2D){
        this.ctx=c
        this.background=new Image()
        this.background.src="assets/background-day.png"
     
        this.width=this.background.width
        this.height=this.background.height
      
        this.obstacle=new Obstacle(this.width,this.height,30)
        this.bird=new Bird(this.height,this.width,30)
     
    }

    public show(){

        this.ctx.drawImage(this.background,0,0)
        this.bird.move()
        this.bird.show(this)

        this.obstacle.show(this)
        this.obstacle.move()
        if (this.obstacle.collide(this.bird)){
            this.obstacle=new Obstacle(this.width,this.height,this.fps)

            this.bird=new Bird(this.height,this.width,this.fps)
   
        }
        if(this.obstacle.x+this.obstacle.width<=0){
            this.obstacle=new Obstacle(this.width,this.height,this.fps)
        }
       

        
    }


}