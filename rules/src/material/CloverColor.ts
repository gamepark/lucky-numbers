import {isEnumValue} from '@gamepark/rules-api'

enum CloverColor {
  Yellow = 1, Red, Purple, Green
}

export default CloverColor

export const cloverColors = Object.values(CloverColor).filter(isEnumValue)
