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
import VariantCard from './VariantCard'


type Props = {
  game: GameLocalView
  audioLoader: AudioLoader
}

export default function GameDisplay({game, audioLoader}: Props) {
  const playerId = usePlayerId<number>()
  const tutorial = useTutorial()

  const [playerLadybugPos, setPlayerLadybugPos] = useState<number|undefined>(undefined)
  const [opponentLadybugPos, setOpponentLadybugPos] = useState<number|undefined>(undefined)
  const [variantCardClosed, setVariantCardClosed] = useState((game.isBrunoVariant === true || game.isMichaelVariant === true) ? false : true)
  const showVariantCard = !variantCardClosed

  useEffect(() => {
    if(game.activePlayer !== undefined){
      playerLadybugPos === undefined 
        ? setPlayerLadybugPos(90 * getDisplayPosition(playerId, game.activePlayer-1, game.players.length))
        : setPlayerLadybugPos(playerLadybugPos+360/game.players.length)
    }
  },[game.activePlayer])

  useEffect(() => {
    if(game.activePlayer !== undefined){
      opponentLadybugPos === undefined 
        ? setOpponentLadybugPos(getInitialOpponentLadybugRot(getDisplayPosition(playerId, game.activePlayer-1, game.players.length)))
        : setOpponentLadybugPos(opponentLadybugPos + getIncrementOpponentLadybugRot(getDisplayPosition(playerId, game.activePlayer-1, game.players.length), game.players.length))
    }
  },[game.activePlayer])
   

  return (
    <>
    {(game.isBrunoVariant || game.isMichaelVariant) && <VariantCard css={[fadeInAnim]} isHide={showVariantCard === false} isBruno={game.isBrunoVariant === true} isMichael={game.isMichaelVariant === true} close={() => setVariantCardClosed(true)} open={() => setVariantCardClosed(false)} />}
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

          <DrawPile 
            size={game.faceDownClovers} 
            canDraw={playerId !== undefined && game.activePlayer === playerId && game.players[playerId - 1].clovers.length === 0 && game.players.find(p => isWinner(p.garden)) === undefined}
            activePlayer={game.activePlayer}
            nbPlayers={game.players.length}
          />





        {game.activePlayer !== undefined && playerLadybugPos !== undefined && <Picture src={Images.ladybug} css={[playerLadybugStyle(playerLadybugPos) ]} />}
        {game.activePlayer !== undefined && opponentLadybugPos !== undefined && <Picture src={Images.ladybug} css={[opponentLadybugStyle(opponentLadybugPos, game.activePlayer === playerId) ]} />}


      </div>

      {tutorial && <TutorialPopup game={game} tutorial={tutorial}/>}

      <LuckyNumbersSounds audioLoader={audioLoader} game={game} />

    </Letterbox>
    </>
  )
}

const playerLadybugStyle = (ladybug:number) => css`
position:absolute;
filter: drop-shadow(0 0 0.3em black);
pointer-events:none;
left:120em;
top:40em;
transform:rotateZ(${ladybug}deg) translateX(-105em);
height:4.5em;
transition:all 1.5s ease-in-out;
`

const opponentLadybugStyle = (ladybug:number, isHidden:boolean) => css`
position:absolute;
opacity:${isHidden ? 0 : 1};
pointer-events:none;
filter: drop-shadow(0 0 0.3em black);
top:58em;
left:119em;
transform:rotateZ(${ladybug}deg) translateX(-42em) translateZ(0.02em) ;
height:4.5em;
transition:all 1.5s ease-in-out;
`

function getInitialOpponentLadybugRot(ladybug:number):number{
  switch(ladybug){
    case 0: return 270
    case 1: return 22
    case 2: return 164
    case 3: return 172
    default: return 0
  }
}

function getIncrementOpponentLadybugRot(ladybug:number, nbPlayers:number):number{
  switch(ladybug){
    case 0: return nbPlayers === 4 ? 98 : nbPlayers === 3 ? 106 : 98
    case 1: return 112
    case 2: return 142
    case 3: return nbPlayers === 4 ? 8 : 262
    default: return 0
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

const fadeInAnim = css`
  animation: ${fadeIn} 3s ease-in forwards;
`

const givePerspective = css`
  position:relative;
  transform: rotateX(10deg);
  transform-style:preserve-3d;
`
