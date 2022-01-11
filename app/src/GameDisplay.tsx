/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import GameView from '@gamepark/lucky-number/GameView'
import {usePlayerId, useTutorial} from '@gamepark/react-client'
import {Letterbox, Picture} from '@gamepark/react-components'
import DrawPile from './clovers/DrawPile'
import FaceUpClovers from './clovers/FaceUpClovers'
import Images from './Images'
import { isWinner } from './players/Board'
import PlayerDisplay, { getDisplayPosition } from './players/PlayerDisplay'
import TutorialPopup from './tutorial/TutorialPopUp'

type Props = {
  game: GameView
}

export default function GameDisplay({game}: Props) {
  const playerId = usePlayerId<number>()
  const tutorial = useTutorial()

  return (
    <Letterbox css={letterBoxStyle} top={0}>
      <div css={givePerspective}>
        {game.players.map((player, index) => 
          <PlayerDisplay key={index} 
                         player={player} 
                         index={index} 
                         isMine={playerId !== undefined && index === playerId-1} 
                         activePlayer={game.activePlayer === index+1 || game.activePlayer === undefined} 
                         isAnyWinner={game.players.some(p => isWinner(p.garden))}
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

        {game.activePlayer !== undefined && <Picture src={Images.ladybug} css={[ladybugStyle(getDisplayPosition(playerId, game.activePlayer-1, game.players.length)) ]} />}
      </div>

      {tutorial && <TutorialPopup game={game} tutorial={tutorial}/>}

    </Letterbox>
  )
}

const ladybugStyle = (activePlayer:number) => css`
position:absolute;
filter: drop-shadow(0 0 0.3em black);
left:87em;
top:45.4em;
height:4.5em;
transition:transform 1s ease-in-out;

transform:rotateZ(${getLadyBugRotation(activePlayer)}deg) translateX(-73em);
`

function getLadyBugRotation(index:number):number{
  console.log(index)
  switch(index){
    case 0:return -4
    case 1:return 4
    case 2:return 180
    case 3:return 185
    default:return 0
  }
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
  position:relative;
  transform: rotateX(10deg);
  transform-style:preserve-3d;
`
