"use client"
"global localStorage"
import { memo } from "react";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";

import { atomWithStorage } from 'jotai/utils';

// based on https://codesandbox.io/p/sandbox/recursive-nodes-demo-with-jotai-ff7y1u?file=%2Fsrc%2FApp.js%3A17%2C1
// by Daishi Kato https://twitter.com/dai_shi/status/1548456520031305728
// from a google search on Jotai Recursive

const trackObjBlueprint = {
  title: 'something',
  url: '',
  duration: undefined,
  repeat: undefined,
  tracks: [],
}

const serializedTracksFromJSON = (tracksJSON = []) =>  (
  tracksJSON.map((track) => {
    if(track.init.childNodes.init?.length > 0) {
      return atom({
        value: atom(track.init.value.init),
        childNodes: atom(serializedTracksFromJSON(track.init.childNodes.init)),
      })
    }
    return atom({
      value: atom(track.init.value.init),
      childNodes: atom([]),
    })
  }));

const rootNodes = atomWithStorage('rootNodes', [], {
  getItem(key, initialValue) {
    const storedValue = localStorage.getItem(key)

    console.log('loggr localstorage obtained ',storedValue)
    const storedValueJSON = JSON.parse(storedValue ?? initialValue);
      console.log('loggr initial atom ',serializedTracksFromJSON(storedValueJSON))
    try {
      const storedValueJSON = JSON.parse(storedValue ?? initialValue);
      console.log('loggr initial atom ',serializedTracksFromJSON(storedValueJSON))
      return serializedTracksFromJSON(storedValueJSON)
    } catch {
      return initialValue
    }
  },
  setItem(key, value) {
    console.log('loggr setting value ', value)
    localStorage.setItem(key, JSON.stringify(value))
  },
  removeItem(key) {
    localStorage.removeItem(key)
  },
});

const appendNode = atom(null, (get, set, [nodes, value]) => {
  console.log('loggr updating nodes, ',nodes)
  const node = atom({
    value: atom(value),
    childNodes: atom([])
  });
  set(nodes, (prev) => [...prev, node]);
});


const NewTrack = memo(({ nodes }) => {
  const append = useSetAtom(appendNode);
  const add = () => {
    append([nodes, { title: 'New Track', duration: 5, url: 'http://' }]);
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
});

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

const Track = memo(({ node, layer }) => {
  const { value, childNodes } = useAtomValue(node);
  const trackAtom = useAtomValue(value);

  return (
    <div className={`${getBgColor(layer)} p-4 rounded-tl-2xl `}>
      {trackAtom?.title} - {trackAtom?.duration?.toString()}
      <br/>
      <div>
        {trackAtom?.url}
      </div>

      <Tracks nodes={childNodes} layer={layer+1} />


    </div>
  );
});

const Tracks = ({nodes, layer = 0}) => {  
  const nodesVal = useAtomValue(nodes);
  return (
    <div className="flex flex-row gap-1">
      {nodesVal?.length > 0 && nodesVal.map((t) => (
        <Track node={t} layer={layer} key={`${t}`}/>
      ))}
      <div className={`${nodes.length > 0 ? 'min-w-[.5rem]' : ''}`}></div>
      <NewTrack nodes={nodes} />
    </div>
  )

}

const PlayerPage = () => {

  return(
    <div className="w-full bg-white min-h-screen">
      {/* contents */}
      <div className="p-4">
        <div className="bg-stone-400 p-4 lg:w-3/4 rounded-lg min-h-[10rem]">
          <Tracks nodes={rootNodes}/>
        </div>
      </div>
    </div>
  )
}

export default PlayerPage;