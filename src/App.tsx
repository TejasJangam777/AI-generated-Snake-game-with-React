/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import SnakeGame from './components/SnakeGame';
import MusicPlayer from './components/MusicPlayer';

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-50 font-sans selection:bg-cyan-500/30 overflow-hidden relative flex flex-col">
      {/* Background Neon Effects */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-fuchsia-600/20 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-cyan-600/20 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px] pointer-events-none" />

      <header className="w-full p-6 relative z-10 flex justify-center">
        <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-fuchsia-500 drop-shadow-[0_0_10px_rgba(217,70,239,0.4)] uppercase italic">
          Neon Snake <span className="text-white">&</span> Synth
        </h1>
      </header>

      <main className="flex-1 w-full max-w-6xl mx-auto p-4 md:p-6 flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 relative z-10">
        
        {/* Game Section */}
        <div className="w-full lg:w-3/5 flex justify-center order-2 lg:order-1">
          <SnakeGame />
        </div>

        {/* Music Player Section */}
        <div className="w-full lg:w-2/5 flex flex-col items-center justify-center order-1 lg:order-2">
          <div className="w-full max-w-md mb-6 text-center lg:text-left">
            <h2 className="text-xl font-bold text-fuchsia-400 mb-2 uppercase tracking-widest">Soundtrack</h2>
            <p className="text-neutral-400 text-sm">
              Immerse yourself in the neon grid with AI-generated synthwave tracks.
            </p>
          </div>
          <MusicPlayer />
        </div>

      </main>

      <footer className="w-full p-4 text-center text-neutral-500 text-xs uppercase tracking-widest relative z-10">
        Use Arrow Keys or WASD to play — Space to pause
      </footer>
    </div>
  );
}
