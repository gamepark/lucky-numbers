import GameState from './GameState'

type GameView = Omit<GameState, 'faceDownClovers'> & {
  faceDownClovers: number
}

export default GameView