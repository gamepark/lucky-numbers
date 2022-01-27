/** @jsxImportSource @emotion/react */
import GameView from '@gamepark/lucky-numbers/GameView'
import {FailuresDialog, FullscreenDialog, Menu, useGame} from '@gamepark/react-client'
import {Header, ImagesLoader, LoadingScreen} from '@gamepark/react-components'
import {useEffect, useState} from 'react'
import {DndProvider} from 'react-dnd-multi-backend'
import HTML5ToTouch from 'react-dnd-multi-backend/dist/cjs/HTML5toTouch'
import GameDisplay from './GameDisplay'
import HeaderText from './HeaderText'
import Images from './Images'
import { AudioLoader } from './sounds/AudioLoader'
import { SoundLoader } from './sounds/SoundLoader'
import fiipSound from './sounds/flip.mp3';
import moveSound from './sounds/moveTile.mp3';
import winSound from './sounds/win.mp3';
import brunoVariantSound from './sounds/brunoVariant.mp3';

export default function App() {
  const game = useGame<GameView>()
  const [audioLoader, setAudioLoader] = useState<AudioLoader>()
  const [isSoundsLoading, setSoundLoading] = useState(true)
  const [imagesLoading, setImagesLoading] = useState(true)
  const [isJustDisplayed, setJustDisplayed] = useState(true)
  useEffect(() => {
    setTimeout(() => setJustDisplayed(false), 2000)
  }, [])
  const loading = !game || imagesLoading || isJustDisplayed || isSoundsLoading
  return (
    <DndProvider options={HTML5ToTouch}>
      {!loading && game && audioLoader && <GameDisplay game={game} audioLoader={audioLoader} />}
      <LoadingScreen display={loading} author="Michael Schacht" artist="Christine Alcouffe" publisher="Tiki Editions" developer="Théo Grégorio"/>
      <Header><HeaderText loading={loading} game={game}/></Header>
      <SoundLoader sounds={[fiipSound, moveSound, winSound, brunoVariantSound]} onSoundLoad={() => setSoundLoading(false)} onSoundsPrepared={ (audioLoader) => setAudioLoader(audioLoader) }/>
      <Menu/>
      <FailuresDialog/>
      <FullscreenDialog/>
      <ImagesLoader images={Object.values(Images)} onImagesLoad={() => setImagesLoading(false)}/>
    </DndProvider>
  )
}