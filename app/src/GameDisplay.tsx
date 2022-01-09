/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameView from '@gamepark/lucky-number/GameView'
import CloverColor from '@gamepark/lucky-number/material/CloverColor'
import {usePlayerId} from '@gamepark/react-client'
import {Letterbox} from '@gamepark/react-components'
import CloverImage from './clovers/CloverImage'
import DrawPile from './clovers/DrawPile'
import FaceUpClovers from './clovers/FaceUpClovers'
import PlayerDisplay from './players/PlayerDisplay'
import {parabolicAnimation} from './styles'

type Props = {
  game: GameView
}

export default function GameDisplay({game}: Props) {
  const playerId = usePlayerId<number>()

  return (
    <Letterbox css={letterBoxStyle} top={0}>
      <div css={givePerspective}>
        {game.players.map((player, index) => 
          <PlayerDisplay key={index} 
                         player={player} 
                         index={index} 
                         isMine={playerId !== undefined && index === playerId-1} 
                         activePlayer={game.activePlayer === index+1 || game.activePlayer === undefined} 
                         nbPlayers={game.players.length} 
                         isSetupPhase={game.activePlayer === undefined}
                         cloversDiscarded={game.faceUpClovers} />
        )}
        <DrawPile 
          size={game.faceDownClovers} 
          canDraw={playerId !== undefined && game.activePlayer === playerId && game.players[playerId - 1].clovers.length === 0}
          activePlayer={game.activePlayer}
          nbPlayers={game.players.length}
          />
        <FaceUpClovers 
          clovers={game.faceUpClovers} 
          canDrag={playerId !== undefined && game.activePlayer === playerId && game.players[playerId-1].clovers.length === 0} 
          activePlayer={game.activePlayer}
          cloversInHand={playerId === undefined ? undefined : game.players[playerId-1].clovers}
          nbPlayers={game.players.length}
          />
      </div>
    </Letterbox>
  )
}

const testTranslation = css`
  width:5em;
  height:5em;
  position:absolute;
  top:30em;
  left:30em;
  transform:translateZ(0em);
`

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
  position:relative;
  transform: rotateX(10deg);
  transform-style:preserve-3d;
`
