"use client"
// import ReactPlayer from "react-player";
import dynamic from 'next/dynamic'

import usePomodoroPlayer from "@hooks/usePomodoroPlayer";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const MediaPlayer = ({checkforStageJump}) => {
  const { playerState } = usePomodoroPlayer();

  return (
    <div>
      Visuals
      <ReactPlayer
          key={`${playerState.url}-${playerState.playback}`}
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