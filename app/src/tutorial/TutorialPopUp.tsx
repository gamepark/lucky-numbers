/** @jsxImportSource @emotion/react */
import {css} from "@emotion/react";
import {faTimes} from '@fortawesome/free-solid-svg-icons'
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome'
import GameView from "@gamepark/lucky-numbers/GameView";
import Move from "@gamepark/lucky-numbers/moves/Move";
import {Failure, Tutorial, useActions, useAnimation, useFailures, usePlayerId} from "@gamepark/react-client";
import {Picture} from '@gamepark/react-components'
import {TFunction} from "i18next";
import {FC, useEffect, useRef, useState} from "react";
import {Trans, useTranslation} from "react-i18next";
import { isWinner } from "../players/Board";
import Arrow from "./tutorial-arrow-black.png"
import {useClickAway} from "react-use";
import Button from "./Button";

const TutorialPopup: FC<{ game: GameView, tutorial: Tutorial }> = ({game, tutorial}) => {

    const {t} = useTranslation()
    const playerId = usePlayerId()
    const actions = useActions<Move, number>()
    const actionsNumber = actions !== undefined ? actions.filter(action => action.playerId === playerId).length : 0
    const previousActionNumber = useRef(actionsNumber)
    const [tutorialIndex, setTutorialIndex] = useState(0)
    const [tutorialDisplay, setTutorialDisplay] = useState(tutorialDescription.length > actionsNumber)
    const [failures] = useFailures()
    const [hideEndInfo, setHideEndInfo] = useState(false)
    const winner = game.players.find(p => isWinner(p.garden))

    const platformUri = process.env.REACT_APP_PLATFORM_URI ?? 'https://game-park.com'
    const discordUri = 'https://discord.gg/nMSDRag'

    const animation = useAnimation<Move>()

    const ref = useRef(null)
    useClickAway(ref, () => setTutorialDisplay(false))

    const moveTutorial = (deltaMessage: number) => {
        if (tutorialDescription[actionsNumber][tutorialIndex + deltaMessage] !== undefined) {
            setTutorialIndex(tutorialIndex + deltaMessage)
            setTutorialDisplay(true)
        } else {
            setTutorialDisplay(false)
        }

    }

    const resetTutorialDisplay = () => {
        if (!winner) {
            setTutorialIndex(0)
            setTutorialDisplay(true)
        } else {
            setHideEndInfo(true)
        }
    }

    const tutorialMessage = (index: number) => {
        let currentStep = actionsNumber
        while (!tutorialDescription[currentStep]) {
            currentStep--
        }
        return tutorialDescription[currentStep][index]
    }

    useEffect(() => {
        if (previousActionNumber.current > actionsNumber) {
            setTutorialDisplay(false)
        } else if (tutorialDescription[actionsNumber]) {
            resetTutorialDisplay()
        }
        previousActionNumber.current = actionsNumber
    }, [actionsNumber])

    const [unexpectedMove, setUnexpectedMove] = useState(false)
    useEffect(() => {
        if (failures.some(failure => failure === Failure.TUTORIAL_MOVE_EXPECTED)) {
            setUnexpectedMove(true)
        } else if (unexpectedMove) {
            setTutorialIndex(tutorialDescription[actionsNumber].length - 1)
            setTutorialDisplay(true)
            setUnexpectedMove(false)
        }
    }, [actionsNumber, failures, unexpectedMove])

    useEffect(() => {
        if(actionsNumber<4){
            tutorial.setOpponentsPlayAutomatically(false)
        } else {
            tutorial.setOpponentsPlayAutomatically(true)

        }
    },[])

    useEffect(() => {
        if(actionsNumber > 3 && tutorialIndex === 1){
            tutorial.setOpponentsPlayAutomatically(true)
        }
    }, [actionsNumber, tutorialIndex])


    const currentMessage = tutorialMessage(tutorialIndex)

    const displayPopup = tutorialDisplay && !animation && currentMessage !== undefined && !failures.length && (game.activePlayer === undefined ? (actions === undefined || actions.length < 5 || (actions.length === 4 && tutorialIndex === 1)) : game.activePlayer === playerId)
    return (
        <>

            {!winner && actionsNumber <12 && <div ref={ref} css={[popupStyle, actionsNumber === 0 && tutorialIndex === 5 && cropDiv, currentMessage && popupWidth(currentMessage.boxWidth), displayPopup ? popupPosition(currentMessage) : hidePopupStyle]}
                 onClick={event => event.stopPropagation()}>

                <div css={closePopupStyle} onClick={() => setTutorialDisplay(false)}><FontAwesomeIcon icon={faTimes}/></div>

                {currentMessage && <h2>{currentMessage.title(t)} {currentMessage && currentMessage.image &&
                <Picture css={[imageStyle]} src={currentMessage.image} alt={t("help image")}/>}</h2>}
                {currentMessage && <p><Trans defaults={currentMessage.text} components={[<strong/>]}/></p>}
                {tutorialIndex > 0 && <Button css={buttonTutoStyle} onClick={() => moveTutorial(-1)}>{'<<'}</Button>}
                <Button css={buttonTutoStyle} onClick={() => moveTutorial(1)}>{t('OK')}</Button>

            </div>}

            {
                !displayPopup && !winner && actionsNumber < 12 &&
                <Button css={[buttonTutoStyle, resetStyle]}
                        onClick={() => setTutorialDisplay(true)}>{t('Display tutorial')}</Button>
            }

            {
                currentMessage && currentMessage.arrow &&
                <Picture alt='Arrow pointing toward current tutorial interest' src={Arrow} draggable="false"
                         css={[arrowStyle(currentMessage.arrow.angle), displayPopup ? showArrowStyle(currentMessage.arrow.top, currentMessage.arrow.left) : hideArrowStyle]}/>
            }

            {
                winner && !hideEndInfo &&
                <div css={[popupStyle, popupWidth(tutorialEndGame.boxWidth), popupPosition(tutorialEndGame)]}>
                    <div css={closePopupStyle} onClick={() => setHideEndInfo(true)}><FontAwesomeIcon icon={faTimes}/></div>
                    <h2 css={textEndStyle}>{tutorialEndGame.title(t)}</h2>
                    <p css={textEndStyle}>{t(tutorialEndGame.text)}</p>
                    <Button css={[buttonTutoStyle, endSize]}
                            onClick={() => resetTutorial()}>{t('Restart the tutorial')}</Button>
                    <Button css={[buttonTutoStyle, endSize]}
                            onClick={() => window.location.href = platformUri}>{t('Play with friends')}</Button>
                    <Button css={[buttonTutoStyle, endSize]}
                            onClick={() => window.location.href = discordUri}>{t('Find players')}</Button>
                </div>
            }

        </>
    )

}

export function resetTutorial() {
    localStorage.removeItem('lucky-numbers')
    window.location.reload()
}

export const hidePopupStyle = css`
    transform: translate(155em, 48em) translate(-50%, -50%) scale(0.08);
`

const buttonTutoStyle = css`
    width: 5em;
    height: 1.5em;
    margin-right: 1em;
    font-family: 'Reggae One', sans-serif;
    z-index: 103;
`

const endSize = css`
    width: auto;
`

const textEndStyle = css`
    color: white;
`

const cropDiv = css`
    clip-path: polygon(0 60%, 20% 100%, 100% 100%, 100% 0%, 0% 0%);
`

const popupStyle = css`
    position: absolute;
    top: 0;
    left: 0;
    text-align: center;
    z-index: 102;
    border-radius: 1em;
    box-sizing: border-box;
    align-self: center;
    padding: 2%;
    margin: 0 2%;
    outline: none;
    box-shadow: 1em 2em 2.5em -1.5em hsla(0, 0%, 0%, 0.95);
    border: 1em black solid;
    background-color: rgba(13, 98, 4, 0.95);
    border-radius: 40em 3em 40em 3em/3em 40em 3em 40em;
    color: white;
    font-family: Arial, sans-serif;
    transition-property: transform, opacity;
    transition-duration: 0.7s;
    transition-timing-function: ease-in-out;
    transform-style: flat;

    &:before {
        content: '';
        display: block;
        position: absolute;
        left: 0;
        top: 0;
        width: 100%;
        height: 100%;
        border-radius: 40em 1.5em 40em 1.5em/1.5em 40em 1.5em 40em;
        background-color: rgba(255, 255, 255, 0.1);
    }

    &:hover {
        box-shadow: 2em 4em 5em -3em hsla(0, 0%, 0%, 0.5);
    }

    & > h2 {
        position: relative;
        font-size: 5em;
        margin: 0 1em;
    }

    & > p {
        position: relative;
        text-align: center;
        font-size: 3.5em;
        white-space: break-spaces;

        strong {
            font-weight: bold;
        }

    }

    & > button {
        font-size: 3.2em;
    }
`

const closePopupStyle = css`
    position: relative;
    float: right;
    text-align: center;
    margin-top: -2%;
    margin-right: -0%;
    font-size: 4em;
    color: white;
    z-index: 1;

    &:hover {
        cursor: pointer;
        color: black;
    }
`

export const popupWidth = (boxWidth: number) => css`
    width: ${boxWidth}%;
`

export const popupPosition = ({boxTop, boxLeft, arrow}: TutorialStepDescription) => css`
    transform: translate(${boxLeft * 16 / 9}em, ${boxTop}em) translate(-50%, ${!arrow || arrow.angle % 180 !== 0 ? -50 : arrow.angle % 360 === 0 ? 0 : -100}%) translateZ(300em);
`

const arrowStyle = (angle: number) => css`
    position: absolute;
    transform: rotate(${angle}deg) translateZ(0.1em);
    will-change: transform;
    z-index: 102;
    transition-property: top, left, transform;
    transition-duration: 0.7s;
    transition-timing-function: ease-in-out;
`

const showArrowStyle = (top: number, left: number) => css`
    top: ${top}%;
    left: ${left}%;
    width: 20%;
`

const hideArrowStyle = css`
    top: 150%;
    left: 150%;
    width: 0;
`

const imageStyle = css`
    height:2.5em;
    filter:drop-shadow(0 0 0.1em black);
    vertical-align: middle;
`

const resetStyle = css`
    position: absolute;
    text-align: center;
    top: 45%;
    right: 5%;
    font-size: 3em;
    width: 11em;
    height: fit-content;
    font-family: 'Reggae One', sans-serif;
`

type TutorialStepDescription = {
    title: (t: TFunction) => string
    text: string
    boxTop: number
    boxLeft: number
    boxWidth: number
    arrow?: {
        angle: number
        top: number
        left: number
    }
    image?: string
}

const tutorialDescription: TutorialStepDescription[][] = [
    [
        {
            title: (t: TFunction) => t('title.welcome'),
            text: 'tuto.welcome',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50
        },
        {
            title: (t: TFunction) => t('title.your.board'),
            text: 'tuto.your.board',
            boxTop: 42,
            boxLeft: 44,
            boxWidth: 50,
            arrow: {
                angle: 270,
                top: 36,
                left: 7
            }
        },
        {
            title: (t: TFunction) => t('title.your.opponent'),
            text: 'tuto.your.opponent',
            boxTop: 55,
            boxLeft: 42,
            boxWidth: 50,
            arrow: {
                angle: 90,
                top: 48,
                left: 62
            }
        },
        {
            title: (t: TFunction) => t('title.the.goal'),
            text: 'tuto.the.goal',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 55,
        },
        {
            title: (t: TFunction) => t('title.setup.phase.1'),
            text: 'tuto.setup.phase.1',
            boxTop: 70,
            boxLeft: 61,
            boxWidth: 40,
            arrow: {
                angle: 270,
                top: 66,
                left: 30
            }
        },
        {
            title: (t: TFunction) => t('title.setup.phase.2'),
            text: 'tuto.setup.phase.2',
            boxTop: 52,
            boxLeft: 38,
            boxWidth: 50,
            arrow: {
                angle: 225,
                top: 59,
                left: 9
            }
        },
        {
            title: (t: TFunction) => t('title.placement.rule'),
            text: 'tuto.placement.rule',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 70,
        },
        {
            title: (t: TFunction) => t('title.your.first.clover.1'),
            text: 'tuto.your.first.clover.1',
            boxTop: 67,
            boxLeft: 66,
            boxWidth: 50,
            arrow: {
                angle: 270,
                top: 59,
                left: 30
            }
        },
        {
            title: (t: TFunction) => t('title.your.first.clover.2'),
            text: 'tuto.your.first.clover.2',
            boxTop: 55,
            boxLeft: 42,
            boxWidth: 55,
            arrow: {
                angle: 270,
                top: 47,
                left: 3
            }
        }
        
    ],[
        {
            title: (t: TFunction) => t('title.place.second.clover.1'),
            text: 'tuto.place.second.clover.1',
            boxTop: 55,
            boxLeft: 66,
            boxWidth: 50,
            arrow: {
                angle: 270,
                top: 47,
                left: 30
            }
        },
        {
            title: (t: TFunction) => t('title.place.second.clover.2'),
            text: 'tuto.place.second.clover.2',
            boxTop: 65,
            boxLeft: 47,
            boxWidth: 55,
            arrow: {
                angle: 270,
                top: 58,
                left: 8
            }
        }
    ],[
        {
            title: (t: TFunction) => t('title.place.third.clover'),
            text: 'tuto.place.third.clover',
            boxTop: 78,
            boxLeft: 52,
            boxWidth: 55,
            arrow: {
                angle: 270,
                top: 70,
                left: 13
            }
        }
    ],[
        {
            title: (t: TFunction) => t('title.last.clover.is.bad.1'),
            text: 'tuto.last.clover.is.bad.1',
            boxTop: 50,
            boxLeft: 55,
            boxWidth: 50,
        },
        {
            title: (t: TFunction) => t('title.last.clover.is.bad.2'),
            text: 'tuto.last.clover.is.bad.2',
            boxTop: 70,
            boxLeft: 56,
            boxWidth: 50,
            arrow: {
                angle: 270,
                top: 83,
                left: 20
            }
        },
        {
            title: (t: TFunction) => t('title.place.last.clover'),
            text: 'tuto.place.last.clover',
            boxTop: 70,
            boxLeft: 56,
            boxWidth: 50,
            arrow: {
                angle: 270,
                top: 83,
                left: 20
            }
        }
    ],[
        {
            title: (t: TFunction) => t('title.watch.opponent.setup'),
            text: 'tuto.watch.opponent.setup',
            boxTop: 72,
            boxLeft: 42,
            boxWidth: 55,
            arrow: {
                angle: 90,
                top: 70,
                left: 65
            }
        }, 
        {
            title: (t: TFunction) => t('title.player.turn'),
            text: 'tuto.player.turn',
            boxTop: 42,
            boxLeft: 39,
            boxWidth: 55,
            arrow: {
                angle: 270,
                top: 35,
                left: 0
            }
        }, 
        {
            title: (t: TFunction) => t('title.draw.clover.rule'),
            text: 'tuto.draw.clover.rule',
            boxTop: 30,
            boxLeft: 50,
            boxWidth: 50,
        },
        {
            title: (t: TFunction) => t('title.draw.clover'),
            text: 'tuto.draw.clover',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
            arrow: {
                angle: 180,
                top: 50,
                left: 40
            }
        },
    ],[
        {
            title: (t: TFunction) => t('title.place.fifth.clover.1'),
            text: 'tuto.place.fifth.clover.1',
            boxTop: 55,
            boxLeft: 66,
            boxWidth: 50,
            arrow: {
                angle: 270,
                top: 47,
                left: 30
            }
        },
        {
            title: (t: TFunction) => t('title.place.fifth.clover.2'),
            text: 'tuto.place.fifth.clover.2',
            boxTop: 55,
            boxLeft: 66,
            boxWidth: 50,
            arrow: {
                angle: 270,
                top: 47,
                left: 30
            }
        },
        {
            title: (t: TFunction) => t('title.place.fifth.clover.3'),
            text: 'tuto.place.fifth.clover.3',
            boxTop: 65,
            boxLeft: 39,
            boxWidth: 55,
            arrow: {
                angle: 270,
                top: 59,
                left: 0
            }
        },
    ],[
        {
            title: (t: TFunction) => t('title.place.discarded.clover.rule'),
            text: 'tuto.place.discarded.clover.rule',
            boxTop: 40,
            boxLeft: 50,
            boxWidth: 60,
        },
        {
            title: (t: TFunction) => t('title.place.sixth.clover.1'),
            text: 'tuto.place.sixth.clover.1',
            boxTop: 28,
            boxLeft: 30,
            boxWidth: 60,
            arrow: {
                angle: 0,
                top: 15,
                left: 1
            }
        },
        {
            title: (t: TFunction) => t('title.place.sixth.clover.2'),
            text: 'tuto.place.sixth.clover.2',
            boxTop: 55,
            boxLeft: 47,
            boxWidth: 55,
            arrow: {
                angle: 270,
                top: 47,
                left: 8
            }
        },
        
    ],[
        {
            title: (t: TFunction) => t('title.draw.again.1'),
            text: 'tuto.draw.again.1',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 50,
        },
    ],
    [
        {
            title: (t: TFunction) => t('title.place.and.discard.rule'),
            text: 'tuto.place.and.discard.rule',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 60,
        },
        {
            title: (t: TFunction) => t('title.place.and.discard'),
            text: 'tuto.place.and.discard',
            boxTop: 75,
            boxLeft: 35,
            boxWidth: 60,
            arrow: {
                angle: 180,
                top: 74,
                left: 16
            }
        },
    ],[
        {
            title: (t: TFunction) => t('title.draw.again.2'),
            text: 'tuto.draw.again.2',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 60,
        }
    ],[
        {
            title: (t: TFunction) => t('title.discard.rule'),
            text: 'tuto.discard.rule',
            boxTop: 35,
            boxLeft: 50,
            boxWidth: 60,
        },
        {
            title: (t: TFunction) => t('title.discard.clover'),
            text: 'tuto.discard.clover',
            boxTop: 43,
            boxLeft: 35,
            boxWidth: 50,
            arrow: {
                angle: 0,
                top: 30,
                left: 12
            }
        },
    ],[
        {
            title: (t: TFunction) => t('title.reminder.goal'),
            text: 'tuto.reminder.goal',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 60,
        },
        {
            title: (t: TFunction) => t('title.end.of.tutorial'),
            text: 'tuto.end.of.tutorial',
            boxTop: 50,
            boxLeft: 50,
            boxWidth: 60,
        },
    ]
      
]

const tutorialEndGame = {
    title: (t: TFunction) => t('Congratulations'),
    text: 'tuto.complete',
    boxTop: 30,
    boxLeft: 50,
    boxWidth: 70
}


export default TutorialPopup