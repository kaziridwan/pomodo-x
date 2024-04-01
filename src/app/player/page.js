"use client"
import {useAtom} from 'jotai';
import { playerAtom } from "@components/Controls"

import Sequencer from '@/app/components/Sequencer'
import Controls from '@components/Controls'
import MediaPlayer from '@components/MediaPlayer'

// based on https://codesandbox.io/p/sandbox/recursive-nodes-demo-with-jotai-ff7y1u?file=%2Fsrc%2FApp.js%3A17%2C1
// by Daishi Kato https://twitter.com/dai_shi/status/1548456520031305728
// from a google search on Jotai Recursive

/**
 * https://www.youtube.com/watch?v=Ao2lNd7jCb8
 * https://www.youtube.com/watch?v=uJzYt_z6OsY
 * https://www.youtube.com/watch?v=O0cs8aIXgkc
 * https://www.youtube.com/watch?v=vMZNAZdw650
 *  
 * @returns 
 */

const Player = () => {
  const [playerState] = useAtom(playerAtom)

  return(
    <div className="w-full bg-white min-h-screen flex flex-col gap-4 p-4">
      {/* contents */}
      <div className="flex flex-row gap-4 grow ">
        {/* sequencer */}
        <div className="bg-stone-400 p-4 lg:w-3/4 rounded-lg min-h-[10rem]">
          <MediaPlayer/>
        </div>
        <div className="bg-stone-400 p-4 lg:w-1/4 rounded-lg min-h-[10rem]">
          Metrics
        </div>
      </div>
      <div className="flex flex-row gap-4">
        {/* sequencer */}
        {/* [&::-webkit-scrollbar-track]:bg-transparent [&::-webkit-scrollbar-track]:rounded-lg */}
        <div className="bg-stone-400 p-4 lg:w-3/4 rounded-lg min-h-[10rem] max-h-60 overflow-auto [scrollbar-width:thin] [scrollbar-color:#6b728040_transparent] ">
          <div className=' min-w-max '>
            <Sequencer/>
          </div>
        </div>
        <div className="bg-stone-400 p-4 lg:w-1/4 rounded-lg min-h-[10rem]">
          <Controls />
        </div>
      </div>
    </div>
  )
}

export default Player;