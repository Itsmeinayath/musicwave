import React, { useState, useEffect } from 'react';
import { Music, Play, TrendingUp, Clock, Heart, Headphones, Radio, Disc3, Search as SearchIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { usePlayer } from '../contexts/PlayerContext';

const Home = () => {
  const navigate = useNavigate();
  const { playTrack } = usePlayer();
  const [featuredTracks, setFeaturedTracks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch some featured tracks from Jamendo on load
  useEffect(() => {
    fetchFeaturedMusic();
  }, []);

  const fetchFeaturedMusic = async () => {
    try {
      const CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID;
      if (!CLIENT_ID) {
        setFeaturedTracks(getDemoTracks());
        setLoading(false);
        return;
      }

      const response = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=12&featured=1&include=musicinfo&audioformat=mp32`
      );
      const data = await response.json();
      
      const tracks = data.results.map((track: any) => ({
        id: track.id.toString(),
        name: track.name,
        artists: [{ name: track.artist_name }],
        album: { 
          name: track.album_name,
          images: [{ url: track.album_image || track.artist_image || 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' }]
        },
        duration_ms: track.duration * 1000,
        preview_url: track.audio,
        genre: track.musicinfo?.tags?.genres?.[0] || 'Music'
      }));

      setFeaturedTracks(tracks);
    } catch (error) {
      console.error('Error fetching featured music:', error);
      setFeaturedTracks(getDemoTracks());
    } finally {
      setLoading(false);
    }
  };

  const getDemoTracks = () => [
    {
      id: '1',
      name: 'Ambient Dreams',
      artists: [{ name: 'Electronic Vibes' }],
      album: { name: 'Digital Waves', images: [{ url: 'https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=300&h=300&fit=crop' }] },
      duration_ms: 240000,
      preview_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      genre: 'Electronic'
    },
    {
      id: '2',
      name: 'Jazz Café Nights',
      artists: [{ name: 'Smooth Collective' }],
      album: { name: 'Midnight Sessions', images: [{ url: 'https://images.unsplash.com/photo-1511379938547-c1f69419868d?w=300&h=300&fit=crop' }] },
      duration_ms: 200000,
      preview_url: 'https://www.soundjay.com/misc/sounds/bell-ringing-05.wav',
      genre: 'Jazz'
    }
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search/${encodeURIComponent(searchQuery)}`);
    }
  };

  const handleCategoryClick = (category: string) => {
    navigate(`/search/${encodeURIComponent(category.toLowerCase())}`);
  };

  const handlePlayFeatured = (track: any) => {
    playTrack(track, featuredTracks);
  };

  const quickSearches = [
    { term: 'electronic', icon: '🎧', color: 'from-blue-500 to-purple-600' },
    { term: 'jazz', icon: '🎷', color: 'from-yellow-500 to-orange-600' },
    { term: 'piano', icon: '🎹', color: 'from-green-500 to-teal-600' },
    { term: 'rock', icon: '🎸', color: 'from-red-500 to-pink-600' },
    { term: 'classical', icon: '🎼', color: 'from-purple-500 to-indigo-600' },
    { term: 'ambient', icon: '🌙', color: 'from-indigo-500 to-blue-600' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 text-white">
      {/* Mobile padding for menu button */}
      <div className="pt-16 lg:pt-0">
        
        {/* Hero Section with Search */}
        <div className="relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 p-4 lg:p-8 rounded-2xl m-4 lg:m-6">
          <div className="relative z-10">
            <div className="flex flex-col lg:flex-row lg:items-center lg:space-x-4 mb-6">
              <div className="flex items-center space-x-4 mb-4 lg:mb-0">
                <div className="bg-white/20 p-3 rounded-full">
                  <Music className="w-6 h-6 lg:w-8 lg:h-8" />
                </div>
                <div>
                  <h1 className="text-2xl lg:text-4xl font-bold">Welcome to MusicWave</h1>
                  <p className="text-sm lg:text-xl opacity-90">Discover amazing independent artists</p>
                </div>
              </div>
            </div>

            {/* Search Bar */}
            <form onSubmit={handleSearch} className="mb-6">
              <div className="relative max-w-md">
                <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search for songs, artists..."
                  className="w-full pl-10 pr-4 py-3 bg-white/90 backdrop-blur-sm rounded-full text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-white/50"
                />
              </div>
            </form>

            <div className="flex flex-wrap gap-3 lg:gap-6">
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 lg:p-4">
                <div className="flex items-center space-x-2">
                  <Headphones className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="font-semibold text-sm lg:text-base">Full Songs</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 lg:p-4">
                <div className="flex items-center space-x-2">
                  <Heart className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="font-semibold text-sm lg:text-base">No Ads</span>
                </div>
              </div>
              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-3 lg:p-4">
                <div className="flex items-center space-x-2">
                  <Radio className="w-4 h-4 lg:w-5 lg:h-5" />
                  <span className="font-semibold text-sm lg:text-base">Free Forever</span>
                </div>
              </div>
            </div>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-black/20 to-transparent" />
        </div>

        {/* Quick Search Categories */}
        <section className="px-4 lg:px-6 mb-8 lg:mb-12">
          <h2 className="text-xl lg:text-2xl font-bold mb-4 lg:mb-6 flex items-center">
            <TrendingUp className="w-5 h-5 lg:w-6 lg:h-6 mr-2 text-green-500" />
            Quick Discover
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 lg:gap-4">
            {quickSearches.map((item) => (
              <button
                key={item.term}
                onClick={() => handleCategoryClick(item.term)}
                className={`bg-gradient-to-br ${item.color} rounded-xl p-4 lg:p-6 text-center hover:scale-105 transition-transform duration-200 shadow-lg hover:shadow-xl`}
              >
                <div className="text-2xl lg:text-3xl mb-1 lg:mb-2">{item.icon}</div>
                <div className="font-bold capitalize text-sm lg:text-base">{item.term}</div>
              </button>
            ))}
          </div>
        </section>

        {/* Featured Music */}
        <section className="px-4 lg:px-6 mb-8 lg:mb-12">
          <div className="flex items-center justify-between mb-4 lg:mb-6">
            <h2 className="text-xl lg:text-2xl font-bold flex items-center">
              <Disc3 className="w-5 h-5 lg:w-6 lg:h-6 mr-2 text-green-500" />
              Featured Music
            </h2>
            <button 
              onClick={() => navigate('/search')}
              className="text-green-500 hover:text-green-400 font-medium text-sm lg:text-base"
            >
              Explore All →
            </button>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-gray-800 rounded-lg p-3 lg:p-4 animate-pulse">
                  <div className="bg-gray-700 aspect-square rounded-lg mb-2 lg:mb-3" />
                  <div className="bg-gray-700 h-3 lg:h-4 rounded mb-1 lg:mb-2" />
                  <div className="bg-gray-700 h-2 lg:h-3 rounded w-3/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-3 lg:gap-4">
              {featuredTracks.slice(0, 6).map((track) => (
                <div
                  key={track.id}
                  className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-3 lg:p-4 hover:bg-gray-700/50 transition-all duration-200 group cursor-pointer"
                  onClick={() => handlePlayFeatured(track)}
                >
                  <div className="relative mb-2 lg:mb-3">
                    <img
                      src={track.album.images[0]?.url}
                      alt={track.album.name}
                      className="w-full aspect-square rounded-lg object-cover"
                    />
                    <button className="absolute bottom-1 right-1 lg:bottom-2 lg:right-2 bg-green-500 text-black p-1.5 lg:p-2 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-200 hover:scale-110">
                      <Play className="w-3 h-3 lg:w-4 lg:h-4" />
                    </button>
                  </div>
                  <h3 className="font-semibold text-white truncate text-xs lg:text-sm">{track.name}</h3>
                  <p className="text-gray-400 text-xs truncate">{track.artists[0].name}</p>
                  <div className="flex items-center mt-1">
                    <span className="text-xs text-green-400 bg-green-400/10 px-1.5 lg:px-2 py-0.5 lg:py-1 rounded-full">
                      {track.genre}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Call to Action */}
        <section className="px-4 lg:px-6 mb-8">
          <div className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-2xl p-6 lg:p-8 text-center">
            <Music className="w-12 h-12 lg:w-16 lg:h-16 mx-auto mb-3 lg:mb-4" />
            <h2 className="text-2xl lg:text-3xl font-bold mb-3 lg:mb-4">Start Your Musical Journey</h2>
            <p className="text-base lg:text-xl mb-4 lg:mb-6 opacity-90">
              Explore thousands of high-quality tracks from talented independent artists
            </p>
            <button
              onClick={() => navigate('/search')}
              className="bg-white text-purple-600 font-bold py-2 lg:py-3 px-6 lg:px-8 rounded-full hover:scale-105 transition-transform duration-200"
            >
              Start Exploring Music
            </button>
          </div>
        </section>
      </div>
    </div>
  );
};

export default Home;