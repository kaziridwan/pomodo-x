import { useState } from "react";
import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

const sequenceAtom = atomWithStorage('sequence', {
  
})

interface TrackType {
  name: string
  url?: string
  loops?: number
  duration?: number
  tracks?: TrackType[]
}

// no loop value means 1
// no duration means its gonna play the full duration of the video

const defaultTrack : TrackType = {
  name: "Daily Pomodoro",
  loops: 2,
  tracks: [
    {
      name: "4 hour sets",
      loops: 2,
      tracks: [
        {
          name: "Focus Flow",
          loops: 4,
          tracks: [
            {
              name: "Focus Flow",
              url: "https://www.youtube.com/watch?v=yIQd2Ya0Ziw&ab_channel=Calm",
              duration: 25,
            },
            {
              name: "Starting a break",
              url: "https://www.youtube.com/watch?v=yIQd2Ya0Ziw&ab_channel=Calm",
            },
            {
              name: "Break",
              url: "https://www.youtube.com/watch?v=MZhivjxcF-M&ab_channel=LofiEveryday",
              duration: 5,
            },
            {
              name: "Start to focus",
              url: "https://www.youtube.com/watch?v=yIQd2Ya0Ziw&ab_channel=Calm",
            },
          ]
        },
        {
          name: "10 min Recharge",
          url: "https://www.youtube.com/watch?v=-hSma-BRzoo&ab_channel=OliverSjostrom",
          duration: 10,
        },
      ]
    },
    {
      name: "Mid-day break",
      url: "https://www.youtube.com/watch?v=CF7msB1CgyM&t=1669s&ab_channel=WVFRMPodcast",
      duration: 30
    }
  ]
}

// default playerCursor -> "Daily Pomodoro".1.tracks.0."4 hour sets".1.tracks.0."Focus Flow".1.tracks.0."Focus Flow".1

const defaultPreferences = {
  jumpNextMode: "go-through-loops", // loop-once, skip-loops
  superJumps: "play-next-parent", // play-next-track, play-specific-track
  showVideo: true,
}

const usePomodoro = () => {

  const track = atom(defaultTrack)

}

export default usePomodoro;