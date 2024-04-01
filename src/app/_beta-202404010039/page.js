"use client"
import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";

const dotsAtom = atom([])

const numberOfDotsAtom = atom((get)=> get(dotsAtom).length)

const drawingAtom = atom(false);

const handleMouseDownAtom = atom(
  null,
  (get, set) => {
    set(drawingAtom, true);
  }
)

const handleMouseUpAtom = atom(
  null,
  (get, set) => {
    set(drawingAtom, false);
  }
)

const handleMouseMoveAtom = atom(
  null,
  (get, set, updates) => {
    if(get(drawingAtom)) {
      set(dotsAtom, (prev) => [...prev, updates])
    }
  }
)

const SvgDots = () => {
  const [dots] = useAtom(dotsAtom);

  return (
    <g>
      {dots.map(([x, y]) => (
        <circle cx={x} cy={y} r="2" fill="#aaa" />
      ))}
    </g>
  )
}

const useCommitCount = () => {
  const commitCountRef = useRef(0);
  useEffect(() => {
    commitCountRef.current += 1;
  })
  return commitCountRef.current
}

const SvgRoot = () => {
  const [, handleMouseDown] = useAtom(handleMouseDownAtom)
  const [, handleMouseUp] = useAtom(handleMouseUpAtom)
  const [, handleMouseMove] = useAtom(handleMouseMoveAtom)
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={(e) => {
        const newPoint = [e.clientX, e.clientY]
        handleMouseMove(newPoint)
      }}
    >
      <rect width="200" height="200" fill="#eee"/>
      <text x="3" y="12" fontSize="12px" >
        Commit: {useCommitCount()}
      </text>
      <SvgDots/>
    </svg>
  )
}

const Stat = () => {
  const [numberofDots] = useAtom(numberOfDotsAtom)
  return (
    <ul>
      <li>Dots : {numberofDots}</li>
    </ul>
  )
}



const App = () => (
  <>
    <SvgRoot />
    <Stat/>
  </>
);

export default App;
