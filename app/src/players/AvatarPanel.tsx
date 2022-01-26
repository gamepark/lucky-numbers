/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Avatar, Player, SpeechBubbleDirection } from "@gamepark/react-client";
import { Picture } from "@gamepark/react-components";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import Images from "../Images";
import { toFullSize } from "../styles";

type Props = {
    playerInfo : Player | undefined
    playerId:number
    display:number
}

const AvatarPanel : FC<Props> = ({playerInfo, playerId, display}) => {

    const {t} = useTranslation()
    const getSpeechPosition = (display:number) => {
        switch(display){
            case 0: return SpeechBubbleDirection.TOP_RIGHT
            case 1: return SpeechBubbleDirection.BOTTOM_RIGHT
            case 2: return SpeechBubbleDirection.BOTTOM_LEFT
            case 3: return SpeechBubbleDirection.TOP_LEFT
            default: return SpeechBubbleDirection.TOP_RIGHT
        }
    }

    return(

        <div css={[avatarStyle, roundBorders]}>
            {(playerInfo?.avatar) || true
                ? <Avatar playerId={playerId} css={[toFullSize, roundBorders]} speechBubbleProps={{direction: getSpeechPosition(display)}} /> 
                : <Picture alt={t('Player avatar')} src={Images.cloverBack} css={[toFullSize, roundBorders]} draggable={false} />
            }
        </div>

    )

}

const avatarStyle = css`
    position:absolute;
    float:left;
    margin:0.8em 0.8em;
    height:5em;
    width:5em;
    transform:translateZ(0.01em);
    transform-style:preserve-3d;
`

const roundBorders = css`
    border-radius:100%;
    color:black;
`

export default AvatarPanel