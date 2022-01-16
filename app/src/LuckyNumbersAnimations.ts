import GameView from "@gamepark/lucky-number/GameView";
import MoveType from "@gamepark/lucky-number/moves/MoveType";
import MoveView from "@gamepark/lucky-number/moves/MoveView";
import { isBrunoVariationTrigger } from "@gamepark/lucky-number/moves/PlaceClover";
import { Animations } from "@gamepark/react-client";

const luckyNumbersAnimations : Animations<GameView, MoveView, number> = {

    getAnimationDuration(move:MoveView,{action, state, playerId}){
        
        if (move.type === MoveType.DrawClover){
            return 3
        } else if (move.type === MoveType.PlaceClover){
            return isBrunoVariationTrigger(state.players[move.playerId-1].garden, move.row, move.column, state.isBrunoVariation === true) === true 
                ? (action.playerId === playerId ? 2 : 3) 
                : (action.playerId === playerId ? 0 : 1)
        }
        return 0
    }

}

export default luckyNumbersAnimations