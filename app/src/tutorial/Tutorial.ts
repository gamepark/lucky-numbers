import GameState from "@gamepark/lucky-numbers/GameState";
import Clover from "@gamepark/lucky-numbers/material/Clover";
import CloverColor from "@gamepark/lucky-numbers/material/CloverColor";
import Move from "@gamepark/lucky-numbers/moves/Move";
import MoveType from "@gamepark/lucky-numbers/moves/MoveType";
import { emptyGarden } from "@gamepark/lucky-numbers/PlayerState";
import { TutorialDescription } from "@gamepark/react-client";

const startingClovers:Clover[][] = [[{color:CloverColor.Green, number:5}, {color:CloverColor.Yellow, number:1}, {color:CloverColor.Yellow, number:13}, {color:CloverColor.Green, number:14}],
                                    [{color:CloverColor.Yellow, number:4}, {color:CloverColor.Yellow, number:12}, {color:CloverColor.Green, number:13}, {color:CloverColor.Yellow, number:8}]]

const LuckyNumbersTutorial: TutorialDescription<GameState, Move> = {
    setupTutorial:() => [{
        faceUpClovers:[],
        faceDownClovers:[
            {color:CloverColor.Yellow, number:3},
            {color:CloverColor.Yellow, number:2},
            {color:CloverColor.Green, number:19},
            {color:CloverColor.Green, number:20},
            {color:CloverColor.Yellow, number:20},
            {color:CloverColor.Yellow, number:10},
            {color:CloverColor.Green, number:15},
            {color:CloverColor.Yellow, number:5},
            {color:CloverColor.Green, number:1},
            {color:CloverColor.Green, number:2},
            {color:CloverColor.Green, number:11},
            {color:CloverColor.Green, number:9},
            {color:CloverColor.Yellow, number:11},
            {color:CloverColor.Green, number:12},
            {color:CloverColor.Yellow, number:19},
            {color:CloverColor.Yellow, number:16},
            {color:CloverColor.Yellow, number:18},
            {color:CloverColor.Green, number:16},
            {color:CloverColor.Green, number:6},
            {color:CloverColor.Green, number:17},
            {color:CloverColor.Yellow, number:6},
            {color:CloverColor.Green, number:10},
            {color:CloverColor.Yellow, number:14},
            {color:CloverColor.Green, number:7},
            {color:CloverColor.Green, number:8},
            {color:CloverColor.Green, number:3},
            {color:CloverColor.Yellow, number:15},
            {color:CloverColor.Yellow, number:9},
            {color:CloverColor.Green, number:4},
            {color:CloverColor.Yellow, number:7},
            {color:CloverColor.Green, number:18},
            {color:CloverColor.Yellow, number:17}
        ],
        players:[{garden:emptyGarden, clovers:startingClovers[0]}, {garden:emptyGarden, clovers:startingClovers[1]}],
        isTutorial:true
    }, [1,2]],

    expectedMoves:() => [
        // Setup Phase
        {type:MoveType.PlaceClover,playerId:1,clover:{color:CloverColor.Yellow, number:1},column:0,row:0},
        {type:MoveType.PlaceClover,playerId:1,clover:{color:CloverColor.Green, number:5},column:1,row:1},
        {type:MoveType.PlaceClover,playerId:1,clover:{color:CloverColor.Yellow, number:13},column:2,row:2},
        {type:MoveType.PlaceClover,playerId:1,clover:{color:CloverColor.Green, number:14},column:3,row:3},

        {type:MoveType.PlaceClover,playerId:2,clover:{color:CloverColor.Yellow, number:4},column:0,row:0},
        {type:MoveType.PlaceClover,playerId:2,clover:{color:CloverColor.Yellow, number:8},column:1,row:1},
        {type:MoveType.PlaceClover,playerId:2,clover:{color:CloverColor.Yellow, number:12},column:2,row:2},
        {type:MoveType.PlaceClover,playerId:2,clover:{color:CloverColor.Green, number:13},column:3,row:3},
    
        //Game Phase

        {type:MoveType.DrawClover},
        {type:MoveType.PlaceClover,playerId:1,clover:{color:CloverColor.Yellow, number:3},column:1,row:0},
        {type:MoveType.DrawClover},
        {type:MoveType.PlaceClover,playerId:2,clover:{color:CloverColor.Yellow, number:2},column:0,row:0},
        {type:MoveType.PlaceClover,playerId:1,clover:{color:CloverColor.Yellow, number:4},column:0,row:1},
        {type:MoveType.DrawClover},
        {type:MoveType.PlaceClover,playerId:2,clover:{color:CloverColor.Green, number:19},column:3,row:3},
        {type:MoveType.DrawClover},
        {type:MoveType.PlaceClover,playerId:1,clover:{color:CloverColor.Green, number:20},column:3,row:3},
        {type:MoveType.PlaceClover,playerId:2,clover:{color:CloverColor.Green, number:13},column:1,row:3},
        {type:MoveType.DrawClover},
        {type:MoveType.PlaceClover,playerId:1,clover:{color:CloverColor.Yellow, number:20},column:-1,row:-1},


    ]
}

export default LuckyNumbersTutorial