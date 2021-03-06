/** @jsxImportSource @emotion/react */
import GameView from '@gamepark/lucky-numbers/GameView'
import PlaceClover, {isBrunoVariantTrigger, isPlaceClover} from '@gamepark/lucky-numbers/moves/PlaceClover'
import {Player as PlayerInfo, useAnimation, usePlayerId, usePlayers} from '@gamepark/react-client'
import {TFunction} from 'i18next'
import {useTranslation} from 'react-i18next'

type Props = {
  loading: boolean
  game?: GameView
}

export default function HeaderText({loading, game}: Props) {
  const {t} = useTranslation()
  if (loading || !game) return <>{t('Game loading...')}</>
  const winner = game.players.findIndex(player => player.garden.every(row => row.every(cell => cell !== null)))
  if (winner !== -1){
    return <HeaderGameOverText winner={winner} />
  } else {
    return <HeaderOnGoingGameText game={game} />
  }
}

function getPseudo(player: number, players: PlayerInfo<number>[], t: TFunction): string {
  if (player === 0){
    return "Error Player"
  }
  if (players[player-1].name === undefined) {
    return t('Player {number}', {number: player})
  } else {
    return players.find(p => p.id === player, t)!.name!
  }
}

function HeaderGameOverText({winner}:{winner: number}){
  const {t} = useTranslation()
  const playerId = usePlayerId<number>()
  const players = usePlayers()
  if(winner+1 === playerId){
    return <> {t("game.over.you.win")} </>
  } else {
    return <> {t("game.over.player.win",{player:getPseudo(winner+1, players,t)})} </>
  }
}

function HeaderOnGoingGameText({game}:{game:GameView}){
  const {t} = useTranslation()
  const playerId = usePlayerId<number>()
  const players = usePlayers<number>()
  const placeCloverAndReplayAnim = useAnimation<PlaceClover>(anim => isPlaceClover(anim.move) && isBrunoVariantTrigger(game.players[anim.move.playerId-1].garden,anim.move.row,anim.move.column,anim.move.clover,game.isBrunoVariant===true))

  if(game.activePlayer === undefined){
    if(playerId !== undefined && game.players[playerId-1].clovers.length !== 0){
      return <> {t("setup.phase.you.place.clovers", {clovers:game.players[playerId-1].clovers.length})} </>
    } else {
      if(game.players.filter(p => p.clovers.length !== 0).length > 1){
        return <> {t("setup.phase.players.place.clovers")} </>
      } else if (game.players.findIndex(p => p.clovers.length !== 0) !== -1){
        return <> {t("setup.phase.player.place.clovers", {player:getPseudo(game.players.findIndex(p => p.clovers.length !== 0)+1, players, t)})} </>
      } else if (game.isMichaelVariant === true){
        return <> {t("setup.michael.variant")} </>
      } else return <> {t("Please wait...")} </>
    }
  } else {
    if(placeCloverAndReplayAnim !== undefined){
      return game.activePlayer === playerId 
        ? <> {t("you.place.and.replay")} </>
        : <> {t("player.place.and.replay", {player:getPseudo(game.activePlayer, players, t)})} </>
    }
    if(game.players[game.activePlayer-1].clovers.length === 0){
      return game.activePlayer === playerId 
        ? <> {t("you.choose.clover")} </>
        : <> {t("player.choose.clover", {player:getPseudo(game.activePlayer, players, t)})} </>
    } else {
      return game.activePlayer === playerId 
        ? <> {t("you.place.clover")} </>
        : <> {t("player.place.clover", {player:getPseudo(game.activePlayer, players, t)})} </>
    }
  }
}