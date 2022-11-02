import { Brain } from "./brain.js"
import { Game } from "./game.js"
import { argmax, fps, gaussianRand } from "./mathfuncs.js"
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
    epsilon: number = 80
    gamma: number = 0.9
    memory: memory[] = []
    model: Brain = new Brain([3, 4, 2], ["sigmoid", "sigmoid"])
    shortMemory: memory[] = []
    score:number=0
    getState(g: Game): number[] {
        let distanceDownPlatform = (g.bird.y - g.obstacle.freeSpaceY) / g.height
        let distanceUpPlatform = ((g.obstacle.freeSpaceY + g.obstacle.freeSpaceHeight) - (g.bird.y + g.bird.height)) / g.height
        let distanceRight = (g.obstacle.x - (g.bird.x + g.bird.width)) / g.width
    return [Math.abs((distanceDownPlatform)), Math.abs((distanceUpPlatform)), distanceRight]
    }
    remember() {

        this.memory.concat(this.shortMemory)
        this.memory = shuffle(this.shortMemory)

        if (this.memory.length > 5000) {
            this.memory = this.memory.slice(0, 4999)
        }
    }

    trainStep(m: memory, lr: number) {
        let [bd, wd] = this.backAndLoss(m)
        this.model.update(lr / this.shortMemory.length, bd, wd)

    }
    backAndLoss(m: memory): [number[][], number[][][]] {
        let layers = this.model.foward(m.state)
        let pred = layers[layers.length - 1].slice()
        let newPred = this.model.predict(m.nextState)
        let target = layers[layers.length - 1].slice()// acaso esto llega a causar algun efecto secundario?
        let qnew = m.reward
        if (!m.done) {
            qnew = m.reward + this.gamma * (argmax(newPred))
        }
        target[m.action] = qnew

        let loss = target.map((v, i) =>
            (pred[i] - v) ** 2
        )
        return this.model.backprop(layers, loss)
    }
    shorMemoryTrain(lr: number) {
        this.shortMemory.map(i => this.backAndLoss(i)).map(i => this.model.update(lr / this.shortMemory.length, i[0], i[1]))
    }
    longMemoryTrain(lr: number) {
        let minisample = shuffle(this.memory)
        if(minisample.length>500){
            minisample=minisample.slice(0,500)
        }

        minisample.map((m) => this.backAndLoss(m)).map(i =>

            this.model.update(lr / minisample.length, i[0], i[1]))
    }
    getAction(state: number[]) {
        if (Math.random() * 100 < this.epsilon) {
            return Math.floor(gaussianRand() * 2)
        }
        let pred = this.model.predict(state)
        return argmax(pred)
    }
    doSomething(g: Game) {
        let state = this.getState(g)
        let action = this.getAction(state)
        if (action == 1) {

            g.bird.jump()
        }

        g.obstacle.move()
        g.bird.move()
        let done = g.obstacle.collide(g.bird)
        let s=(g.obstacle.givePoints(g.bird))
        let reward = done ? -1 : s
        this.score+=s

        let nexState = this.getState(g)
        let m = {
            state: state,
            action: action,
            reward: reward,
            nextState: nexState,
            done: done
        }

        this.shortMemory.push(m)

        if (reward != 0) {
            this.shortMemory.map((v, i) => (v.reward = reward * ((this.shortMemory.length - i) ** (-1))))
            // this.shorMemoryTrain(0.01)
            this.remember()
            this.shortMemory = []
        }
        document.getElementById("score")!.innerText=this.score+""

        if (g.obstacle.collide(g.bird)) {
            g.restart()
            this.longMemoryTrain(Number((document.getElementById("learning-rate") as HTMLInputElement).value )||0.01)

            this.totalGames++
            this.epsilon--
            this.score=0
            document.getElementById("epoch")!.innerText = this.totalGames + ""

        }
    }
}


