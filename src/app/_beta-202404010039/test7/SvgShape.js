import { atom, useAtom } from 'jotai';
import { useMemo } from "react";
import {selectAtom, selectedAtomCreator } from './selection';

export const createShapeAtom = (points) => atom({path: pointsToPath(points)});

const pointsToPath = (points) =>  points.reduce((acc, point) => !acc ? `M ${point[0]} ${point[1]}` : `${acc} L ${point[0]} ${point[1]}`, null)

export const addShapeAtom = atom(
  null,
  (_get, set, update) => {
    set(shapeAtom, {path: pointsToPath(update)} )
  }
)

export const SvgShape = ({shapeAtom}) => {
  const [shape] = useAtom(shapeAtom);
  const [, select] = useAtom(selectAtom);
  const [selected] = useAtom(
    useMemo(() => selectedAtomCreator(shapeAtom), [shapeAtom])
  )

  return (
    <g onClick={() => select(shapeAtom)} >
      <path
        d={shape.path}
        opacity={selected ? "0.3" : "0"}
        fill="none"
        stroke="black"
        strokeWidth="12" 
      />
      <path
        d={shape.path}
        fill="none"
        stroke={shape?.color ?? "black"}
        strokeWidth="3" 
      />
    </g>
  )

}