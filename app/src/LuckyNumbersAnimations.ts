import GameView from "@gamepark/lucky-numbers/GameView";
import MoveType from "@gamepark/lucky-numbers/moves/MoveType";
import MoveView from "@gamepark/lucky-numbers/moves/MoveView";
import { isBrunoVariantTrigger } from "@gamepark/lucky-numbers/moves/PlaceClover";
import { Animations } from "@gamepark/react-client";

const luckyNumbersAnimations : Animations<GameView, MoveView, number> = {

    getAnimationDuration(move:MoveView,{action, state, playerId}){
        const tuto:boolean = state.isTutorial ?? false
        
        if (move.type === MoveType.DrawClover || move.type === MoveType.DrawCloverForEveryone){
            return 2 + (tuto ? 1 : 0)
        } else if (move.type === MoveType.PlaceClover){
            return isBrunoVariantTrigger(state.players[move.playerId-1].garden, move.row, move.column, move.clover, state.isBrunoVariant === true) === true 
                ? (action.playerId === playerId ? 1.7 : 2.7) 
                : (action.playerId === playerId ? 0 : 0.7+ (tuto ? 1 : 0))
        } 
        return 0
    }

}

export default luckyNumbersAnimations