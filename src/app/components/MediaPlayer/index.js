"use client"
// import ReactPlayer from "react-player";
import dynamic from 'next/dynamic'
import {useAtom} from 'jotai'
import { playerAtom, checkStageJumpAtom } from "../Controls";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

export const isValidUrl = (url) => (url.split('/').length > 3)

const MediaPlayer = () => {
  const [playerState] = useAtom(playerAtom);
  const [, checkforStageJump] = useAtom(checkStageJumpAtom)
  
  return (
    <div>
      Visuals
      <ReactPlayer
          key={`${playerState.url}-${playerState.playback}`}
          url={playerState.url}
          playing={playerState.playback === 'playing' && isValidUrl(playerState.url)}
          progressInterval={5000}
          onProgress={checkforStageJump}
          loop
          width="80vw"
          height="45vw"
          // onReady={onPlayerReady}
          style={{
            maxHeight: "675px",
            maxWidth: "1200px",
          }}
        />
    </div>
  )

}

export default MediaPlayer;