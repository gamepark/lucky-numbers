/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import Clover from '@gamepark/lucky-number/material/Clover'
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
  return <>
    {clovers.map((clover, index) => 
    <Draggable key={index} type={CLOVER} item={clover} canDrag={canDrag} drop={play} >
      <CloverImage clover={clover} css={[position(index), canDrag && canDragStyle]}/>
    </Draggable> )}
  </>
}

const position = (index: number) => css`
  left: ${index * (cloverSize + 1) + 70}em;
  top: ${70}em;
`
