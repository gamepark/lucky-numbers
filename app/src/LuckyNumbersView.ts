import GameView from '@gamepark/lucky-numbers/GameView'
import { concede } from '@gamepark/lucky-numbers/moves/Concede'
import {drawCloverInView} from '@gamepark/lucky-numbers/moves/DrawClover'
import { drawCloverForEveryoneInView } from '@gamepark/lucky-numbers/moves/DrawCloverForEveryone'
import MoveType from '@gamepark/lucky-numbers/moves/MoveType'
import MoveView from '@gamepark/lucky-numbers/moves/MoveView'
import {placeClover} from '@gamepark/lucky-numbers/moves/PlaceClover'
import { howManyCloversInGarden } from '@gamepark/lucky-numbers/PlayerState'
import {Action, Game, Undo} from '@gamepark/rules-api'
import SetSelectedClover, { resetSelectedClover, ResetSelectedClover, RESET_SELECTED_CLOVER, setSelectedClover, SET_SELECTED_CLOVER } from './localMoves/setSelectedClover'

type LocalMove = MoveView | SetSelectedClover | ResetSelectedClover

export default class LuckyNumbersView implements Game<GameView, MoveView>, Undo<GameView, MoveView, number> {
  state: GameView

  constructor(state: GameView) {
    this.state = state
  }

  play(move: LocalMove): void {
    switch (move.type) {
      case MoveType.DrawClover:
        drawCloverInView(this.state, move)
        break
      case MoveType.PlaceClover:
        placeClover(this.state, move)
        break
      case MoveType.DrawCloverForEveryone:
        drawCloverForEveryoneInView(this.state, move)
        break
      case MoveType.Concede:
        concede(this.state, move)
        break
      case SET_SELECTED_CLOVER:
        setSelectedClover(this.state, move)
        break
      case RESET_SELECTED_CLOVER:
        resetSelectedClover(this.state)
        break
    }
    if (this.state.activePlayer === undefined && this.state.players.every(player => player.clovers.length === 0) && this.state.players.every(player => howManyCloversInGarden(player.garden) === 4)) {
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

  canUndo(action: Action<MoveView, number>, consecutiveActions: Action<MoveView, number>[]): boolean {
    if(this.state.activePlayer !== undefined) return false
    if(this.state.isMichaelVariant === true){
      return !action.consequences.some(consequence => consequence.type === MoveType.DrawCloverForEveryone)
    } else {
      return this.state.activePlayer === undefined
    }
  }
}