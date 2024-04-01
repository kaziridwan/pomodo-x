"use client"
import { sequencerAtom } from '@components/Sequencer'
import { linearTrackMapAtom } from '@atoms/linearTrackMap'

export const playerAtom = atomWithStorage('player', {
  url: '',
  currentTrackIndex: 0,
  playback: 'paused', // playing | paused
})

const playerPlayActionAtom = atom(
  null,
  (get, set) => {
    set(playerAtom, (prev) => ({...prev, playback: 'playing'}))
  }
)

const playerPauseActionAtom = atom(
  null,
  (_get, set) => {
    set(playerAtom, (prev) => ({...prev, playback: 'paused'}))
  }
)

const playerPlaybackToggleActionAtom = atom(
  null,
  (get, set) => {
    const player = get(playerAtom);
    if(player.playback === "paused") {
      set(playerAtom, (prev) => ({...prev, playback: 'playing'}))
    } else {
      set(playerAtom, (prev) => ({...prev, playback: 'paused'}))
    }
  }
)

// const playNextActionAtom = atom(
//   null,
//   (get, set, updates) => {
//     set(incrementTrackPlayedAtom);
//   }
// )


const Controls = () => {
  return (
    <div>
      <div className=" cursor-pointer " onClick={playPause}>play</div>
      <div>-</div>
      <div className=" cursor-pointer " onClick={skipToNext}>skip next</div>
      <div>-</div>
      <div className=" cursor-pointer " onClick={playNext}>next</div>
    </div>
  )
}

export default Controls