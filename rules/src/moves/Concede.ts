import GameState from '../GameState'
import GameView from '../GameView'
import MoveType from './MoveType'

export default interface Concede {
  type: typeof MoveType.Concede
  playerId: number
}

export const concedeMove = (playerId: number): Concede => ({
  type: MoveType.Concede, playerId
})

export function concede(state: GameState | GameView, move: Concede) {
  const player = state.players[move.playerId - 1]
  if (player.isEliminated) return console.error('Cannot apply', move, 'on', state, ': player is already eliminated')
  player.isEliminated = true
}

export function skipEliminatedPlayers(state: GameState | GameView) {
  if (state.activePlayer !== undefined && state.players.some(player => !player.isEliminated)) {
    while (state.players[state.activePlayer - 1].isEliminated) {
      state.activePlayer = (state.activePlayer % state.players.length) + 1
    }
  }
}