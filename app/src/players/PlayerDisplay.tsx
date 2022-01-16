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
  isBrunoVariation:boolean
}

export default function PlayerDisplay({player, index, isMine, activePlayer, isAnyWinner, nbPlayers, isSetupPhase, cloversDiscarded, isBrunoVariation}: Props) {

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
  const isAnimation = useAnimation<Move>()

  const displayPosition = getDisplayPosition(playerId, index, nbPlayers)
  const ladybugStart = getLadyBugStart(actionsNumber)
  const ladybugMove = getLadyBugMove(actionsNumber)

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

const replayKF = keyframes`
from{filter:drop-shadow(0 0 0em gold) drop-shadow(0 0 0em gold);}
50%{filter:drop-shadow(0 0 1em gold) drop-shadow(0 0 1em gold);}
to{filter:drop-shadow(0 0 0em gold) drop-shadow(0 0 0em gold);}
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

const ladyBugWaitingKF = (top:number) => keyframes`
  from{
    transform:rotateZ(0deg) translate(${top === -15 ? 13 : 3}em);
  }
  to{
    transform:rotateZ(-360deg) translate(${top === -15 ? 13 : 3}em);
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
  pointer-events:none;
  filter: drop-shadow(0 0 0.3em black);
  left:${boardLeft(0) + pos.left}em;
  top:${boardTop(0) + pos.top}em;
  height:4.5em;
  z-index:10;
  opacity:1;
  animation:${ladyBugEntryKF} 2s linear, ${ladyBugWaitingKF(pos.top)} 2s linear infinite;
`

function getLadyBugStart(action:number):{top:number, left:number}|undefined{
  switch(action){
    case 0: return {top:10,left:38}
    case 1: return {top:2.5,left:38}
    case 2: return {top:2.5,left:38}
    case 3: return {top:2.5,left:38}
    case 4: return {top:-15,left:70}
    case 5: return {top:2.5,left:38}
    case 6: return {top:9,left:53}
    case 8: return {top:2.5,left:38}
    case 10: return {top:2.5,left:38}
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
    case 0: return {X:-35, Y:-7, rot:Math.atan(-35/7)*(180/Math.PI)}
    case 1: return {X:-26, Y:8, rot:180+Math.atan(-26/-8)*(180/Math.PI)}
    case 2: return {X:-19, Y:17, rot:180+Math.atan(-19/-17)*(180/Math.PI)}
    case 3: return {X:-11, Y:25, rot:180+Math.atan(-11/-25)*(180/Math.PI)}
    case 5: return {X:-35, Y:9, rot:180+Math.atan(-35/-9)*(180/Math.PI)}
    case 6: return {X:-42, Y:-6, rot:Math.atan(-42/6)*(180/Math.PI)}
    case 8: return {X:-11, Y:25, rot:180+Math.atan(-11/-25)*(180/Math.PI)}
    case 10: return {X:34, Y:15, rot:180+Math.atan(34/-15)*(180/Math.PI)}
    default: return undefined
  }
}