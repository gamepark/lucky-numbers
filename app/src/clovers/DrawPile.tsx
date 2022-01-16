/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import CloverColor from '@gamepark/lucky-number/material/CloverColor'
import {drawCloverMove, DrawView, isDrawClover} from '@gamepark/lucky-number/moves/DrawClover'
import { Garden } from '@gamepark/lucky-number/PlayerState'
import {Animation, useAnimation, usePlay, usePlayerId} from '@gamepark/react-client'
import {useEffect, useState} from 'react'
import { getDisplayPosition } from '../players/PlayerDisplay'
import {canDragStyle, cloverSize, headerHeight, opacityKeyframe, playerCloverLeft, playerCloverTop} from '../styles'
import CloverImage from './CloverImage'

type Props = {
  size: number
  canDraw: boolean
  activePlayer:number|undefined
  nbPlayers:number
}

export default function DrawPile({size, canDraw, activePlayer, nbPlayers}: Props) {
  const play = usePlay()
  const playerId = usePlayerId()
  const [positions, setPositions] = useState<(CssPosition)[]>([...new Array(size)].map(() => ({radius: Math.random(), direction: Math.random(), rotation: Math.random()})))
  const [indexDrew, setIndexDrew] = useState(-10)
  const drawCloverAnimation = useAnimation<DrawView>(animation => isDrawClover(animation.move))

  function playDrawMove(index:number){
    setIndexDrew(index)
    play(drawCloverMove, {delayed: true})
  }

  useEffect(() => { // We have to refresh the position array and removing the good clover, as it was the array on which clovers are mapped for display.
    if(drawCloverAnimation === undefined){
      const newArray = [...positions]
      if(indexDrew !== -10){
        newArray[indexDrew] = {direction:null,radius:null,rotation:null}
        setPositions(newArray)
      }
    }
  },[drawCloverAnimation?.duration])

  useEffect(() => {   // We need to get a clover index when other players draw one, which is obviously not guaranted by onClick event
    if(drawCloverAnimation !== undefined && drawCloverAnimation.action.playerId !== playerId){
      const newArray = positions.slice()
      setIndexDrew(newArray.findIndex(isPositionned))
    }
  },[drawCloverAnimation?.duration])
  
  return <>
    {positions.map((cssPos, index) => isPositionned(cssPos) && 
      <div key={index} 
           onClick={canDraw ? () => playDrawMove(index) : undefined}
           css={[cardWrapper,
                 style(positions[index]),
                 drawCloverAnimation !== undefined && activePlayer !== undefined && index === indexDrew && cloverDrewTranslation(drawCloverAnimation.duration, cssPos, getDisplayPosition(playerId, activePlayer-1, nbPlayers), playerId === activePlayer-1),
                 canDraw && drawCloverAnimation === undefined && feedBackAnimation(positions[index].rotation!)]}>
        <div css={[css`transform:rotateY(0deg);`, cloverFace, canDraw && drawCloverAnimation === undefined && canDragStyle]} > <CloverImage /> </div>
        <div css={[css`transform:rotateY(180deg);`, cloverFace]} > <CloverImage  clover={drawCloverAnimation !== undefined ? drawCloverAnimation.move.clover : undefined}  /> </div>
      </div>
    )}

  </>
}

function isPositionned({direction, radius, rotation}: CssPosition):boolean{
  return direction !== null && radius !== null && rotation !== null
}

type CssPosition = {
  radius: number|null
  direction: number|null
  rotation: number|null
} 

const cardWrapper = css`
  position:absolute;
  transform-style:preserve-3d;
  width:${cloverSize}em;
  height:${cloverSize}em; 
`

const cloverFace = css`
  position:absolute;
  top:0;left:0;width:100%;height:100%;
  transform-style: preserve-3d;
  backface-visibility:hidden;
`

const feedBackKeyframes = (rotation:number) => keyframes`
from{transform:translateX(0em) rotateZ(${rotation! * 90}deg) ;}
50%{transform:translateX(0.5em) rotateZ(${-rotation! * 90}deg) ;}
to{transform:translateX(-0.5em) rotateZ(${0}deg) ;}
`

const feedBackAnimation =(rotation:number) => css`
transition:transform 0.4s ease-in-out;
&:hover{
  cursor:pointer;
  z-index:10;
  transform:translateZ(0em) rotateZ(0deg);
}
`

const cloverDrewTranslation = (duration:number, cssPos:CssPosition, posPlayer:number, isPlayerId:boolean) => css`
  z-index:10;
  animation: ${cloverDrewKeyframes(cssPos, posPlayer, isPlayerId)} ${duration}s ease-in-out forwards;
  transform-style:preserve-3d;
`

const cloverDrewKeyframes = ({direction, radius, rotation}:CssPosition, posPlayer:number, isPlayerId:boolean) => keyframes`
from{
  left: ${Math.cos(direction! * 2 * Math.PI) * (radius!+0.1) * 24 + (16 / 9 * 100 - cloverSize) / 2}em;
  top: ${Math.sin(direction! * 2 * Math.PI) * (radius!+0.1) * 24 + 25 + headerHeight + 3}em;
  transform: rotateZ(${isPlayerId ? 0 : rotation!*360}deg) rotateY(0deg) translateZ(0em) scale(1);
}
30%,60%{
  left: ${Math.cos(direction! * 2 * Math.PI) * radius! * 24 + (16 / 9 * 100 - cloverSize) / 2}em;
  top: ${Math.sin(direction! * 2 * Math.PI) * radius! * 24 + 25 + headerHeight + 3}em;
  transform:rotateZ(${360}deg) rotateY(180deg) translateZ(-10em) scale(1.5) ;
}
to{
  left:${playerCloverLeft(posPlayer)}em;
  top:${playerCloverTop(posPlayer, 0)}em;
  transform:rotateZ(${0}deg) rotateY(-180deg) translateZ(0em) scale(1);
}
`

const style = ({direction, radius, rotation}: CssPosition) => css`
  left: ${Math.cos(direction! * 2 * Math.PI) * (Math.sqrt(radius!)) * 24 + (16 / 9 * 100 - cloverSize) / 2}em;
  top: ${Math.sin(direction! * 2 * Math.PI) * (Math.sqrt(radius!)) * 24 + 25 + headerHeight + 3}em;
  transform: rotateZ(${rotation! * 360}deg);
`