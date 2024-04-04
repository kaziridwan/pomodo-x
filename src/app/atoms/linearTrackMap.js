"use client"

import { atom } from 'jotai'
import { sequencerAtom, getTrackAtPosition, updateTrackAtom, resetLoopsInAtom, updateAllValuesAtom } from '@components/Sequencer'
import { playerAtom, playerPlayActionAtom, playerPauseActionAtom } from "../components/Controls"
import { atomWithStorage } from 'jotai/utils';

export const linearTrackMapAtom = atomWithStorage('linearTrackMap', []);
// i am using recursion instead of while rigorously
const generateLinearTrackmap = (sequence, position = [], map = [] ) => { // dfs, tree-graph
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
  // return map.filter(track => isValidUrl(track.value.url));
  return map;
}

export const setlinearTrackMapAtom = atom(
  null,
  (get, set) => {
    const sequencer = get(sequencerAtom);
    const newLinearMap = generateLinearTrackmap(sequencer);
    set(linearTrackMapAtom, newLinearMap)
  }
);
/**
 * 
 * if should not loop
 *  if last child
 *    if theres a parent track
 *      recurse with parent track
 *    if no
 *      play from start of parent
 *  else
 *    play next child
 * else
 *  play self
 */

const findNextPlayableTrack = (track, sequencer, resetLoopsIn = []) => {
  const parentTrack = track.value.position.length === 1 ? null : getTrackAtPosition(track.value.position.slice(0, track.value.position.length - 1), sequencer);
  const tracksContext = parentTrack ? parentTrack.childNodes : sequencer;
  const isLoop = track.childNodes.length > 0;
  if(itsDonePlaying(track)){
    if(itsLastChild(track, tracksContext)) { // either it can replay (parent) context or [[[move next]]]
      if(parentTrack){ // its not a root level track
        return findNextPlayableTrack(parentTrack, sequencer, [...resetLoopsIn, parentTrack]);
      } else {
        return { // restart the loop
          ...getPlayableTrack(tracksContext[0]),
          resetLoopsIn,
          resetAllLoops: true
        };
      }
    } else { // play next
      const trackIndex = tracksContext.findIndex(t => t.value.identifier === track.value.identifier);
      const nextTrackIndex = trackIndex < tracksContext.length - 1 ? trackIndex + 1 : 0; 
      if(parentTrack) {
        return {
          ...getPlayableTrack(tracksContext[nextTrackIndex]),
          resetLoopsIn,
        }
      } else {
        return { // partial reset
          ...getPlayableTrack(tracksContext[nextTrackIndex]),
          resetLoopsIn,
        }
      }
    }
  } else { // it should loop
    if(isLoop) { // play it (or its last-gen child)
      return {
        ...getPlayableTrack(track),
        resetLoopsIn,
      };
    } else { // if its root level track, just ~~move next~~~ play again
      const trackIndex = tracksContext.findIndex(t => t.value.identifier === track.value.identifier);
      // const nextTrackIndex = trackIndex < tracksContext.length - 1 ? trackIndex + 1 : 0; 
      return {
        ...getPlayableTrack(track),
        resetLoopsIn,
      }
    }
  }
}

const itsLastChild = (track, tracksContext) => {
  // either its last child of its parent, but if its at the sequencer level, if its last child of the sequencer
  // make sure to sanitize the parent context
  // filter(item => isValidUrl(item.value.url))
  const childIndex = tracksContext.findIndex(item => item.value.identifier === track.value.identifier);
  return childIndex === tracksContext.length - 1
}

const getPlayableTrack = (track) => {
  if(track.childNodes.length === 0) {
    return {
      nextTrack: track,
    };
  } else {
    return getPlayableTrack(track.childNodes[0]);
  }
}

const playedIncrementsUpdateChain = (track, sequencer) => {
  const positionChains = track.value.position.map((_val, index) => (track.value.position.slice(0, track.value.position.length - index)))

  const increaseTrackPlayed = track => track.value.played < track.value.repeat ? track.value.played + 1 : track.value.played

  return positionChains.map((trackPosition, index) => {
    const trackAtCursor = getTrackAtPosition(trackPosition, sequencer);
    if(index === 0) {
      return {
        ...trackAtCursor,
        value: {
          ...trackAtCursor.value,
          played: increaseTrackPlayed(trackAtCursor),
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
            played: increaseTrackPlayed(trackAtCursor),
          }
        }
      } else {
        return trackAtCursor;
      }
    }
  })
}

const itShouldNotLoop = (track) => {
  return (track.value.played >= track.value.repeat - 1) // repeat - 1 because it should stop looping before the last play
}

const itsDonePlaying = (track) => {
  return (track.value.played >= track.value.repeat - 1 ) // repeat - 1 because it should stop looping before the last play
}

export const playNextTrackAtom = atom(
  null,
  (get, set, currentTrackIndex) => {
    set(playerPauseActionAtom)
    const trackMap = get(linearTrackMapAtom);
    const sequencer = get(sequencerAtom);
    // update the sequencer
    const { nextTrack, resetAllLoops, resetLoopsIn } = findNextPlayableTrack(trackMap[currentTrackIndex], sequencer);
    
    const updatedSequencerValues = playedIncrementsUpdateChain(trackMap[currentTrackIndex], sequencer)
    // update the sequencer
    // set(sequencerAtom, updatedSequencerState)
    for(const sequencerTrackUpdate of updatedSequencerValues) {
      set(updateTrackAtom, {position: sequencerTrackUpdate.value.position, updates: {played: sequencerTrackUpdate.value.played}})
    }
    
    const updatedSequencerWithPlayedCounts = get(sequencerAtom);
    const updatedTrackMap = get(linearTrackMapAtom);
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
    const nextTrackIndex = trackMap.findIndex(t => t.value.identifier === nextTrack.value.identifier)
    
    
    set(playerAtom, (prev) => ({...prev, currentTrackIndex: nextTrackIndex}));
    // that can be figured out from the play counts
    // set(playerAtom, (prev)=>({...prev, nextTrackIndex}))
    set(playerPlayActionAtom)
    if(resetAllLoops) {
      console.log('loggr reset all looops')
      set(updateAllValuesAtom, {played: 0})
    } else {
      // set(resetLoopsInAtom, resetLoopsIn)
    }
  }
)