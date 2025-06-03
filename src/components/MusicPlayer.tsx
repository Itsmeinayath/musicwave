import React, { useRef } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Shuffle, Repeat, RotateCcw, RotateCw } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';

const MusicPlayer = () => {
  const { 
    currentTrack, 
    isPlaying, 
    playTrack, 
    pauseTrack, 
    resumeTrack, 
    currentTime, 
    duration,
    seekTo,
    skipForward,
    skipBackward,
    nextTrack,
    previousTrack,
    playlist,
    currentIndex
  } = usePlayer();

  const progressBarRef = useRef<HTMLDivElement>(null);

  if (!currentTrack) {
    return null;
  }

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration ? (currentTime / duration) * 100 : 0;

  // Handle clicking on progress bar to seek
  const handleProgressBarClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (progressBarRef.current && duration) {
      const rect = progressBarRef.current.getBoundingClientRect();
      const clickX = e.clientX - rect.left;
      const clickPercentage = clickX / rect.width;
      const newTime = clickPercentage * duration;
      seekTo(newTime);
    }
  };

  const canGoPrevious = playlist.length > 0 && currentIndex > 0;
  const canGoNext = playlist.length > 0 && currentIndex < playlist.length - 1;

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 p-4 z-50">
      <div className="flex items-center justify-between max-w-full">
        {/* Current Track Info */}
        <div className="flex items-center space-x-4 min-w-0 flex-1">
          <img
            src={currentTrack.album.images[0]?.url || 'https://via.placeholder.com/56x56'}
            alt={currentTrack.album.name}
            className="w-14 h-14 rounded"
          />
          <div className="min-w-0">
            <div className="text-white font-medium truncate">{currentTrack.name}</div>
            <div className="text-gray-400 text-sm truncate">
              {currentTrack.artists.map(artist => artist.name).join(', ')}
            </div>
          </div>
        </div>

        {/* Player Controls */}
        <div className="flex flex-col items-center space-y-2 flex-1">
          <div className="flex items-center space-x-4">
            <button className="text-gray-400 hover:text-white">
              <Shuffle className="w-4 h-4" />
            </button>
            
            <button 
              onClick={previousTrack}
              disabled={!canGoPrevious}
              className={`${canGoPrevious ? 'text-gray-400 hover:text-white' : 'text-gray-600'} transition-colors`}
            >
              <SkipBack className="w-5 h-5" />
            </button>

            <button 
              onClick={skipBackward}
              className="text-gray-400 hover:text-white"
              title="Skip back 10 seconds"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
            
            <button
              onClick={isPlaying ? pauseTrack : resumeTrack}
              className="bg-white text-black rounded-full p-2 hover:scale-105 transition-transform"
            >
              {isPlaying ? (
                <Pause className="w-5 h-5" />
              ) : (
                <Play className="w-5 h-5 ml-0.5" />
              )}
            </button>

            <button 
              onClick={skipForward}
              className="text-gray-400 hover:text-white"
              title="Skip forward 10 seconds"
            >
              <RotateCw className="w-4 h-4" />
            </button>
            
            <button 
              onClick={nextTrack}
              disabled={!canGoNext}
              className={`${canGoNext ? 'text-gray-400 hover:text-white' : 'text-gray-600'} transition-colors`}
            >
              <SkipForward className="w-5 h-5" />
            </button>
            
            <button className="text-gray-400 hover:text-white">
              <Repeat className="w-4 h-4" />
            </button>
          </div>

          {/* Progress Bar - Clickable! */}
          <div className="flex items-center space-x-3 w-full max-w-md">
            <span className="text-xs text-gray-400 min-w-[35px]">{formatTime(currentTime)}</span>
            <div 
              ref={progressBarRef}
              className="flex-1 bg-gray-600 rounded-full h-1 cursor-pointer hover:h-1.5 transition-all group"
              onClick={handleProgressBarClick}
            >
              <div
                className="bg-white rounded-full h-full transition-all duration-100 relative group-hover:bg-green-500"
                style={{ width: `${progressPercentage}%` }}
              >
                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-3 h-3 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </div>
            <span className="text-xs text-gray-400 min-w-[35px]">{formatTime(duration)}</span>
          </div>
        </div>

        {/* Volume Control */}
        <div className="flex items-center space-x-3 flex-1 justify-end">
          <Volume2 className="w-4 h-4 text-gray-400" />
          <div className="w-20 bg-gray-600 rounded-full h-1 cursor-pointer">
            <div className="bg-white rounded-full h-1 w-3/4" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default MusicPlayer;