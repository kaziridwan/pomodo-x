"use client"

import { atom } from 'jotai'
import { sequencerAtom } from '@components/Sequencer'

// i am using recursion instead of while rigorously
const getLinearTrackmap = (sequence, position = [], map = []) => { // dfs, tree-graph
  if(!sequence.length || sequence.length == 0) {
    return []
  }
  for (const [index, track] of sequence.entries()) {
    if(track.childNodes.length === 0) {
      map.push({
        ...track,
      });
    } else {
      const deeperTracks = getLinearTrackmap(track.childNodes, [...position, index]);
      map.push(...deeperTracks);
    }
  }
  return map;
}

export const linearTrackMapAtom = atom(
  (get) => {
    const sequencer = get(sequencerAtom);
    const linearMap = getLinearTrackmap(sequencer);
    return linearMap;
  }
);