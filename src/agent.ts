import { Brain } from "./brain.js"
import { Game } from "./game.js"
import {argmax} from  "./mathfuncs.js" 
interface memory {
    state: number[];
    action: number
    reward: number
    nextState: number[]
    done: number[]
}

// i could finish this , so im going to be force to make something else bruh 
class agent {
    totalGames: number = 0
    epsilon: number = 0
    gamma: number = 0.9
    memory: memory[] = []
    model: Brain = new Brain([3, 5, 5, 2])
    getState(game: Game): number[] {
      //  let distanceDownPlatform = game.bird.y - game.obstacle.freeSpaceY
      //  let distanceUpPlatform = (game.obstacle.freeSpaceY + game.obstacle.freeSpaceHeight) - game.bird.y
      //  let distanceRight = game.obstacle.x - game.bird.x
      //  return [distanceDownPlatform, distanceUpPlatform, distanceRight]
      return []
    }
    remember(state: number[],
        action: number,
        reward: number,
        nextState: number[],
        done: number[]) {
        this.memory.push({ state: state, action: action, reward: reward, nextState: nextState, done: done })
    }
    trainStep(v: memory, lr: number) {
        let layers = this.model.foward(v.state)
        let pred = layers[layers.length - 1]
        let newLayers = this.model.foward(v.nextState)
        let newPred = newLayers[newLayers.length - 1]
        let qnew = v.reward + this.gamma * (argmax(newPred))
        let target =[]// acaso esto llega a causar algun efecto secundario?
        pred.map((v,i)=>target.push(v))
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
            // do something
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


}