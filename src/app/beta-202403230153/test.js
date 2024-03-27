"use client"
// import { useMemo, useState } from 'react';
// import { atom, useAtom } from 'jotai';
import { selectAtom, splitAtom } from "jotai/utils";
import { focusAtom } from "jotai-optics";

import { memo, useState } from "react";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

const trackObjBlueprint = {
  title: 'something',
  url: '',
  duration: undefined,
  repeat: undefined,
  tracks: [],
}

const trackAtom= atom(trackObjBlueprint);
const baseTrackAtomWritable = atom(
  (get) => get(trackAtom),
  (_get, set, newTrack) => set(trackAtom, newTrack),
)


const rootNodes = atom([]);
const appendNode = atom(null, (get, set, [nodes, value]) => {
  const node = atom({
    value: atom(value),
    childNodes: atom([])
  });
  set(nodes, (prev) => [...prev, node]);
});


const NewTrack = ({ nodes }) => {
  const append = useSetAtom(appendNode);
  const add = () => {
    append([nodes, { title: 'new', duration: 5, url: 'http://' }]);
  };
  return (
    <div className=" bg-orange-700 rounded-lg text-white w-max px-2 text-lg cursor-pointer "
        onClick={add}
    >
      +
    </div>
  );
};

const Track = memo(({ node, layer }) => {
  const { value, childNodes } = useAtomValue(node);
  return (
    <div className={`${layer % 2 === 0 ? `bg-blue-400` : 'bg-emerald-500'} p-4 `}>
      {value.title} - {value.duration?.toString()}
      <br/>
      
      {value.url}
      <Tracks nodes={childNodes} layer={layer} />


    </div>
  );
});

const Tracks = ({nodes, layer = 0}) => {
  // const trackAtomWritable = useMemo(() => atom(
  //   (get) => get(trackAtom),
  //   (_get, set, newTrack) => set(trackAtom, newTrack),
  // ), [trackAtom])
  // const subTracksAtom = useMemo(
  //   () => atom((get) => get(trackAtomWritable)?.tracks ?? []),
  //   [trackAtomWritable]
  // );
  
  // const subTracksAtomsAtom = splitAtom(subTracksAtom)
  // const [subTracksAtoms] = useAtom(subTracksAtomsAtom);
  // const [track, setTrackAtom] = useAtom(trackAtomWritable);

  // const [trackAtomAtom, setTrackAtom] = useAtom(trackAtom)
  // const subTrackFocuskAtom = focusAtom(trackAtomAtom, (optic) => optic.prop('tracks'))
  // const subTracskAtom = splitAtom(subTrackFocuskAtom);




  
  return (
    <div>
      { useAtomValue(nodes).map(((t) => (
        <Track node={t} layer={layer+1} key={`${t}`}/>
      )))}
      <NewTrack nodes={nodes} />
    </div>
  )

}

const BetaPlayer = () => {
  // const [trackAtom, updateTrackAtom] = useAtom(trackAtomConfig);

  return(
    <div className="w-full bg-white min-h-screen">
      {/* contents */}
      <div className="p-4">
        <div className="bg-stone-400 p-4 lg:w-3/4 rounded-lg min-h-[10rem]">

        <Tracks nodes={rootNodes}/>


        {/* <div className=" bg-orange-700 rounded-lg text-white w-max px-2 text-lg cursor-pointer "
          onClick={() => updateTrackAtom({
            ...trackAtom,
            tracks: [
              ...(trackAtom.tracks ?? []),
              {
                ...trackObjBlueprint
              }
            ]
          })}
        >
          +
        </div> */}
        </div>
      </div>
    </div>
  )
}

export default BetaPlayer;