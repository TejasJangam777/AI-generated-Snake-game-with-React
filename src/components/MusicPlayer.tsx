import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "Neon Nights (AI Synth)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "Cyber City (AI Beats)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "Digital Dream (AI Wave)", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
];

export default function MusicPlayer() {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  const [isMuted, setIsMuted] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume;
    }
  }, [volume, isMuted]);

  useEffect(() => {
    if (isPlaying && audioRef.current) {
      audioRef.current.play().catch(e => console.error("Audio play error:", e));
    }
  }, [currentTrackIndex, isPlaying]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play().catch(e => console.error("Audio play error:", e));
      }
      setIsPlaying(!isPlaying);
    }
  };

  const nextTrack = () => {
    setCurrentTrackIndex((prev) => (prev + 1) % TRACKS.length);
  };

  const prevTrack = () => {
    setCurrentTrackIndex((prev) => (prev - 1 + TRACKS.length) % TRACKS.length);
  };

  const handleEnded = () => {
    nextTrack();
  };

  const currentTrack = TRACKS[currentTrackIndex];

  return (
    <div className="bg-black/80 border border-fuchsia-500/50 rounded-xl p-4 shadow-[0_0_15px_rgba(217,70,239,0.3)] backdrop-blur-sm w-full max-w-md mx-auto">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="flex flex-col items-center gap-4">
        <div className="text-center mb-4">
          <h3 className="text-fuchsia-400 font-mono text-sm uppercase tracking-widest mb-2">Now Playing</h3>
          <p 
            className="text-cyan-300 font-mono font-bold text-2xl md:text-3xl tracking-widest uppercase glitch drop-shadow-[0_0_12px_rgba(34,211,238,0.8)]"
            data-text={currentTrack.title}
          >
            {currentTrack.title}
          </p>
        </div>

        <div className="flex items-center gap-8 mb-2">
          <button 
            onClick={prevTrack}
            className="text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] hover:text-fuchsia-200 hover:drop-shadow-[0_0_15px_rgba(217,70,239,1)] transition-all"
          >
            <SkipBack size={32} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="text-fuchsia-400 drop-shadow-[0_0_12px_rgba(217,70,239,0.9)] hover:text-fuchsia-200 hover:drop-shadow-[0_0_20px_rgba(217,70,239,1)] transition-all"
          >
            {isPlaying ? <Pause size={48} /> : <Play size={48} />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="text-fuchsia-400 drop-shadow-[0_0_8px_rgba(217,70,239,0.8)] hover:text-fuchsia-200 hover:drop-shadow-[0_0_15px_rgba(217,70,239,1)] transition-all"
          >
            <SkipForward size={32} />
          </button>
        </div>

        <div className="flex items-center gap-3 w-full px-4">
          <button onClick={() => setIsMuted(!isMuted)} className="text-fuchsia-500/70 hover:text-fuchsia-400">
            {isMuted || volume === 0 ? <VolumeX size={18} /> : <Volume2 size={18} />}
          </button>
          <input 
            type="range" 
            min="0" 
            max="1" 
            step="0.01" 
            value={isMuted ? 0 : volume}
            onChange={(e) => {
              setVolume(parseFloat(e.target.value));
              if (isMuted) setIsMuted(false);
            }}
            className="w-full h-1 bg-fuchsia-900 rounded-lg appearance-none cursor-pointer accent-fuchsia-500"
          />
        </div>
      </div>
    </div>
  );
}
