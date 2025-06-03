import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Clock, MoreHorizontal, Play } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import TrackList from '../components/TrackList';
import { usePlayer } from '../contexts/PlayerContext';

const Playlist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { spotifyApi } = useAuth();
  const { playTrack } = usePlayer();
  const [playlist, setPlaylist] = useState<SpotifyApi.SinglePlaylistResponse | null>(null);
  const [tracks, setTracks] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    
    spotifyApi.getPlaylist(id)
      .then(data => {
        setPlaylist(data);
        const playlistTracks = data.tracks.items
          .filter(item => item.track) // Filter out null tracks
          .map(item => item.track as SpotifyApi.TrackObjectFull);
        setTracks(playlistTracks);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error getting playlist:", err);
        setIsLoading(false);
      });
  }, [id, spotifyApi]);

  const playFirstTrack = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0]);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  if (!playlist) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-2">Playlist not found</h2>
        <p className="text-text-subdued">
          The playlist you're looking for doesn't exist or you might not have access to it.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-10 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col md:flex-row items-center md:items-end gap-6 mb-6">
        <div className="w-48 h-48 shadow-lg flex-shrink-0">
          <img 
            src={playlist.images[0]?.url || 'https://via.placeholder.com/150'} 
            alt={playlist.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex flex-col items-center md:items-start">
          <p className="text-sm uppercase font-bold">Playlist</p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">{playlist.name}</h1>
          <div className="text-sm text-text-subdued">
            <span>{playlist.description}</span>
            <div className="mt-2">
              <span className="font-semibold">{playlist.owner.display_name}</span>
              <span> • {playlist.followers.total.toLocaleString()} likes</span>
              <span> • {tracks.length} songs</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center gap-6 mb-6 px-4">
        <button 
          onClick={playFirstTrack}
          className="bg-spotify-green hover:bg-spotify-greenHover rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-black"
        >
          <Play size={28} fill="currentColor" />
        </button>
        
        <button className="text-text-subdued hover:text-text-base">
          <MoreHorizontal size={32} />
        </button>
      </div>
      
      {/* Tracks */}
      <div className="px-4">
        {tracks.length > 0 ? (
          <TrackList tracks={tracks} />
        ) : (
          <div className="text-center py-12">
            <p className="text-text-subdued">This playlist is empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Playlist;