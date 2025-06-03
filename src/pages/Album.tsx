import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Heart, Clock, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePlayer } from '../contexts/PlayerContext';
import TrackList from '../components/TrackList';

const Album: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { spotifyApi } = useAuth();
  const { playTrack } = usePlayer();
  const [album, setAlbum] = useState<SpotifyApi.SingleAlbumResponse | null>(null);
  const [tracks, setTracks] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);
  
  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    
    // Get album details
    spotifyApi.getAlbum(id)
      .then(data => {
        setAlbum(data);
        
        // Convert simplified tracks to full tracks for consistency with TrackList component
        const fullTracks = data.tracks.items.map(item => ({
          ...item,
          album: {
            id: data.id,
            name: data.name,
            images: data.images,
            artists: data.artists,
            album_type: data.album_type,
            release_date: data.release_date,
            type: 'album',
            uri: data.uri
          }
        } as SpotifyApi.TrackObjectFull));
        
        setTracks(fullTracks);
        
        // Check if album is saved
        return spotifyApi.containsMySavedAlbums([id]);
      })
      .then(data => {
        if (data && data[0]) {
          setIsSaved(data[0]);
        }
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error getting album:", err);
        setIsLoading(false);
      });
  }, [id, spotifyApi]);

  const playFirstTrack = () => {
    if (tracks.length > 0) {
      playTrack(tracks[0]);
    }
  };

  const toggleSaveAlbum = () => {
    if (isSaved) {
      spotifyApi.removeFromMySavedAlbums([id!])
        .then(() => setIsSaved(false))
        .catch(err => console.error("Error removing album:", err));
    } else {
      spotifyApi.addToMySavedAlbums([id!])
        .then(() => setIsSaved(true))
        .catch(err => console.error("Error saving album:", err));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  if (!album) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-2">Album not found</h2>
        <p className="text-text-subdued">
          The album you're looking for doesn't exist or you might not have access to it.
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
            src={album.images[0]?.url || 'https://via.placeholder.com/150'} 
            alt={album.name}
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="flex flex-col items-center md:items-start">
          <p className="text-sm uppercase font-bold">Album</p>
          <h1 className="text-3xl md:text-5xl font-bold mb-4 md:mb-6">{album.name}</h1>
          <div className="text-sm flex items-center gap-1">
            <span className="font-semibold">{album.artists[0]?.name}</span>
            <span className="text-text-subdued">
              • {new Date(album.release_date).getFullYear()}
              • {tracks.length} songs
            </span>
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
        
        <button 
          onClick={toggleSaveAlbum}
          className={`${isSaved ? 'text-spotify-green' : 'text-text-subdued hover:text-text-base'}`}
        >
          <Heart size={32} fill={isSaved ? 'currentColor' : 'none'} />
        </button>
        
        <button className="text-text-subdued hover:text-text-base">
          <MoreHorizontal size={32} />
        </button>
      </div>
      
      {/* Tracks */}
      <div className="px-4">
        <TrackList tracks={tracks} showAlbum={false} />
      </div>
    </div>
  );
};

export default Album;