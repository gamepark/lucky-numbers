import GameState from '../GameState'
import GameView from '../GameView'
import Clover from '../material/Clover'
import Position from '../material/Position'
import { Garden } from '../PlayerState'
import Move from './Move'
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
  if (move.row === -1 && move.column === -1){
    state.faceUpClovers.push(move.clover)
  } else {
    const clover = player.garden[move.row][move.column]
    if (clover) {
      state.faceUpClovers.push(clover)
    }
    player.garden[move.row][move.column] = move.clover
  }

  if (state.activePlayer !== undefined) {
    if(state.isBrunoVariant !== true || !isBrunoVariantTrigger(player.garden, move.row, move.column, move.clover, state.isBrunoVariant)){
      state.activePlayer = (state.activePlayer % state.players.length) + 1
    }
  }
}

export function isPlaceClover(move: Move): move is PlaceClover {
  return move.type === MoveType.PlaceClover
}

export function isBrunoVariantTrigger(garden:Garden, row:number, column:number, cloverPlaced:Clover, isVariation:boolean):boolean{
  if(isVariation !== true || row === -1) return false
  const neighbourClovers:[(Clover|null),(Clover|null)] = [(row+1<=3 && column-1>=0) ? garden[row+1][column-1] : null,(row-1>=0 && column+1<=3) ? garden[row-1][column+1] : null]
  return neighbourClovers.some(clover => clover !== null && clover.number === cloverPlaced.number)
}
