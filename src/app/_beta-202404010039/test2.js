"use client"
import { atom, useAtom } from "jotai";

const dotsAtom = atom([])

const numberOfDotsAtom = atom((get)=> get(dotsAtom).length)

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
const SvgRoot = () => {
  const [, setDots] = useAtom(dotsAtom)
  return (
    <svg
      width="200"
      height="200"
      viewBox="0 0 200 200"
      onMouseMove={(e) => {
        const newPoint = [e.clientX, e.clientY]
        setDots((prev) => [...prev, newPoint])
      }}
    >
      <rect width="200" height="200" fill="#eee"/>
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
    <Stat />
  </>
);

export default App;
