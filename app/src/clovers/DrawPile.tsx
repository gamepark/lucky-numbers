/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import DrawClover, {drawCloverMove, DrawView, isDrawClover} from '@gamepark/lucky-number/moves/DrawClover'
import PlaceClover from '@gamepark/lucky-number/moves/PlaceClover'
import {Animation, useAnimation, usePlay, usePlayerId} from '@gamepark/react-client'
import {useEffect, useState} from 'react'
import {canDragStyle, cloverSize, headerHeight} from '../styles'
import CloverImage from './CloverImage'

type Props = {
  size: number
  canDraw: boolean
}

export default function DrawPile({size, canDraw}: Props) {
  const play = usePlay()
  const playerId = usePlayerId()
  const [positions, setPositions] = useState<(CssPosition)[]>([...new Array(size)].map(() => ({radius: Math.random(), direction: Math.random(), rotation: Math.random()})))
  const [indexDrew, setIndexDrew] = useState<number>(-1)
  const drawCloverAnimation = useAnimation<DrawView>(animation => isDrawClover(animation.move))

  function playDrawMove(index:number){
    play(drawCloverMove, {delayed: true})
    setIndexDrew(index)
    const newArray = [...positions]
    newArray[index] = {direction:null,radius:null,rotation:null}
    setPositions(newArray)
  }

  useEffect(() => {   // We need to remove a clover when other players draw one, which is obviously not guaranted by onClick event
    if(drawCloverAnimation !== undefined && drawCloverAnimation.action.playerId !== playerId){
      const newArray = [...positions]
      newArray[newArray.filter(isPositionned).length-1] = {direction:null,radius:null,rotation:null}
      setPositions(newArray)
    }
  },[drawCloverAnimation?.duration])


  
  return <>
    {positions.map((cssPos, index) =>
      isPositionned(cssPos) && <CloverImage key={index} onClick={canDraw ? () => playDrawMove(index) : undefined}
                   css={[style(positions[index]), canDraw && canDragStyle, isCloverDrew(index, drawCloverAnimation, indexDrew)]}/>
    )}
  </>
}

function isPositionned({direction, radius, rotation}: CssPosition):boolean{
  return direction !== null && radius !== null && rotation !== null
}

function isCloverDrew(index:number, animation:Animation<DrawView>|undefined, indexDrew:number):boolean{
  return animation !== undefined && indexDrew === index
}

type CssPosition = {
  radius: number|null
  direction: number|null
  rotation: number|null
} 

const style = ({direction, radius, rotation}: CssPosition) => css`
  left: ${Math.cos(direction! * 2 * Math.PI) * radius! * 24 + (16 / 9 * 100 - cloverSize) / 2}em;
  top: ${Math.sin(direction! * 2 * Math.PI) * radius! * 24 + 25 + headerHeight + 3}em;
  transform: rotate(${rotation! * 90}deg);
`
