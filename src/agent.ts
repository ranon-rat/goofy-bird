import { Brain } from "./brain.js"
import { Game } from "./game.js"
import { argmax } from "./mathfuncs.js"
interface memory {
    state: number[];
    action: number
    reward: number
    nextState: number[]
    done: boolean
}
function shuffle(arr: memory[]): memory[] {
    for (let i = 0; i < arr.length; i++) {
        let index = Math.floor(Math.random() * arr.length)
        let copy = arr[i]
        arr[i] = arr[index]
        arr[index] = copy
    }
    return arr
}
/// qnet network
// i couldnt finished this , so im going to be forced to make something else bruh 
export class Agent {
    totalGames: number = 0
    epsilon: number = 0
    gamma: number = 0.9
    memory: memory[] = []
    model: Brain = new Brain([3, 4, 2], ["sigmoid", "relu"])
    getState(g: Game): number[] {
        let distanceDownPlatform = g.bird.y - g.obstacle.freeSpaceY
        let distanceUpPlatform = (g.obstacle.freeSpaceY + g.obstacle.freeSpaceHeight) - (g.bird.y + g.bird.height)
        let distanceRight = g.obstacle.x - (g.bird.x + g.bird.width)

        return [distanceDownPlatform / (g.height + 1), distanceUpPlatform / (g.height + 1), distanceRight / (g.width + 1)]
    }
    remember(m: memory) {
        if (typeof m == 'undefined') return;

        this.memory.push(m)
        if (this.memory.length > 5000000) {
            this.memory = shuffle(this.memory)
            this.memory.shift()
        }
    }
    trainStep(m: memory, lr: number) {

        if (typeof m == 'undefined') return;
        let layers = this.model.foward(m.state)
        let pred = layers[layers.length - 1]
        let newPred = this.model.predict(m.nextState)
        let qnew = m.reward
        if (!m.done) {
            qnew = m.reward + this.gamma * (argmax(newPred))
        }
        let target = pred.slice()// acaso esto llega a causar algun efecto secundario?
        target[m.action] = qnew


        let loss = target.map((v, i) =>
            (pred[i] - v) ** 2
        )
        let [bd, wd] = this.model.backprop(layers, loss)
        this.model.update(lr, bd, wd)
    }

    longMemoryTrain(learningRate: number) {
        let minisample = this.memory
        if (minisample.length > 500) {
            minisample = shuffle(this.memory).slice(0, 500)

        }
        minisample.map((v) => this.trainStep(v, learningRate))
    }
    getAction(state: number[]) {
        this.epsilon = 80 - this.totalGames
        if (Math.random() * 100 < this.epsilon) {
            return Math.floor(Math.random() * 2)
        }
        let pred = this.model.predict(state)
        console.log(pred)
        return argmax(pred)
    }
    doSomething(g: Game) {
        let state = this.getState(g)
        let action = this.getAction(state)
        if (action == 1) {
            g.bird.jump()
        }

        let done = g.obstacle.collide(g.bird) 
        let reward = done ? -1 : g.obstacle.givePoints(g.bird)

        g.bird.move()
        let nexState = this.getState(g)

        this.remember({
            state: state,
            action: action,
            reward: reward,
            nextState: nexState,
            done: done 
        })

        this.trainStep(
            {
                state: state,
                action: action,
                reward: reward,
                nextState: nexState,
                done: done 
            }, 0.01
        )

        if (g.obstacle.collide(g.bird)) {

            g.restart()

            this.longMemoryTrain(0.01/this.memory.length)
            this.totalGames++
        }
    }
}


