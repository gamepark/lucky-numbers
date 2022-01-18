import shuffle from 'lodash.shuffle'
import {LuckyNumbersOptions} from './LuckyNumbersOptions'
import Clover from './material/Clover'
import {cloverColors} from './material/CloverColor'
import PlayerState, {emptyGarden} from './PlayerState'

type GameState = {
  players: PlayerState[]
  activePlayer?: number
  faceDownClovers: Clover[]
  faceUpClovers: Clover[]
  isBrunoVariant?:boolean
  isMichaelVariant?:boolean
}

export default GameState

export function setupNewGame(options: LuckyNumbersOptions) {
  const colors = options.players < 3 ? shuffle(cloverColors).splice(0, options.players) : cloverColors
  const clovers: Clover[] = shuffle(colors.flatMap(color => [...new Array(20)].map((_, index) => ({color, number: index + 1}))))
  return {
    players: [...new Array(options.players)].map(() => ({garden: emptyGarden, clovers: clovers.splice(0, options.isMichaelVariant ? 1 : 4)})),
    faceDownClovers: clovers,
    faceUpClovers: [],
    isBrunoVariant: options.isBrunoVariant,
    isMichaelVariant: options.isMichaelVariant
  }

}
