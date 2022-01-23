import {OptionsSpec} from '@gamepark/rules-api'
import GameState from './GameState'

export type LuckyNumbersOptions = {
  players: number
  isBrunoVariant: boolean
  isMichaelVariant: boolean
}

export function isGameOptions(arg: GameState | LuckyNumbersOptions): arg is LuckyNumbersOptions {
  return typeof (arg as GameState).faceDownClovers === 'undefined'
}

export const LuckyNumbersOptionsSpec: OptionsSpec<LuckyNumbersOptions> = {
  isBrunoVariant: {
    label: (t: Function) => t('Bruno Variant'),
    help: t => t('bruno.variant.help'),
    subscriberRequired: true
  },
  isMichaelVariant: {
    label: (t: Function) => t('Michael Variant'),
    help: t => t('michael.variant.help'),
    subscriberRequired: true
  }
}
