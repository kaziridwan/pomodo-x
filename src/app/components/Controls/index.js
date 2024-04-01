"use client"
import { playNextTrackAtom, linearTrackMapAtom, setlinearTrackMapAtom } from '@atoms/linearTrackMap'
import { atom, useAtom } from "jotai";
import { atomWithStorage } from 'jotai/utils';

export const playerAtom = atomWithStorage('player', {
  url: '',
  currentTrackIndex: 0,
  playback: 'paused', // playing | paused
})

export const playerPlayActionAtom = atom(
  null,
  (get, set) => {
    set(setlinearTrackMapAtom);
    const linearTrackMap = get(linearTrackMapAtom);
    console.log('loggr playing with lineartmp', linearTrackMap)
    set(playerAtom, (prev) => ({...prev, playback: 'playing', url: linearTrackMap[prev.currentTrackIndex].value.url}))
  }
)

export const playerPauseActionAtom = atom(
  null,
  (_get, set) => {
    set(playerAtom, (prev) => ({...prev, playback: 'paused'}))
  }
)

const playPauseActionAtom = atom(
  null,
  (get, set) => {
    const {playback} = get(playerAtom);
    if(playback === 'playing') {
      set(playerPauseActionAtom)
    } else {
      set(playerPlayActionAtom)
    }
  }
)


const playNextActionAtom = atom(
  null,
  (get, set, updates) => {
    const { currentTrackIndex } = get(playerAtom);
    set(playNextTrackAtom, currentTrackIndex);
  }
)


const Controls = () => {
  const [, playPause] = useAtom(playPauseActionAtom)
  const [, playNext] = useAtom(playNextActionAtom)
  return (
    <div>
      <div className=" cursor-pointer " onClick={playPause}>play</div>
      <div>-</div>
      <div className=" cursor-pointer " onClick={playPause}>skip next</div>
      <div>-</div>
      <div className=" cursor-pointer " onClick={playNext}>next</div>
    </div>
  )
}

export default Controls