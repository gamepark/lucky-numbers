/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import {drawCloverMove} from '@gamepark/lucky-number/moves/DrawClover'
import {usePlay} from '@gamepark/react-client'
import {useState} from 'react'
import {cloverSize, headerHeight} from '../styles'
import CloverImage from './CloverImage'

type Props = {
  size: number
  canDraw: boolean
}

export default function DrawPile({size, canDraw}: Props) {
  const play = usePlay()
  const [positions] = useState<CssPosition[]>([...new Array(size)].map(() => ({radius: Math.random(), direction: Math.random(), rotation: Math.random()})))
  return <>
    {[...new Array(size)].map((_, index) =>
      <CloverImage key={index} onClick={canDraw ? () => play(drawCloverMove, {delayed: true}) : undefined}
                   css={[style(positions[index]), canDraw && canDrawStyle]}/>
    )}
  </>
}

type CssPosition = {
  radius: number
  direction: number
  rotation: number
}

const style = ({direction, radius, rotation}: CssPosition) => css`
  left: ${Math.cos(direction * 2 * Math.PI) * radius * 24 + (16 / 9 * 100 - cloverSize) / 2}em;
  top: ${Math.sin(direction * 2 * Math.PI) * radius * 24 + 25 + headerHeight + 3}em;
  transform: rotate(${rotation * 90}deg);
`

const opacityKeyframe = keyframes`
  from {
    filter: drop-shadow(0 0 0.1em white) drop-shadow(0 0 0.1em white);
  }
  to {
    filter: drop-shadow(0 0 0.2em white) drop-shadow(0 0 0.2em white);
  }
`

const canDrawStyle = css`
  cursor: pointer;
  animation: ${opacityKeyframe} 2s ease-in-out alternate infinite;

  &:hover:after {
    animation: none;
    filter: drop-shadow(0 0 0.3em white) drop-shadow(0 0 0.3em white);
  }
`
