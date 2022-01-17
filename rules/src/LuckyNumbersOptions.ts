import {OptionsSpec} from '@gamepark/rules-api'
import { TFunction } from 'i18next'
import GameState from './GameState'

export type LuckyNumbersOptions = {
  players:number
  isBrunoVariation:boolean
  isMichaelVariant:boolean
}

export function isGameOptions(arg: GameState | LuckyNumbersOptions): arg is LuckyNumbersOptions {
  return typeof (arg as GameState).faceDownClovers === 'undefined'
}

export const LuckyNumbersOptionsSpec: OptionsSpec<LuckyNumbersOptions> = {
  isBrunoVariation:{
    label:(t:Function) => t('Bruno Variant'),
    help:t => t('bruno.variant.help')
  },
  isMichaelVariant:{
    label:(t:Function) => t('Michael Variant'),
    help:t => t('michael.variant.help')
  }
}


export function getPlayerName(playerId: number, t: TFunction) {
  return t('Player').concat(" n° ", String(playerId)) 
}