/** @jsxImportSource @emotion/react */
import {css} from '@emotion/react'
import {GamePoints, Player, PlayerTimer, useTutorial} from '@gamepark/react-client'
import {FC} from 'react'
import {useTranslation} from 'react-i18next'
import {panelBGTop, panelLeft, panelTop, toAbsolute} from '../styles'
import AvatarPanel from './AvatarPanel'

type Props = {
    playerInfo:Player|undefined
    index:number
    activePlayer:boolean
    indexPlayer:number
    isWinner:boolean
}

const PlayerPanel : FC<Props> = ({playerInfo, index, indexPlayer, activePlayer, isWinner}) => {
    const {t} = useTranslation()
    const isTuto = useTutorial()

    return(

        <>

        <div css={[panelBGStyle(index, activePlayer)]}></div>

        <div css={[panelPosition(index)]}>
            <AvatarPanel playerInfo={playerInfo} playerId={indexPlayer} display={index} />
            {isTuto 
                ? <h1 css={[nameStyle]}>{index === 0 ? t("You") : t("Your Opponent")}</h1>
                : <h1 css={[nameStyle]}>{playerInfo?.name === undefined ? t('Player {number}', {number: playerInfo?.id}) : playerInfo?.name}</h1>
            }
            
            {!isWinner && <PlayerTimer playerId={indexPlayer} css={[toAbsolute, timerStyle]}/>}
            {isWinner && <GamePoints playerId={indexPlayer} css={[toAbsolute, timerStyle]}/>}
        </div>
    

        </>
        

    )
}

const panelBGStyle = (index:number, activePlayer:boolean) => css`
    position:absolute;
    left: ${panelLeft(index)}em;
    top: ${panelBGTop(index)}em;
    width:34.3em;
    height:12em;
    border:solid 0.6em ${activePlayer ? "gold" : "green"};
    border-radius:2em;
    transform-style:preserve-3d;
`

const panelPosition = (index:number) => css`
    position:absolute;
    left: ${panelLeft(index)}em;
    top: ${panelTop(index)}em;
    width:34.3em;
    height:6em;
    transform-style:preserve-3d;
`

const nameStyle = css`
    position:absolute;
    left:2.5em;
    width:7.8em;
    font-size: 2.5em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const timerStyle = css`
    right:0.5em;
    top:0.7em;
    font-size: 2.8em;
    font-family:'Righteous', sans-serif;
`

export default PlayerPanel