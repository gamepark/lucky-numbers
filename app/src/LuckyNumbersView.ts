import GameView from '@gamepark/lucky-number/GameView'
import {drawCloverInView} from '@gamepark/lucky-number/moves/DrawClover'
import MoveType from '@gamepark/lucky-number/moves/MoveType'
import MoveView from '@gamepark/lucky-number/moves/MoveView'
import {placeClover} from '@gamepark/lucky-number/moves/PlaceClover'
import {Game} from '@gamepark/rules-api'

export default class LuckyNumbersView implements Game<GameView, MoveView> {
  state: GameView

  constructor(state: GameView) {
    this.state = state
  }

  play(move: MoveView): void {
    switch (move.type) {
      case MoveType.DrawClover:
        drawCloverInView(this.state, move)
        break
      case MoveType.PlaceClover:
        placeClover(this.state, move)
        break
    }
    if (this.state.activePlayer === undefined && this.state.players.every(player => player.clovers.length === 0)) {
      this.state.activePlayer = 1
    }
  }
}