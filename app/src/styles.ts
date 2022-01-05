import { css } from "@emotion/react"

export const headerHeight = 7
export const cloverSize = 7

export const boardTop = (index: number) => (index === 0 || index === 3) ? 58 : 9
export const boardLeft = (index: number) => index < 2 ? 15 : 128

export const playerCloverTop = (playerIndex: number, index: number) => (playerIndex === 0 || playerIndex === 3) ? 60 + index * 8 : 35 - index * 8
export const playerCloverLeft = (playerIndex: number) => playerIndex < 2 ? 52 : 119

export const panelTop = (index: number) => (index === 0 || index === 3) ? 52 : 43
export const panelBGTop = (index: number) => (index === 0 || index === 3) ? 52 : 38
export const panelLeft = (index: number) => index < 2 ? 15 : 128

export const toFullSize = css`
  width: 100%;
  height: 100%;
`

export const toAbsolute = css`
  position: absolute;
`