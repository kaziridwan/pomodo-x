"use client"
// import ReactPlayer from "react-player";
import dynamic from 'next/dynamic'
import {useAtom} from 'jotai'
import { atomWithStorage } from 'jotai/utils';
import { playerAtom, checkStageJumpAtom, getCurrentLinearTrackAtom } from "../Controls/index-v1";
import { toTimeString } from "@/app/lib/util";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const displayVideoPlayerAtom = atomWithStorage('displayVideoPlayer', true);

export const isValidUrl = (url) => (url.split('/').length > 3)

const MediaPlayer = () => {
  const [playerState] = useAtom(playerAtom);
  const [, checkforStageJump] = useAtom(checkStageJumpAtom)
  const [displayVideoPlayer, setDisplayVideoPlayer] = useAtom(displayVideoPlayerAtom);
  const [currentLinearTrack] = useAtom(getCurrentLinearTrackAtom);

  const timePlayed = playerState.playback === 'playing' ? toTimeString(Date.now() - playerState.started + playerState.timeEllapsed) : toTimeString(playerState.timeEllapsed);

  const toggleVideoPlayerDisplay = () => {
    setDisplayVideoPlayer(!displayVideoPlayer)
  }
  return (
    <div className="flex h-full p-4" onClick={toggleVideoPlayerDisplay}>
      <div className={` w-full h-full ${!displayVideoPlayer ? 'hidden' : ''}`} >
        <ReactPlayer
          key={`${playerState.url}-${playerState.playback}`}
          url={playerState.url}
          playing={playerState.playback === 'playing' && isValidUrl(playerState.url)}
          progressInterval={1000}
          onProgress={checkforStageJump}
          loop
          width="100%"
          height="100%"
          controls
          // onReady={onPlayerReady}
          // style={{
          //   maxHeight: "675px",
          //   maxWidth: "1200px",
          // }}
        />
      </div>
      <div className={`w-full h-full flex items-center justify-center ${displayVideoPlayer ? 'hidden' : ''}`}>
        <div className="text-8xl font-mono">
          {timePlayed} / <span className="opacity-50">{currentLinearTrack?.value?.duration}</span>
        </div>
      </div>
    </div>
  )

}

export default MediaPlayer;