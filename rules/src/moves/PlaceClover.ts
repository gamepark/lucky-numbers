import GameState from '../GameState'
import GameView from '../GameView'
import Clover from '../material/Clover'
import Position from '../material/Position'
import MoveType from './MoveType'

type PlaceClover = {
  type: MoveType.PlaceClover
  playerId: number
  clover: Clover
} & Position

export default PlaceClover

export function placeCloverMove(playerId: number, clover: Clover, row: number, column: number): PlaceClover {
  return {type: MoveType.PlaceClover, playerId, clover, row, column}
}

export function placeClover(state: GameState | GameView, move: PlaceClover) {
  const player = state.players[move.playerId - 1]
  const index = player.clovers.findIndex(clover => clover.number === move.clover.number && clover.color === move.clover.color)
  if (index !== -1) {
    player.clovers.splice(index, 1)
  } else {
    state.faceUpClovers = state.faceUpClovers.filter(clover => clover.number !== move.clover.number || clover.color !== move.clover.color)
  }
  const clover = player.garden[move.row][move.column]
  if (clover) {
    state.faceUpClovers.push(clover)
  }
  player.garden[move.row][move.column] = move.clover
  if (state.activePlayer !== undefined) {
    state.activePlayer = (state.activePlayer % state.players.length) + 1
  }
}