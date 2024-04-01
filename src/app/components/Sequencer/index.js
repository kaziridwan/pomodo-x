"use client"
// "global localStorage"
import { memo } from "react";
import { atom, useAtom } from "jotai";
import { nanoid } from 'nanoid'

import { atomWithStorage } from 'jotai/utils';

import { setlinearTrackMapAtom } from "@/app/atoms/linearTrackMap";

const BASE_NODE = {
  value: { 
    title: 'New Track',
    identifier: '',
    url: 'http',
    duration: 5,
    repeat: 1,
    played: 0,
    position: [],
  },
  childNodes: [],
}

export const sequencerAtom = atomWithStorage('sequencer', []);

const addTrack = (position = [], tracks = [], coordinates) => {
  if(position.length === 0 ) {
    return [...tracks, {
      ...BASE_NODE,
      value: {
        ...BASE_NODE.value,
        title: `track-${coordinates.length > 0 ? `${coordinates},` : ''}${tracks.length}`,
        position: coordinates.length === 0 ? [tracks.length] :  [...coordinates, tracks.length], // we need to recalculate position on drag/ drop/ delete
        identifier: nanoid(),
      }
    }]
  } else {
    const [firstCoordinate, ...remainingCoordinates] = position;
    tracks[firstCoordinate].childNodes = addTrack(remainingCoordinates, tracks[firstCoordinate].childNodes, coordinates);
    return tracks;
  }
}

const addNewTrackAtom = atom(
  null,
  (get, set, position) => {
    const sequencer = get(sequencerAtom);
    const updatedValue = addTrack(position, [...sequencer], position)
    set(sequencerAtom, updatedValue)
    set(setlinearTrackMapAtom)
  }
)

const updateTrackValue = (position = [0], updates, tracks = []) => {
  const [firstCoordinate, ...remainingCoordinates] = position;
  if(position.length === 1) {
    tracks[firstCoordinate].value = {
      ...tracks[firstCoordinate].value,
      ...updates
    };
  } else {
    tracks[firstCoordinate].childNodes = updateTrackValue(remainingCoordinates, updates, tracks[firstCoordinate].childNodes); 
  }
  return tracks;
}

export const updateTrackAtom = atom(
  null,
  (get, set, {position, updates}) => {
    const sequencer = get(sequencerAtom)
    const updatedValue = updateTrackValue(position, updates, [...sequencer])
    set(sequencerAtom, updatedValue)
  }
)

export const getTrackAtPosition = (position = [0,0,1], sequence = []) => {
  if(position.length === 0) {
    return sequence;
  }
  if(position.length === 1) {
    return sequence[position[0]]
  } else {
    const [parentPosition, ...childPositions] = position;
    console.log('loggr sequecer', sequence, parentPosition, position)
    return getTrackAtPosition(childPositions, sequence[parentPosition].childNodes)
  }
}

const updateValuesGlobally = (sequencer, updates) => {
  console.log('loggr global sequencer is ', sequencer)
  return sequencer.map((childTrack) => {
    if(childTrack.childNodes.length > 0) {
      return {
        value: {
          ...childTrack.value,
          ...updates
        },
        childNodes: updateValuesGlobally(childTrack.childNodes, updates)
      }
    } else {
      return {
        value: {
          ...childTrack.value,
          ...updates
        },
        childNodes: []
      }
    }
  })
} 

export const updateAllValuesAtom = atom(
  null,
  (get, set, updates) => {
    const sequencer = get(sequencerAtom);
    console.log('loggr sequencer is ', sequencer)
    const updatedSequencer = updateValuesGlobally(sequencer, updates)
    set(sequencerAtom, updatedSequencer)
  }
)

const getBgColor = (layerNumber) => {
  const bgColorsMap = [
    'bg-green-400',
    'bg-gray-500',
    'bg-lime-400',
    'bg-orange-400',
  ]
  const layer = layerNumber + 1;

  if(layer % 4 === 0 ) {
    return bgColorsMap[3]
  } else if(layer % 3 === 0 ) {
    return bgColorsMap[2]
  } else if(layer % 2 === 0 ) {
    return bgColorsMap[1]
  } else {
    return bgColorsMap[0]
  }
}

const AutogrowInput = ({wrapperStyles= '', className = '', value, size = 1, ...props}) => (
  <div className={`inline-grid [place-items:center_start] ${wrapperStyles}`}>
    <input className={`[grid-area:1/1/2/2] h-full bg-transparent appearance-none bg-none border-none min-w-[1rem] resize-none w-full ${className}`} size={size} value={value} {...props}/>
    <span className={`[visibility:hidden] [grid-area:1/1/2/2] ${className}`}>{value}</span>
  </div>
)

const Field = ({value, ...props}) => {
  return (
    <AutogrowInput className=" text-black " type={props.type ?? "text"} value={value} {...props}/>
  )
}

const Track = memo(({ node, layer, position }) => {
  const [,updateTrackValue] = useAtom(updateTrackAtom)

  const updateTracks = (positionValue, updates) => {
    updateTrackValue({position: positionValue, updates})
  }

  return (
    <div className={`${getBgColor(layer)} p-4 rounded-tl-2xl `}>
      <Field value={node.value?.title} onChange={(e) => { updateTracks(position, { title: e.target.value }) }}/>
      <Field value={node.value?.duration} onChange={(e) => { updateTracks(position, { duration: e.target.value !== '' ? parseInt(e.target.value, 10) : 1 }) }}/>
      <span>x</span>
      <span>{node.value.played}</span>
      <span>/</span>
      <Field value={node.value.repeat} onChange={(e) => { updateTracks(position, { repeat: e.target.value !== '' ? parseInt(e.target.value, 10) : 1 }) }}/>
      <br/>
      <div>
        <Field value={node.value?.url} onChange={(e) => { updateTracks(position, { url: e.target.value }) }}/>
      </div>

      <Tracks nodes={node.childNodes} layer={layer+1} position={position} />

    </div>
  );
});

const Tracks = ({nodes, layer = 0, position=[]}) => {
  return (
    <div className="flex flex-row gap-1">
      {nodes?.length > 0 && nodes.map((t, index) => (
        <Track node={t} layer={layer} key={`${[...position,index]}`} position={[...position, index]}/>
      ))}
      <div className={`${nodes.length > 0 ? 'min-w-[.5rem]' : ''}`}></div>
      <NewTrack position={position}/>
    </div>
  )
}


const NewTrack = ({ position }) => {
  const [,addNewTrack] = useAtom(addNewTrackAtom);
  return (
    <div className="flex flex-col justify-center">
      <div className=" bg-orange-700 rounded-lg text-white w-max px-2 text-lg cursor-pointer "
          onClick={() => addNewTrack(position)}
      >
        +
      </div>
    </div>
  );
};

const Sequencer = () => {

  const [sequencer] = useAtom(sequencerAtom)

  return(
    <Tracks nodes={sequencer}/>
  )
}

export default Sequencer;