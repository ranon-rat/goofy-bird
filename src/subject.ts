import { Bird } from "./bird.js"
import { Brain } from "./brain.js";
import { Game } from "./game.js";
import { argmax } from "./mathfuncs.js";
export class Subject {
    brain: Brain = new Brain([3, 4, 2]);
    bird: Bird;
    death: boolean = false;
    width: number
    height: number
    score: number = 0

    constructor(height: number, width: number) {
        this.width = width
        this.height = height
        this.bird = new Bird(height, width)

    }
    getState(g: Game): number[] {

        let distanceDownPlatform = this.bird.y - g.obstacle.freeSpaceY
        let distanceUpPlatform = (g.obstacle.freeSpaceY + g.obstacle.freeSpaceHeight) - (this.bird.y+this.bird.height)
        let distanceRight = g.obstacle.x - (this.bird.x+this.bird.width)

        return [distanceDownPlatform /( g.height+1), distanceUpPlatform /(g.height+1), distanceRight / (g.width+1)]
    }
    doSomething(g: Game) {
    
        if (this.death) {
            return
        }
     
    
        let state = this.getState(g)
        let output = this.brain.predict(state)

        let action = argmax(output)
        if (action == 1) {
            this.bird.jump()
        }
        this.bird.move()
        this.bird.show(g)

        g.obstacle.givePoints(this)
        this.death = g.obstacle.collide(this.bird) 
       
    }
    mutate(bestSubjectBrain: Brain) {
        this.brain.mutate(bestSubjectBrain.biases, bestSubjectBrain.weights)
        this.score = 0
        this.death = false;
        this.bird = new Bird(this.height, this.width)
    }
}