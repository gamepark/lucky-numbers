/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import Clover, { isSameClover } from '@gamepark/lucky-numbers/material/Clover'
import PlaceClover, { isBrunoVariantTrigger, isPlaceClover } from '@gamepark/lucky-numbers/moves/PlaceClover'
import PlayerState from '@gamepark/lucky-numbers/PlayerState'
import {Animation, useActions, useAnimation, usePlay, usePlayer, usePlayerId, useTutorial} from '@gamepark/react-client'
import {Draggable, Picture} from '@gamepark/react-components'
import Images from '../Images'
import CloverImage from '../clovers/CloverImage'
import {boardLeft, boardMargin, boardTop, canDragStyle, cloverSize, discardLeft, discardMarginLeft, discardMarginTop, discardTop, playerCloverLeft, playerCloverTop, selectedStyle} from '../styles'
import Board from './Board'
import {CLOVER} from './CloverDropArea'
import PlayerPanel from './PlayerPanel'
import Move from '@gamepark/lucky-numbers/moves/Move'
import { DragLayerMonitor, DropTargetMonitor, useDrop } from 'react-dnd'
import SetSelectedClover, { setSelectedCloverMove } from '../localMoves/setSelectedClover'

type Props = {
  player: PlayerState
  index: number
  isMine?: boolean
  activePlayer:boolean
  isAnyWinner:boolean
  nbPlayers:number
  isSetupPhase:boolean
  cloversDiscarded:Clover[]
  isBrunoVariant:boolean
  cloverSelected?:Clover
}

export default function PlayerDisplay({player, index, isMine, activePlayer, isAnyWinner, nbPlayers, isSetupPhase, cloversDiscarded, isBrunoVariant, cloverSelected}: Props) {

  const tutorial = useTutorial()
  const playerId = usePlayerId()
  const actions = useActions<Move, number>()
  const actionsNumber = actions !== undefined ? actions.filter(action => action.playerId === playerId).length : 0
  
  const [{canDrop}] = useDrop({
    accept: CLOVER,
    canDrop: (item:Clover) => {
      return false
    },
    collect: (monitor: DropTargetMonitor<Clover>) => ({
      canDrop: monitor.getItem()
    })
  })

  const playerInfo = usePlayer(index+1)
  const play = usePlay()
  const playSetSelectedClover = usePlay<SetSelectedClover>()
  const placeCloverAnimation = useAnimation<PlaceClover>(animation => isPlaceClover(animation.move))
  const isAnimation = useAnimation<Move>()

  const isBrunoVariantAnim = placeCloverAnimation !== undefined && isBrunoVariantTrigger(player.garden, placeCloverAnimation.move.row, placeCloverAnimation.move.column, placeCloverAnimation.move.clover, isBrunoVariant)

  const displayPosition = getDisplayPosition(playerId, index, nbPlayers)
  const ladybugStart = getLadyBugStart(actionsNumber)
  const ladybugMove = getLadyBugMove(actionsNumber)

  function bottomLeftPlayerProjection(monitor: DragLayerMonitor) {
    let offset = monitor.getDifferenceFromInitialOffset()
    if (!offset) return offset
    return {x: offset.x * 0.85, y: offset.y * 0.8}
  }

  return (
    <>
      <PlayerPanel playerInfo={playerInfo} indexPlayer={index+1} index={displayPosition} activePlayer={activePlayer && !isAnyWinner} isWinner={isAnyWinner} />
      <Board itemDrag={canDrop} 
             garden={player.garden} 
             idGarden={index} 
             isMine={isMine} 
             isSetupPhase={isSetupPhase}
             cloversDiscarded={cloversDiscarded} 
             playerPosition={displayPosition} 
             isBrunoVariant={isBrunoVariant} 
             selectedClover={cloverSelected} 
             cloverInHand={player.clovers}
             css={boardPosition(displayPosition)} />

      {isMine 
        ? player.clovers.map((clover, cloverIndex) =>
          <Draggable key={`${clover.color} ${clover.number}`} 
          onClick={() => isMine && playSetSelectedClover(setSelectedCloverMove(clover), {local:true})}
          projection={bottomLeftPlayerProjection}
          type={CLOVER} 
          item={clover} 
          css={[cloverPosition(displayPosition, cloverIndex), 
                cloverSelected && isSameClover(clover, cloverSelected) && selectedStyle,
                (isCloverAnimated(clover, placeCloverAnimation)) && (placeCloverAnimation!.move.row === -1
                  ? discardCloverTranslation(placeCloverAnimation!.duration, cloversDiscarded.length) 
                  : placeCloverTranslation(placeCloverAnimation!.duration, displayPosition, placeCloverAnimation!.move.row, placeCloverAnimation!.move.column, isBrunoVariantAnim && displayPosition === 0))
                ]} 
          canDrag={isMine} 
          drop={play}>
            <CloverImage clover={clover} 
                         css={[isMine && !isAnimation && canDragStyle,
                               isCloverAnimated(clover, placeCloverAnimation) && isBrunoVariantAnim && replayAnimation(placeCloverAnimation!.duration, displayPosition === 0)
                              ]} />
          </Draggable>
        )

        : player.clovers.map((clover, cloverIndex) => 
          <div key={cloverIndex}
               css={[cloverPosition(displayPosition, cloverIndex),
                    (isCloverAnimated(clover, placeCloverAnimation)) && (placeCloverAnimation!.move.row === -1
                      ? discardCloverTranslation(placeCloverAnimation!.duration, cloversDiscarded.length) 
                      : placeCloverTranslation(placeCloverAnimation!.duration, displayPosition, placeCloverAnimation!.move.row, placeCloverAnimation!.move.column, isBrunoVariantAnim && displayPosition === 0))
                  ]} >
          <CloverImage clover={clover} 
                       css={[isCloverAnimated(clover, placeCloverAnimation) && isBrunoVariantAnim && replayAnimation(placeCloverAnimation!.duration, displayPosition === 0)]} /> 
          </div>                  
        )
      }



      {tutorial !== undefined && isAnimation === undefined && isMine && ladybugStart !== undefined && <Picture src={Images.ladybug} css={[ladybugStyle(ladybugStart), canDrop && ladybugMove !== undefined && ladyBugMoveAnim(ladybugMove)]} />}

    </>
  )
}

function isCloverAnimated(clover:Clover, animation:Animation<PlaceClover>|undefined):boolean{
  return animation !== undefined && isSameClover(clover, animation.move.clover)
}

export function getDisplayPosition(playerId:number|undefined, index:number, nbPlayers:number):number{
  if (playerId === undefined){
    return nbPlayers === 2 ? index*2 : index
  } else {
    return nbPlayers === 2 ? ((index -playerId+1+nbPlayers)%nbPlayers)*3 : (index -playerId+1+nbPlayers)%nbPlayers
  } 
}

const discardCloverTranslation = (duration:number, nbDiscarded:number) => css`
  transition:all 0.2s linear;
  animation: ${discardCloverKeyframes(nbDiscarded)} ${duration}s ease-in-out forwards;
`

const discardCloverKeyframes = (nbDiscarded:number) => keyframes`
from{}
to{
  left: ${(nbDiscarded%6) * (cloverSize + 1) + discardLeft + discardMarginLeft}em;
  top: ${Math.floor(nbDiscarded/6)*(cloverSize +1) + discardTop + discardMarginTop}em;
}
`

const placeCloverKeyframes = (playerPosition:number, row:number, column:number) => keyframes`
from{}
80%,to{
  left:${boardLeft(playerPosition) + boardMargin + (playerPosition === 0 ? 0.5 : 0) + (cloverSize+1)*row * (playerPosition === 0 ? 1.3 : 1)}em;
  top:${boardTop(playerPosition) + boardMargin + (playerPosition === 0 ? -9.7 : 0) + (cloverSize+1)*column * (playerPosition === 0 ? 1.3 : 1)}em;
}
`

const replayKF = keyframes`
  from,50%{filter: drop-shadow(0 0 0em gold) drop-shadow(0 0 0em gold);}
  to{filter: drop-shadow(0 0 0.5em gold) drop-shadow(0 0 0.5em gold) drop-shadow(0 0 0.5em gold);}
`

const replayAnimation = (duration:number, isPlayerId:boolean) => css`
  animation: ${replayKF} ${duration/10}s linear ${isPlayerId ? 0 : 1 }s infinite alternate;
`


const placeCloverTranslation = (duration:number, playerPosition:number, row:number, column:number, isBrunoVariant:boolean) => css`
  animation: ${placeCloverKeyframes(playerPosition, row, column)} ${duration}s ease-in-out ${isBrunoVariant === true ? -duration : 0}s forwards;
`

const boardPosition = (index: number) => css`
  left: ${boardLeft(index)}em;
  top: ${boardTop(index)}em;
  transform-style:preserve-3d;
`

const cloverPosition = (playerIndex: number, index: number) => css`
  position: absolute;
  width: ${playerIndex === 0 ? cloverSize*1.3 : cloverSize}em;
  height: ${playerIndex === 0 ? cloverSize*1.3 : cloverSize}em;
  left: ${playerCloverLeft(playerIndex)}em;
  top: ${playerCloverTop(playerIndex, index)}em;
  transform-style:preserve-3d;
`

const ladyBugWaitingKF = (top:number) => keyframes`
  from{
    transform:rotateZ(0deg) translate(${top === 12 ? 13 : 4}em);
  }
  to{
    transform:rotateZ(-360deg) translate(${top === 12 ? 13 : 4}em);
  }
`

const ladyBugEntryKF = keyframes`
  from{
    opacity:0;
  }
  to{
    opacity:1;
  }
`

const ladybugStyle = (pos:{top:number, left:number}) => css`
  position:absolute;
  //pointer-events:none;
  filter: drop-shadow(0 0 0.3em black);
  left:${boardLeft(0) + pos.left}em;
  top:${boardTop(0) + pos.top}em;
  height:4.5em;
  z-index:10;
  opacity:1;
  animation:${ladyBugEntryKF} 2s linear, ${ladyBugWaitingKF(pos.top)} 3s linear infinite;
`

function getLadyBugStart(action:number):{top:number, left:number}|undefined{
  switch(action){
    case 0: return {top:4.5,left:49.5}
    case 1: return {top:-5.5,left:49.5}
    case 2: return {top:-5.5,left:49.5}
    case 3: return {top:-5.5,left:49.5}
    case 4: return {top:12,left:78}
    case 5: return {top:-5.5,left:49.5}
    case 6: return {top:-45,left:4.5}
    case 8: return {top:-5.5,left:49.5}
    case 10: return {top:-5.5,left:49.5}
    default: return undefined
  }
}

const ladybugMoveKF = (pos:{X:number, Y:number, rot:number}) => keyframes`
  from{
    transform:translate(0em,0em) rotateZ(${pos.rot}deg);
    opacity:1;
  }
  80%{
    transform:translate(${pos.X}em, ${pos.Y}em) rotateZ(${pos.rot}deg);
    opacity:1;
  }
  to{
    transform:translate(${pos.X}em, ${pos.Y}em) rotateZ(${pos.rot}deg);
    opacity:0;
  }
`

const ladyBugMoveAnim = (pos:{X:number, Y:number, rot:number}) => css`
  animation:${ladybugMoveKF(pos)} 2s ease-in-out infinite;
`

function getLadyBugMove(action:number):{X:number, Y:number, rot:number}|undefined{
  switch(action){
    case 0: return {X:-44, Y:-10, rot:Math.atan(-44/10)*(180/Math.PI)}
    case 1: return {X:-35, Y:10, rot:180+Math.atan(-35/-10)*(180/Math.PI)}
    case 2: return {X:-24, Y:20, rot:180+Math.atan(-24/-20)*(180/Math.PI)}
    case 3: return {X:-13, Y:31, rot:180+Math.atan(-13/-31)*(180/Math.PI)}
    case 5: return {X:-44, Y:10, rot:180+Math.atan(-44/-10)*(180/Math.PI)}
    case 6: return {X:10, Y:39, rot:180+Math.atan(10/-39)*(180/Math.PI)}
    case 8: return {X:-13, Y:31, rot:180+Math.atan(-13/-31)*(180/Math.PI)}
    case 10: return {X:-25, Y:-30, rot:Math.atan(25/-30)*(180/Math.PI)}
    default: return undefined
  }
}