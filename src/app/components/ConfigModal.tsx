"use client"

import { minutes, toMinutes } from "../lib/util";

const ConfigModal = ({config:{focusVideo, breakVideo, focusDuration, breakDuration, rounds, refresherDuration, refreshVideo}, updateConfig, show, hideConfigModal}) => {
  return (
    <div className={`absolute h-screen w-screen bg-[rgba(0,0,0,0.2)] backdrop-blur-sm flex justify-center items-center ${!show ? 'hidden' : ''}`}>
      <div className="flex h-1/2 w-6 justify-start text-3xl leading-[0] cursor-pointer hover:text-amber-700" onClick={hideConfigModal}>
        ×
      </div>
      <div className="w-1/2 h-1/2 rounded-md p-8 bg-[rgba(255,255,255,.9)] flex flex-col text-gray-900">
        <div className="text-2xl mb-8">
          Preferences
        </div>
        <div className="text-xl flex mb-4">
          <div className="w-60">
            Focus video
          </div>
          <div className="flex-grow">
            <input type="text" className="block w-full h-full p-1 bg-transparent border-b-2 border-gray-900 border-dashed" value={focusVideo} onChange={(e) => updateConfig({focusVideo: e.target.value})}/>
          </div>
        </div>
        <div className="text-xl flex mb-4">
          <div className="w-60">
            Break video
          </div>
          <div className="flex-grow">
            <input type="text" className="block w-full h-full p-1 bg-transparent border-b-2 border-gray-900 border-dashed" value={breakVideo} onChange={(e) => updateConfig({breakVideo: e.target.value})}/>
          </div>
        </div>
        <div className="text-xl flex mb-4">
          <div className="w-60">
            Focus duration
          </div>
          <div className="flex-grow">
            <input type="number" className="block w-full h-full p-1 bg-transparent border-b-2 border-gray-900 border-dashed" value={toMinutes(focusDuration)} onChange={(e) => updateConfig({focusDuration: minutes(parseFloat(e.target.value))})}/>
          </div>
          <div className="w-60 ml-8">
            Break duration
          </div>
          <div className="flex-grow">
            <input type="number" className="block w-full h-full p-1 bg-transparent border-b-2 border-gray-900 border-dashed" value={toMinutes(breakDuration)} onChange={(e) => updateConfig({breakDuration: minutes(parseFloat(e.target.value))})}/>
          </div>
        </div>
        <div className="text-xl flex mb-4">
          <div className="w-60">
            Loops
          </div>
          <div className="flex-grow">
            <input type="number" className="block w-full h-full p-1 bg-transparent border-b-2 border-gray-900 border-dashed" value={rounds} onChange={(e) => updateConfig({rounds: parseInt(e.target.value)})}/>
          </div>
          <div className="w-60 ml-8">
            Refresh duration
          </div>
          <div className="flex-grow">
            <input type="number" className="block w-full h-full p-1 bg-transparent border-b-2 border-gray-900 border-dashed" value={toMinutes(refresherDuration)} onChange={(e) => updateConfig({refresherDuration: minutes(parseFloat(e.target.value))})}/>
          </div>
        </div>
        <div className="text-xl flex mb-4">
          <div className="w-60">
            Refresher video
          </div>
          <div className="flex-grow">
            <input type="text" className="block w-full h-full p-1 bg-transparent border-b-2 border-gray-900 border-dashed" value={breakVideo} onChange={(e) => updateConfig({breakVideo: e.target.value})}/>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConfigModal;