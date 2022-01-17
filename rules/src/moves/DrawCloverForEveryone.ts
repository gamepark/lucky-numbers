import GameState from '../GameState'
import GameView from '../GameView'
import Clover from '../material/Clover'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type DrawCloverForEveryone = {
  type: MoveType.DrawCloverForEveryone
}

export default DrawCloverForEveryone

export type DrawForEveryoneView = DrawCloverForEveryone & {
  clover: Clover[]
}

export const drawCloverMove: DrawCloverForEveryone = {type: MoveType.DrawCloverForEveryone}

export function drawCloverForEveryone(state: GameState) {
    state.players.forEach(player => {player.clovers.push(state.faceDownClovers.shift()!)})
}

export function drawCloverForEveryoneInView(state: GameView, move: DrawForEveryoneView) {
  state.players.forEach((player, index) => {
    state.faceDownClovers--
    player.clovers.push(move.clover[index])
  })
}

export function isDrawClover(move: Move | MoveView): move is DrawCloverForEveryone {
  return move.type === MoveType.DrawCloverForEveryone
}
