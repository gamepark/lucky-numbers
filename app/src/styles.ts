import { css, keyframes } from "@emotion/react"

export const headerHeight = 7
export const cloverSize = 7
export const boardMargin = 1.7

export const discardTop = 9
export const discardLeft = 15
export const discardMarginTop = 12
export const discardMarginLeft = 18


export const boardTop = (index: number) => (index === 0 || index === 3) ? 58 : 9
export const boardLeft = (index: number) => index < 2 ? (index === 0 ? 15 : 80) : 128

export const playerCloverTop = (playerIndex: number, index: number) => (playerIndex === 0 || playerIndex === 3) ? (playerIndex === 0 ? 50 + index * 8*1.3  : 59.5 + index * 8) : 34.5 - index * 8
export const playerCloverLeft = (playerIndex: number) => playerIndex < 2 ? (playerIndex === 0 ? 62 : 70) : 118.5

export const panelTop = (index: number) => (index === 0 || index === 3) ? (index === 0 ? 33.5 : 52) : 43
export const panelBGTop = (index: number) => (index === 0 || index === 3) ? (index === 0 ? 40 : 52) : 38
export const panelLeft = (index: number) => index < 2 ? (index === 0 ? 15 : 80) : 128

export const toFullSize = css`
  width: 100%;
  height: 100%;
`

export const toAbsolute = css`
  position: absolute;
`

export const opacityKeyframe = keyframes`
  from {
    filter: drop-shadow(0 0 0.1em white) drop-shadow(0 0 0.1em white);
  }
  to {
    filter: drop-shadow(0 0 0.4em white) drop-shadow(0 0 0.4em white);
  }
`

export const canDragStyle = css`
  cursor: pointer;
  animation: ${opacityKeyframe} 1s ease-in-out alternate infinite;

  &:hover:after {
    filter: drop-shadow(0 0 0.3em white) drop-shadow(0 0 0.3em white);
  }
`

export const parabolicAnimation = (duration:number) => css`
animation: ${parabolicKeyframes} ${duration}s infinite cubic-bezier(0,3.75,1,3.75);
`

export const parabolicKeyframes = keyframes`
from{transform:translateZ(0em);}
to{transform:translateZ(5em);}
`

export const opacitySelectedKeyframe = keyframes`
  from {
    filter: drop-shadow(0 0 0.1em lime) drop-shadow(0 0 0.1em lime);
  }
  to {
    filter: drop-shadow(0 0 0.4em lime) drop-shadow(0 0 0.4em lime);
  }
`

export const selectedStyle = css`
  transform:translateZ(4em) scale(1.25);
  animation: ${opacitySelectedKeyframe} 1s ease-in-out alternate infinite;
`

