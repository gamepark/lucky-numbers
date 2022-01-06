/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import Clover from '@gamepark/lucky-number/material/Clover'
import { placeCloverMove } from '@gamepark/lucky-number/moves/PlaceClover'
import { usePlay, usePlayerId } from '@gamepark/react-client'
import { Draggable } from '@gamepark/react-components'
import { DropTargetMonitor, useDrop } from 'react-dnd'
import { CLOVER } from '../players/CloverDropArea'
import {canDragStyle, cloverSize} from '../styles'
import CloverImage from './CloverImage'

type Props = {
  clovers: Clover[]
  canDrag:boolean
  cloversInHand:Clover[]|undefined
  activePlayer:number|undefined
}

export default function FaceUpClovers({clovers, canDrag, cloversInHand, activePlayer}: Props) {
  const play = usePlay()
  const playerId = usePlayerId()

  const [{canDrop, isOver}, dropRef] = useDrop({
    accept: CLOVER,
    canDrop: (item: Clover) => {
      return cloversInHand !== undefined && cloversInHand.find(clover => clover.color === item.color && clover.number === item.number && activePlayer === playerId) !== undefined
    },
    drop: (item: Clover) => {
      return placeCloverMove(playerId, {color:item.color, number:item.number}, -1,-1)
    },
    collect: (monitor: DropTargetMonitor<Clover>) => {
      return ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver()
      })
    }
  })
  return (
  <>
    <div css={[canDrop && discardZoneStyle, isOver && isOverDiscard]} ref={dropRef}></div>
      {clovers.map((clover, index) => 
      <Draggable key={index} type={CLOVER} item={clover} canDrag={canDrag} drop={play} >
        <CloverImage clover={clover} css={[position(index), canDrag && canDragStyle]}/>
      </Draggable> )}
  </>
  )
}

const discardZoneStyle = css`
  position:absolute;
  top:65em;
  left:64em;
  width:52em;
  height:25em;
  border:solid 0.4em red;
  border-radius:5em;
  background-color:rgba(225,0,0,0.4);
`

const isOverDiscard = css`
  background-color:rgba(225,0,0,0.7);
`

const position = (index: number) => css`
  left: ${(index%6) * (cloverSize + 1) + 66}em;
  top: ${Math.floor(index/6)*(cloverSize +1) + 66}em;
`
