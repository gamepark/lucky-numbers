import GameState from '@gamepark/lucky-numbers/GameState';
import LuckyNumbers from '@gamepark/lucky-numbers/LuckyNumbers';
import Move from '@gamepark/lucky-numbers/moves/Move';
import MoveType from '@gamepark/lucky-numbers/moves/MoveType';
import PlaceClover from '@gamepark/lucky-numbers/moves/PlaceClover';
import { Garden, howManyCloversInGarden } from '@gamepark/lucky-numbers/PlayerState';

export default async function tutorialAI(game:GameState, playerId:number):Promise<Move[]> {

    new LuckyNumbers(game).getLegalMoves(playerId)

    return [{type:MoveType.DrawClover}]

}

function isSlotEmpty(garden:Garden, row:number, column:number):boolean{
    return garden[row][column] === null
}

function ratePlaceCloverMove(move:PlaceClover, garden:Garden):number{
    const cloverNumber = move.clover.number
    if(isSlotEmpty(garden, move.row, move.column)){   
        if(move.row+move.column <= 3){
            const extremeValue:number = extremeLowTable[move.row][move.column]!
            if (cloverNumber < extremeValue) return 0
        } else {
            const extremeValue:number = extremeHighTable[move.row][move.column]!
            if (cloverNumber > extremeValue) return 0
        }
        if(cloverNumber === extremeHighTable[move.row][move.column] || cloverNumber === extremeLowTable[move.row][move.column]){
            return 1
        } else {
            const averageValues = AverageTable[move.row][move.column]
            if (isNumberinInterval(cloverNumber, averageValues)){
                return 1 - Math.abs(cloverNumber - (averageValues[0]+averageValues[1])/2)/10
            } else {
                return 0.6 - (cloverNumber < averageValues[0] ? (averageValues[0]-cloverNumber)/10 : (cloverNumber-averageValues[1])/10)
            }
        }
        
    } else {
        const placedClover = garden[move.row][move.column]!.number
        if(move.row+move.column < 3){
            return placedClover - cloverNumber > 0 ? 0.5 + (placedClover - cloverNumber)/10 : 0
        } else if (move.row+move.column > 3){
            return cloverNumber - placedClover > 0 ? 0.5 + (cloverNumber - placedClover)/10 : 0
        } else {
            return 1 - (16-howManyCloversInGarden(garden))/12
        }
    }
}

function isNumberinInterval(value:number, interval:[number,number]):boolean{
    return value >= interval[0] && value <= interval[1]
}

function shallDraw(bestMoveRate:number, nbEmptySlots:number):boolean{
    return bestMoveRate > getShallDrawCoeff(nbEmptySlots)
}

function getShallDrawCoeff(nbEmptySlots:number){
    switch(nbEmptySlots){
        case 1:
        case 2:
            return 0
        case 12:
        case 11:
            return 0.9
        default: return (nbEmptySlots/10)-0.2
    }
}

const extremeLowTable:(number|null)[][] = [
    [1  , 2   , 3     , 4],
    [2  , 3   , 4     , null],
    [3  , 4   , null  , null],
    [4  , null, null  , null]
]

const extremeHighTable:(number|null)[][] = [
    [null  , null  , null  , 17],
    [null  , null  , 17    , 18],
    [null  , 17    , 18    , 19],
    [17    , 18    , 19    , 20]
]

const AverageTable:([number, number])[][] = [
    [[1,4]  , [3,6]  , [5,8]  , [7,14]],
    [[3,6]  , [5,9]  , [9,12]  , [13,16]],
    [[5,8]  , [9,12]  , [11,15]  , [15,18]],
    [[7,14]  , [13,16]  , [15,18]  , [17,20]]
]