import React, { createContext, useContext, useState, ReactNode } from 'react';

interface Playlist {
  id: string;
  name: string;
  description: string;
  tracks: any[];
  image?: string;
}

interface PlaylistContextType {
  playlists: Playlist[];
  createPlaylist: (name: string, description?: string) => Promise<void>;
  addToPlaylist: (playlistId: string, track: any) => Promise<void>;
  removeFromPlaylist: (playlistId: string, trackId: string) => Promise<void>;
  deletePlaylist: (playlistId: string) => Promise<void>;
}

const PlaylistContext = createContext<PlaylistContextType | undefined>(undefined);

export const PlaylistProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  const createPlaylist = async (name: string, description: string = '') => {
    const newPlaylist: Playlist = {
      id: Date.now().toString(),
      name,
      description,
      tracks: [],
      image: 'https://via.placeholder.com/300x300'
    };
    
    setPlaylists(prev => [...prev, newPlaylist]);
    console.log('Created playlist:', newPlaylist);
  };

  const addToPlaylist = async (playlistId: string, track: any) => {
    setPlaylists(prev => 
      prev.map(playlist => 
        playlist.id === playlistId 
          ? { ...playlist, tracks: [...playlist.tracks, track] }
          : playlist
      )
    );
    console.log('Added track to playlist');
  };

  const removeFromPlaylist = async (playlistId: string, trackId: string) => {
    setPlaylists(prev => 
      prev.map(playlist => 
        playlist.id === playlistId 
          ? { ...playlist, tracks: playlist.tracks.filter(track => track.id !== trackId) }
          : playlist
      )
    );
    console.log('Removed track from playlist');
  };

  const deletePlaylist = async (playlistId: string) => {
    setPlaylists(prev => prev.filter(playlist => playlist.id !== playlistId));
    console.log('Deleted playlist');
  };

  return (
    <PlaylistContext.Provider value={{
      playlists,
      createPlaylist,
      addToPlaylist,
      removeFromPlaylist,
      deletePlaylist
    }}>
      {children}
    </PlaylistContext.Provider>
  );
};

export const usePlaylist = () => {
  const context = useContext(PlaylistContext);
  if (context === undefined) {
    throw new Error('usePlaylist must be used within a PlaylistProvider');
  }
  return context;
};