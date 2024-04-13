import { atom, useAtom } from 'jotai';
import { createShapeAtom, SvgShape } from './SvgShape';
import { selectAtom, selectedAtom, unselectAtom } from './selection';
import { shapeAtomsAtom } from './history';

// const shapeAtomsAtom = atom([]);

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

export const deleteShapeAtom = atom(
  (get) => !get(selectedAtom),
  (get, set, _update) => {
    const selected = get(selectedAtom);
    if(selected) {
      // its just deleting the item from the array
      // its enough to delete the atom
      // the prev value will be garbage collected
      set(shapeAtomsAtom, (prev) => prev.filter((shapeItem) => shapeItem !== selected))
      set(unselectAtom, null); // the second parameter has no effect
    }
  }
)