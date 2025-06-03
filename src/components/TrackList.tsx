// Update your TrackList component to pass the playlist
import React from 'react';
import { Play, Pause, MoreHorizontal } from 'lucide-react';
import { usePlayer } from '../contexts/PlayerContext';

interface TrackListProps {
  tracks: any[];
}

const TrackList: React.FC<TrackListProps> = ({ tracks }) => {
  const { currentTrack, isPlaying, playTrack, pauseTrack } = usePlayer();

  const handlePlayTrack = (track: any) => {
    // Pass the entire track list as playlist
    playTrack(track, tracks);
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-1">
      {tracks.map((track, index) => {
        const isCurrentTrack = currentTrack?.id === track.id;
        const isCurrentlyPlaying = isCurrentTrack && isPlaying;
        
        return (
          <div
            key={track.id}
            className="group flex items-center space-x-4 p-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            <div className="flex items-center justify-center w-10">
              {isCurrentTrack ? (
                <button
                  onClick={isCurrentlyPlaying ? pauseTrack : () => handlePlayTrack(track)}
                  className="text-green-500 hover:scale-110 transition-transform"
                >
                  {isCurrentlyPlaying ? (
                    <Pause className="w-4 h-4" />
                  ) : (
                    <Play className="w-4 h-4" />
                  )}
                </button>
              ) : (
                <button
                  onClick={() => handlePlayTrack(track)}
                  className="opacity-0 group-hover:opacity-100 text-white hover:scale-110 transition-all"
                >
                  <Play className="w-4 h-4" />
                </button>
              )}
              {!isCurrentTrack && (
                <span className="text-gray-400 text-sm group-hover:hidden">
                  {index + 1}
                </span>
              )}
            </div>

            <img
              src={track.album.images[0]?.url || 'https://via.placeholder.com/40x40'}
              alt={track.album.name}
              className="w-10 h-10 rounded"
            />

            <div className="flex-1 min-w-0">
              <div className={`font-medium truncate ${isCurrentTrack ? 'text-green-500' : 'text-white'}`}>
                {track.name}
              </div>
              <div className="text-gray-400 text-sm truncate">
                {track.artists.map((artist: any) => artist.name).join(', ')}
              </div>
            </div>

            <div className="text-gray-400 text-sm">
              {formatDuration(track.duration_ms)}
            </div>

            <button className="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white">
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};

export default TrackList;