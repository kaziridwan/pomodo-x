"use client"

import { atom } from 'jotai'
import { sequencerAtom, getTrackAtPosition, updateTrackAtom, updateAllValuesAtom } from '@components/Sequencer'
import { playerAtom, playerPlayActionAtom, playerPauseActionAtom } from "../components/Controls"
import { atomWithStorage } from 'jotai/utils';

import { isValidUrl } from "../components/MediaPlayer";

export const linearTrackMapAtom = atomWithStorage('linearTrackMap', []);
// i am using recursion instead of while rigorously
const generateLinearTrackmap = (sequence, position = [], map = []) => { // dfs, tree-graph
  if(!sequence.length || sequence.length == 0) {
    return []
  }
  for (const [index, track] of sequence.entries()) {
    if(track.childNodes.length === 0) {
      map.push({
        ...track,
      });
    } else {
      const deeperTracks = generateLinearTrackmap(track.childNodes, [...position, index]);
      map.push(...deeperTracks);
    }
  }
  return map.filter(track => isValidUrl(track.url));
}

export const setlinearTrackMapAtom = atom(
  null,
  (get, set) => {
    const sequencer = get(sequencerAtom);
    const newLinearMap = generateLinearTrackmap(sequencer);
    set(linearTrackMapAtom, newLinearMap)
  }
);

const playedIncrementsUpdateChain = (track, sequencer) => {
  const positionChains = track.value.position.map((_val, index) => (track.value.position.slice(0, track.value.position.length - index)))
  return positionChains.map((trackPosition, index) => {
    const trackAtCursor = getTrackAtPosition(trackPosition, sequencer);
    if(index === 0) {
      return {
        ...trackAtCursor,
        value: {
          ...trackAtCursor.value,
          played: trackAtCursor.value.played + 1
        }
      }
    } else {
      // check if childTrack is last track
      const lastTrackPosition = positionChains[index - 1];
      const lastTrackSubIndex = lastTrackPosition[lastTrackPosition.length - 1];
      if(trackAtCursor.childNodes.length - 1 === lastTrackSubIndex) {
        return {
          ...trackAtCursor,
          value: {
            ...trackAtCursor.value,
            played: trackAtCursor.value.played + 1
          }
        }
      } else {
        return trackAtCursor;
      }
    }
  })
}

const itShouldLoop = (track) => (track.value.played < track.value.repeat)
const itsNotTheLastTrack = (trackIndex, trackMap) => (trackIndex < trackMap.length - 1)
const getTrackIndexForPosition = (position, trackMap) => {
  return trackMap.findIndex(track => track.position === position)
}

export const playNextTrackAtom = atom(
  null,
  (get, set, currentTrackIndex) => {
    set(playerPauseActionAtom)
    const trackMap = get(linearTrackMapAtom);
    const sequencer = get(sequencerAtom);
    // update the sequencer
    const updatedSequencerValues = playedIncrementsUpdateChain(trackMap[currentTrackIndex], sequencer)
    
    // update the sequencer
    // set(sequencerAtom, updatedSequencerState)
    for(const sequencerTrackUpdate of updatedSequencerValues) {
      set(updateTrackAtom, {position: sequencerTrackUpdate.value.position, updates: {played: sequencerTrackUpdate.value.played}})
    }
    
    // update the player
    // either its 
    /**
     * the same track
     * first track of the parent 
     * or the first of the sequencer
     *
     * can be figured out by
     * its own play count
     * then parents play count
     * then its trackIndex 
     *  */
    if(itsNotTheLastTrack(currentTrackIndex, trackMap) || !trackMap.length === 1){
      if(itShouldLoop(updatedSequencerValues[0])) {
        // do nothing for now
      } else {
        if(!updatedSequencerValues.length > 1 && itShouldLoop(updatedSequencerValues[1])) {
          const loopbackIndex = getTrackIndexForPosition([...updatedSequencerValues[1].value.position, 0],trackMap)
          set(playerAtom, (prev) => ({...prev, currentTrackIndex: loopbackIndex}))
        } else {
          // set the index to next one
          set(playerAtom, (prev) => ({...prev, currentTrackIndex: currentTrackIndex + 1}))
        }
      }
    } else {
      // play from beggining
      set(updateAllValuesAtom, {played: 0})
      set(playerAtom, (prev) => ({...prev, currentTrackIndex: 0}))
    }
    // that can be figured out from the play counts
    // set(playerAtom, (prev)=>({...prev, nextTrackIndex}))
    set(playerPlayActionAtom)
  }
)