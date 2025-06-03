import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Search, Library, Plus, Heart, X } from 'lucide-react';
import { usePlaylist } from '../contexts/PlaylistContext';

interface SidebarProps {
  onClose?: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ onClose }) => {
  const location = useLocation();
  const { playlists, createPlaylist } = usePlaylist();

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  const handleCreatePlaylist = () => {
    const name = prompt('Playlist name:');
    if (name) {
      createPlaylist(name, 'My new playlist');
    }
  };

  const handleLinkClick = () => {
    // Close sidebar on mobile when link is clicked
    if (onClose) {
      onClose();
    }
  };

  return (
    <div className="w-64 bg-black text-white h-full p-6 border-r border-gray-800">
      {/* Logo */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
          MusicWave
        </h1>
        <p className="text-xs text-gray-400">Free Music Streaming</p>
      </div>

      {/* Main Navigation */}
      <nav className="space-y-2 mb-8">
        <Link
          to="/"
          onClick={handleLinkClick}
          className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${
            isActive('/') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <Home className="w-5 h-5" />
          <span>Home</span>
        </Link>

        <Link
          to="/search"
          onClick={handleLinkClick}
          className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${
            isActive('/search') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <Search className="w-5 h-5" />
          <span>Search</span>
        </Link>

        <Link
          to="/library"
          onClick={handleLinkClick}
          className={`flex items-center space-x-3 py-3 px-4 rounded-lg transition-colors ${
            isActive('/library') ? 'bg-gray-800 text-white' : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
          }`}
        >
          <Library className="w-5 h-5" />
          <span>Your Library</span>
        </Link>
      </nav>

      {/* Playlist Section */}
      <div className="border-t border-gray-800 pt-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-gray-400 text-sm font-medium">PLAYLISTS</h3>
          <button 
            onClick={handleCreatePlaylist}
            className="text-gray-400 hover:text-white p-1 hover:bg-gray-800 rounded"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Playlist List */}
        <div className="space-y-1 max-h-48 overflow-y-auto">
          {playlists.length === 0 ? (
            <p className="text-gray-500 text-sm py-2">No playlists yet</p>
          ) : (
            playlists.map((playlist) => (
              <Link
                key={playlist.id}
                to={`/playlist/${playlist.id}`}
                onClick={handleLinkClick}
                className="block py-2 px-2 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded truncate text-sm"
              >
                {playlist.name}
              </Link>
            ))
          )}
        </div>

        {/* Liked Songs */}
        <Link
          to="/liked"
          onClick={handleLinkClick}
          className="flex items-center space-x-3 py-2 px-2 mt-4 text-gray-400 hover:text-white hover:bg-gray-800/50 rounded"
        >
          <Heart className="w-4 h-4" />
          <span className="text-sm">Liked Songs</span>
        </Link>
      </div>
    </div>
  );
};

export default Sidebar;