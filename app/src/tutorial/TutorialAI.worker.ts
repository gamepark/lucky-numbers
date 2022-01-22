import GameState from "@gamepark/lucky-number/GameState"
import LuckyNumbers from '@gamepark/lucky-number/LuckyNumbers';
import TutorialAI from "./TutorialAI"
import {Dummy} from '@gamepark/rules-api'

export async function ai(game: GameState, playerId: number) {
    try {
      return new TutorialAI(playerId).play(game as GameState)
    } catch (e) {
      console.error(e)
      const dummy = new Dummy(LuckyNumbers)
      return dummy.getRandomMove(game, playerId)
    }
  }
  