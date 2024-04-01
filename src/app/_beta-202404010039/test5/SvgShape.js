import { atom, useAtom } from 'jotai';

// const shapeAtom = atom({path: ""})

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

  return (
    <g>
      <path
        d={shape.path}
        fill="none"
        stroke="black"
        strokeWidth="3" 
      />
    </g>
  )

}