/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import Clover from '@gamepark/lucky-number/material/Clover'
import CloverColor from '@gamepark/lucky-number/material/CloverColor'
import {Picture, PictureAttributes} from '@gamepark/react-components'
import Images from '../Images'
import {cloverSize} from '../styles'

type Props = {
  clover?: Clover
} & PictureAttributes

export default function CloverImage({clover, ...props}: Props) {
  return <Picture src={clover ? clovers[clover.color][clover.number - 1] : Images.cloverBack} css={style} {...props}/>
}

export const style = css`
  position: absolute;
  width: ${cloverSize}em;
  height: ${cloverSize}em;
  filter: drop-shadow(0 0 0.1em black) drop-shadow(0 0 0.1em black);
  transform-style: preserve-3d;
`

const clovers = {
  [CloverColor.Yellow]: [
    Images.cloverYellow1, Images.cloverYellow2, Images.cloverYellow3, Images.cloverYellow4, Images.cloverYellow5,
    Images.cloverYellow6, Images.cloverYellow7, Images.cloverYellow8, Images.cloverYellow9, Images.cloverYellow10,
    Images.cloverYellow11, Images.cloverYellow12, Images.cloverYellow13, Images.cloverYellow14, Images.cloverYellow15,
    Images.cloverYellow16, Images.cloverYellow17, Images.cloverYellow18, Images.cloverYellow19, Images.cloverYellow20
  ],
  [CloverColor.Red]: [
    Images.cloverRed1, Images.cloverRed2, Images.cloverRed3, Images.cloverRed4, Images.cloverRed5,
    Images.cloverRed6, Images.cloverRed7, Images.cloverRed8, Images.cloverRed9, Images.cloverRed10,
    Images.cloverRed11, Images.cloverRed12, Images.cloverRed13, Images.cloverRed14, Images.cloverRed15,
    Images.cloverRed16, Images.cloverRed17, Images.cloverRed18, Images.cloverRed19, Images.cloverRed20
  ],
  [CloverColor.Purple]: [
    Images.cloverPurple1, Images.cloverPurple2, Images.cloverPurple3, Images.cloverPurple4, Images.cloverPurple5,
    Images.cloverPurple6, Images.cloverPurple7, Images.cloverPurple8, Images.cloverPurple9, Images.cloverPurple10,
    Images.cloverPurple11, Images.cloverPurple12, Images.cloverPurple13, Images.cloverPurple14, Images.cloverPurple15,
    Images.cloverPurple16, Images.cloverPurple17, Images.cloverPurple18, Images.cloverPurple19, Images.cloverPurple20
  ],
  [CloverColor.Green]: [
    Images.cloverGreen1, Images.cloverGreen2, Images.cloverGreen3, Images.cloverGreen4, Images.cloverGreen5,
    Images.cloverGreen6, Images.cloverGreen7, Images.cloverGreen8, Images.cloverGreen9, Images.cloverGreen10,
    Images.cloverGreen11, Images.cloverGreen12, Images.cloverGreen13, Images.cloverGreen14, Images.cloverGreen15,
    Images.cloverGreen16, Images.cloverGreen17, Images.cloverGreen18, Images.cloverGreen19, Images.cloverGreen20
  ]
}
