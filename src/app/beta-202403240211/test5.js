"use client"
import { useAtom, useAtomValue } from "jotai";
import { atomWithStorage } from 'jotai/utils';

import { rootNodes } from "../Sequencer";

export const playerStateAtom = atomWithStorage('playerState', {
  playerPosition: [],
  url: '',
  currentTrack: 0,
  playTimes: 0,
  playback: 'paused', // playing | paused
})

const validTrackURL = url => {
  const slashSplit = url.split('/');
  return slashSplit.length > 2 && slashSplit[slashSplit.length - 1] !== '';
}

const getPlayablePosition = (tracks, position = []) => { // BFS
  for (const [index, track] of tracks.entries()){
    if(track.childNodes.length === 0) {
      return [...position, index]
    } else {
      return getPlayablePosition(track, [...position, index]) // depth
    }
  }
}

const getTrackAtPosition = (position = [0, 1], sequence) => {
  if(position.length === 1) {
    return sequence[position[0]]
  } else {
    return position.reduce((_acc, curr, index) => { // dfs
      if (index === 0) {
        return sequence[curr]
      } else {
        return sequence.childNodes[curr];
      }
    }, sequence)
  }
}

const getNextPlayablePosition = (currentPosition, sequence) => { 
  const position = [...currentPosition];
  const currentCoord = position.pop(); // stack

  const parentTrack = getTrackAtPosition(position, sequence);

}
// i am using recursion instead of while rigorously

const getLinearTrackmap = (sequence, position = [], map = []) => { // dfs, tree-graph
  for (const [index, track] of sequence.entries()) {
    if(track.childNodes.length === 0) {
      map.push({...track, position: [...position, index] });
    } else {
      const deeperTracks = getLinearTrackmap(track.childNodes, [...position, index])
      map.push(...deeperTracks);
    }
  }
  return map;
} 

const Controls = () => {
  const [playerState, setPlayerState] = useAtom(playerStateAtom);

  const sequencerState = useAtomValue(rootNodes);

  const trackMap = getLinearTrackmap(sequencerState);

  const play = () => {
    console.log('loggr trackmap',trackMap)
    setPlayerState({playback: 'playing', url: trackMap[playerState.currentTrack].value.url})
  }

  const pause = () => {
    if(playerState.playback === 'playing') {
      setPlayerState({playback: 'pause'})
    }
  }

  const playNext = () => {
    // next sibling, or DFS search
  }

  return (
    <div className=" cursor-pointer " onClick={play}>
      Controls
    </div>
  )
}

export default Controls