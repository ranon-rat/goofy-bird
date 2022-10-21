import { Brain } from "./brain"
import { Game } from "./game"
interface memory{
    state:number[];
    action:number
    reward:number
    nextState:number[]
    done:number[]
}
class agent {
    totalGames: number = 0
    epsilon: number = 0
    gamma: number = 0.9
    memory: memory[] = []
    model: Brain = new Brain([3, 5, 5, 2])
    getState(game: Game): number[] {
        let distanceDownPlatform = game.bird.y - game.obstacle.freeSpaceY
        let distanceUpPlatform = (game.obstacle.freeSpaceY + game.obstacle.freeSpaceHeight) - game.bird.y
        let distanceRight = game.obstacle.x - game.bird.x
        return [distanceDownPlatform, distanceUpPlatform, distanceRight]
    }
    remember(  state:number[],
        action:number,
        reward:number,
        nextState:number[],
        done:number[]){
            this.memory.push({state:state,action:action,reward:reward,nextState:nextState,done:done})
        }

        
}