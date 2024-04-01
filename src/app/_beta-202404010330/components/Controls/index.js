"use client"
import usePomodoroPlayer from '@hooks/usePomodoroPlayer';

const Controls = () => {
  const {playPause, skipToNext, playNext} = usePomodoroPlayer();
  return (
    <div>
      <div className=" cursor-pointer " onClick={playPause}>play</div>
      <div>-</div>
      <div className=" cursor-pointer " onClick={skipToNext}>skip next</div>
      <div>-</div>
      <div className=" cursor-pointer " onClick={playNext}>next</div>
    </div>
  )
}

export default Controls