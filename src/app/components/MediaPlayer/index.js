"use client"
// import ReactPlayer from "react-player";
import dynamic from 'next/dynamic'
import {useAtom} from 'jotai'
import { atomWithStorage } from 'jotai/utils';
import { playerAtom, checkStageJumpAtom, getCurrentLinearTrackAtom } from "../Controls/";
import { toTimeString } from "@/app/lib/util";

const ReactPlayer = dynamic(() => import("react-player"), { ssr: false });

const displayVideoPlayerAtom = atomWithStorage('displayVideoPlayer', true);

export const isValidUrl = (url) => {console.log('url is ',url);return (url.split('/').length > 3)}

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
    <div className="grow w-full h-full flex flex-col p-4 pb-24 xl:pb-4" onClick={toggleVideoPlayerDisplay}>
      <div key={`${playerState.url}-${playerState.playback}`}className={`grow h-full w-full flex flex-col [&>div>div]:![height:auto] ${!displayVideoPlayer ? 'hidden' : ''}`} >
        {playerState.url}-{playerState.playback}
        <ReactPlayer
          key={`${playerState.url}-${playerState.playback}`}
          url={playerState.url}
          playing={playerState.playback === 'playing' && isValidUrl(playerState.url)}
          progressInterval={1000}
          onProgress={checkforStageJump}
          loop
          width="100%"
          height="auto"
          controls
          // onReady={onPlayerReady}
          style={{
            height: "auto",
            flexGrow: "1",
            display: "flex"
          }}
          config={{
            youtube: {
              autoplay: true
            }
          }}
        />
      </div>
      <div className={`w-full h-full items-center justify-center ${displayVideoPlayer ? 'hidden' : ''}`}>
        <div className="text-8xl font-mono">
          {timePlayed} / <span className="opacity-50">{currentLinearTrack?.value?.duration}</span>
        </div>
      </div>
    </div>
  )

}

export default MediaPlayer;