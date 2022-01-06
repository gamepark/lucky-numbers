/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import Clover from '@gamepark/lucky-number/material/Clover'
import CloverColor from '@gamepark/lucky-number/material/CloverColor'
import { usePlay } from '@gamepark/react-client'
import { Draggable } from '@gamepark/react-components'
import { CLOVER } from '../players/CloverDropArea'
import {canDragStyle, cloverSize} from '../styles'
import CloverImage from './CloverImage'

type Props = {
  clovers: Clover[]
  canDrag:boolean
}

export default function FaceUpClovers({clovers, canDrag}: Props) {
  const play = usePlay()
  const arrayExampleClovers = Array(15).fill({color:CloverColor.Green, number:2})
  return (
  <>

    {clovers.map((clover, index) => 
    <Draggable key={index} type={CLOVER} item={clover} canDrag={canDrag} drop={play} >
      <CloverImage clover={clover} css={[position(index), canDrag && canDragStyle]}/>
    </Draggable> )}
  </>
  )
}

const position = (index: number) => css`
  left: ${(index%6) * (cloverSize + 1) + 66}em;
  top: ${Math.floor(index/6)*(cloverSize +1) + 70}em;
`
