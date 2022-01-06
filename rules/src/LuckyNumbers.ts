import {IncompleteInformation, SimultaneousGame} from '@gamepark/rules-api'
import GameState, {setupNewGame} from './GameState'
import GameView from './GameView'
import {isGameOptions, LuckyNumbersOptions} from './LuckyNumbersOptions'
import {drawClover, drawCloverMove} from './moves/DrawClover'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import MoveView from './moves/MoveView'
import PlaceClover, {placeClover, placeCloverMove} from './moves/PlaceClover'
import {isValidPosition} from './PlayerState'

export default class LuckyNumbers extends SimultaneousGame<GameState, Move>
  implements IncompleteInformation<GameState, GameView, Move, MoveView> {
  constructor(state: GameState)
  constructor(options: LuckyNumbersOptions)
  constructor(arg: GameState | LuckyNumbersOptions) {
    super(isGameOptions(arg) ? setupNewGame(arg) : arg)
  }

  isOver(): boolean {
    return this.state.players.some(player => player.garden.every(row => row.every(space => space !== null)))
  }

  isActive(playerId: number): boolean {
    if (this.state.activePlayer === undefined) {
      const player = this.state.players[playerId - 1]
      return player.clovers.length > 0
    } else {
      return playerId === this.state.activePlayer
    }
  }

  getLegalMoves(playerId: number): Move[] {
    if (this.state.activePlayer === undefined) {
      return this.getSetupLegalMoves(playerId)
    } else if (playerId !== this.state.activePlayer) {
      return []
    } else {
      const moves: Move[] = []
      const player = this.state.players[playerId - 1]
      if (player.clovers.length > 0) {
        for (const clover of player.clovers) {
          for (let row = 0; row < 4; row++) {
            for (let column = 0; column < 4; column++) {
              if (isValidPosition(player.garden, clover, row, column)) {
                moves.push(placeCloverMove(playerId, clover, row, column))
              }
            }
          }
        }
      } else {
        for (const clover of this.state.faceUpClovers) {
          for (let row = 0; row < 4; row++) {
            for (let column = 0; column < 4; column++) {
              if (isValidPosition(player.garden, clover, row, column)) {
                moves.push(placeCloverMove(playerId, clover, row, column))
              }
            }
          }
        }
        if (this.state.faceDownClovers.length) {
          moves.push(drawCloverMove)
        }
      }
      return moves
    }
  }

  getSetupLegalMoves(playerId: number): PlaceClover[] {
    const moves: PlaceClover[] = []
    const player = this.state.players[playerId - 1]
    for (const clover of player.clovers) {
      for (let i = 0; i < 4; i++) {
        if (player.garden[i][i] === null) {
          moves.push(placeCloverMove(playerId, clover, i, i))
        }
      }
    }
    return moves
  }

  play(move: Move): void {
    switch (move.type) {
      case MoveType.DrawClover:
        drawClover(this.state)
        break
      case MoveType.PlaceClover:
        placeClover(this.state, move)
        break
    }
    if (this.state.activePlayer === undefined && this.state.players.every(player => player.clovers.length === 0)) {
      this.state.activePlayer = 1
    }
  }

  getView(): GameView {
    return {...this.state, faceDownClovers: this.state.faceDownClovers.length}
  }

  getMoveView(move: Move): MoveView {
    if (move.type === MoveType.DrawClover) {
      return {...move, clover: this.state.faceDownClovers[0]}
    }
    return move
  }
}