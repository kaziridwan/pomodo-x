import { atom, useAtom } from 'jotai';
import { createShapeAtom, SvgShape } from './SvgShape';
import { selectAtom } from './selection';

const shapeAtomsAtom = atom([]);

export const addShapeAtom = atom(
  null,
  (_get, set, update) => {
    const shapeAtom = createShapeAtom(update);
    set(shapeAtomsAtom, (prev) => [
      ...prev,
      shapeAtom
    ])
    set(selectAtom, shapeAtom)
  }
)

export const SvgShapes = () => {
  const [shapeAtoms] = useAtom(shapeAtomsAtom);

  return (
    <g>
      {shapeAtoms.map((shapeAtom) => <SvgShape key={`${shapeAtom}`} shapeAtom={shapeAtom}/>)}
    </g>
  )
}