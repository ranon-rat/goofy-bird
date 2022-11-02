import { Brain } from "./brain.js"
import { Game } from "./game.js"
import { argmax, shuffle, gaussianRand } from "./mathfuncs.js"
interface memory {
    state: number[];
    action: number
    reward: number
    nextState: number[]
    done: boolean
}

/// qnet network
// i couldnt finished this , so im going to be forced to make something else bruh 
export class Agent {
    totalGames: number = 0
    epsilon: number = 80
    gamma: number = 0.8
    memory: memory[] = []
    model: Brain = new Brain([3, 4, 2], ["sigmoid", "sigmoid"])
    shortMemory: memory[] = []
    score: number = 0
    bestScore: number = 0

    getState(g: Game): number[] {
        let distanceDownPlatform = (g.bird.y - g.obstacle.freeSpaceY) / g.height
        let distanceUpPlatform = ((g.obstacle.freeSpaceY + g.obstacle.freeSpaceHeight) - (g.bird.y + g.bird.height)) / g.height
        let distanceRight = (g.obstacle.x - (g.bird.x + g.bird.width)) / g.width
        return [distanceDownPlatform, distanceUpPlatform, distanceRight]
    }
   
    remember() {

        this.memory.concat(this.shortMemory)
        this.memory = shuffle(this.memory)

        if (this.memory.length > 5000) {
            this.memory = this.memory.slice(0, 5000)

        }
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
    shortMemoryTrain(lr:number){
        let minisample = shuffle(this.shortMemory)
  
        minisample.map((m) => this.backAndLoss(m)).map(i =>

            this.model.update(lr / minisample.length, i[0], i[1]))
    }
    longMemoryTrain(lr: number) {
        let minisample = shuffle(this.memory)
        if (minisample.length > 1000) {
            minisample = minisample.slice(0, 500)
        }
        minisample.map((m) => this.backAndLoss(m)).map(i =>

            this.model.update(lr / minisample.length, i[0], i[1]))
    }
    getAction(state: number[]) {
        if (Math.random() * 100 < this.epsilon-this.totalGames) {
            return Math.floor(gaussianRand() * 2)
        }
        return argmax(this.model.predict(state))
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
        document.getElementById("score")!.innerText = this.score + ""

        let nexState = this.getState(g)


        this.shortMemory.push({
            state: state,
            action: action,
            reward: reward,
            nextState: nexState,
            done: done
        })

        if (this.score > this.bestScore) {

            this.bestScore = this.score
            // this is for me lol
            console.log("//" + this.score + "\n", "this.model.weights=" + JSON.stringify(this.model.weights), "\n", "this.model.biases=" + JSON.stringify(this.model.biases))

        }
        if (reward != 0) {
            // the action that you take in the begining isnt that important so this is really useful
            this.shortMemory.map((v, i) => (v.reward = reward * ((this.shortMemory.length - i) ** (-1))))
            if(done)this.shortMemoryTrain(0.15)
            this.remember()
            this.shortMemory = []
        }


        if (g.obstacle.collide(g.bird)) {

            g.restart()
            this.longMemoryTrain(0.01)
            this.totalGames++
          //  this.epsilon--

            this.score = 0
            document.getElementById("epoch")!.innerText = this.totalGames + ""
            document.getElementById("best-score")!.innerText = this.bestScore + ""

        }
    }
}


