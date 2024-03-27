"use client"
// import ReactPlayer from "react-player";
import dynamic from 'next/dynamic'
import { useAtomValue } from "jotai";
import { playerStateAtom } from "@components/Controls"

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const MediaPlayer = ({checkforStageJump}) => {
  const playerState = useAtomValue(playerStateAtom);
  return (
    <div>
      Visuals
      <ReactPlayer
          url={playerState.url}
          playing={playerState.playback === 'playing'}
          // progressInterval={5000}
          // onProgress={checkforStageJump}
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