import React from 'react';
import { usePlaylist } from '../contexts/PlaylistContext';
import { Music, Plus } from 'lucide-react';

const Library = () => {
  const { playlists, createPlaylist } = usePlaylist();

  const handleCreatePlaylist = () => {
    const name = prompt('Playlist name:');
    if (name) {
      createPlaylist(name, 'Created from Your Library');
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold text-white">Your Library</h1>
        <button
          onClick={handleCreatePlaylist}
          className="bg-green-500 hover:bg-green-600 text-black font-bold py-2 px-4 rounded-full flex items-center space-x-2"
        >
          <Plus className="w-4 h-4" />
          <span>Create Playlist</span>
        </button>
      </div>

      {playlists.length === 0 ? (
        <div className="text-center py-12">
          <Music className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-white mb-2">Create your first playlist</h2>
          <p className="text-gray-400 mb-6">It's easy, we'll help you</p>
          <button
            onClick={handleCreatePlaylist}
            className="bg-white text-black font-bold py-3 px-8 rounded-full hover:scale-105 transition-transform"
          >
            Create playlist
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {playlists.map((playlist) => (
            <div
              key={playlist.id}
              className="bg-gray-900 hover:bg-gray-800 transition-colors duration-200 rounded-lg p-4 cursor-pointer group"
            >
              <div className="relative mb-4">
                <img
                  src={playlist.image}
                  alt={playlist.name}
                  className="w-full aspect-square rounded-lg"
                />
                <button className="absolute bottom-2 right-2 bg-green-500 text-black p-3 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 hover:scale-105">
                  <Music className="w-4 h-4" />
                </button>
              </div>
              <h3 className="font-semibold text-white mb-1 truncate">{playlist.name}</h3>
              <p className="text-gray-400 text-sm">{playlist.tracks.length} songs</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Library;