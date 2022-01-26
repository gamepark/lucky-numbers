/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import {drawCloverMove, DrawView, isDrawClover} from '@gamepark/lucky-numbers/moves/DrawClover'
import { DrawForEveryoneView, isDrawCloverForEveryone } from '@gamepark/lucky-numbers/moves/DrawCloverForEveryone'
import {useAnimation, usePlay, usePlayerId} from '@gamepark/react-client'
import {useEffect, useState} from 'react'
import { getDisplayPosition } from '../players/PlayerDisplay'
import {canDragStyle, cloverSize, headerHeight, playerCloverLeft, playerCloverTop} from '../styles'
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
  const [positions, setPositions] = useState<(CssPosition)[]>([...new Array(size)].map((_, index) => ({key:index, radius: Math.random(), direction: Math.random(), rotation: Math.random()})))
  const [keyDrew, setKeyDrew] = useState<number|undefined>()
  const [cloverDrew, setCloverDrew] = useState(false)
  const drawCloverAnimation = useAnimation<DrawView>(animation => isDrawClover(animation.move))
  const drawCloverForEveryoneAnimation = useAnimation<DrawForEveryoneView>(animation => isDrawCloverForEveryone(animation.move))

  function playDrawMove(key:number){
    setKeyDrew(key)
    play(drawCloverMove, {delayed: true})
  }

  useEffect(() => { // We have to refresh the position array and removing the good clover, as it was the array on which clovers are mapped for display.
    if(drawCloverAnimation !== undefined || drawCloverForEveryoneAnimation !== undefined){
      setCloverDrew(true)
    } else if(cloverDrew){
      setCloverDrew(false)
      if(keyDrew === undefined){
        drawCloverForEveryoneAnimation !== undefined 
          ? setPositions(positions => positions.slice(0, -nbPlayers)) 
          : setPositions(positions => positions.slice(0, -1))
      } else {
        setKeyDrew(undefined)
        setPositions(positions => positions.filter(position => position.key !== keyDrew))
      }
    }
  },[drawCloverAnimation, drawCloverForEveryoneAnimation, cloverDrew, keyDrew])

  return <>
    {positions.map((cssPos, index) => (drawCloverAnimation !== undefined || drawCloverForEveryoneAnimation !== undefined || cloverDrew === false || (keyDrew === undefined ? (drawCloverForEveryoneAnimation !== undefined ? index < positions.length-nbPlayers : index !== positions.length-1) : keyDrew !== cssPos.key ) ) &&
      <div key={cssPos.key} 
           onClick={(canDraw && keyDrew === undefined) ? () => playDrawMove(cssPos.key) : undefined}
           css={[cardWrapper,
                 style(positions[index]),
                 drawCloverAnimation !== undefined && activePlayer !== undefined && (keyDrew === undefined ? index === positions.length-1 : keyDrew === cssPos.key ) && cloverDrewTranslation(drawCloverAnimation.duration, cssPos, getDisplayPosition(playerId, activePlayer-1, nbPlayers), playerId === activePlayer-1),
                 drawCloverForEveryoneAnimation !== undefined && index >= positions.length-nbPlayers && cloverDrewTranslation(drawCloverForEveryoneAnimation!.duration, cssPos, getDisplayPosition(playerId, positions.length-index-1 , nbPlayers), false),
                 canDraw && drawCloverAnimation === undefined && feedBackAnimation]}>
        <div css={[css`transform:rotateY(0deg);`, cloverFace, canDraw && drawCloverAnimation === undefined && canDragStyle]} > <CloverImage /> </div>
        <div css={[css`transform:rotateY(180deg);`, cloverFace]} > <CloverImage  clover={drawCloverAnimation !== undefined ? drawCloverAnimation.move.clover : (drawCloverForEveryoneAnimation ? drawCloverForEveryoneAnimation.move.clover[positions.length-index-1] : undefined)}  /> </div>
      </div>
    )}

  </>
}

type CssPosition = {
  key:number
  radius: number
  direction: number
  rotation: number
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

const feedBackAnimation = css`
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