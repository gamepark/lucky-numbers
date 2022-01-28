/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import Clover, { isSameClover } from '@gamepark/lucky-numbers/material/Clover'
import CloverColor from '@gamepark/lucky-numbers/material/CloverColor'
import Move from '@gamepark/lucky-numbers/moves/Move'
import PlaceClover, {isBrunoVariantTrigger, isPlaceClover, placeCloverMove} from '@gamepark/lucky-numbers/moves/PlaceClover'
import {Garden, isValidPosition} from '@gamepark/lucky-numbers/PlayerState'
import {Animation, useActions, useAnimation, usePlay, usePlayerId, useSound, useTutorial} from '@gamepark/react-client'
import {Fragment, HTMLAttributes} from 'react'
import { useTranslation } from 'react-i18next'
import { ResetSelectedClover, resetSelectedCloverMove } from '../localMoves/setSelectedClover'
import CloverImage from '../clovers/CloverImage'
import Images from '../Images'
import {cloverSize} from '../styles'
import CloverDropArea from './CloverDropArea'
import moveSound from '../sounds/moveTile.mp3';

type Props = {
  garden: Garden
  idGarden:number
  isMine?: boolean
  isSetupPhase: boolean
  cloversDiscarded:Clover[]
  playerPosition:number
  itemDrag:Clover
  isBrunoVariant:boolean
  selectedClover?:Clover
  cloverInHand:Clover[]
} & HTMLAttributes<HTMLDivElement>

export default function Board({garden, idGarden, isMine, isSetupPhase, cloversDiscarded, playerPosition, itemDrag, isBrunoVariant, selectedClover, cloverInHand, ...props}: Props) {
  const tutorial = useTutorial()
  const playerId = usePlayerId()
  const actions = useActions<Move, number>()
  const actionsNumber = actions !== undefined ? actions.filter(action => action.playerId === playerId).length : 0
  const placeCloverAnimation = useAnimation<PlaceClover>(animation => isPlaceClover(animation.move) && animation.move.column !== -1)
  const isBrunoVariantAnim = placeCloverAnimation !== undefined && placeCloverAnimation.move.playerId === idGarden+1 && isBrunoVariantTrigger(garden, placeCloverAnimation.move.row, placeCloverAnimation.move.column, placeCloverAnimation.move.clover, isBrunoVariant)
  
  const moveCloverSound = useSound(moveSound)
  moveCloverSound.volume = 0.6

  const playResetSelectedClover = usePlay<ResetSelectedClover>()

  function isDiagAdjacentSameClover(clover:Clover|null, animClover:Clover, animRow:number, animColumn:number):boolean{
    const cloverBelow:Clover|null = animRow-1>=0 && animColumn+1<=3 ? garden[animRow-1][animColumn+1] : null
    const cloverOver:Clover|null = animRow+1<=3 && animColumn-1>=0 ? garden[animRow+1][animColumn-1] : null
    return clover !== null && (clover.number === cloverBelow?.number || clover.number === cloverOver?.number) && clover.number === animClover.number
  }

  function playPlaceClover(playerId:number, clover:Clover, row:number, column:number):PlaceClover{
    moveCloverSound.play()
    playResetSelectedClover(resetSelectedCloverMove(), {local:true})
    return placeCloverMove(playerId, clover, row, column)
  }

  function howManyCloversPlacedBefore(row:number):number{
    let result:number = 0
    for(let i=0;i<=row;i++){
      if(garden[i][i]){
        result++}
    }
    return result
  }

  const {t} = useTranslation()

  const sortedCloversInHand = [...cloverInHand].sort((a:Clover,b:Clover) => a.number-b.number)
  
  return (
    <div css={[style, isMine && itemDrag !== null && !isGoodCloverGoodTime({color:itemDrag.color,number:itemDrag.number}, actionsNumber) && tutorial !== undefined && wrongCloverTutoStyle(t(actionsNumber === 10 ? "Put in discard !" : "Not good clover !"))]} {...props}>
      {garden.map((line, row) =>
        line.map((clover, column) =>
          <Fragment key={`${row} ${column}`}>
            {clover && <div css={[css`position:absolute;width:${cloverSize}em;height:${cloverSize}em;`, position(row, column),
                                    isCloverAnimated(row, column, placeCloverAnimation) && placeCloverAnimation!.move.playerId === idGarden+1 && clover !== null && discardCloverTranslation(placeCloverAnimation!.duration, cloversDiscarded.length - (cloversDiscarded.find(clover => isSameClover(clover, placeCloverAnimation!.move.clover)) !== undefined ? 1 : 0), playerPosition),
                                    isBrunoVariantAnim && isDiagAdjacentSameClover(clover, placeCloverAnimation.move.clover, placeCloverAnimation.move.row, placeCloverAnimation.move.column) && replayAnimation(placeCloverAnimation.duration, isMine === true),
                                    isWinner(garden) && jumpingAnimation(row+column),
                                    isWinner(garden) && shinyEffect
                                    ]} ><CloverImage clover={clover} /></div>}
            {isMine && <CloverDropArea canPlaceClover={clover => isValidPosition(garden, clover, row, column, isSetupPhase)}
                                       onDropClover={clover => playPlaceClover(playerId, clover, row, column)}
                                       getBestSetupClover={sortedCloversInHand[row-howManyCloversPlacedBefore(row)]}
                                       isTutorialHighLight = {tutorial !== undefined && itemDrag !== null && isGoodCloverGoodTime({color:itemDrag.color,number:itemDrag.number},actionsNumber) && isInPlaceAndTime(row, column, actionsNumber)}
                                       cloverSelected={selectedClover}
                                       isSetupPhase={isSetupPhase}
                                       cloversInHand={cloverInHand}
                                       css={[position(row, column)]}/>}
          </Fragment>
        )
      )}
    </div>
  )
}

const replayKF = keyframes`
  from,50%{filter: drop-shadow(0 0 0em gold) drop-shadow(0 0 0em gold);}
  to{filter: drop-shadow(0 0 0.5em gold) drop-shadow(0 0 0.5em gold) drop-shadow(0 0 0.5em gold);}
`

const replayAnimation = (duration:number, isPlayerId:boolean) => css`
  animation: ${replayKF} ${duration/10}s linear ${isPlayerId ? 0 : 1 }s infinite alternate;
`

const wrongCloverTutoStyle = (warning:string) => css`
  &:after{
    content:'${warning}';
    display: flex;
    align-items: center;
    justify-content: center;
    text-align:center;
    position: absolute;
    left: 0;
    top: 0;
    width:100%;
    height:100%;
    opacity:0.8;
    border-radius:0.5em;
    background-color:red;
    font-size:5em;
    font-family:'Righteous', cursive;
  }
`

function isGoodCloverGoodTime(clover:Clover, action:number):boolean{
  if(action > 10) return true
  switch(action){
    case 0: return clover.color === CloverColor.Yellow && clover.number === 1 
    case 1: return clover.color === CloverColor.Green && clover.number === 5
    case 2: return clover.color === CloverColor.Yellow && clover.number === 13
    case 3: return clover.color === CloverColor.Green && clover.number === 14
    case 5: return clover.color === CloverColor.Yellow && clover.number === 3
    case 6: return clover.color === CloverColor.Yellow && clover.number === 4
    case 8: return clover.color === CloverColor.Green && clover.number === 20
    default: return false
  }
}

function isInPlaceAndTime(row:number, column:number, action:number):boolean{
  switch(action){
    case 0: return row === 0 && column === 0 
    case 1: return row === 1 && column === 1
    case 2: return row === 2 && column === 2
    case 3: return row === 3 && column === 3
    case 5: return row === 0 && column === 1
    case 6: return row === 1 && column === 0
    case 8: return row === 3 && column === 3
    default: return false
  }
}

export function isWinner(garden:Garden):boolean{
  return garden.every(row => row.every(clover => clover !== null))
}

const jumpingKeyframes = keyframes`
  from,40%{
    transform:translateZ(0em) rotateZ(0deg);
  }
  40%{
    transform:translateZ(4em) rotateZ(0deg);
  }
  60%{
    transform:translateZ(4em) rotateZ(360deg);
  }
  60%,to{
    transform:translateZ(0em) rotateZ(360deg);
  }
`

const jumpingAnimation = (index:number) => css`
  animation: ${jumpingKeyframes} 1.5s ease-in-out ${index/8}s infinite; 
`

const discardCloverTranslation = (duration:number, nbDiscarded:number, playerPos:number) => css`
  animation: ${discardCloverKeyframes(nbDiscarded, playerPos)} ${duration}s ease-in-out forwards;
`

const discardCloverKeyframes = (nbDiscarded:number, playerPos:number) => keyframes`
from{}
to{
  top:${((playerPos === 1 || playerPos === 2) ? 57 : 8) + Math.floor(nbDiscarded/6)*(cloverSize +1)}em;
  left:${0+(playerPos<2 ? (cloverSize+1)*4 + 19: -cloverSize+1 - 56) + (nbDiscarded%6) * (cloverSize + 1)}em;
}
`

function isCloverAnimated(row:number, column:number, animation:Animation<PlaceClover>|undefined):boolean{
  return animation !== undefined && animation && row === animation.move.row && animation.move.column === column
}

const style = css`
  position: absolute;
  width: ${cloverSize * 4.9}em;
  height: ${cloverSize * 4.9}em;
  background-image: url(${Images.board});
  background-size: cover;
  border-radius: 3em;
  box-shadow: 0 0 0.3em black, 0 0 0.3em black, 0 0 0.3em black;
  transform:translateZ(0em);
  transform-style:preserve-3d;
`

const position = (row: number, column: number) => css`
  left: ${(cloverSize + 1) * row + 1.7}em;
  top: ${(cloverSize + 1) * column + 1.7}em;
  &:after {
    content: "";
    opacity:0;
    transition: opacity 1s ease-in-out;
  }
`

const shinyEffect = css`
  &:after {
    content: "";
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    top: 0;
    background-repeat: no-repeat;
    opacity: .5;
    mix-blend-mode: color-dodge;
    border-radius:200px;
    clip-path: polygon(36% 1%, 43% 13%, 57% 13%, 62% 2%, 100% 0, 99% 38%, 87% 43%, 87% 56%, 99% 63%, 100% 100%, 62% 99%, 57% 85%, 43% 85%, 39% 99%, 0 100%, 3% 61%, 14% 56%, 14% 42%, 2% 38%, 0% 0%);
  }

  &:after {
    opacity: 1;
    background-image: url(${Images.shinyBG}), linear-gradient(125deg, #ff008450 15%, #fca40040 30%, #ffff0030 40%, #00ff8a20 60%, #00cfff40 70%, #cc4cfa50 85%) ;
    background-position: 50% 50%;
    background-size: 800%,100%;
    background-blend-mode: overlay;
    z-index: 2;
    filter: brightness(1) contrast(1);
    mix-blend-mode: color-dodge;
  }  
`
