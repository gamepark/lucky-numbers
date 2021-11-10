/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import Clover from '@gamepark/lucky-number/material/Clover'
import {cloverSize} from '../styles'
import CloverImage from './CloverImage'

type Props = {
  clovers: Clover[]
}

export default function FaceUpClovers({clovers}: Props) {
  return <>
    {clovers.map((clover, index) => <CloverImage key={index} clover={clover} css={position(index)}/>)}
  </>
}

const position = (index: number) => css`
  left: ${index * (cloverSize + 1) + 70}em;
  top: ${70}em;
`
