/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import Clover, { isSameClover } from '@gamepark/lucky-number/material/Clover'
import PlaceClover, { isPlaceClover } from '@gamepark/lucky-number/moves/PlaceClover'
import PlayerState from '@gamepark/lucky-number/PlayerState'
import {Animation, useActions, useAnimation, usePlay, usePlayer, usePlayerId, useTutorial} from '@gamepark/react-client'
import {Draggable, Picture} from '@gamepark/react-components'
import Images from '../Images'
import CloverImage from '../clovers/CloverImage'
import {boardLeft, boardMargin, boardTop, canDragStyle, cloverSize, parabolicAnimation, parabolicKeyframes, playerCloverLeft, playerCloverTop} from '../styles'
import Board from './Board'
import {CLOVER} from './CloverDropArea'
import PlayerPanel from './PlayerPanel'
import Move from '@gamepark/lucky-number/moves/Move'
import { DropTargetMonitor, useDrop } from 'react-dnd'

type Props = {
  player: PlayerState
  index: number
  isMine?: boolean
  activePlayer:boolean
  isAnyWinner:boolean
  nbPlayers:number
  isSetupPhase:boolean
  cloversDiscarded:Clover[]
}

export default function PlayerDisplay({player, index, isMine, activePlayer, isAnyWinner, nbPlayers, isSetupPhase, cloversDiscarded}: Props) {

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
  const placeCloverAnimation = useAnimation<PlaceClover>(animation => isPlaceClover(animation.move))

  const displayPosition = getDisplayPosition(playerId, index, nbPlayers)

  return (
    <>
      <PlayerPanel playerInfo={playerInfo} index={displayPosition} activePlayer={activePlayer && !isAnyWinner} />
      <Board itemDrag={canDrop} garden={player.garden} idGarden={index} isMine={isMine} isSetupPhase={isSetupPhase} cloversDiscarded={cloversDiscarded} playerPosition={displayPosition} css={boardPosition(displayPosition)}/>
      {player.clovers.map((clover, cloverIndex) =>
        <Draggable key={`${clover.color} ${clover.number}`} 
        type={CLOVER} 
        item={clover} 
        css={[cloverPosition(displayPosition, cloverIndex), 
              (isCloverAnimated(clover, placeCloverAnimation)) && (placeCloverAnimation!.move.row === -1
                ? discardCloverTranslation(placeCloverAnimation!.duration, cloversDiscarded.length) 
                : placeCloverTranslation(placeCloverAnimation!.duration, displayPosition, placeCloverAnimation!.move.row, placeCloverAnimation!.move.column))
              ]} 
        canDrag={isMine} 
        drop={play}>
          <CloverImage clover={clover} 
                       css={[isMine && canDragStyle]} />
        </Draggable>
      )}

      {tutorial !== undefined && isMine && getLadyBugStart(actionsNumber) !== undefined && <Picture src={Images.ladybug} css={[ladybugStyle(getLadyBugStart(actionsNumber)!), canDrop && ladyBugMove(getLadyBugMove(actionsNumber)!)]} />}

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
  left: ${(nbDiscarded%6) * (cloverSize + 1) + 66}em;
  top: ${Math.floor(nbDiscarded/6)*(cloverSize +1) + 66}em;
}
`

const placeCloverKeyframes = (playerPosition:number, row:number, column:number) => keyframes`
from{}
to{
  left:${boardLeft(playerPosition) + boardMargin + (cloverSize+1)*row}em;
  top:${boardTop(playerPosition) + boardMargin + (cloverSize+1)*column}em;
}
`

const placeCloverTranslation = (duration:number, playerPosition:number, row:number, column:number) => css`
  animation: ${placeCloverKeyframes(playerPosition, row, column)} ${duration}s ease-in-out forwards;
`

const boardPosition = (index: number) => css`
  left: ${boardLeft(index)}em;
  top: ${boardTop(index)}em;
  transform-style:preserve-3d;
`

const cloverPosition = (playerIndex: number, index: number) => css`
  position: absolute;
  width: ${cloverSize}em;
  height: ${cloverSize}em;
  left: ${playerCloverLeft(playerIndex)}em;
  top: ${playerCloverTop(playerIndex, index)}em;
  transform-style:preserve-3d;
`

const ladybugStyle = (pos:{top:number, left:number}) => css`
  position:absolute;
  pointer-events:none;
  filter: drop-shadow(0 0 0.3em black);
  left:${boardLeft(0) + pos.left}em;
  top:${boardTop(0) + pos.top}em;
  height:4.5em;
  z-index:10;
  opacity:1;
`

function getLadyBugStart(action:number):{top:number, left:number}|undefined{
  switch(action){
    case 0: return {top:8,left:40}
    case 1: return {top:0,left:40}
    case 2: return {top:0,left:40}
    case 3: return {top:0,left:40}
    case 4: return {top:-15,left:70}
    case 5: return {top:0,left:40}
    case 6: return {top:6,left:55}
    case 8: return {top:0,left:40}
    case 10: return {top:0,left:40}
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

const ladyBugMove = (pos:{X:number, Y:number, rot:number}) => css`
  animation:${ladybugMoveKF(pos)} 2s ease-in-out infinite;
`

function getLadyBugMove(action:number):{X:number, Y:number, rot:number}|undefined{
  switch(action){
    case 0: return {X:-36, Y:-5, rot:Math.atan(-36/5)*(180/Math.PI)}
    case 1: return {X:-28, Y:10, rot:180+Math.atan(-28/-10)*(180/Math.PI)}
    case 2: return {X:-20, Y:18, rot:180+Math.atan(-20/-18)*(180/Math.PI)}
    case 3: return {X:-12, Y:26, rot:180+Math.atan(-12/-26)*(180/Math.PI)}
    case 5: return {X:-36, Y:10, rot:180+Math.atan(-36/-10)*(180/Math.PI)}
    case 6: return {X:-43, Y:-3, rot:Math.atan(-43/3)*(180/Math.PI)}
    case 8: return {X:-12, Y:26, rot:180+Math.atan(-12/-26)*(180/Math.PI)}
    case 10: return {X:33, Y:17, rot:180+Math.atan(33/-17)*(180/Math.PI)}
    default: return undefined
  }
}