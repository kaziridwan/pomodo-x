import { useEffect, useRef } from 'react';

export const useKeypress = (callback: () => void, key: string, {doublePress, tripplePress} : {doublePress?: () => void, tripplePress?: () => void }, delay = 1000) => {
  // const [pressCount, setPressCount] = useState(0);
  let pressCount = 0;
  const timeoutRef : any = useRef(null); // quick fix lol

  const onKeyDown = (event : {
    keyCode: any; key: any; preventDefault: () => void; 
  }) => {
    console.log('pressed key = ',event.key)
    console.log('pressed key = ',event.keyCode)
    console.log('pressed key = ',event.key === " ")
    const keyIsPressed = event.key === key;

    if(keyIsPressed) {
      console.log('pressed for ',(pressCount+1))
      pressCount = pressCount + 1;
    }

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      if(keyIsPressed) {
        if (!doublePress && !tripplePress) {
          callback()
        } else {
          console.log(pressCount, doublePress, tripplePress)
          if(pressCount === 2 && doublePress) {
            doublePress();
            console.log(' double press')
          } else if(pressCount === 3 && tripplePress) {
            tripplePress();
            console.log(' tripple press')
          } else {
            callback();
            console.log(' single press')
          }
        }
        pressCount = 0;
      }
    }, delay);
  };

  useEffect(() => {
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [onKeyDown]);

  useEffect(() => {
    // Cleanup the previous timeout on re-render
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
};