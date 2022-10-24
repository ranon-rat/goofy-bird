import { Bird } from "./bird.js";
import { Brain } from "./brain.js";
import { argmax } from "./mathfuncs.js";
export class Subject {
    constructor(height, width) {
        this.brain = new Brain([3, 4, 2], ["sigmoid", "sigmoid"]);
        this.death = false;
        this.score = 0;
        this.width = width;
        this.height = height;
        this.bird = new Bird(height, width);
    }
    getState(g) {
        let distanceDownPlatform = this.bird.y - g.obstacle.freeSpaceY;
        let distanceUpPlatform = (g.obstacle.freeSpaceY + g.obstacle.freeSpaceHeight) - (this.bird.y + this.bird.height);
        let distanceRight = g.obstacle.x - (this.bird.x + this.bird.width);
        return [distanceDownPlatform / (g.height + 1), distanceUpPlatform / (g.height + 1), distanceRight / (g.width + 1)];
    }
    doSomething(g) {
        if (this.death) {
            return;
        }
        let state = this.getState(g);
        let output = this.brain.predict(state);
        let action = argmax(output);
        if (action == 1) {
            this.bird.jump();
        }
        this.bird.move();
        this.bird.show(g);
        this.death = g.obstacle.collide(this.bird);
    }
    mutate(bestSubjectBrain) {
        this.brain.mutate(bestSubjectBrain.biases, bestSubjectBrain.weights);
        this.score = 0;
        this.death = false;
        this.bird = new Bird(this.height, this.width);
    }
}
