import { css, keyframes } from "@emotion/react"

export const headerHeight = 7
export const cloverSize = 7
export const boardMargin = 1.7

export const boardTop = (index: number) => (index === 0 || index === 3) ? 58 : 9
export const boardLeft = (index: number) => index < 2 ? 15 : 128

export const playerCloverTop = (playerIndex: number, index: number) => (playerIndex === 0 || playerIndex === 3) ? 59.5 + index * 8 : 34.5 - index * 8
export const playerCloverLeft = (playerIndex: number) => playerIndex < 2 ? 51.5 : 118.5

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