/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import Clover from '@gamepark/lucky-number/material/Clover'
import PlaceClover from '@gamepark/lucky-number/moves/PlaceClover'
import {HTMLAttributes} from 'react'
import {DropTargetMonitor, useDrop} from 'react-dnd'
import {cloverSize} from '../styles'

type Props = {
  canPlaceClover: (clover: Clover) => boolean
  onDropClover: (clover: Clover) => PlaceClover
} & HTMLAttributes<HTMLDivElement>

export const CLOVER = 'CLOVER'

export default function CloverDropArea({canPlaceClover, onDropClover, ...props}: Props) {
  const [{canDrop, over}, ref] = useDrop({
    accept: CLOVER,
    canDrop: canPlaceClover,
    drop: onDropClover,
    collect: (monitor: DropTargetMonitor<Clover>) => ({
      canDrop: monitor.getItem() && canPlaceClover(monitor.getItem()),
      over: monitor.isOver()
    })
  })
  return <div ref={ref} css={[style, canDrop && (over ? highlight : display)]} {...props}/>
}

const style = css`
  position: absolute;
  width: ${cloverSize}em;
  height: ${cloverSize}em;
  border-radius: 50%;
`

const display = css`
  background-color: rgba(255, 255, 255, 0.3);
`

const highlight = css`
  background-color: rgba(255, 255, 255, 0.7);
`
