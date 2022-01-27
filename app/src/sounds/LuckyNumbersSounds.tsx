import GameView from "@gamepark/lucky-numbers/GameView"
import DrawClover, { isDrawClover } from "@gamepark/lucky-numbers/moves/DrawClover"
import { useAnimation, usePlayerId } from "@gamepark/react-client"
import { FC, useEffect } from "react"
import { AudioLoader } from "./AudioLoader"
import fiipSound from './flip.mp3';
import moveSound from './moveTile.mp3';
import winSound from './win.mp3';
import brunoVariantSound from './brunoVariant.mp3';
import PlaceClover, { isBrunoVariantTrigger, isPlaceClover } from "@gamepark/lucky-numbers/moves/PlaceClover"
import PlayerState from "@gamepark/lucky-numbers/PlayerState"
import { isWinner } from "../players/Board"

type Props = {
    audioLoader: AudioLoader
    game:GameView
}

const LuckyNumbersSounds : FC<Props> = ({audioLoader, game}) => {

    const drawAnim = useAnimation<DrawClover>(anim => isDrawClover(anim.move))
    const moveAnim = useAnimation<PlaceClover>(anim =>  isPlaceClover(anim.move))

    useEffect(() => {
        if (drawAnim) {
          audioLoader.play(fiipSound, false, 0.6)
        }
      }, [drawAnim?.move])

    useEffect(() => {
        if(moveAnim){
            audioLoader.play(moveSound, false, 0.6)
        }
    }, [moveAnim?.move] )
    
    useEffect(() => {
        const activePlayer:PlayerState|undefined = game.activePlayer ? game.players[game.activePlayer-1] : undefined
        if(moveAnim && activePlayer && isBrunoVariantTrigger(activePlayer?.garden, moveAnim.move.row, moveAnim.move.column, moveAnim.move.clover, game.isBrunoVariant === true)){
            audioLoader.play(brunoVariantSound, false, 0.6)
        }
    }, [moveAnim?.move])

    useEffect(() => {
        if(game.players.some(p => isWinner(p.garden))){
            audioLoader.play(winSound, false, 0.7)
        }
    }, [game.players.some(p => isWinner(p.garden))] )

    return null
}

export default LuckyNumbersSounds