import GameView from '@gamepark/lucky-numbers/GameView'
import {drawCloverInView} from '@gamepark/lucky-numbers/moves/DrawClover'
import { drawCloverForEveryoneInView } from '@gamepark/lucky-numbers/moves/DrawCloverForEveryone'
import MoveType from '@gamepark/lucky-numbers/moves/MoveType'
import MoveView from '@gamepark/lucky-numbers/moves/MoveView'
import {placeClover} from '@gamepark/lucky-numbers/moves/PlaceClover'
import { howManyCloversInGarden } from '@gamepark/lucky-numbers/PlayerState'
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
      case MoveType.DrawCloverForEveryone:
        drawCloverForEveryoneInView(this.state, move)
        break
    }
    if (this.state.activePlayer === undefined && this.state.players.every(player => player.clovers.length === 0) && this.state.players.every(player => howManyCloversInGarden(player.garden) === 4)) {
      this.state.activePlayer = 1
    }
  }
}