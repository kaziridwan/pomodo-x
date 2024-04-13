"use client"
import {useRef, useEffect } from 'react';
import { atom, useAtom } from "jotai";

import { addDotAtom, SvgDots, commitDotsAtom} from "./SvgDots";
import { SvgShapes } from "./SvgShapes";

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
    set(commitDotsAtom, null);
  }
)

const handleMouseMoveAtom = atom(
  null,
  (get, set, update) => {
    if(get(drawingAtom)) {
      set(addDotAtom, update)
    }
  }
)

const useCommitCount = () => {
  const commitCountRef = useRef(0);
  useEffect(() => {
    commitCountRef.current += 1;
  })
  return commitCountRef.current
}

export const SvgRoot = () => {
  const [, handleMouseDown] = useAtom(handleMouseDownAtom)
  const [, handleMouseUp] = useAtom(handleMouseUpAtom)
  const [, handleMouseMove] = useAtom(handleMouseMoveAtom)
  return (
    <svg
      width="200"
      height="120"
      viewBox="0 0 200 120"
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={(e) => {
        const {x, y} = e.currentTarget.getBoundingClientRect();
        const newPoint = [e.clientX-x, e.clientY-y]
        handleMouseMove(newPoint)
      }}
    >
      <rect width="200" height="200" fill="#eee"/>
      <text x="3" y="12" fontSize="12px" >
        Commit: {useCommitCount()}
      </text>
      <SvgShapes/>
      <SvgDots/>
    </svg>
  )
}

export const Stat = () => {
  const [numberofDots] = useAtom(numberOfDotsAtom)
  return (
    <ul>
      <li>Dots : {numberofDots}</li>
    </ul>
  )
}