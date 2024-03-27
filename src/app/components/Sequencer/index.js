"use client"
// "global localStorage"
import { memo } from "react";
import { useAtom } from "jotai";
import { nanoid } from 'nanoid'

import { atomWithStorage } from 'jotai/utils';

// based on https://codesandbox.io/p/sandbox/recursive-nodes-demo-with-jotai-ff7y1u?file=%2Fsrc%2FApp.js%3A17%2C1
// by Daishi Kato https://twitter.com/dai_shi/status/1548456520031305728
// from a google search on Jotai Recursive

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

export const rootNodes = atomWithStorage('rootNodes', []);


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

const Track = memo(({ node, layer, position, addTracks, updateTracks }) => {

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

      <Tracks nodes={node.childNodes} layer={layer+1} position={position} addTracks={addTracks} updateTracks={updateTracks} />

    </div>
  );
});

const Tracks = ({nodes, layer = 0, addTracks, updateTracks, position=[]}) => {
  return (
    <div className="flex flex-row gap-1">
      {nodes?.length > 0 && nodes.map((t, index) => (
        <Track node={t} layer={layer} key={`${[...position,index]}`} position={[...position, index]} addTracks={addTracks} updateTracks={updateTracks}/>
      ))}
      <div className={`${nodes.length > 0 ? 'min-w-[.5rem]' : ''}`}></div>
      <NewTrack addTracks={addTracks} position={position}/>
    </div>
  )
}


const NewTrack = ({ addTracks, position }) => {
  const add = () => {
    addTracks(position);
  };
  return (
    <div className="flex flex-col justify-center">
      <div className=" bg-orange-700 rounded-lg text-white w-max px-2 text-lg cursor-pointer "
          onClick={add}
      >
        +
      </div>
    </div>
  );
};

const Sequencer = () => {

  const [rootNodesAtom, setRootNodesAtom] = useAtom(rootNodes)

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

  const updateTracks = (position = [0], updates) => {
    const updatedValue = updateTrackValue(position, updates, [...rootNodesAtom])
    setRootNodesAtom(updatedValue);
  }

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

  const addTracks = (position = []) => {
    const updatedValue = addTrack(position, [...rootNodesAtom], position)
    setRootNodesAtom(updatedValue);
  }


  return(
    <Tracks nodes={rootNodesAtom} updateTracks={updateTracks} addTracks={addTracks}/>
  )
}

export default Sequencer;