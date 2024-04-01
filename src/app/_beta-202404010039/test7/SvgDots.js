"use client"
import { atom, useAtom } from "jotai";
import { addShapeAtom } from './SvgShapes';

const dotsAtom = atom([])

export const addDotAtom = atom(
  null,
  (_get, set, update) => {
    set(dotsAtom, (prev) => [...prev, update])
  }
)
export const SvgDots = () => {
  const [dots] = useAtom(dotsAtom);

  return (
    <g>
      {dots.map(([x, y]) => (
        <circle cx={x} cy={y} r="2" fill="#aaa" />
      ))}
    </g>
  )
}

export const commitDotsAtom = atom(
  null,
  (get, set) => {
    set(addShapeAtom, get(dotsAtom));
    set(dotsAtom, []);
  }
)
