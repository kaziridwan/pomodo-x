import { useAtom } from 'jotai';

import { setColorAtom } from './selection';
import {deleteShapeAtom } from './SvgShapes'

import { undoAtom, redoAtom } from "./history";

const colors = [
  {value: null, label: "Default"},
  {value: "red", label: "Red"},
  {value: "green", label: "Green"},
  {value: "blue", label: "Blue"},
  {value: "cyan", label: "Cyan"},
  {value: "magenta", label: "Magenta"},
  {value: "yellow", label: "yellow"},
  {value: "grey", label: "Grey"},
]


export const Controls = () => {
  const [, setColor] = useAtom(
    setColorAtom
  )
  const [hasHistory, undo] = useAtom(undoAtom)
  const [canRedo, redo] = useAtom(redoAtom)

  const [notSelected, deleteSelectedShape] = useAtom(deleteShapeAtom)
  return (
    <div>
      Color:
      {colors.map((color) => (
        <button key={color.value} onClick={() => setColor(color.value)}>
          {color.label}
        </button>
      ))}
      <hr/>
      <button disabled={notSelected} onClick={deleteSelectedShape}>delete</button>
      <hr/>
      <button disabled={!hasHistory} onClick={undo}>undo</button>
      <hr/>
      <button disabled={!canRedo} onClick={redo}>redo</button>
    </div>
  )
}