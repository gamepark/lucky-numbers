/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import Clover, { isSameClover } from '@gamepark/lucky-number/material/Clover'
import PlaceClover, { isPlaceClover } from '@gamepark/lucky-number/moves/PlaceClover'
import PlayerState from '@gamepark/lucky-number/PlayerState'
import {Animation, useAnimation, usePlay, usePlayer, usePlayerId} from '@gamepark/react-client'
import {Draggable} from '@gamepark/react-components'
import CloverImage from '../clovers/CloverImage'
import {boardLeft, boardMargin, boardTop, canDragStyle, cloverSize, parabolicAnimation, parabolicKeyframes, playerCloverLeft, playerCloverTop} from '../styles'
import Board from './Board'
import {CLOVER} from './CloverDropArea'
import PlayerPanel from './PlayerPanel'

type Props = {
  player: PlayerState
  index: number
  isMine?: boolean
  activePlayer:boolean
  nbPlayers:number
  isSetupPhase:boolean
  cloversDiscarded:Clover[]
}

export default function PlayerDisplay({player, index, isMine, activePlayer, nbPlayers, isSetupPhase, cloversDiscarded}: Props) {

  const playerId = usePlayerId<number>()
  const playerInfo = usePlayer(index+1)
  const play = usePlay()
  const placeCloverAnimation = useAnimation<PlaceClover>(animation => isPlaceClover(animation.move))

  const displayPosition = getDisplayPosition(playerId, index, nbPlayers)

  return (
    <>
      <PlayerPanel playerInfo={playerInfo} index={displayPosition} activePlayer={activePlayer} />
      <Board garden={player.garden} idGarden={index} isMine={isMine} isSetupPhase={isSetupPhase} cloversDiscarded={cloversDiscarded} playerPosition={displayPosition} css={boardPosition(displayPosition)}/>
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
  left:${boardLeft(playerPosition) + boardMargin + (cloverSize+1)*column}em;
  top:${boardTop(playerPosition) + boardMargin + (cloverSize+1)*row}em;
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
