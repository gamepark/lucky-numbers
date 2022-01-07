import CloverColor from './CloverColor'

type Clover = {
  color: CloverColor
  number: number
}

export default Clover

export function isSameClover(clover1:Clover, clover2:Clover):boolean{
  return clover1.color === clover2.color && clover1.number === clover2.number
}