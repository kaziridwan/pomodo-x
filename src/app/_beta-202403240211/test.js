"use client"
"global localStorage"
import { memo } from "react";
import { atom, useAtom, useAtomValue, useSetAtom } from "jotai";
import { atomWithStorage } from 'jotai/utils'

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

const rootNodes = atomWithStorage('rootNodes', []);

rootNodes.onMount = setAtom => {
  const persistedValue = localStorage.getItem('rootNodes');
  if (persistedValue && persistedValue !== '') {
    console.log('loggr obtained value', JSON.parse(persistedValue))
    setAtom(JSON.parse(persistedValue));
  }
}

const appendNode = atom(null, (get, set, [nodes, value]) => {
  const node = atom({
    value: atom(value),
    childNodes: atom([])
  });
  // localStorage.setItem('rootNodes', JSON.stringify(rootNodes))
  set(nodes, (prev) => [...prev, node]);
});


const NewTrack = ({ nodes }) => {
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
};

const getBgColor = (layerNumber) => {
  const bgColorsMap = [
    'bg-green-400',
    'bg-gray-500',
    'bg-lime-400',
    'bg-orange-400',
  ]
  const layer = layerNumber;

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
  console.log('loggr node is ', node)
  const { value, childNodes } = useAtomValue(node);
  const [trackAtom, setTrackAtom] = useAtom(value);


  return (
    <div className={`${getBgColor(layer)} p-4 rounded-tl-2xl `}>
      {trackAtom.title} - {trackAtom.duration?.toString()}
      <br/>
      
      <div>
        {trackAtom.url}
      </div>

      <Tracks nodes={childNodes} layer={layer} />


    </div>
  );
});

const Tracks = ({nodes, layer = 0}) => {  
  return (
    <div className="flex flex-row gap-1">
      { useAtomValue(nodes).map(((t) => (
        <Track node={t} layer={layer+1} key={`${t}`}/>
      )))}
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

PlayerPage.displayName = 'PlayerPage';

export default PlayerPage;