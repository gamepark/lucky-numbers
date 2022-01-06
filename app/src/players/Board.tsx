/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import {placeCloverMove} from '@gamepark/lucky-number/moves/PlaceClover'
import {Garden, isValidPosition} from '@gamepark/lucky-number/PlayerState'
import {usePlayerId} from '@gamepark/react-client'
import {Fragment, HTMLAttributes} from 'react'
import CloverImage from '../clovers/CloverImage'
import Images from '../Images'
import {cloverSize} from '../styles'
import CloverDropArea from './CloverDropArea'

type Props = {
  garden: Garden
  isMine?: boolean
  isSetupPhase: boolean
} & HTMLAttributes<HTMLDivElement>

export default function Board({garden, isMine, isSetupPhase, ...props}: Props) {
  const playerId = usePlayerId()
  return (
    <div css={style} {...props}>
      {garden.map((line, row) =>
        line.map((clover, column) =>
          <Fragment key={`${row} ${column}`}>
            {clover && <CloverImage clover={clover} css={position(row, column)}/>}
            {isMine && <CloverDropArea canPlaceClover={clover => isValidPosition(garden, clover, row, column, isSetupPhase)}
                                       onDropClover={clover => placeCloverMove(playerId, clover, row, column)}
                                       css={position(row, column)}/>}
          </Fragment>
        )
      )}
    </div>
  )
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
