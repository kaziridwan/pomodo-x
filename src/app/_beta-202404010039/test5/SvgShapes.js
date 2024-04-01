import { atom, useAtom } from 'jotai';
import { createShapeAtom, SvgShape } from './SvgShape';

const shapeAtomsAtom = atom([]);

export const addShapeAtom = atom(
  null,
  (_get, set, update) => {
    const shapeAtom = createShapeAtom(update);
    set(shapeAtomsAtom, (prev) => [
      ...prev,
      shapeAtom
    ])
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