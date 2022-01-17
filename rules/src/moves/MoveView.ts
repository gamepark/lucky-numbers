import DrawClover, {DrawView} from './DrawClover'
import DrawCloverForEveryone, { DrawForEveryoneView } from './DrawCloverForEveryone'
import Move from './Move'

type MoveView = Exclude<Move, DrawClover | DrawCloverForEveryone> | DrawView | DrawForEveryoneView

export default MoveView