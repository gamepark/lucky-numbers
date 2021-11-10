import Clover from './material/Clover'

export type Garden = (Clover | null)[][]

export default interface PlayerState {
  garden: Garden
  clovers: Clover[]
}

export const emptyGarden = [
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null],
  [null, null, null, null]
]

export function isValidPosition(garden: Garden, clover: Clover, row: number, column: number) {
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
  return true
}
