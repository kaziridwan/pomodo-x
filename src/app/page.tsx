"use client";
import { useEffect, useMemo, useState } from "react";
import ReactPlayer from "react-player";

import { useSearchParams } from 'next/navigation'

import ConfigModal from "./components/ConfigModal";
import { stages, minutes } from "./lib/util";
import usePodcast from "./lib/usePodcast";
import { useKeypress } from "./lib/useKeypress";

export interface configUpdates {
  [key: string]: string | number;
}

export interface configInterface {
  focusVideo: string;
  breakVideo: string;
  focusDuration: number;
  breakDuration: number;
  rounds: number;
  refresherDuration: number;
  refreshVideo: string;
}

export default function Home() {

  const searchParams = useSearchParams();

  useKeypress(() => {
    playpause();
  }, ' ', {
    doublePress: () => {
      moveToNextPart();
    },
    tripplePress: () => {
      playRefresher();
    }
  });

  const [sessionStatus, setSessionStatus] = useState({
    sessionNumber: 0,
    stage: "focus_1",
    timedPreviously: 0,
    timeStarted: 0,
  });

  const [showConfigModal, setshowConfigModal] = useState(false);

  const refresherVideoURLOverride_RAW = decodeURIComponent(searchParams.get('refresherVideo') ?? '');
  const refresherVideoURLOverride = refresherVideoURLOverride_RAW.substring(1,refresherVideoURLOverride_RAW.length-1);

  const getStoredConfig = (key: string): string | null => {
    const value = JSON.parse(localStorage.getItem("config_" + key) || "");
    if (value === "") {
      return null;
    }
    return value;
  };

  const [config, setConfig] = useState({
    focusVideo: "https://www.youtube.com/watch?v=yIQd2Ya0Ziw&ab_channel=Calm",
    breakChime: "",
    breakVideo:
      "https://www.youtube.com/watch?v=MZhivjxcF-M&ab_channel=LofiEveryday",
    refreshVideo:
      "https://www.youtube.com/watch?v=-hSma-BRzoo&ab_channel=OliverSjostrom",
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

  const {feed, feedLoaded, setPodcast} = usePodcast('https://cdn.atp.fm/rss/public?a2ddltlm');

  // get latest (or specific) podcast from url

  // play pause

  const playpause = () => {
    const timedPreviously = playerConfig.playing
      ? Date.now() - sessionStatus.timeStarted
      : sessionStatus.timedPreviously;
    const timeStarted = playerConfig.playing ? 0 : Date.now();
    setSessionStatus({
      ...sessionStatus,
      sessionNumber: sessionStatus.sessionNumber + 1,
      timedPreviously,
      timeStarted,
    });
    setPlayerConfig({ ...playerConfig, playing: !playerConfig.playing });
  };

  // need to debounce this
  const moveToNextPart = () => {
    setPlayerConfig({ ...playerConfig, playing: false });
    // need to update the session first
    const videoURL = stages[sessionStatus.stage].next.startsWith("refresh")
      ? config.refreshVideo
      : stages[sessionStatus.stage].next.startsWith("break")
      ? config.breakVideo
      : config.focusVideo;

    setSessionStatus({
      sessionNumber: sessionStatus.sessionNumber + 1,
      stage: stages[sessionStatus.stage].next,
      timedPreviously: 0,
      timeStarted: Date.now(),
    });
    setTimeout(() => {
      setPlayerConfig({ ...playerConfig, url: videoURL, playing: true });
    }, 1000);
  };

  // moveToPart() needs an architectural review
  const playRefresher = () => {
    setPlayerConfig({ ...playerConfig, playing: false });
    // need to update the session first
    const videoURL = config.refreshVideo;

    setSessionStatus({
      sessionNumber: sessionStatus.sessionNumber + 1,
      stage: 'refresh',
      timedPreviously: 0,
      timeStarted: Date.now(),
    });
    setTimeout(() => {
      setPlayerConfig({ ...playerConfig, url: videoURL, playing: true });
    }, 1000);
  };

  const checkforStageJump = () => {
    const sessionDuration = sessionStatus.stage.startsWith("refresh")
      ? config.refresherDuration
      : sessionStatus.stage.startsWith("break")
      ? config.breakDuration
      : config.focusDuration;
    const timePlayed =
      sessionStatus.timedPreviously + (Date.now() - sessionStatus.timeStarted);

    if (
      timePlayed > sessionDuration &&
      sessionStatus.sessionNumber > 0 &&
      playerConfig.playing
    ) {
      moveToNextPart();
    }
  };

  const updateConfig = (updatedConfig: configUpdates) => {
    const updateConfig: any = { ...config, ...updatedConfig };
    console.log("updatedConfig is", updateConfig);
    Object.keys(updateConfig).map((key: string) => {
      localStorage.setItem("config_" + key, JSON.stringify(updateConfig[key]));
    });
    setConfig(updateConfig);
  };

  const onPlayerReady = () => {
    console.log("onPlayerReady");
    setConfig({
      ...config,
      focusVideo:
        getStoredConfig("focusVideo") ||
        "https://www.youtube.com/watch?v=yIQd2Ya0Ziw&ab_channel=Calm",
      breakVideo:
        getStoredConfig("breakVideo") ||
        "https://www.youtube.com/watch?v=MZhivjxcF-M&ab_channel=LofiEveryday",
      refreshVideo:
        getStoredConfig("refreshVideo") ||
        "https://www.youtube.com/watch?v=-hSma-BRzoo&ab_channel=OliverSjostrom",
    });
  };

  const handleClick = (event: { detail: number; }) => {
    if (event.detail === 2) {
      moveToNextPart()
    } else if (event.detail === 3) {
      playRefresher();
    } else {
      playpause();
    }
    
  }

  useEffect(() => {
    console.log('refresherVideoURLOverride', refresherVideoURLOverride);
    // need to tie this up to an event / flag so that it doesnt mess up state update cycles
    setConfig({
      ...config,
      refreshVideo: refresherVideoURLOverride
    })
    setSessionStatus({
      sessionNumber: sessionStatus.sessionNumber + 1,
      stage: 'refresh',
      timedPreviously: 0,
      timeStarted: Date.now(),
    });
    
    updateConfig({refreshVideo: refresherVideoURLOverride})

    setTimeout(() => {
      setPlayerConfig({ ...playerConfig, url: refresherVideoURLOverride, playing: true });
    }, 1000);
  }, [refresherVideoURLOverride])

  return (
    <main className="flex min-h-screen bg-emerald-200 flex-col">
      <ConfigModal
        config={config}
        updateConfig={updateConfig}
        show={showConfigModal}
        hideConfigModal={() => setshowConfigModal(false)}
      />
      <div className="bg-emerald-100 flex-grow flex items-center justify-center h-0">
        <ReactPlayer
          {...playerConfig}
          url={playerConfig.url}
          progressInterval={5000}
          onProgress={checkforStageJump}
          width="80vw"
          height="45vw"
          onReady={onPlayerReady}
          style={{
            maxHeight: "675px",
            maxWidth: "1200px",
          }}
        />
      </div>
      <div className="bg-slate-500 h-40 flex">
        <div className="bg-slate-400 flex-grow flex items-end">
          <div className="flex-grow"></div>
          <div className="w-max px-2 flex flex-col items-center">
            <div
              className="cursor-pointer text-amber-700 font-bold hover:text-amber-600 transition-colors"
              onClick={() => setshowConfigModal(true)}
            >
              conf
            </div>
          </div>
        </div>
        <div
          className="group w-40 cursor-pointer select-none flex flex-col items-center justify-center"
          onClick={handleClick}
        >
          <div className="text-2xl">
            <span className="group-hover:hidden inline-block animate-pulse">
              {playerConfig.playing ? "Playing..." : "...Paused"}
            </span>
            <span className="group-hover:inline-block hidden">
              {playerConfig.playing ? "Pause" : "Play"}
            </span>
          </div>
          <div className="text-xs text-slate-700 mt-2">
            <div className="group-hover:hidden group-hover:opacity-0 block opacity-100">
              {sessionStatus.stage.startsWith("refresh")
                ? "refresher"
                : sessionStatus.stage.startsWith("break")
                ? "break"
                : "focus"}
            </div>
            <div className="group-hover:block group-hover:opacity-100 text-slate-400 hidden opacity-0 animate-bounce">
              double click to skip
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
