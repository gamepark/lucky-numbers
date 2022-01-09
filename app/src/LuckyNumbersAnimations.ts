import GameView from "@gamepark/lucky-number/GameView";
import MoveType from "@gamepark/lucky-number/moves/MoveType";
import MoveView from "@gamepark/lucky-number/moves/MoveView";
import { Animations } from "@gamepark/react-client";

const luckyNumbersAnimations : Animations<GameView, MoveView, number> = {

    getAnimationDuration(move:MoveView,{action, state, playerId}){
        
        if (move.type === MoveType.DrawClover){
            return 3
        } else if (move.type === MoveType.PlaceClover){
            return action.playerId === playerId ? 0 : 1
        }
        return 0
    }

}

export default luckyNumbersAnimations