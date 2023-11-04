import { useEffect, useState } from "react";
import Parser from "rss-parser"

const usePodcast = (rssLink = '') => {
  let parser = new Parser();

  const [feed, updateFeed ] = useState <{[key:string]:any}> ();
  const [feedLoaded, setFeedLoaded ] = useState(false);
  const [link, setLink] = useState(rssLink);

  const parseFeed = async () => {
    const feedObtained = await parser.parseURL(link);
    console.log('feed obtained', feedObtained)
    updateFeed(feedObtained);
    setFeedLoaded(true)
  }

  useEffect(() => {
    if(link !== '') {
      parseFeed();
    }  
  }, [link]);

  return {
    feedLoaded,
    feed,
    setPodcast: setLink
  }

}

export default usePodcast;