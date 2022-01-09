/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { getPlayerName } from "@gamepark/lucky-number/LuckyNumbersOptions";
import { Player, PlayerTimer } from "@gamepark/react-client";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import { panelBGTop, panelLeft, panelTop, toAbsolute } from "../styles";
import AvatarPanel from "./AvatarPanel";

type Props = {
    playerInfo:Player|undefined
    index:number
    activePlayer:boolean;
}

const PlayerPanel : FC<Props> = ({playerInfo, index, activePlayer}) => {
    const {t} = useTranslation()

    return(

        <>

        <div css={[panelBGStyle(index, activePlayer)]}></div>

        <div css={[panelPosition(index)]}>
            <AvatarPanel playerInfo={playerInfo}/>
            <h1 css={[nameStyle]}>{playerInfo?.name === undefined ? getPlayerName(playerInfo?.id, t) : playerInfo?.name}</h1>
            <PlayerTimer playerId={index} css={[toAbsolute,timerStyle]}/>
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
    width:7em;
    font-size: 2.8em;
    font-family: 'Reggae One', sans-serif;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`

const timerStyle = css`
    right:0.5em;
    top:0.7em;
    font-size: 2.8em;
    font-family:'Reggae One', sans-serif;
`

export default PlayerPanel