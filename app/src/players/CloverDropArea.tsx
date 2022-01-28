/** @jsxImportSource @emotion/react */
import {css, keyframes} from '@emotion/react'
import Clover from '@gamepark/lucky-numbers/material/Clover'
import { usePlay } from '@gamepark/react-client'
import {HTMLAttributes} from 'react'
import {DropTargetMonitor, useDrop} from 'react-dnd'
import {cloverSize} from '../styles'

type Props = {
  canPlaceClover: (clover: Clover) => boolean
  onDropClover: (clover: Clover) => void
  isTutorialHighLight : boolean
  cloverSelected?:Clover
  cloversInHand:Clover[]
  isSetupPhase:boolean
  getBestSetupClover:Clover
} & HTMLAttributes<HTMLDivElement>

export const CLOVER = 'CLOVER'

export default function CloverDropArea({canPlaceClover, onDropClover, isTutorialHighLight, cloverSelected, cloversInHand, isSetupPhase, getBestSetupClover, ...props}: Props) {
  const [{canDrop, over}, ref] = useDrop({
    accept: CLOVER,
    canDrop: canPlaceClover,
    drop: onDropClover,
    collect: (monitor: DropTargetMonitor<Clover>) => ({
      canDrop: monitor.getItem() && canPlaceClover(monitor.getItem()),
      over: monitor.isOver()
    })
  })

  const play = usePlay()

  return <div ref={ref} css={[
    style,
    !canDrop && (isSetupPhase
      ? cloverSelected ? cloverSelected && canPlaceClover(cloverSelected) && cursorDisplay : getBestSetupClover && canPlaceClover(getBestSetupClover) && hoverOnly
      : cloverSelected ? cloverSelected && canPlaceClover(cloverSelected) && cursorDisplay : cloversInHand[0] && canPlaceClover(cloversInHand[0]) && hoverOnly),
    canDrop && (over 
      ? (isTutorialHighLight === true ? tutoHighlight : highlight) 
      : (isTutorialHighLight === true ? tutoDisplay : display))
    ]}
    onClick={() => {(isSetupPhase
        ? cloverSelected ? canPlaceClover(cloverSelected) && play(onDropClover(cloverSelected)) : getBestSetupClover && canPlaceClover(getBestSetupClover) && play(onDropClover(getBestSetupClover))
        : cloverSelected ? canPlaceClover(cloverSelected) && play(onDropClover(cloverSelected)) : cloversInHand[0] && canPlaceClover(cloversInHand[0]) && play(onDropClover(cloversInHand[0])))
      }
    }
    {...props}/>
}

const hoverOnly = css`
cursor:pointer;
&:hover:before{
  background-color: rgba(255,255,255,0.95)
}
`

const cursorDisplay = css`
cursor:pointer;
&:before{
  background-color: rgba(255, 255, 255, 0.5);
}
&:hover:before{
  background-color: rgba(255, 255, 255, 0.95);
}
`

const tutoAnimKF = keyframes`
  from,20%{background-color: rgba(0, 255, 0, 0.9);}
  50%{background-color: rgba(255, 255, 255, 0.9);}
  80%,to{background-color: rgba(0, 255, 0, 0.9);}
`

const tutoDisplay = css`
  &:before{
    animation:${tutoAnimKF} 0.75s linear infinite alternate;
  }
`

const tutoHighlight = css`
  &:before{
    background-color: rgba(0, 255, 0, 0.9);
  }
`

const style = css`
  position: absolute;
  width: ${cloverSize}em;
  height: ${cloverSize}em;
  border-radius: 50%;
  &:before{
    content:'';
    position:absolute;
    top:0;
    left:0;
    width:100%;
    height:100%;
    background-color: rgba(255, 255, 255, 0);
    border-radius: 50%;
    transition:background-color 0.2s linear;
    clip-path: polygon(40% 1%, 46% 21%, 50% 50%, 54% 20%, 60% 1%, 75% 2%, 86% 13%, 99% 24%, 100% 39%, 78% 47%, 51% 50%, 82% 54%, 98% 60%, 98% 76%, 87% 86%, 79% 96%, 60% 99%, 54% 81%, 50% 52%, 45% 81%, 40% 98%, 25% 98%, 15% 88%, 1% 74%, 1% 61%, 21% 54%, 48% 50%, 21% 46%, 2% 40%, 1% 26%, 14% 14%, 27% 1%);
  }
  `

const display = css`
  &:before{
    background-color: rgba(255, 255, 255, 0.5);
  }
`

const highlight = css`
  &:before{
    background-color: rgba(255, 255, 255, 0.95);
  }
`
