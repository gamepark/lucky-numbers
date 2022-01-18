/** @jsxImportSource @emotion/react */
import {FC} from "react"
import {useTranslation} from "react-i18next/"
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import { css } from "@emotion/react"
import Button from "./tutorial/Button"

const WelcomePopUp : FC<{isBruno:boolean, isMichael:boolean, close: () => void}> = ({isBruno, isMichael, close}) => {

    const {t} = useTranslation()

    return(

      <div css={[popupOverlayStyle, showPopupOverlayStyle]} onClick={close}>

          <div css={[popupStyle, popupPosition]} onClick={event => event.stopPropagation()}>

              <div css = {closePopupStyle} onClick={close}> <FontAwesomeIcon icon={faTimes} /> </div>
              <h1>{t("Warning !")}</h1>

              <p>{t("warning.intro.text")}</p>

              {isMichael && <h2> {t("Michael Variant")} </h2>}
              {isMichael && <p> {t("michael.variant.help")} </p>}
              {isBruno && <h2> {t("Bruno Variant")} </h2>}
              {isBruno && <p> {t("bruno.variant.help")} </p>}

              <Button css={buttonPosition} onClick={close}>{t("Wish me luck !")}</Button>

          </div>

      </div>

    )

}

const buttonPosition = css`
    position:relative;
`

const popupOverlayStyle = css`
    position: absolute;
    right: 0;
    bottom: 0;
    background-color: transparent;
    transform: translate(-50%,-50%);
    z-index: 110;
    transition: all .5s ease;
`
const showPopupOverlayStyle = css`
    left: 50%;
    top: 50%;
    width: 100%;
    height: 100%;
`

const popupStyle = css`
    position: absolute;
    text-align: center;
    height: fit-content;
    width:50%;
    z-index : 102;
    border-radius: 1em;
    box-sizing: border-box;
    align-self: center;
    padding: 2%;
    margin: 0 2%;
    outline: none;
    box-shadow: 1em 2em 2.5em -1.5em hsla(0, 0%, 0%, 0.2);
    border:1em black solid;
    background-color: rgba(0, 128, 12, 0.95);
    border-radius: 40em 3em 40em 3em/3em 40em 3em 40em;

    &:before {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 40em 1.5em 40em 1.5em/1.5em 40em 1.5em 40em;
        background-color: rgba(0, 0, 0, 0.5);
    }

    &:hover{
        box-shadow: 2em 4em 5em -3em hsla(0,0%,0%,.5);
    }
    & > h1 {
        position:relative;
        font-size: 5em;
        margin:0 1em;
    }
    & > h2 {
        position:relative;
        font-size: 4em;
        margin:0 1em;
    }
    & > p {
        position:relative;
        text-align: center;
        font-size: 3em;
        margin:0.5em auto;
        width:80%;

    }
    & > button {
        font-size: 3.5em;
    }
`

const popupPosition = css`
    top: 50%;
    left: 50%;
    transform:translate(-50%,-50%);

`

const closePopupStyle = css`
    position: relative;
    float: right;
    text-align: center;
    margin-top: -2%;
    margin-right: -0%;
    font-size: 4em;
    &:hover{
        cursor: pointer;
        color: black;
    }
`

export default WelcomePopUp