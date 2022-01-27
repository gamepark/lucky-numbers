/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import {usePlayerId, useTutorial} from '@gamepark/react-client'
import {Letterbox, Picture} from '@gamepark/react-components'
import { useEffect, useState } from 'react'
import DrawPile from './clovers/DrawPile'
import FaceUpClovers from './clovers/FaceUpClovers'
import GameLocalView from './GameLocalView'
import Images from './Images'
import { isWinner } from './players/Board'
import PlayerDisplay, { getDisplayPosition } from './players/PlayerDisplay'
import { AudioLoader } from './sounds/AudioLoader'
import LuckyNumbersSounds from './sounds/LuckyNumbersSounds'
import TutorialPopup from './tutorial/TutorialPopUp'
import WelcomePopUp from './WelcomePopup'

type Props = {
  game: GameLocalView
  audioLoader: AudioLoader
}

export default function GameDisplay({game, audioLoader}: Props) {
  const playerId = usePlayerId<number>()
  const tutorial = useTutorial()

  const [ladybugPosition, setLadybugPosition] = useState<number>(0)
  const [welcomePopUpClosed, setWelcomePopUpClosed] = useState(tutorial ? true : game.activePlayer !== undefined)
  const showWelcomePopup = !welcomePopUpClosed

  useEffect(() => {
    if(game.activePlayer !== undefined)
    setLadybugPosition(ladybugPosition + getLadyBugIncrement(getDisplayPosition(playerId, game.activePlayer-1 , game.players.length), ladybugPosition, game.players.length))
  },[game.activePlayer])
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
                         cloversDiscarded={game.faceUpClovers}
                         isBrunoVariant={game.isBrunoVariant === true} 
                         cloverSelected={game.selectedClover} />
        )}
        <DrawPile 
          size={game.faceDownClovers} 
          canDraw={playerId !== undefined && game.activePlayer === playerId && game.players[playerId - 1].clovers.length === 0 && game.players.find(p => isWinner(p.garden)) === undefined}
          activePlayer={game.activePlayer}
          nbPlayers={game.players.length}
          />
        <FaceUpClovers 
          clovers={game.faceUpClovers} 
          canDrag={playerId !== undefined && game.activePlayer === playerId && game.players[playerId-1].clovers.length === 0 && game.players.find(p => isWinner(p.garden)) === undefined} 
          activePlayer={game.activePlayer}
          cloversInHand={playerId === undefined ? undefined : game.players[playerId-1].clovers}
          nbPlayers={game.players.length}
          isBrunoVariant={game.isBrunoVariant === true}
          cloverSelected={game.selectedClover}
          players={game.players}
          />

        {game.activePlayer !== undefined && <Picture src={Images.ladybug} css={[ladybugStyle(ladybugPosition) ]} />}
        
      </div>

      {(game.isBrunoVariant === true || game.isMichaelVariant === true) && showWelcomePopup && <WelcomePopUp isBruno={game.isBrunoVariant === true} isMichael={game.isMichaelVariant === true} close={() => setWelcomePopUpClosed(true)} /> }

      {tutorial && <TutorialPopup game={game} tutorial={tutorial}/>}

      <LuckyNumbersSounds audioLoader={audioLoader} game={game} />

    </Letterbox>
  )
}

const ladybugStyle = (ladyBug:number) => css`
position:absolute;
filter: drop-shadow(0 0 0.3em black);
left:87em;
top:45.4em;
height:4.5em;
transition:transform 2s ease-in-out;

transform:rotateZ(${ladyBug}deg) translateX(-73em) translateZ(0.02em);
`

function getLadyBugIncrement(index:number, ladyBug:number, nbPlayers:number):number{
  if(ladyBug === 0){
    switch(index){
      case 0:return -4
      case 1:return 4
      case 2:return 180
      case 3:return 185
      default:return 0
    }
  } else {
    switch(index){
      case 0:return nbPlayers === 3 ? 176 : 172
      case 1:return 8
      case 2:return 176
      case 3:return nbPlayers === 2 ? 188 : 4
      default:return 0
    }
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
