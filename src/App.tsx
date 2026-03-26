/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-black text-cyan-400 font-terminal overflow-hidden relative flex flex-col">
      <div className="bg-noise" />
      <div className="scanlines" />

      <header className="w-full p-6 relative z-10 flex justify-center border-b-4 border-fuchsia-500 mb-4 tear bg-black">
        <h1 className="text-3xl md:text-5xl font-pixel tracking-tighter text-cyan-400 glitch" data-text="SYS.OP // SNAKE_PROTOCOL">
          SYS.OP // SNAKE_PROTOCOL
        </h1>
      </header>

      <main className="flex-1 w-full max-w-7xl mx-auto p-4 flex flex-col lg:flex-row items-start justify-center gap-8 relative z-10">
        
        {/* Game Section */}
        <div className="w-full lg:w-2/3 flex justify-center border-4 border-cyan-400 p-2 bg-black shadow-[12px_12px_0px_#ff00ff]">
          <SnakeGame />
        </div>

        {/* Music Player Section */}
        <div className="w-full lg:w-1/3 flex flex-col items-center justify-center border-4 border-fuchsia-500 p-6 bg-black shadow-[12px_12px_0px_#00ffff] tear">
          <div className="w-full mb-8 text-left border-b-4 border-cyan-400 pb-4">
            <h2 className="text-2xl md:text-3xl font-pixel text-fuchsia-500 mb-4 glitch" data-text="AUDIO_SUBSYSTEM">AUDIO_SUBSYSTEM</h2>
            <p className="text-cyan-400 text-xl font-terminal">
              {'>'} STATUS: ONLINE<br/>
              {'>'} STREAMING_DATA...
            </p>
          </div>
          <MusicPlayer />
        </div>

      </main>

      <footer className="w-full p-6 text-center text-fuchsia-500 text-xl md:text-2xl font-pixel relative z-10 border-t-4 border-cyan-400 mt-auto bg-black">
        INPUT_REQ: [W,A,S,D] OR [ARROWS] // HALT: [SPACE]
      </footer>
    </div>
  );
}
