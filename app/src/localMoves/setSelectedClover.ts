import Clover, { isSameClover } from "@gamepark/lucky-numbers/material/Clover"
import GameLocalView from "src/GameLocalView"

export const SET_SELECTED_CLOVER = 'SetSelectedClover'
export const RESET_SELECTED_CLOVER = 'ResetSelectedClover'

export default interface SetSelectedClover {
  type: typeof SET_SELECTED_CLOVER
  clover:Clover
}

export interface ResetSelectedClover {
  type: typeof RESET_SELECTED_CLOVER
}

export const setSelectedCloverMove = (clover:Clover): SetSelectedClover => ({
  type: SET_SELECTED_CLOVER, clover
})

export const resetSelectedCloverMove = (): ResetSelectedClover => ({
  type: RESET_SELECTED_CLOVER
})

export function setSelectedClover(state: GameLocalView, move: SetSelectedClover) {
  state.selectedClover = (state.selectedClover && isSameClover(state.selectedClover, move.clover)) ? undefined : move.clover
}

export function resetSelectedClover(state: GameLocalView) {
  delete state.selectedClover
}