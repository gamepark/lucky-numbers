/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import Clover, { isSameClover } from '@gamepark/lucky-number/material/Clover'
import PlaceClover, { isPlaceClover, placeCloverMove } from '@gamepark/lucky-number/moves/PlaceClover'
import { Animation, useAnimation, usePlay, usePlayerId } from '@gamepark/react-client'
import { Draggable } from '@gamepark/react-components'
import { DragLayerMonitor, DropTargetMonitor, useDrop } from 'react-dnd'
import { getDisplayPosition } from '../players/PlayerDisplay'
import { CLOVER } from '../players/CloverDropArea'
import {canDragStyle, cloverSize, boardTop, boardLeft, boardMargin} from '../styles'
import CloverImage from './CloverImage'
import { useTranslation } from 'react-i18next'

type Props = {
  clovers: Clover[]
  canDrag:boolean
  cloversInHand:Clover[]|undefined
  activePlayer:number|undefined
  nbPlayers:number
}

export default function FaceUpClovers({clovers, canDrag, cloversInHand, activePlayer, nbPlayers}: Props) {
  const {t} = useTranslation()
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

  function bottomLeftPlayerProjection(monitor: DragLayerMonitor) {
    let offset = monitor.getDifferenceFromInitialOffset()
    if (!offset) return offset
    return {x: offset.x * 0.85, y: offset.y * 0.8}
  }

  return (
  <>
    <div css={[discardZoneStyle, canDrop && canDropDiscard, isOver && isOverDiscard]} ref={dropRef}>{canDrop && <span css={spanStyle}>{t("Discard here")}</span>}</div>
      {clovers.map((clover, index) => 
      <Draggable key={index} type={CLOVER} item={clover} canDrag={canDrag} drop={play} projection={bottomLeftPlayerProjection}>
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

const spanStyle = css`
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  font-size:4em;
`

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
  top:${boardTop(playerPos) + boardMargin + (cloverSize+1)*column}em;
  left:${boardLeft(playerPos) + boardMargin + (cloverSize+1)*row}em;
}
`

const fadeInKF = keyframes`
from{opacity:0;}
to{opacity:1;}
`

const canDropDiscard = css`
  opacity:1;
`

const discardZoneStyle = css`
  opacity:0;
  position:absolute;
  top:65em;
  left:64em;
  width:52em;
  height:25em;
  border:solid 0.4em rgb(109,0,0);
  border-radius:5em;
  background-color:rgba(150,0,36,0.4);
  transition:opacity 0.3s linear, background-color 0.3s linear;
`

const isOverDiscard = css`
  background-color:rgba(150,0,36,0.6);
`

const position = (index: number) => css`
  left: ${(index%6) * (cloverSize + 1) + 66}em;
  top: ${Math.floor(index/6)*(cloverSize +1) + 66}em;
`
