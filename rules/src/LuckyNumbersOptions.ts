import {OptionsSpec} from '@gamepark/rules-api'
import { TFunction } from 'i18next'
import GameState from './GameState'

export type LuckyNumbersOptions = {
  players:number
}

export function isGameOptions(arg: GameState | LuckyNumbersOptions): arg is LuckyNumbersOptions {
  return typeof (arg as GameState).faceDownClovers === 'undefined'
}

export const LuckyNumbersOptionsSpec: OptionsSpec<LuckyNumbersOptions> = {}


export function getPlayerName(playerId: number, t: TFunction) {
  switch (playerId) {
    case 1:
      return t('Mischievous Player')
    case 2:
      return t('Waggish Player')
    case 3:
      return t('Boisterous Player')
    case 4:
      return t('Rascal Player')
    default:
      return t('Error Player')
  }
}