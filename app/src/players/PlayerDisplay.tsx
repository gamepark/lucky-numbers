/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import Clover from '@gamepark/lucky-number/material/Clover'
import PlaceClover, { isPlaceClover } from '@gamepark/lucky-number/moves/PlaceClover'
import PlayerState from '@gamepark/lucky-number/PlayerState'
import {Animation, useAnimation, usePlay, usePlayer, usePlayerId} from '@gamepark/react-client'
import {Draggable} from '@gamepark/react-components'
import CloverImage from '../clovers/CloverImage'
import {boardLeft, boardTop, canDragStyle, cloverSize, playerCloverLeft, playerCloverTop} from '../styles'
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
}

export default function PlayerDisplay({player, index, isMine, activePlayer, nbPlayers, isSetupPhase}: Props) {

  const playerId = usePlayerId<number>()
  const playerInfo = usePlayer(index+1)
  const play = usePlay()
  const placeCloverAnimation = useAnimation<PlaceClover>(animation => isPlaceClover(animation.move))

  const displayPosition = getDisplayPosition(playerId, index, nbPlayers)

  return (
    <>
      <PlayerPanel playerInfo={playerInfo} index={displayPosition} activePlayer={activePlayer} />
      <Board garden={player.garden} isMine={isMine} isSetupPhase={isSetupPhase} css={boardPosition(displayPosition)}/>
      {player.clovers.map((clover, cloverIndex) =>
        <Draggable key={`${clover.color} ${clover.number}`} type={CLOVER} item={clover} css={cloverPosition(displayPosition, cloverIndex)} canDrag={isMine} drop={play}>
          <CloverImage clover={clover} css={[isMine && canDragStyle, (isCloverAnimated(clover, placeCloverAnimation)) && placeCloverTranslation(placeCloverAnimation!.duration,cloverIndex, displayPosition, placeCloverAnimation!.move.row, placeCloverAnimation!.move.column)]} />
        </Draggable>
      )}
    </>
  )
}

function isCloverAnimated(clover:Clover, animation:Animation<PlaceClover>|undefined):boolean{
  return animation !== undefined && animation.move.clover.color === clover.color && animation.move.clover.number === clover.number
}

function getDisplayPosition(playerId:number|undefined, index:number, nbPlayers:number):number{
  if (playerId === undefined){
    return nbPlayers === 2 ? index*2 : index
  } else {
    return nbPlayers === 2 ? ((index -playerId+1+nbPlayers)%nbPlayers)*3 : (index -playerId+1+nbPlayers)%nbPlayers
  } 
}

const placeCloverKeyframes = (index:number, playerPosition:number, row:number, column:number) => keyframes`
from{}
to{
  transform:translateX(${(playerPosition<2 ? -3.18 : 1)*11 + column*(cloverSize+1)}em) translateY(${(playerPosition === 1 || playerPosition === 2 ? (-3+index) : (-index))*(cloverSize+1) + row*(cloverSize+1)}em);
}
`

const placeCloverTranslation = (duration:number, index:number, playerPosition:number, row:number, column:number) => css`
  animation: ${placeCloverKeyframes(index, playerPosition, row, column)} ${duration}s ease-in-out forwards;
`

const boardPosition = (index: number) => css`
  left: ${boardLeft(index)}em;
  top: ${boardTop(index)}em;
`

const cloverPosition = (playerIndex: number, index: number) => css`
  position: absolute;
  width: ${cloverSize}em;
  height: ${cloverSize}em;
  left: ${playerCloverLeft(playerIndex)}em;
  top: ${playerCloverTop(playerIndex, index)}em;
`
