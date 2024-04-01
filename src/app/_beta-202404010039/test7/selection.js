import { atom } from 'jotai';


const selectedShapeAtomsAtom = atom(null);

export const selectAtom = atom(
  null,
  (_get, set, shapeAtom) => {
    set(selectedShapeAtomsAtom, shapeAtom)
  }
)

export const selectedAtomCreator = (shapeAtom) => {
  const selectedAtom = atom(
    (get) => shapeAtom === get(selectedShapeAtomsAtom)
  )

  return selectedAtom;
}

export const setColorAtom = atom(
  null,
  (get, set, color) => {
    const selectedShapeAtom = get(selectedShapeAtomsAtom);
    if(selectedShapeAtom) {
      set(selectedShapeAtom, (prev) => ({
        ...prev,
        color
      }))
    }
  } 
)