const userUserPreset = () => {
  const preset = {
    collections: [{
      name: 'default collection',
      sets: [
        {
          name: 'Classic',
          repeat: Infinity,
          tracks: [
            {
              name: 'Flow',
              // type ?
              // openWebURL?
              // closeOptional?
              repeat: 4,
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
            }
          ]
        },
        {
          name: 'Naps',
          repeat: 1,
          queue: "Classic", // id here if from same collection, collectionId/setId if from different
          // no queue if repeat is infinite,
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
          repeat: Infinity,
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
        }
      ]
    }]
  }
}

export default userUserPreset;