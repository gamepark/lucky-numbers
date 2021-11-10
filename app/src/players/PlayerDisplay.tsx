/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import PlayerState from '@gamepark/lucky-number/PlayerState'
import {usePlay} from '@gamepark/react-client'
import {Draggable} from '@gamepark/react-components'
import CloverImage from '../clovers/CloverImage'
import {boardLeft, boardTop, cloverSize, playerCloverLeft, playerCloverTop} from '../styles'
import Board from './Board'
import {CLOVER} from './CloverDropArea'

type Props = {
  player: PlayerState
  index: number
  isMine?: boolean
}

export default function PlayerDisplay({player, index, isMine}: Props) {
  const play = usePlay()
  return (
    <>
      <Board garden={player.garden} isMine={isMine} css={boardPosition(index)}/>
      {player.clovers.map((clover, cloverIndex) =>
        <Draggable key={`${clover.color} ${clover.number}`} type={CLOVER} item={clover} css={cloverPosition(index, cloverIndex)} canDrag={isMine} drop={play}>
          <CloverImage clover={clover}/>
        </Draggable>
      )}
    </>
  )
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
