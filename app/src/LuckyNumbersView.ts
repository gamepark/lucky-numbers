import GameView from '@gamepark/lucky-numbers/GameView'
import {concede, skipEliminatedPlayers} from '@gamepark/lucky-numbers/moves/Concede'
import {drawCloverInView} from '@gamepark/lucky-numbers/moves/DrawClover'
import {drawCloverForEveryoneInView, isDrawCloverForEveryone} from '@gamepark/lucky-numbers/moves/DrawCloverForEveryone'
import MoveType from '@gamepark/lucky-numbers/moves/MoveType'
import MoveView from '@gamepark/lucky-numbers/moves/MoveView'
import {placeClover} from '@gamepark/lucky-numbers/moves/PlaceClover'
import {howManyCloversInGarden} from '@gamepark/lucky-numbers/PlayerState'
import {Action, Game, Undo} from '@gamepark/rules-api'
import SetSelectedClover, {
  RESET_SELECTED_CLOVER, ResetSelectedClover, resetSelectedClover, SET_SELECTED_CLOVER, setSelectedClover
} from './localMoves/setSelectedClover'

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
    if (this.state.activePlayer === undefined && this.state.players.every(player =>
      player.clovers.length === 0 && howManyCloversInGarden(player.garden) === 4
    )) {
      this.state.activePlayer = 1
    }
    skipEliminatedPlayers(this.state)
  }

  canUndo(action: Action<MoveView, number>, consecutiveActions: Action<MoveView, number>[]): boolean {
    return this.state.activePlayer === undefined
      && !action.consequences.some(isDrawCloverForEveryone) && !consecutiveActions.some(ca => ca.consequences.some(isDrawCloverForEveryone))
  }
}