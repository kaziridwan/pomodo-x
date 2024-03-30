// what I want users to have
/**
 * - ability to create custom pomodoro sessions
 * - ability to have one-off tracks in them
 */

// nothing can be infinitely looped ?? few things can have extensions period
// ml for optimized loop and track length

const configSample = {
  presets: ['lofi pomodoro', 'course', 'workout'],
  sets: ['pomodoro', 'power nap', 'ml-course'], //-> flavors ?
  backgrundTracks: ['']
}

// so many ways to do these
// what is the best way ?
// this can't be completely vague
// can't have unrestricted democracy while
// building features

/**
 * think about the usage,
 * most of the people would use this 
 * 1. to break habits into pomodoro
 * 
 * So a user should land here with a youtube video
 * A. the video plays as refresher video for 30 minutes and pomodoro starts
 * B. the user plays it as for refresher video for 5 minutes, then pomodoro starts
 *    - the user gets options to play the video on the background, which slowly fades away
 *
 */

const useUserConfig = () => {
  const preset = {
    collections: [{
      name: 'Default-Collection',
      sets: [
        {
          name: 'Classic',
          repeats: Infinity,
          tracks: [
            {
              name: 'Flow',
              // type ?
              // openWebURL?
              // closeOptional?
              repeats: 4,
              tracks: [
                {
                  name: 'Focus-Video',
                  // its not url but URI because there will be sth like podcast:https://www...../.../
                  // for allowing podcasts
                  mediaURI: "https://www.youtube.com/watch?v=yIQd2Ya0Ziw&ab_channel=Calm",
                  duration: 25
                },
                {
                  name: 'Bell',
                  // its not url but URI because there will be sth like podcast:https://www...../.../
                  // for allowing podcasts
                  mediaURI: "https://www.youtube.com/watch?v=nMzVUmLe3yw&ab_channel=SoundsInSeconds",
                  duration: .03 //
                },
                {
                  name: 'Break-Video',
                  mediaURI: "https://www.youtube.com/watch?v=MZhivjxcF-M&ab_channel=LofiEveryday",
                  duration: 5
                },
                {
                  name: 'Boxing-Bell',
                  // its not url but URI because there will be sth like podcast:https://www...../.../
                  // for allowing podcasts
                  mediaURI: "https://www.youtube.com/watch?v=TvvTacquttk",
                  duration: .08 //
                },
              ]
              // tracks or duration
            },
            {
              name: 'Refresher',
              mediaURI: "https://www.youtube.com/watch?v=-hSma-BRzoo&ab_channel=OliverSjostrom",
              duration: 30,
              alternateAudioFrom: "https://www.youtube.com/watch?v=yIQd2Ya0Ziw&ab_channel=Calm",
              // mute: true
              // unmutes: [[0,1],[10000, 10000+1], [13000, 3200]]
              // antipattern = playonce/playtwice/playeven/playodd
              // pattern is to go for a timeline DS
            }
          ]
        },
        {
          name: 'Naps',
          repeats: 1,
          queue: "Classic", // id here if from same collection, collectionId/setId if from different
          // no queue if s is infinite,
          tracks: [
            {
              name: '20 minutes power nap',
              mediaURI: "https://www.youtube.com/watch?v=r_nOgNmhgc4",
              duration: 'full', // special case
            },
            {
              name: 'Workout',
              mediaURI: "https://www.youtube.com/watch?v=-hSma-BRzoo&ab_channel=OliverSjostrom",
              duration: 'full',
            }
          ]
        },
        {
          name: 'Course',
          repeats: Infinity,
          queue: "Classic",
          // no queue if repeat is infinite,
          // I also want to provision queue after x duration
          // essentially making the case if the 
          // UPDATE: nope, thats not gonna work;
          // too much customization, product will lose its shape
          // , character and definition
          // rather just do 
          tracks: [
            {
              name: 'ML-Andrew-Ng',
              mediaURI: "https://www.youtube.com/watch?v=jGwO_UgTS7I&list=PLoROMvodv4rMiGQp3WXShtMGgzqpfVfbU",
              duration: 30, // special case
            },
            {
              name: 'Bell',
              // its not url but URI because there will be sth like podcast:https://www...../.../
              // for allowing podcasts
              mediaURI: "https://www.youtube.com/watch?v=nMzVUmLe3yw&ab_channel=SoundsInSeconds",
              duration: .03 //
            },
            {
              name: 'Break-Video',
              mediaURI: "https://www.youtube.com/watch?v=MZhivjxcF-M&ab_channel=LofiEveryday",
              duration: 5
            },
            {
              name: 'Boxing-Bell',
              // its not url but URI because there will be sth like podcast:https://www...../.../
              // for allowing podcasts
              mediaURI: "https://www.youtube.com/watch?v=TvvTacquttk",
              duration: .08 //
            },
          ]
        },
        {
          name: 'Web-Sessions',
          repeats: 1,
          queue: "Classic",
          tracks: []
          // need a config option to have
          // tracklengths to play on full or specific or (half)
          // to append new tracks here or keep it limited to last n 
          // ( both limited to M, because of localstorage memory limit to 10MB ) 
        }
      ]
    }]
  }
}

export default useUserConfig;