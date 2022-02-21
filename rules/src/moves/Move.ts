import Concede from './Concede'
import DrawClover from './DrawClover'
import DrawCloverForEveryone from './DrawCloverForEveryone'
import PlaceClover from './PlaceClover'

type Move = DrawClover | PlaceClover | DrawCloverForEveryone | Concede

export default Move