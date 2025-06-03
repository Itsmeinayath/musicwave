import React, { useState, useRef } from 'react';
import { 
  SkipBack, 
  SkipForward, 
  Play, 
  Pause, 
  Volume2, 
  Volume1, 
  VolumeX,
  Repeat,
  Shuffle
} from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';

const Player: React.FC = () => {
  const { 
    currentTrack, 
    isPlaying, 
    progress, 
    duration, 
    volume,
    togglePlayPause, 
    skipNext, 
    skipPrevious, 
    seekToPosition, 
    setVolume 
  } = usePlayer();
  
  const [isDragging, setIsDragging] = useState(false);
  const progressRef = useRef<HTMLDivElement>(null);

  if (!currentTrack) {
    return (
      <div className="h-20 bg-background-elevated border-t border-background-highlight px-4 flex items-center justify-center text-text-subdued">
        No track currently playing
      </div>
    );
  }

  const formatTime = (ms: number) => {
    const minutes = Math.floor(ms / 60000);
    const seconds = Math.floor((ms % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    const position = Math.floor(duration * percent);
    seekToPosition(position);
  };

  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging || !progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const position = Math.floor(duration * percent);
    seekToPosition(position);
  };

  const getVolumeIcon = () => {
    if (volume === 0) return <VolumeX size={20} />;
    if (volume < 50) return <Volume1 size={20} />;
    return <Volume2 size={20} />;
  };

  return (
    <div 
      className="h-20 bg-background-elevated border-t border-background-highlight px-4 flex items-center"
      onMouseMove={handleProgressDrag}
      onMouseUp={() => setIsDragging(false)}
      onMouseLeave={() => setIsDragging(false)}
    >
      {/* Left: Track Info */}
      <div className="w-1/4 flex items-center gap-4">
        <img 
          src={currentTrack.album.images[0]?.url} 
          alt={currentTrack.album.name}
          className="h-14 w-14 rounded shadow"
        />
        <div className="truncate">
          <p className="font-medium truncate">{currentTrack.name}</p>
          <p className="text-sm text-text-subdued truncate">
            {currentTrack.artists.map(artist => artist.name).join(', ')}
          </p>
        </div>
      </div>
      
      {/* Center: Controls */}
      <div className="flex-1 flex flex-col items-center">
        <div className="flex items-center gap-6 mb-2">
          <button className="text-text-subdued hover:text-text-base transition-colors">
            <Shuffle size={18} />
          </button>
          <button 
            onClick={skipPrevious}
            className="text-text-subdued hover:text-text-base transition-colors"
          >
            <SkipBack size={24} />
          </button>
          <button 
            onClick={togglePlayPause}
            className="bg-text-base text-background-base rounded-full p-2 hover:scale-105 transition-transform"
          >
            {isPlaying ? <Pause size={18} /> : <Play size={18} />}
          </button>
          <button 
            onClick={skipNext}
            className="text-text-subdued hover:text-text-base transition-colors"
          >
            <SkipForward size={24} />
          </button>
          <button className="text-text-subdued hover:text-text-base transition-colors">
            <Repeat size={18} />
          </button>
        </div>
        <div className="w-full flex items-center gap-2">
          <span className="text-xs text-text-subdued w-10 text-right">
            {formatTime(progress)}
          </span>
          <div 
            className="progress-bar flex-1"
            ref={progressRef}
            onClick={handleProgressClick}
            onMouseDown={(e) => {
              setIsDragging(true);
              handleProgressClick(e);
            }}
          >
            <div 
              className="progress-bar-fill"
              style={{ width: `${(progress / duration) * 100}%` }}
            />
          </div>
          <span className="text-xs text-text-subdued w-10">
            {formatTime(duration)}
          </span>
        </div>
      </div>
      
      {/* Right: Volume */}
      <div className="w-1/4 flex justify-end items-center gap-2">
        <button className="text-text-subdued hover:text-text-base transition-colors">
          {getVolumeIcon()}
        </button>
        <div className="w-24 progress-bar">
          <input
            type="range"
            min="0"
            max="100"
            value={volume}
            onChange={(e) => setVolume(Number(e.target.value))}
            className="absolute opacity-0 w-24 h-5 cursor-pointer"
          />
          <div 
            className="progress-bar-fill"
            style={{ width: `${volume}%` }}
          />
        </div>
      </div>
    </div>
  );
};

export default Player;