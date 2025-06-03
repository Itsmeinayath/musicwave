import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Play, Heart, MoreHorizontal } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { usePlayer } from '../contexts/PlayerContext';
import TrackList from '../components/TrackList';
import CardGrid from '../components/CardGrid';

const Artist: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { spotifyApi } = useAuth();
  const { playTrack } = usePlayer();
  const [artist, setArtist] = useState<SpotifyApi.SingleArtistResponse | null>(null);
  const [topTracks, setTopTracks] = useState<SpotifyApi.TrackObjectFull[]>([]);
  const [albums, setAlbums] = useState<SpotifyApi.AlbumObjectSimplified[]>([]);
  const [relatedArtists, setRelatedArtists] = useState<SpotifyApi.ArtistObjectFull[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    if (!id) return;
    
    setIsLoading(true);
    
    // Get artist details, top tracks, albums, and related artists
    Promise.all([
      spotifyApi.getArtist(id),
      spotifyApi.getArtistTopTracks(id, 'US'),
      spotifyApi.getArtistAlbums(id, { limit: 10 }),
      spotifyApi.getArtistRelatedArtists(id),
      spotifyApi.isFollowingArtists([id])
    ])
      .then(([artistData, topTracksData, albumsData, relatedArtistsData, followingData]) => {
        setArtist(artistData);
        setTopTracks(topTracksData.tracks);
        setAlbums(albumsData.items);
        setRelatedArtists(relatedArtistsData.artists);
        setIsFollowing(followingData[0]);
        setIsLoading(false);
      })
      .catch(err => {
        console.error("Error getting artist data:", err);
        setIsLoading(false);
      });
  }, [id, spotifyApi]);

  const playArtistTopTracks = () => {
    if (topTracks.length > 0) {
      playTrack(topTracks[0]);
    }
  };

  const toggleFollowArtist = () => {
    if (isFollowing) {
      spotifyApi.unfollowArtists([id!])
        .then(() => setIsFollowing(false))
        .catch(err => console.error("Error unfollowing artist:", err));
    } else {
      spotifyApi.followArtists([id!])
        .then(() => setIsFollowing(true))
        .catch(err => console.error("Error following artist:", err));
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-spotify-green"></div>
      </div>
    );
  }

  if (!artist) {
    return (
      <div className="text-center py-20">
        <h2 className="text-2xl font-bold mb-2">Artist not found</h2>
        <p className="text-text-subdued">
          The artist you're looking for doesn't exist or you might not have access to it.
        </p>
      </div>
    );
  }

  return (
    <div className="pb-10 animate-fade-in">
      {/* Header with artist image as background */}
      <div 
        className="h-80 flex items-end p-8 mb-6 bg-cover bg-center"
        style={{ 
          backgroundImage: `linear-gradient(rgba(0,0,0,0.2), rgba(0,0,0,0.8)), url(${artist.images[0]?.url})` 
        }}
      >
        <div>
          <h1 className="text-5xl font-bold mb-4">{artist.name}</h1>
          <p className="text-sm">
            {artist.followers.total.toLocaleString()} followers
          </p>
        </div>
      </div>
      
      {/* Action buttons */}
      <div className="flex items-center gap-6 mb-6 px-4">
        <button 
          onClick={playArtistTopTracks}
          className="bg-spotify-green hover:bg-spotify-greenHover rounded-full w-14 h-14 flex items-center justify-center shadow-lg text-black"
        >
          <Play size={28} fill="currentColor" />
        </button>
        
        <button 
          onClick={toggleFollowArtist}
          className={`border px-6 py-2 rounded-full font-bold ${
            isFollowing 
              ? 'border-text-base text-text-base' 
              : 'border-text-subdued text-text-subdued hover:border-text-base hover:text-text-base'
          }`}
        >
          {isFollowing ? 'Following' : 'Follow'}
        </button>
        
        <button className="text-text-subdued hover:text-text-base">
          <MoreHorizontal size={32} />
        </button>
      </div>
      
      {/* Popular tracks */}
      <div className="px-4 mb-8">
        <h2 className="text-2xl font-bold mb-4">Popular</h2>
        <TrackList tracks={topTracks.slice(0, 5)} showArtist={false} />
      </div>
      
      {/* Albums */}
      {albums.length > 0 && (
        <div className="px-4 mb-8">
          <CardGrid title="Albums" items={albums} />
        </div>
      )}
      
      {/* Related artists */}
      {relatedArtists.length > 0 && (
        <div className="px-4">
          <CardGrid title="Fans also like" items={relatedArtists} />
        </div>
      )}
    </div>
  );
};

export default Artist;