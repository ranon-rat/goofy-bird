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
    epsilon: number =0
    gamma: number = 0.8
    memory: memory[] = []
    model: Brain = new Brain([3, 4, 2], ["sigmoid", "sigmoid"])
    shortMemory: memory[] = []
    score: number = 0
    bestScore: number = 0
    constructor() {

//44
this.model.weights=[[[-0.24770185414963364,0.6074550729596015,0.2521278272456858,-0.27600240376030016],[-0.0987527585872822,0.3002796339961309,-0.16726652444603748,-0.024159539556164004],[-0.31714281521611926,-0.05019345626373601,0.3226091116654749,0.2260169567478902]],[[-0.2672202221131191,-0.6646200086833131],[-0.8715925485068329,-0.5323856063221659],[-0.0386284679121189,-0.635066968881527],[-0.6530856625826373,-0.29463391066228817]]] 
this.model.biases=[[0.19415896820606576,0.9265386530429618,0.3462182047832292,0.31320778236782765],[-0.8232808888743061,-0.714112610061257]]
    }
    getState(g: Game): number[] {
        let distanceDownPlatform = (g.bird.y - g.obstacle.freeSpaceY) / g.height
        let distanceUpPlatform = ((g.obstacle.freeSpaceY + g.obstacle.freeSpaceHeight) - (g.bird.y + g.bird.height)) / g.height
        let distanceRight = (g.obstacle.x - (g.bird.x + g.bird.width)) / g.width
        return [((distanceDownPlatform)), ((distanceUpPlatform)), distanceRight]
    }
    remember() {

        this.memory.concat(this.shortMemory)
        this.memory = shuffle(this.shortMemory)

        if (this.memory.length > 50000) {
            this.memory = this.memory.slice(0, 49990)
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
        if (minisample.length > 1000) {
            minisample = minisample.slice(0, 100)
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
        let s = (g.obstacle.givePoints(g.bird))
        let reward = done ? -1 : s
        this.score += s

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
            this.remember()
            this.shortMemory = []
        }
        document.getElementById("score")!.innerText = this.score + ""

        if (this.score > this.bestScore) {
            this.bestScore = this.score
            console.log("//"+this.score+"\n","this.model.weights=" + JSON.stringify(this.model.weights), "\n", "this.model.biases=" + JSON.stringify(this.model.biases))

        }
        if (g.obstacle.collide(g.bird)) {
       
            g.restart()
          
            this.longMemoryTrain(Number((document.getElementById("learning-rate") as HTMLInputElement).value) || 0.4)

            this.totalGames++
            this.epsilon--

            this.score = 0
            document.getElementById("epoch")!.innerText = this.totalGames + ""
            document.getElementById("best-score")!.innerText = this.bestScore + ""

        }
    }
}


