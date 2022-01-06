/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import PlayerState from '@gamepark/lucky-number/PlayerState'
import {usePlay, usePlayer, usePlayerId} from '@gamepark/react-client'
import {Draggable} from '@gamepark/react-components'
import CloverImage from '../clovers/CloverImage'
import {boardLeft, boardTop, cloverSize, playerCloverLeft, playerCloverTop} from '../styles'
import Board from './Board'
import {CLOVER} from './CloverDropArea'
import PlayerPanel from './PlayerPanel'

type Props = {
  player: PlayerState
  index: number
  isMine?: boolean
  activePlayer:boolean
  nbPlayers:number
}

export default function PlayerDisplay({player, index, isMine, activePlayer, nbPlayers}: Props) {

  const playerId = usePlayerId<number>()
  const playerInfo = usePlayer(index+1)
  const play = usePlay()

  return (
    <>
      <PlayerPanel playerInfo={playerInfo} index={getDisplayPosition(playerId, index, nbPlayers)} activePlayer={activePlayer} />
      <Board garden={player.garden} isMine={isMine} css={boardPosition(getDisplayPosition(playerId, index, nbPlayers))}/>
      {player.clovers.map((clover, cloverIndex) =>
        <Draggable key={`${clover.color} ${clover.number}`} type={CLOVER} item={clover} css={cloverPosition(getDisplayPosition(playerId, index, nbPlayers), cloverIndex)} canDrag={isMine} drop={play}>
          <CloverImage clover={clover}/>
        </Draggable>
      )}
    </>
  )
}

function getDisplayPosition(playerId:number|undefined, index:number, nbPlayers:number):number{
  if (playerId === undefined){
    return nbPlayers === 2 ? index*2 : index
  } else {
    return nbPlayers === 2 ? ((index -playerId+1+nbPlayers)%nbPlayers)*3 : (index -playerId+1+nbPlayers)%nbPlayers
  } 
}

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
