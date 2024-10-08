"use client"
import { playNextTrackAtom, linearTrackMapAtom, setlinearTrackMapAtom } from '@atoms/linearTrackMap'
import { atom, useAtom } from "jotai";
import { atomWithStorage } from 'jotai/utils';
import { toMinutes } from "@/app/lib/util";
import { useKeypress } from "@/app/lib/useKeypress";

export const playerAtom = atomWithStorage('player', {
  url: '',
  currentTrackIndex: 0,
  currentTrackPosition: [0],
  playback: 'paused', // playing | paused | finished
  timeEllapsed: 0, // in ms
  started: 0, // in ms
})

export const playerPlayActionAtom = atom(
  null,
  (get, set) => {
    set(setlinearTrackMapAtom);
    const linearTrackMap = get(linearTrackMapAtom);
    set(playerAtom, (prev) => ({...prev, playback: 'playing', url: linearTrackMap[prev.currentTrackIndex].value.url, started: Date.now()}))
  }
)

export const playerPauseActionAtom = atom(
  null,
  (get, set) => {
    const prevPlayer = get(playerAtom)
    const timeEllapsedRecalculated = prevPlayer.timeEllapsed +  (Date.now() - prevPlayer.started)
    set(playerAtom, (prev) => ({...prev, playback: 'paused', timeEllapsed: timeEllapsedRecalculated, started: 0 }))
  }
)

const playPauseActionAtom = atom(
  null,
  (get, set) => {
    const {playback} = get(playerAtom);
    console.log(' play pause', playback)
    if(playback === 'playing') {
      set(playerPauseActionAtom)
    } else {
      set(playerPlayActionAtom)
    }
  }
)

export const playNextActionAtom = atom(
  null,
  (get, set) => {
    const { currentTrackIndex } = get(playerAtom);
    set(playerAtom, (prev) => ({...prev, timeEllapsed: 0, started: Date.now() }));
    set(playNextTrackAtom, currentTrackIndex);
  }
)

export const skipToNextActionAtom = atom(
  null,
  (get, set) => {
    const { currentTrackIndex } = get(playerAtom);
    set(setlinearTrackMapAtom);
    const trackMap = get(linearTrackMapAtom);
    const nextTrackIndexRaw = currentTrackIndex+1;
    const nextTrackIndex = nextTrackIndexRaw > trackMap.length - 1 ? 0 : nextTrackIndexRaw;
    set(playerPauseActionAtom);
    set(playerAtom, (prev) => ({...prev, currentTrackIndex: nextTrackIndex, timeEllapsed: 0}));
    set(playerPlayActionAtom);
  }
)

export const checkStageJumpAtom = atom(
  null,
  (get, set) => {
    const player = get(playerAtom)
    if(player.playback === "playing") {
      set(setlinearTrackMapAtom); // need to figure this out
      const trackMap = get(linearTrackMapAtom);
      const currentTrack = trackMap[player.currentTrackIndex];
      const totalPlayTimeInMs = player.timeEllapsed + (Date.now() - player.started)
      const playTimeMinutes = toMinutes(totalPlayTimeInMs);
      
      // console.log('loggr checking for stage jump', playTimeMinutes, currentTrack, trackMap, player.currentTrackIndex)
      if(playTimeMinutes > currentTrack.value.duration) {
        set(playNextActionAtom)
      }
    }
  }
)

export const getCurrentLinearTrackAtom = atom(
  (get) => {
    const player = get(playerAtom)
    const trackMap = get(linearTrackMapAtom);
    return trackMap[player.currentTrackIndex];
  }
)


const Controls = () => {
  const [, playPause] = useAtom(playPauseActionAtom)
  const [, playNext] = useAtom(playNextActionAtom)
  const [, skipNext] = useAtom(skipToNextActionAtom)

  useKeypress(() => {
    playPause();
  }, ' ', {
    doublePress: () => {
      playNext();
    },
    tripplePress: () => {
      skipNext();
    },
  }, 300);

  return (
    <div className="flex flex-row-reverse xl:flex-col-reverse p-4 gap-4 xl:h-full">
      <div className=" bg-white flex h-full xl:h-max w-12 cursor-pointer text-black p-2 rounded-md" onClick={playPause} title="Alternatively press space">play</div>
      {/* <div>-</div> */}
      <div className=" bg-white flex h-full xl:h-max w-12 cursor-pointer text-black p-2 rounded-md" onClick={playNext} title="Alternatively double-press space">next</div>
      {/* <div>-</div> */}
      <div className=" flex flex-row gap-1 xl:flex-col items-center bg-white h-full xl:h-max w-auto xl:w-12 cursor-pointer text-black p-2 rounded-md" onClick={skipNext} title="Alternatively tripple-press space">skip <span>next</span></div>
    </div>
  )
}

export default Controls