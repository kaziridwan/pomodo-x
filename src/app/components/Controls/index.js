"use client"
import { useAtom } from "jotai";
import { atomWithStorage } from 'jotai/utils';

import { rootNodes } from "@components/Sequencer";

/**
 * 
 * https://www.youtube.com/watch?v=yIQd2Ya0Ziw&ab_channel=Calm
 * https://www.youtube.com/watch?v=MZhivjxcF-M&ab_channel=LofiEveryday
 * https://www.youtube.com/watch?ab_channel=OldiesClassic&v=nh9t5QSSzDE
 * https://www.youtube.com/watch?v=C-FLCLjiSYg
 * 
 */

export const playerStateAtom = atomWithStorage('playerState', {
  playerPosition: [],
  url: '',
  currentTrackIndex: 0,
  currentTrackObj: {},
  playback: 'paused', // playing | paused
})

// i am using recursion instead of while rigorously
const getLinearTrackmap = (sequence, position = [], map = []) => { // dfs, tree-graph
  if(!sequence.length || sequence.length == 0) {
    return []
  }
  for (const [index, track] of sequence.entries()) {
    if(track.childNodes.length === 0) {
      map.push({
        ...track,
        nextForLoop: 0,
      });
    } else {
      const deeperTracks = getLinearTrackmap(track.childNodes, [...position, index])
      map.push(...deeperTracks);
    }
  }
  return map;
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

const updatedTrackAtPosition = (position = [0], updates, tracks = []) => {
  const [firstCoordinate, ...remainingCoordinates] = position;
  if(position.length === 1) {
    tracks[firstCoordinate].value = {
      ...tracks[firstCoordinate].value,
      ...updates
    };
  } else {
    tracks[firstCoordinate].childNodes = updatedTrackAtPosition(remainingCoordinates, updates, tracks[firstCoordinate].childNodes); 
  }
  return tracks;
}

const Controls = () => {
  const [playerState, updatePlayerState] = useAtom(playerStateAtom);
  
  const setPlayerState = (updates) => {
    updatePlayerState({...playerState, ...updates});
  }

  const [sequencerState, setSequencerState] = useAtom(rootNodes);

  const trackMap = getLinearTrackmap(sequencerState);

  console.log('loggr sequencerState ',sequencerState)
    
  const updateSequencerState = (position, updates) => {
    const updatedState = updatedTrackAtPosition(position, updates, sequencerState)
    setSequencerState(updatedState);
  }

  const play = () => {
    console.log('loggr trackmap ',trackMap)
    const currentTrackObj = trackMap[playerState.currentTrackIndex];
    updateSequencerState(currentTrackObj.value.position, {played: currentTrackObj.value.played + 1})
    setPlayerState({
      playback: 'playing', 
      url: currentTrackObj.value.url,
      currentTrackObj,
    })
  }

  const pause = () => {
    if(playerState.playback === 'playing') {
      setPlayerState({playback: 'pause'})
    }
  }

  const playPause = () => {
    if(playerState.playback === 'playing') {
      pause();
    } else {
      play();
    }
  }

  // findNext
  // current Tracks

  const findNextSkipTrackIndex = () => {
    const nextTrackIndexRAW = playerState.currentTrackIndex + 1 ;
    const nextTrackIndex = nextTrackIndexRAW > trackMap.length - 1 ? 0 : nextTrackIndexRAW;
    return nextTrackIndex;
  }

  const getParentTrackPosition = (position) => {
    return position.length > 1 ? position.toSpliced(position.length-1, 1) : [];
  }

  const isCommonParent = (position1, position2) => {
    const position1Parent = getParentTrackPosition(position1);
    const position2Parent = getParentTrackPosition(position2);
    if(JSON.stringify(position1Parent) === JSON.stringify(position2Parent)) {// works in this use case, but not ideal, lodash isEqual() could be used
      return true;
    }
    return false;
  }

  const playNext = () => {
    // need to take care of playnext coming from the player sideeffect on play finish 
    if(playerState.currentTrackObj.value.played >= playerState.currentTrackObj.value.repeat) {
      updateSequencerState(playerState.currentTrackObj.value.position, {played: playerState.currentTrackObj.value.played + 1})
      return;
    }
    const parentTrackPosition = getParentTrackPosition(playerState.currentTrackObj.value.position);

    if(parentTrackPosition.length === 0) {
      skipToNext();
      return;
    }

    const nextTrackIndex = findNextSkipTrackIndex();
    const nextTrackPosition = trackMap[nextTrackIndex].value.position;

    if (isCommonParent(playerState.currentTrackObj.value.position, nextTrackPosition)) {
      skipToNext();
    } else { // this means double nested redundant loops are invalid
      const parentTrack = getTrackAtPosition(parentTrackPosition, sequencerState);

      // if need to loop back
      if (parentTrack.value.played >= parentTrack.value.repeat) {
        skipToNext();
      } else {
        pause();
        // increase parentTrackPlayCount, and play the first childtrack again
        updateSequencerState(parentTrack.value.position, {played: parentTrack.value.played + 1})
        setPlayerState({
          currentTrackIndex: trackMap.findIndex(track => JSON.stringify(track.value.position) === JSON.stringify([...parentTrackPosition, 0]))
        })
        play();
      }
    }
  }

  const skipToNext = () => {
    pause() // need to move to a two player solution
    const nextTrackIndex = findNextSkipTrackIndex();
    console.log('loggr nextTrack Index', nextTrackIndex)
    setPlayerState({ currentTrackIndex: nextTrackIndex })
    play();
  }

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