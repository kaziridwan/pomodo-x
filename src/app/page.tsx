"use client"
import { useState } from 'react'
import ReactPlayer from 'react-player'

import ConfigModal from './components/ConfigModal';
import { stages, minutes } from './lib/util';

export interface configUpdates {
  [key : string] : string | number,
}

export interface configInterface { 
  focusVideo : string,
  breakVideo : string,
  focusDuration : number,
  breakDuration : number,
  rounds : number,
  refresherDuration : number,
  refreshVideo : string
} 

export default function Home() {
  const [sessionStatus, setSessionStatus] = useState({
    sessionNumber: 0,
    stage: "focus_1",
    timedPreviously: 0,
    timeStarted: 0,
  });

  const [showConfigModal, setshowConfigModal] = useState(false);

  const getStoredConfig  = (key : string) : (string | null) => {
    const value = JSON.parse(localStorage.getItem('config_'+key) || '');
    if(value === '') {
      return null
    }
    return value
  }

  const [config, setConfig] = useState({
    focusVideo: "https://www.youtube.com/watch?v=yIQd2Ya0Ziw&ab_channel=Calm",
    breakChime: "",
    breakVideo: "https://www.youtube.com/watch?v=MZhivjxcF-M&ab_channel=LofiEveryday",
    refreshVideo: "https://www.youtube.com/watch?v=Gcy35RLo8_0&ab_channel=ZYCheng",
    focusDuration: minutes(25),
    breakDuration: minutes(5),
    rounds: 4,
    refresherDuration: minutes(30),
  });

  const [playerConfig, setPlayerConfig] = useState({
    url: config.focusVideo,
    controls: true,
    playing: false,
  });

  // play pause

  const playpause = () => {
    const timedPreviously = playerConfig.playing ? (Date.now() - sessionStatus.timeStarted) : sessionStatus.timedPreviously;
    const timeStarted = playerConfig.playing ? 0 : Date.now();
    setSessionStatus({
      ...sessionStatus,
      sessionNumber: sessionStatus.sessionNumber + 1,
      timedPreviously,
      timeStarted
    })
    setPlayerConfig({...playerConfig, playing: !playerConfig.playing})
  }

  // need to debounce this
  const moveToNextPart = () => {
    setPlayerConfig({...playerConfig, playing: false});
    // need to update the session first
    const videoURL = stages[sessionStatus.stage].next.startsWith('refresh') ? config.refreshVideo : stages[sessionStatus.stage].next.startsWith('break') ? config.breakVideo : config.focusVideo;

    setSessionStatus({
      sessionNumber: sessionStatus.sessionNumber + 1,
      stage: stages[sessionStatus.stage].next,
      timedPreviously: 0,
      timeStarted: Date.now()
    })
    setTimeout(() => { setPlayerConfig({...playerConfig, url: videoURL ,playing: true}) }, 1000);
  }

  const checkforStageJump = () => {
    const sessionDuration = sessionStatus.stage.startsWith('refresh') ? config.refresherDuration : sessionStatus.stage.startsWith('break') ? config.breakDuration : config.focusDuration; 
    const timePlayed = sessionStatus.timedPreviously + (Date.now() - sessionStatus.timeStarted);
    
    if (timePlayed > sessionDuration && sessionStatus.sessionNumber > 0) {
      moveToNextPart()
    }
  }
  
  const updateConfig = (updatedConfig : configUpdates) => {
    const updateConfig : any = {...config, ...updatedConfig};
    console.log('updatedConfig is', updateConfig)
    Object.keys(updateConfig).map((key: string) => {
      localStorage.setItem('config_'+key, JSON.stringify(updateConfig[key]))
    })     
    setConfig(updateConfig)
  }

  const onPlayerReady = () => {
    console.log('onPlayerReady')
    setConfig({
      ...config,
    focusVideo: getStoredConfig("focusVideo") || "https://www.youtube.com/watch?v=yIQd2Ya0Ziw&ab_channel=Calm",
    breakVideo: getStoredConfig("breakVideo") || "https://www.youtube.com/watch?v=MZhivjxcF-M&ab_channel=LofiEveryday",
    refreshVideo: getStoredConfig("refreshVideo") || "https://www.youtube.com/watch?v=Gcy35RLo8_0&ab_channel=ZYCheng",
    })
  } 


  return (
    <main className="flex min-h-screen bg-emerald-200 flex-col">
      <ConfigModal config={config} updateConfig={updateConfig} show={showConfigModal} hideConfigModal={() => setshowConfigModal(false)} />
      <div className="bg-emerald-100 flex-grow flex items-center justify-center">
        <ReactPlayer 
          {...playerConfig} 
          progressInterval={5000} 
          onProgress={checkforStageJump}
          width="80vw"
          height="45vw"
          onReady={onPlayerReady}
          style={{
            maxHeight:"675px",
            maxWidth: "1200px"
          }}
        />
      </div>
      <div className='bg-slate-500 h-40 flex'>
        <div className="bg-slate-400 flex-grow flex items-end">
          <div className="flex-grow"></div>
          <div className="w-max px-2 flex flex-col items-center">
            <div className="cursor-pointer text-amber-700 font-bold hover:text-amber-600" onClick={() => setshowConfigModal(true)}>conf</div>
          </div>
        </div>
        <div 
          className="w-40 cursor-pointer select-none flex flex-col items-center justify-center [&_.mainAlert]:hover:hidden [&_.doubleClickAlert]:hover:block" 
          onClick={playpause}
          onDoubleClick={moveToNextPart}
        >
          <div className="text-2xl">
            {playerConfig.playing ? 'Playing..' : '..Paused'}
          </div>
          <div className="text-xs text-slate-700 mt-2">
            <div className="mainAlert">{sessionStatus.stage.startsWith('refresh') ? "refresher" : sessionStatus.stage.startsWith('break') ? "break" : "focus"}</div>
            <div className="doubleClickAlert hidden text-slate-400">double click to skip</div>
          </div>
        </div>
      </div>
    </main>
  )
}
