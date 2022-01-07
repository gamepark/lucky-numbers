/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import Clover, { isSameClover } from '@gamepark/lucky-number/material/Clover'
import PlaceClover, { isPlaceClover, placeCloverMove } from '@gamepark/lucky-number/moves/PlaceClover'
import { Animation, useAnimation, usePlay, usePlayerId } from '@gamepark/react-client'
import { Draggable } from '@gamepark/react-components'
import { DropTargetMonitor, useDrop } from 'react-dnd'
import { getDisplayPosition } from '../players/PlayerDisplay'
import { CLOVER } from '../players/CloverDropArea'
import {canDragStyle, cloverSize, boardTop, boardLeft} from '../styles'
import CloverImage from './CloverImage'

type Props = {
  clovers: Clover[]
  canDrag:boolean
  cloversInHand:Clover[]|undefined
  activePlayer:number|undefined
  nbPlayers:number
}

export default function FaceUpClovers({clovers, canDrag, cloversInHand, activePlayer, nbPlayers}: Props) {
  const play = usePlay()
  const playerId = usePlayerId()
  const placeCloverAnimation = useAnimation<PlaceClover>(animation => isPlaceClover(animation.move) && clovers.find(clover => isSameClover(clover, animation.move.clover)) !== undefined)
  const displayPositionOfAnimPlayer = placeCloverAnimation !== undefined && getDisplayPosition(playerId, placeCloverAnimation.move.playerId-1 , nbPlayers)

  const [{canDrop, isOver}, dropRef] = useDrop({
    accept: CLOVER,
    canDrop: (item: Clover) => {
      return cloversInHand !== undefined && cloversInHand.find(clover => isSameClover(clover, item) && activePlayer === playerId) !== undefined
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
      <Draggable key={index} type={CLOVER} item={clover} canDrag={canDrag} drop={play}>
        <CloverImage clover={clover} 
                     css={[position(index), 
                     canDrag && canDragStyle, 
                     isCloverAnimated(clover, placeCloverAnimation) && displayPositionOfAnimPlayer !== false && placeCloverTranslation(placeCloverAnimation!.duration, displayPositionOfAnimPlayer, placeCloverAnimation!.move.row, placeCloverAnimation!.move.column),
                     isCloverSorted(index, clovers, placeCloverAnimation) && sortClovers(placeCloverAnimation!.duration, index)
                     ]}/>
      </Draggable> )}
  </>
  )
}

function isCloverSorted(index:number, discard:Clover[], animation:Animation<PlaceClover>|undefined):boolean{
  return animation !== undefined && discard.findIndex(clover => isSameClover(clover, animation.move.clover)) < index
}

function isCloverAnimated(clover:Clover, animation:Animation<PlaceClover>|undefined):boolean{
  return animation !== undefined && isSameClover(clover, animation.move.clover)
}

const sortClovers = (duration:number, index:number) => css`
  animation: ${sortCloverKeyframes(index)} ${duration}s ease-in-out forwards;
`

const sortCloverKeyframes = (index:number) => keyframes`
from{}
to{
  left: ${((index-1)%6) * (cloverSize + 1) + 66}em;
  top: ${Math.floor((index-1)/6)*(cloverSize +1) + 66}em;
}
`

const placeCloverTranslation = (duration:number, playerPos:number, row:number, column:number) => css`
  animation: ${discardCloverKeyframes(playerPos, row, column)} ${duration}s ease-in-out infinite;
`

const discardCloverKeyframes = (playerPos:number, row:number, column:number) => keyframes`
from{}
to{
  top:${boardTop(playerPos) + 1.7 + (cloverSize+1)*row}em;
  left:${boardLeft(playerPos) + 1.7 + (cloverSize+1)*column}em;
}
`

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
