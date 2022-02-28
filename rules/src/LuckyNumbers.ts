import {Action, Competitive, Eliminations, GameSpeed, IncompleteInformation, SimultaneousGame, TimeLimit, Undo} from '@gamepark/rules-api'
import GameState, {setupNewGame} from './GameState'
import GameView from './GameView'
import {isGameOptions, LuckyNumbersOptions} from './LuckyNumbersOptions'
import { concede, concedeMove } from './moves/Concede'
import {drawClover, drawCloverMove} from './moves/DrawClover'
import { drawCloverForEveryone } from './moves/DrawCloverForEveryone'
import Move from './moves/Move'
import MoveType from './moves/MoveType'
import MoveView from './moves/MoveView'
import PlaceClover, {placeClover, placeCloverMove} from './moves/PlaceClover'
import {howManyCloversInGarden, isValidPosition} from './PlayerState'

export default class LuckyNumbers extends SimultaneousGame<GameState, Move>
  implements IncompleteInformation<GameState, GameView, Move, MoveView>, 
             TimeLimit<GameState, Move>,
             Competitive<GameState, Move>, 
             Eliminations<GameState, Move, number>,
             Undo<GameState, Move, number> {
  constructor(state: GameState)
  constructor(options: LuckyNumbersOptions)
  constructor(arg: GameState | LuckyNumbersOptions) {
    super(isGameOptions(arg) ? setupNewGame(arg) : arg)
  }

  isOver(): boolean {
    return this.state.players.some(player => player.garden.every(row => row.every(space => space !== null)))
  }

  isActive(playerId: number): boolean {
    if(this.state.players.some(p => p.garden.every(row => row.every(space => space !== null)))) return false
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
          moves.push(placeCloverMove(playerId, clover, -1, -1))
          for (let row = 0; row < 4; row++) {
            for (let column = 0; column < 4; column++) {
              if (isValidPosition(player.garden, clover, row, column, this.state.activePlayer === undefined)) {
                moves.push(placeCloverMove(playerId, clover, row, column))
              }
            }
          }
        }
      } else {
        for (const clover of this.state.faceUpClovers) {
          for (let row = 0; row < 4; row++) {
            for (let column = 0; column < 4; column++) {
              if (isValidPosition(player.garden, clover, row, column, this.state.activePlayer === undefined)) {
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
      case MoveType.DrawCloverForEveryone:
        drawCloverForEveryone(this.state)
        break
      case MoveType.Concede:
        concede(this.state, move)
        break
    }
    if (this.state.activePlayer === undefined && this.state.players.filter(p => !p.isEliminated).every(player => player.clovers.length === 0) && this.state.players.filter(p => !p.isEliminated).every(player => howManyCloversInGarden(player.garden) === 4)) {
      this.state.activePlayer = 1
    } 
    if(this.state.activePlayer !== undefined) {      // We need to skip eliminated players
      let nextActivePlayer:number = this.state.activePlayer
      while(this.state.players[nextActivePlayer-1].isEliminated){
        nextActivePlayer = (nextActivePlayer % this.state.players.length) + 1
      }
      this.state.activePlayer = nextActivePlayer
    }

  }

  getAutomaticMove(): void | Move{
    if(this.state.isMichaelVariant === true && this.state.players.every(player => player.clovers.length === 0) && this.state.players.every(player => howManyCloversInGarden(player.garden) !== 4 && this.state.activePlayer === undefined)){
      return {type:MoveType.DrawCloverForEveryone}
    }
    return
  }

  getView(): GameView {
    return {...this.state, faceDownClovers: this.state.faceDownClovers.length}
  }

  getMoveView(move: Move): MoveView {
    if (move.type === MoveType.DrawClover) {
      return {...move, clover: this.state.faceDownClovers[0]}
    } 
    if (move.type === MoveType.DrawCloverForEveryone){
      return {...move, clover: this.state.faceDownClovers.slice(0,this.state.players.length)}
    }
    
    return move
  }

  giveTime(playerId: number): number {
    if(this.state.activePlayer === undefined){
      if(this.state.isMichaelVariant === true && this.state.players.every(p => howManyCloversInGarden(p.garden) !== 0)){
        return 8
      } else {
        return 8
      }
    } else {
      return 8
    }
  }

  rankPlayers(playerA:number, playerB:number):number{
    const playedTokensA = howManyCloversInGarden(this.state.players[playerA-1].garden)
    const playedTokenB = howManyCloversInGarden(this.state.players[playerB-1].garden)
    return playedTokenB - playedTokensA
  }

  isEliminated(playerId: number): boolean {
    return !!this.state.players[playerId-1].isEliminated
  }

  giveUpMove(playerId: number): Move {
    return concedeMove(playerId)
  }

  canUndo(action: Action<Move, number>, consecutiveActions: Action<Move, number>[]): boolean {
    if(this.state.activePlayer !== undefined) return false
    if(this.state.isMichaelVariant === true){
      return !action.consequences.some(consequence => consequence.type === MoveType.DrawCloverForEveryone)
    } else {
      return this.state.activePlayer === undefined
    }
  }
}
