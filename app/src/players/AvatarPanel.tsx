/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react";
import { Avatar, Player } from "@gamepark/react-client";
import { Picture } from "@gamepark/react-components";
import { FC } from "react";
import { useTranslation } from "react-i18next";
import Images from "../Images";
import { toFullSize } from "../styles";

type Props = {
    playerInfo : Player | undefined
}

const AvatarPanel : FC<Props> = ({playerInfo}) => {

    const {t} = useTranslation()

    return(

        <div css={[avatarStyle, roundBorders]}>
            {playerInfo?.avatar 
                ? <Avatar style={{width:'100%', height:'100%'}} avatarStyle="Circle" {...playerInfo.avatar}/> 
                : <Picture alt={t('Player avatar')} src={Images.cloverBack} css={[toFullSize, roundBorders]} draggable={false}/>
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
`

const roundBorders = css`
    border-radius:100%;
`

export default AvatarPanel