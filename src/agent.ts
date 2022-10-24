import { Bird } from "./bird.js";
import { Brain } from "./brain.js"
import { Game } from "./game.js"
import { argmax } from "./mathfuncs.js"
import { Obstacle } from "./obstacle.js";
interface memory {
    state: number[];
    action: number
    reward: number
    nextState: number[]
    done: number
}
function shuffle(arr: memory[]) :memory[]{
    for (let i = 0; i < arr.length; i++) {
        let index = Math.round(Math.random() * arr.length)
        let copy = arr[i]
        arr[i] = arr[index]
        arr[index] = copy
    }
    return arr
}

// i couldnt finished this , so im going to be forced to make something else bruh 
export class Agent {
    totalGames: number = 0
    epsilon: number = 0
    gamma: number = 0.9
    memory: memory[] = []
    bird: Bird = new Bird(512, 288);
    model: Brain = new Brain([3, 5,  2], ["", ""])
    getState(g: Game): number[] {
        let distanceDownPlatform = this.bird.y - g.obstacle.freeSpaceY
        let distanceUpPlatform = (g.obstacle.freeSpaceY + g.obstacle.freeSpaceHeight) - (this.bird.y+this.bird.height)
        let distanceRight = g.obstacle.x - (this.bird.x+this.bird.width)

        return [distanceDownPlatform , distanceUpPlatform, distanceRight ]
    }
    remember(state: number[],
        action: number,
        reward: number,
        nextState: number[],
        done: number) {
        
        this.memory.push({ state: state, action: action, reward: reward, nextState: nextState, done: done })
        if(this.memory.length){
            this.memory.shift()
        }
    }
    trainStep(v: memory, lr: number) {
        let layers = this.model.foward(v.state)
        let pred = layers[layers.length - 1]
        let newLayers = this.model.foward(v.nextState)
        let newPred = newLayers[newLayers.length - 1]
        let qnew = v.reward + this.gamma * (argmax(newPred))
        let target = []// acaso esto llega a causar algun efecto secundario?
        pred.map((v) => target.push(v))
        target[(v.action)] = qnew

        let loss = target.map((v, i) =>
            (pred[i] - v) ** 2
        )
        let [bd, wd] = this.model.backprop(layers, loss)
        this.model.update(lr, bd, wd)
    }

    longMemoryTrain(learningRate: number) {
        let minisample = this.memory
        if (minisample.length > 1000) {
            minisample=shuffle(this.memory).slice(0,1000)
        }
        minisample.map((v) => this.trainStep(v, learningRate))
    }
    getAction(state: number[]) {
        this.epsilon = 80 - this.totalGames
        let finalMove = [0, 0]
        if (Math.random() * 100 < this.epsilon) {
            finalMove[Math.round(Math.random() * 2)] = 1
        } else {
            let layers = this.model.foward(state)
            let pred = layers[layers.length - 1]
            finalMove[argmax(pred)] = 1
        }
        return finalMove
    }
    doSomething(g: Game) {
        let oldState = this.getState(g)
        let move = this.getAction(oldState)
        if (argmax(move) == 1) {
            this.bird.jump()
        }
        this.bird.move()
        this.bird.show(g)
        let done = g.obstacle.collide(this.bird)
        let reward = done ? -10 : g.obstacle.givePoints(this.bird)
        let nexState = this.getState(g)
        this.remember(oldState, argmax(move), reward, nexState, done ? 0 : 1)
        this.trainStep(
            {
                state: oldState,
                action: argmax(move),
                reward: reward,
                nextState: nexState,
                done: done ? 1 : 0
            } as memory, 0.001
        )
        
        if (g.obstacle.collide(this.bird)) {
            
            this.longMemoryTrain(0.001)
            this.totalGames++
            this.bird=new Bird(g.height,g.width)

            g.obstacle=new Obstacle(g.width,g.height)
        }
    }
}


