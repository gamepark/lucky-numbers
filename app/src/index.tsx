import {css, Global} from '@emotion/react'
import {LuckyNumbersOptionsSpec} from '@gamepark/lucky-numbers/LuckyNumbersOptions'
import LuckyNumbers from '@gamepark/lucky-numbers/LuckyNumbers'
import {GameProvider, setupTranslation} from '@gamepark/react-client'
import normalize from 'emotion-normalize'
import {StrictMode} from 'react'
import ReactDOM from 'react-dom'
import App from './App'
import LuckyNumbersView from './LuckyNumbersView'
import translations from './translations.json'
import luckyNumbersAnimations from './LuckyNumbersAnimations'
import LuckyNumbersTutorial from './tutorial/Tutorial'
import tutorialAI from './tutorial/TutorialAI'

setupTranslation(translations, {debug: false})

const style = css`
  html {
    -webkit-box-sizing: border-box;
    -moz-box-sizing: border-box;
    box-sizing: border-box;
  }

  *, *::before, *::after {
    -webkit-box-sizing: inherit;
    -moz-box-sizing: inherit;
    box-sizing: inherit;
  }

  body {
    margin: 0;
    font-family: 'Righteous', cursive;
    font-size: 1vh;
    @media (max-aspect-ratio: 16/9) {
      font-size: calc(9vw / 16);
    }
  }

  #root {
    position: absolute;
    height: 100vh;
    width: 100vw;
    user-select: none;
    overflow: hidden;
    background-image: url(${process.env.PUBLIC_URL + '/cover-1920.jpg'});
    background-color: white;
    background-size: cover;
    background-position: center;
    color: #eee;

    &:before {
      content: '';
      display: block;
      position: absolute;
      left: 0;
      top: 0;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.8);
    }
  }
`

ReactDOM.render(
  <StrictMode>
    <GameProvider game="lucky-numbers" 
                  Rules={LuckyNumbers} 
                  RulesView={LuckyNumbersView} 
                  optionsSpec={LuckyNumbersOptionsSpec}
                  animations={luckyNumbersAnimations}
                  tutorial={LuckyNumbersTutorial}
                  ai={tutorialAI}
    >
      <App/>
    </GameProvider>
    <Global styles={[normalize, style]}/>
  </StrictMode>,
  document.getElementById('root')
)
