/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import Clover, { isSameClover } from '@gamepark/lucky-number/material/Clover'
import PlaceClover, {isPlaceClover, placeCloverMove} from '@gamepark/lucky-number/moves/PlaceClover'
import {Garden, isValidPosition} from '@gamepark/lucky-number/PlayerState'
import {Animation, useAnimation, usePlayerId} from '@gamepark/react-client'
import {Fragment, HTMLAttributes} from 'react'
import CloverImage from '../clovers/CloverImage'
import Images from '../Images'
import {cloverSize} from '../styles'
import CloverDropArea from './CloverDropArea'

type Props = {
  garden: Garden
  idGarden:number
  isMine?: boolean
  isSetupPhase: boolean
  cloversDiscarded:Clover[]
  playerPosition:number
} & HTMLAttributes<HTMLDivElement>

export default function Board({garden, idGarden, isMine, isSetupPhase, cloversDiscarded, playerPosition, ...props}: Props) {
  const playerId = usePlayerId()
  const placeCloverAnimation = useAnimation<PlaceClover>(animation => isPlaceClover(animation.move) && animation.move.column !== -1 && garden[animation.move.row][animation.move.column] !== null)
  return (
    <div css={style} {...props}>
      {garden.map((line, row) =>
        line.map((clover, column) =>
          <Fragment key={`${row} ${column}`}>
            {clover && <div css={[css`position:absolute;width:${cloverSize}em;height:${cloverSize}em;`, position(row, column),
                                    isCloverAnimated(row, column, placeCloverAnimation) && placeCloverAnimation!.move.playerId === idGarden+1 && discardCloverTranslation(placeCloverAnimation!.duration, cloversDiscarded.length - (cloversDiscarded.find(clover => isSameClover(clover, placeCloverAnimation!.move.clover)) !== undefined ? 1 : 0), playerPosition),
                                    isWinner(garden) && jumpingAnimation(row+column),
                                    isWinner(garden) && shinyEffect
                                    ]} ><CloverImage clover={clover} /></div>}
            {isMine && <CloverDropArea canPlaceClover={clover => isValidPosition(garden, clover, row, column, isSetupPhase)}
                                       onDropClover={clover => placeCloverMove(playerId, clover, row, column)}
                                       css={[position(row, column)]}/>}
          </Fragment>
        )
      )}
    </div>
  )
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
  transform-style:preserve-3d;
`

const position = (row: number, column: number) => css`
  left: ${(cloverSize + 1) * row + 1.7}em;
  top: ${(cloverSize + 1) * column + 1.7}em;
`

const shinyEffect = css`
  &:before,
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
    transition: all .33s ease;
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
    transition: all .33s ease;
    mix-blend-mode: color-dodge;
  }  
`
