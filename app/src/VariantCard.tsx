/** @jsxImportSource @emotion/react */
import { css } from "@emotion/react"
import { FC, HTMLAttributes } from "react"
import { useTranslation } from "react-i18next"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faAngleUp} from '@fortawesome/free-solid-svg-icons/faAngleUp'

type Props = {
    isBruno:boolean
    isMichael:boolean
    isHide:boolean
    close: () => void
    open:() => void
} & HTMLAttributes<HTMLDivElement>

const VariantCard : FC<Props> = ({isBruno, isMichael, isHide, close, open, ...props}) => {

    const {t} = useTranslation()

    return(

        <div css={[popupOverlayStyle, isHide === false && showPopupOverlayStyle]} onClick={close} {...props}>

            {isBruno && <div css={[popupStyle(isHide), popupPosition(isHide)]} onClick={event => event.stopPropagation()}>

                <div css = {closePopupStyle(isHide)} onClick={isHide ? open : close}> <FontAwesomeIcon icon={faAngleUp} /> </div>

                <h2>{t("Bruno Variant")}</h2>

                <p> {t("bruno.variant.help")} </p>                

            </div>}

            {isMichael && <div css={[popupStyle(isHide), popupPosition(isHide)]} onClick={event => event.stopPropagation()}>

                <div css = {closePopupStyle(isHide)} onClick={isHide ? open : close}> <FontAwesomeIcon icon={faAngleUp} /> </div>

                <h2>{t("Michael Variant")}</h2>

                <p> {t("michael.variant.help")} </p>
                
            </div>}

    </div>
    )

}

const popupOverlayStyle = css`
    position: absolute;
    left: 50%;
    top: 95%;
    background-color: transparent;
    transform: translate(-50%,0%) ;
    z-index: 110;
    transition: top .5s ease, transform .5s ease;
    display:flex;
    flex-direction:row;
    justify-content:center;
`
const showPopupOverlayStyle = css`
    left: 50%;
    top: 50%;
    transform: translate(-50%,-50%) ;
    width: 100%;
    height: 100%;
`

const popupStyle = (isHide:boolean) => css`
    text-align: center;
    height: fit-content;
    width:35em;
    transform: translateZ(0.1em) translateX(6em);
    z-index : 102;
    border-radius: 1em;
    box-sizing: border-box;
    align-self: ${isHide ? 'start' : 'center'};
    padding: 1em;
    margin: 0 1em 0 1em;
    outline: none;
    box-shadow: 1em 2em 2.5em -1.5em hsla(0, 0%, 0%, 0.2);
    border:1em black solid;
    background-color: rgba(13, 98, 4, 0.95);
    border-radius: 40em 3em 40em 3em/3em 40em 3em 40em;
    color:white;

    &:before {
        content: '';
        display: block;
        position: relative;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 40em 1.5em 40em 1.5em/1.5em 40em 1.5em 40em;
        background-color: rgba(255, 255, 255, 0.1);
    }

    &:hover{
        box-shadow: 2em 4em 5em -3em hsla(0,0%,0%,.5);
    }
    & > h2 {
        position:relative;
        font-size: 3em;
        margin:1em 0.5em 0.5em 0.5em;
    }
    & > p {
        position:relative;
        text-align: center;
        font-size: 2.5em;
        margin:0.2em auto 0.5em auto;
        font-family:sans-serif;
        width:90%;

    }
    & > button {
        font-size: 3.5em;
    }
`

const popupPosition = (isHide:boolean) => css`


`

const closePopupStyle = (isHide:boolean) => css`
    position: relative;
    text-align: center;
    margin-top: -2%;
    margin-right: -0%;
    font-size: 4em;
    transform:rotateZ(${isHide ? 0 : 180}deg);
    transition:transform 0.5s ease-in-out;
    &:hover{
        cursor: pointer;
        color: black;
    }
`

export default VariantCard