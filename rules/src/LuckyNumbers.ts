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

/**
 * Your Board Game rules must extend either "SequentialGame" or "SimultaneousGame".
 * When there is at least on situation during the game where multiple players can act at the same time, it is a "SimultaneousGame"
 * If the game contains information that players does not know (dices, hidden cards...), it must implement "IncompleteInformation".
 * If the game contains information that some players know, but the other players does not, it must implement "SecretInformation" instead.
 * Later on, you can also implement "Competitive", "Undo", "TimeLimit" and "Eliminations" to add further features to the game.
 */
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

  /**
   * If you game has incomplete information, sometime you need to alter a Move before it is sent to the players and spectator.
   * For example, if a card is revealed, the id of the revealed card should be ADDED to the Move in the MoveView
   * Sometime, you will hide information: for example if a player secretly choose a card, you will hide the card to the other players or spectators.
   *
   * @param move The move that has been played
   * @return What a person should know about the move that was played
   */
  getMoveView(move: Move): MoveView {
    if (move.type === MoveType.DrawClover) {
      return {...move, clover: this.state.faceDownClovers[0]}
    }
    return move
  }
}
