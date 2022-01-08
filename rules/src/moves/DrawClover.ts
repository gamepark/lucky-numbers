import GameState from '../GameState'
import GameView from '../GameView'
import Clover from '../material/Clover'
import Move from './Move'
import MoveType from './MoveType'
import MoveView from './MoveView'

type DrawClover = {
  type: MoveType.DrawClover
}

export default DrawClover

export type DrawView = DrawClover & {
  clover: Clover
}

export const drawCloverMove: DrawClover = {type: MoveType.DrawClover}

export function drawClover(state: GameState) {
  const player = state.players[state.activePlayer! - 1]
  player.clovers.push(state.faceDownClovers.shift()!)
}

export function drawCloverInView(state: GameView, move: DrawView) {
  const player = state.players[state.activePlayer! - 1]
  state.faceDownClovers--
  player.clovers.push(move.clover)
}

export function isDrawClover(move: Move | MoveView): move is DrawClover {
  return move.type === MoveType.DrawClover
}
