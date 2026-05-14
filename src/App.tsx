import React from 'react';
import { TopNav } from './components/TopNav/TopNav';
import { CodePanel } from './components/CodePanel/CodePanel';
import { VizPanel } from './components/VizPanel/VizPanel';
import { BottomControls } from './components/BottomControls/BottomControls';
import { PurposeBox } from './components/PurposeBox/PurposeBox';
import { useKeyboard } from './hooks/useKeyboard';
import { useAutoPlay } from './hooks/useAutoPlay';

function App() {
  useKeyboard();
  useAutoPlay();

  return (
    <div className="h-screen flex flex-col bg-[#0A0C10] text-white overflow-hidden">
      <TopNav />
      <div className="flex-1 flex overflow-hidden">
        <div className="w-[45%] min-w-[300px] flex flex-col border-r border-[#1E2235] overflow-hidden">
          <div className="flex-1 overflow-hidden">
            <CodePanel />
          </div>
          <PurposeBox />
        </div>
        <div className="flex-1 overflow-hidden">
          <VizPanel />
        </div>
      </div>
      <BottomControls />
    </div>
  );
}

export default App;
