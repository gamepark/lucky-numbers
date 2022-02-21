import GameState from "../GameState"
import GameView from "../GameView"
import MoveType from "./MoveType"

export default interface Concede {
    type: typeof MoveType.Concede
    playerId: number
  }
  
  export const concedeMove = (playerId: number): Concede => ({
    type: MoveType.Concede, playerId
  })
  
  export function concede(state: GameState | GameView, move: Concede) {
    const player = state.players[move.playerId]
    if (player.eliminated) return console.error('Cannot apply', move, 'on', state, ': player is already eliminated')
    player.eliminated = state.players.filter(player => player.eliminated).length + 1
  }