import DrawClover, {DrawView} from './DrawClover'
import Move from './Move'

type MoveView = Exclude<Move, DrawClover> | DrawView

export default MoveView