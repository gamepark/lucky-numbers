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
            {clover && <CloverImage clover={clover} css={[position(row, column), isCloverAnimated(row, column, placeCloverAnimation) && placeCloverAnimation!.move.playerId === idGarden+1 && discardCloverTranslation(placeCloverAnimation!.duration, cloversDiscarded.length - (cloversDiscarded.find(clover => isSameClover(clover, placeCloverAnimation!.move.clover)) !== undefined ? 1 : 0), playerPosition)]}/>}
            {isMine && <CloverDropArea canPlaceClover={clover => isValidPosition(garden, clover, row, column, isSetupPhase)}
                                       onDropClover={clover => placeCloverMove(playerId, clover, row, column)}
                                       css={[position(row, column)]}/>}
          </Fragment>
        )
      )}
    </div>
  )
}

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
`

const position = (row: number, column: number) => css`
  left: ${(cloverSize + 1) * row + 1.7}em;
  top: ${(cloverSize + 1) * column + 1.7}em;
`
