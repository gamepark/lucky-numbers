import Clover from './material/Clover'

export type Garden = (Clover | null)[][]

export default interface PlayerState {
  garden: Garden
  clovers: Clover[]
  isEliminated:boolean
}

export const emptyGarden = [
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null]
]

export function isValidPosition(garden: Garden, clover: Clover, row: number, column: number, isSetupPhase:boolean) {
  if(isSetupPhase){
    return ((row === 0 && column === 0) || (row === 1 && column === 1) || (row === 2 && column === 2) || (row === 3 && column === 3)) && garden[row][column] === null
  }
  for (let i = 0; i < 4; i++) {
    const rowSpace = garden[row][i]
    const columnSpace = garden[i][column]
    if (rowSpace !== null && ((i < column && rowSpace.number >= clover.number) || (i > column && rowSpace.number <= clover.number))) {
      return false
    }
    if (columnSpace !== null && ((i < row && columnSpace.number >= clover.number) || (i > row && columnSpace.number <= clover.number))) {
      return false
    }
  }
  return clover.color === undefined ? false : true
}

export enum PlayerColor {
  Elf = 1, Fairy, Unicorn, Gobelin
}

export const playerColors = Object.values(PlayerColor).filter(isPlayerColor)

function isPlayerColor(arg: string | PlayerColor): arg is PlayerColor {
  return typeof arg === 'number'
}

export function howManyCloversInGarden(garden:Garden):number{
 return garden.flat().filter(clover => clover !== null).length
}