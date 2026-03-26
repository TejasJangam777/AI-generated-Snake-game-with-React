import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, SkipForward, SkipBack, Volume2, VolumeX } from 'lucide-react';

const TRACKS = [
  { id: 1, title: "NEON_NIGHTS.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" },
  { id: 2, title: "CYBER_CITY.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3" },
  { id: 3, title: "DIGITAL_DREAM.WAV", url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3" },
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
    <div className="w-full">
      <audio 
        ref={audioRef} 
        src={currentTrack.url} 
        onEnded={handleEnded}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />
      
      <div className="flex flex-col items-center gap-8">
        <div className="text-center w-full border-4 border-cyan-400 p-4 bg-black">
          <h3 className="text-fuchsia-500 font-pixel text-sm mb-4">{'>'} ACTIVE_STREAM</h3>
          <p 
            className="text-cyan-400 font-terminal text-4xl md:text-5xl glitch"
            data-text={currentTrack.title}
          >
            {currentTrack.title}
          </p>
        </div>

        <div className="flex items-center gap-10">
          <button 
            onClick={prevTrack}
            className="text-cyan-400 hover:text-fuchsia-500 transition-colors"
          >
            <SkipBack size={48} strokeWidth={1.5} />
          </button>
          
          <button 
            onClick={togglePlay}
            className="text-fuchsia-500 hover:text-cyan-400 transition-colors tear"
          >
            {isPlaying ? <Pause size={72} strokeWidth={1.5} /> : <Play size={72} strokeWidth={1.5} />}
          </button>
          
          <button 
            onClick={nextTrack}
            className="text-cyan-400 hover:text-fuchsia-500 transition-colors"
          >
            <SkipForward size={48} strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex items-center gap-4 w-full border-4 border-fuchsia-500 p-3 bg-black">
          <button onClick={() => setIsMuted(!isMuted)} className="text-cyan-400 hover:text-fuchsia-500 transition-colors">
            {isMuted || volume === 0 ? <VolumeX size={28} /> : <Volume2 size={28} />}
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
            className="w-full h-4 bg-black border-2 border-cyan-400 appearance-none cursor-pointer accent-fuchsia-500"
          />
        </div>
      </div>
    </div>
  );
}
