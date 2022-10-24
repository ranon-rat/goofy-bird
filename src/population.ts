import { Brain } from "./brain.js";
import { Game } from "./game.js";
import { argmax } from "./mathfuncs.js";
import { Obstacle } from "./obstacle.js";
import { Subject } from "./subject.js";

export class Population {
    subjects: Subject[] = [];
    bestScore = 0
    bestBrain: Brain = new Brain([3, 4, 2], ["sigmoid", "sigmoid"]);
    generation: number = 1

    bestScoreToShow:number=0
    constructor(populationSize: number, height: number, width: number) {
        for (let i = 0; i < populationSize; i++) {
            this.subjects.push(new Subject(height, width))
        }
    }
    doSomething(g: Game) {
        let howManyDeath = 0
        let s= 0
        for (let i = 0; i < this.subjects.length; i++) {

            this.subjects[i].doSomething(g)
            if (this.subjects[i].death) {
                howManyDeath++
                continue
            }
            if (this.subjects[i].score > s) {
                s = this.subjects[i].score
            }
            s += g.obstacle.givePoints(this.subjects[i])
            this.subjects[i].score = s

        }
        document.getElementById("score")!.innerText = s+ ""
        document.getElementById("survivors")!.innerText = (this.subjects.length - howManyDeath) + ""

        if (howManyDeath == this.subjects.length) {
            document.getElementById("best-score")!.innerText = this.bestScore + ""
            this.generation++
            document.getElementById("generation")!.innerText = this.generation + ""

            let index = argmax(this.subjects.map((i) => i.score))
            let score = this.subjects[index].score
            if (score >= this.bestScore) {
                this.bestBrain.biases = this.subjects[index].brain.biases.map(l => l.slice())
                this.bestBrain.weights = this.subjects[index].brain.weights.map(l => l.map(n => n.slice()))

                this.bestScore = score

            }
            this.subjects.map((s) => s.mutate(this.bestBrain))

            g.obstacle = new Obstacle(g.width, g.height)

        }

    }

}