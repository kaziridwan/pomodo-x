import { atom, SetStateAction } from "jotai";

const internalShapeAtomsAtom = atom([]);
export const shapeAtomsAtom = atom(
  (get) => get(internalShapeAtomsAtom),
  (_get, set, update) => {
    set(saveHistoryAtom);
    set(internalShapeAtomsAtom, update)
  }
)

const historyAtom = atom([])

const futureAtom = atom([]);

export const saveHistoryAtom = atom(
  null,
  (get, set) => {
    const shapes = get(internalShapeAtomsAtom).map(shape => get(shape));
    set(historyAtom, (prev) => [shapes, ...prev]);
  }
)

export const saveFutureAtom = atom(
  null,
  (get, set) => {
    const currentShape = get(internalShapeAtomsAtom).map(shape => get(shape));;
    set(futureAtom, (prev) => [currentShape, ...prev]);
  }
)

export const redoAtom = atom(
  (get) => get(futureAtom).length > 0,
  (get, set) => {
    const future = get(futureAtom);
    if(future.length > 0){
      const [shapes, ...rest] = future;
      set(internalShapeAtomsAtom, (prev) => (
        shapes.map((shape, index) =>
          // need to understand the debugging part
          (prev[index] && get(prev[index]) === shape ? prev[index] : atom(shape)) // each shape is an atom, hence we can just use old shapes or create new shape atoms
        )
      ))
      set(saveHistoryAtom);
      set(futureAtom, rest);
    }
  }
)

export const deleteRedoAtom = atom(
  null,
  (_get, set) => {
      set(futureAtom, [])
  }
)
  

export const undoAtom = atom(
  (get) => {
    const hasHistory = get(historyAtom).length > 0;
    return hasHistory;
  },
  (get, set) => {
    const history = get(historyAtom);
    if(history.length > 0){
      const [shapes, ...rest] = history;
      set(saveFutureAtom)
      set(internalShapeAtomsAtom, (prev) => (
        shapes.map((shape, index) =>
          (get(prev[index]) === shape ? prev[index] : atom(shape)) // each shape is an atom, hence we can just use old shapes or create new shape atoms
        )
      ))
      set(historyAtom, rest);
      // im too sleep deprived to code now
      // set(saveFutureAtom, shapes);
    }
  }
)