"use client"

import { atom } from 'jotai'
import { sequencerAtom, getTrackAtPosition, updateTrackAtom, updateAllValuesAtom, resetAllFinishedLoopsAtom } from '@components/Sequencer'
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
     * if last track
     *  loopfrom beginning
     * else
     *  if self loop remaining
     *    loop self
     *  else
     *    play next
     * 
     * // another approach
     * 
     * take the context of the track, and move to its parents slowly
     * if (self) loop
     *  loop (self) -> play itself if it has no childtrack, or play first child track
     * or
     *  move one context up 
     *
     * // improvisation
     * if loop remaining
     *  go ahead and play
     * else
     *  move context up
     * 
     * // improvisation from other direction
     * if loop ended
     *  move context up and play next
     * else
     *  play
     * 
     * // improvisation from other direction
     * track
     * if loop ended
     *  get parent context
     *  if last child
     *    recurse with parent context
     *  else
     *    play next child
     * else
     *  if childtrack
     *    play first child track of child of child ...recursed
     *  else
     *    play self
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
const findNextPlayableTrack = (track, sequencer, trackMap) => {
  console.log("loggr digging through ", track)
  const parentTrack = track.value.position.length === 1 ? null : getTrackAtPosition(track.value.position.slice(0, track.value.position.length - 1), sequencer);
  const parentContext = parentTrack ? parentTrack.childNodes : sequencer;
  if(itShouldNotLoop(track)){
    console.log("loggr digging through parent ", parentTrack, parentContext, itShouldNotLoop(track),itsLastChild(track, parentContext) )
    if(itsLastChild(track, parentContext)) {
      if(parentTrack){ // its a root level track
        return findNextPlayableTrack(parentTrack, sequencer, trackMap);
      } else {
        console.log('loggr')
        return getPlayableTrack(parentContext[0], true); // restart the loop
      }
    } else { // play next
      if(parentTrack) {
        const trackIndex = trackMap.findIndex(t => t.value.identifier === track.value.identifier);
        const nextTrackIndex = trackIndex < trackMap.length - 1 ? trackIndex + 1 : 0; 
        return getPlayableTrack(trackMap[nextTrackIndex])
      } else {
        const trackIndex = sequencer.findIndex(t => t.value.identifier === track.value.identifier);
        const nextTrackIndex = trackIndex < sequencer.length - 1 ? trackIndex + 1 : 0;
        return getPlayableTrack(sequencer[nextTrackIndex], true, true) // partial reset
      }
    }
  } else {
    if(parentTrack) {
      return getPlayableTrack(track);
    } else {
      const trackIndex = sequencer.findIndex(t => t.value.identifier === track.identifier);
      const nextTrackIndex = trackIndex < sequencer.length - 1 ? trackIndex + 1 : 0; 
      return getPlayableTrack(sequencer[nextTrackIndex])
    }
  }
}

const itsLastChild = (track, parentContext) => {
  // either its last child of its parent, but if its at the sequencer level, if its last child of the sequencer
  // make sure to sanitize the parent context
  // filter(item => isValidUrl(item.value.url))
  const childIndex = parentContext.findIndex(item => item.value.identifier === track.value.identifier);
  console.log('loggr child Index ', childIndex)
  console.log('loggr parent length ', parentContext.length)
  return childIndex === parentContext.length - 1
}

const getPlayableTrack = (track, resetPlayedCounts = false, resetFinishedLoops = false) => {
  if(track.childNodes.length === 0) {
    return {
      nextTrack: track,
      resetPlayedCounts
    };
  } else {
    return getPlayableTrack(track.childNodes[0], resetPlayedCounts, resetFinishedLoops);
  }
}

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
const itShouldNotLoop = (track) => {
  return (track.value.played >= track.value.repeat - 1) // repeat - 1 because it should stop looping before the last play
}
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
    const { nextTrack, resetPlayedCounts, resetFinishedLoops } = findNextPlayableTrack(trackMap[currentTrackIndex], sequencer, trackMap);

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
    const nextTrackIndex = trackMap.findIndex(t => t.value.identifier === nextTrack.value.identifier)
    if(resetPlayedCounts) {
      if(resetFinishedLoops) {
        set(resetAllFinishedLoopsAtom)
      } else {
        set(updateAllValuesAtom, {played: 0})
      }
    }
    set(playerAtom, (prev) => ({...prev, currentTrackIndex: nextTrackIndex}));
    // that can be figured out from the play counts
    // set(playerAtom, (prev)=>({...prev, nextTrackIndex}))
    set(playerPlayActionAtom)
  }
)