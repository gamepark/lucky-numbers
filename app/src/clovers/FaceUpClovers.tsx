/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import Clover, { isSameClover } from '@gamepark/lucky-numbers/material/Clover'
import PlaceClover, { isBrunoVariantTrigger, isPlaceClover, placeCloverMove } from '@gamepark/lucky-numbers/moves/PlaceClover'
import { Animation, useAnimation, usePlay, usePlayerId } from '@gamepark/react-client'
import { Draggable } from '@gamepark/react-components'
import { DragLayerMonitor, DropTargetMonitor, useDrop } from 'react-dnd'
import { getDisplayPosition } from '../players/PlayerDisplay'
import { CLOVER } from '../players/CloverDropArea'
import {canDragStyle, cloverSize, boardTop, boardLeft, boardMargin, selectedStyle} from '../styles'
import CloverImage from './CloverImage'
import { useTranslation } from 'react-i18next'
import PlayerState from '@gamepark/lucky-numbers/PlayerState'
import SetSelectedClover, { ResetSelectedClover, resetSelectedCloverMove, setSelectedCloverMove } from '../localMoves/setSelectedClover'
import Button from '../tutorial/Button'

type Props = {
  clovers: Clover[]
  canDrag:boolean
  cloversInHand:Clover[]|undefined
  activePlayer:number|undefined
  nbPlayers:number
  isBrunoVariant:boolean
  cloverSelected?:Clover
  players:PlayerState[]
}

export default function FaceUpClovers({clovers, canDrag, cloversInHand, activePlayer, players, isBrunoVariant, nbPlayers, cloverSelected}: Props) {
  const {t} = useTranslation()
  const play = usePlay()
  const playResetSelectedClover = usePlay<ResetSelectedClover>()
  const playerId = usePlayerId()
  const placeCloverAnimation = useAnimation<PlaceClover>(animation => isPlaceClover(animation.move) && clovers.find(clover => isSameClover(clover, animation.move.clover)) !== undefined)
  const displayPositionOfAnimPlayer = placeCloverAnimation !== undefined && getDisplayPosition(playerId, placeCloverAnimation.move.playerId-1 , nbPlayers)
  const isBrunoVariantAnim = placeCloverAnimation !== undefined && activePlayer !== undefined && isBrunoVariantTrigger(players[activePlayer-1].garden, placeCloverAnimation.move.row, placeCloverAnimation.move.column, placeCloverAnimation.move.clover, isBrunoVariant)
  const [{canDrop, isOver}, dropRef] = useDrop({
    accept: CLOVER,
    canDrop: (item: Clover) => {
      return cloversInHand !== undefined && cloversInHand.find(clover => isSameClover(clover, item) && activePlayer === playerId) !== undefined
    },
    drop: (item: Clover) => {
      playResetSelectedClover(resetSelectedCloverMove(), {local:true})
      return placeCloverMove(playerId, {color:item.color, number:item.number}, -1,-1)
    },
    collect: (monitor: DropTargetMonitor<Clover>) => {
      return ({
        canDrop: monitor.canDrop(),
        isOver: monitor.isOver()
      })
    }
  })

  function playClickDiscard(move:PlaceClover){
    playResetSelectedClover(resetSelectedCloverMove(), {local:true})
    play(move)
  }

  const playSetSelectedClover = usePlay<SetSelectedClover>()

  function bottomLeftPlayerProjection(monitor: DragLayerMonitor) {
    let offset = monitor.getDifferenceFromInitialOffset()
    if (!offset) return offset
    return {x: offset.x * 0.85, y: offset.y * 0.8}
  }

  return (
  <>
    <div css={[discardZoneStyle, (canDrop || cloversInHand?.some(c => cloverSelected && isSameClover(cloverSelected, c)) ) && canDropDiscard, isOver && isOverDiscard]} ref={dropRef}>{canDrop && <span css={spanStyle}>{t("Discard here")}</span>}
      {cloversInHand?.some(c => cloverSelected && isSameClover(cloverSelected, c)) && <Button onClick={() => playClickDiscard(placeCloverMove(playerId, cloverSelected!, -1,-1))} css={[`position:absolute;bottom:5%;left:50%;transform:translate(-50%,-50%);font-size:3em;`]} > {t("Discard Selected Clover")} </Button>}
    </div>
      {clovers.map((clover, index) => 
      <Draggable key={index} 
                 onClick={() => activePlayer === playerId && cloversInHand?.length === 0 && playSetSelectedClover(setSelectedCloverMove(clover), {local:true})}
                 type={CLOVER} 
                 item={clover} 
                 canDrag={canDrag} 
                 drop={play} 
                 projection={bottomLeftPlayerProjection} 
                 css={[position(index),
                  cloverSelected && (cloversInHand?.length === 0) && isSameClover(clover, cloverSelected) && selectedStyle,
                  isCloverAnimated(clover, placeCloverAnimation) && displayPositionOfAnimPlayer !== false && placeCloverTranslation(placeCloverAnimation!.duration, displayPositionOfAnimPlayer, placeCloverAnimation!.move.row, placeCloverAnimation!.move.column, isBrunoVariantAnim && playerId === activePlayer),
                  isCloverSorted(index, clovers, placeCloverAnimation) && sortClovers(placeCloverAnimation!.duration, index)]}>
        <CloverImage clover={clover} 
                     css={[css`position:absolute;width:100%;height:100%;`,
                           canDrag && placeCloverAnimation === undefined && canDragStyle, 
                           isCloverAnimated(clover, placeCloverAnimation) && isBrunoVariantAnim && replayAnimation(placeCloverAnimation!.duration, playerId === activePlayer),
                           
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

const replayKF = keyframes`
  from,50%{filter: drop-shadow(0 0 0em gold) drop-shadow(0 0 0em gold);}
  to{filter: drop-shadow(0 0 0.5em gold) drop-shadow(0 0 0.5em gold) drop-shadow(0 0 0.5em gold);}
`

const replayAnimation = (duration:number, isPlayerId:boolean) => css`
  animation: ${replayKF} ${duration/10}s linear ${isPlayerId ? 0 : 1 }s infinite alternate;
`

const spanStyle = css`
  position:absolute;
  top:50%;
  left:50%;
  transform:translate(-50%,-50%);
  font-size:4em;
`

const sortClovers = (duration:number, index:number) => css`
  animation: ${sortCloverKeyframes(index)} ${duration}s ease-in-out 0s forwards;
`

const sortCloverKeyframes = (index:number) => keyframes`
from{}
to{
  left: ${((index-1)%6) * (cloverSize + 1) + 66}em;
  top: ${Math.floor((index-1)/6)*(cloverSize +1) + 66}em;
}
`

const placeCloverTranslation = (duration:number, playerPos:number, row:number, column:number, isBrunoVariant:boolean) => css`
  animation: ${placeCloverKeyframes(playerPos, row, column)} ${duration}s ease-in-out ${isBrunoVariant === true ? -duration : 0}s forwards;
`

const placeCloverKeyframes = (playerPos:number, row:number, column:number) => keyframes`
from{}
to{
  top:${boardTop(playerPos) + boardMargin + (cloverSize+1)*column}em;
  left:${boardLeft(playerPos) + boardMargin + (cloverSize+1)*row}em;
}
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
  position:absolute;
  width:${cloverSize}em;
  height:${cloverSize}em;
  left: ${(index%6) * (cloverSize + 1) + 66}em;
  top: ${Math.floor(index/6)*(cloverSize +1) + 66}em;

`
