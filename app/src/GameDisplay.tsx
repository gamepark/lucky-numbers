/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameView from '@gamepark/lucky-number/GameView'
import {usePlayerId} from '@gamepark/react-client'
import {Letterbox} from '@gamepark/react-components'
import DrawPile from './clovers/DrawPile'
import FaceUpClovers from './clovers/FaceUpClovers'
import PlayerDisplay from './players/PlayerDisplay'

type Props = {
  game: GameView
}

export default function GameDisplay({game}: Props) {
  const playerId = usePlayerId<number>()

  return (
    <Letterbox css={letterBoxStyle} top={0}>
      <div css={givePerspective}>
        {game.players.map((player, index) => <PlayerDisplay key={index} player={player} index={index} isMine={playerId !== undefined && index === playerId-1} activePlayer={game.activePlayer === index+1 || game.activePlayer === undefined} nbPlayers={game.players.length} />)}
        <DrawPile size={game.faceDownClovers} canDraw={playerId !== undefined && game.activePlayer === playerId && game.players[playerId - 1].clovers.length === 0}/>
        <FaceUpClovers clovers={game.faceUpClovers}/>
      </div>
    </Letterbox>
  )
}

const fadeIn = keyframes`
  from, 50% {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`

const letterBoxStyle = css`
  animation: ${fadeIn} 3s ease-in forwards;

  > div {
    perspective: 100em;
  }
`

const givePerspective = css`
  transform: rotateX(10deg);
`
