import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Search as SearchIcon } from 'lucide-react';
import TrackList from '../components/TrackList';

const Search = () => {
  const { query } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState(query || '');
  const [searchResults, setSearchResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  const handleSearch = async (searchTerm: string, loadMore = false) => {
    if (!searchTerm.trim()) return;
    
    if (!loadMore) {
      setLoading(true);
      setOffset(0);
    } else {
      setLoadingMore(true);
    }

    try {
      const CLIENT_ID = import.meta.env.VITE_JAMENDO_CLIENT_ID;
      
      if (!CLIENT_ID) {
        console.error('Jamendo client ID not found');
        throw new Error('API key not configured');
      }

      const currentOffset = loadMore ? offset : 0;
      const limit = 50; // Increased from 20 to 50

      console.log('Searching Jamendo for:', searchTerm, 'Offset:', currentOffset);
      
      const response = await fetch(
        `https://api.jamendo.com/v3.0/tracks/?client_id=${CLIENT_ID}&format=json&limit=${limit}&offset=${currentOffset}&search=${encodeURIComponent(searchTerm)}&include=musicinfo&audioformat=mp32&order=popularity_total`
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Jamendo API response:', data);
      
      // Convert Jamendo format to our format
      const tracks = data.results.map((track: any) => ({
        id: track.id.toString(),
        name: track.name,
        artists: [{ name: track.artist_name }],
        album: { 
          name: track.album_name,
          images: [{ url: track.album_image || track.artist_image || 'https://via.placeholder.com/300x300' }]
        },
        duration_ms: track.duration * 1000,
        preview_url: track.audio, // FULL SONG! 🎵
        jamendo_id: track.id,
        genre: track.musicinfo?.tags?.genres?.[0] || 'Music'
      }));

      if (loadMore) {
        // Append new tracks to existing ones
        setSearchResults(prev => ({
          tracks: { 
            items: [...(prev?.tracks?.items || []), ...tracks] 
          }
        }));
      } else {
        // Replace with new search results
        setSearchResults({
          tracks: { items: tracks }
        });
      }
      
      // Check if there are more results
      setHasMore(tracks.length === limit);
      setOffset(currentOffset + limit);
      
      console.log('Processed tracks:', tracks.length, 'Total now:', loadMore ? (searchResults?.tracks?.items?.length || 0) + tracks.length : tracks.length);
    } catch (error) {
      console.error('Jamendo search error:', error);
      
      if (!loadMore) {
        setSearchResults({
          tracks: { items: [] },
          error: 'Failed to search. Please check your internet connection.'
        });
      }
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Load more results function
  const loadMoreResults = () => {
    if (query && hasMore && !loadingMore) {
      handleSearch(query, true);
    }
  };

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setSearchResults(null); // Clear previous results
      setOffset(0);
      setHasMore(true);
      handleSearch(searchQuery);
      navigate(`/search/${encodeURIComponent(searchQuery)}`);
    }
  };

  React.useEffect(() => {
    if (query) {
      setSearchResults(null); // Clear previous results
      setOffset(0);
      setHasMore(true);
      handleSearch(query);
    }
  }, [query]);

  return (
    <div className="p-6">
      <form onSubmit={onSearch} className="mb-8">
        <div className="relative">
          <SearchIcon className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Jamendo for full songs (try 'electronic', 'jazz', 'piano', 'guitar')"
            className="w-full pl-10 pr-4 py-3 bg-white rounded-full text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500"
          />
        </div>
      </form>

      {loading && (
        <div className="text-center py-8">
          <div className="text-gray-400 animate-pulse">🎵 Searching Jamendo for full songs...</div>
        </div>
      )}

      {searchResults && !loading && (
        <div>
          {searchResults.error ? (
            <div className="text-center py-8">
              <div className="text-red-400">{searchResults.error}</div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-white">
                  Songs ({searchResults.tracks.items.length} results)
                </h2>
                <div className="text-sm text-green-400 bg-green-900/20 px-3 py-1 rounded-full">
                  🎵 Full songs • No ads • Free
                </div>
              </div>
              <TrackList tracks={searchResults.tracks.items} />
              
              {/* Load More Button */}
              {hasMore && searchResults.tracks.items.length > 0 && (
                <div className="text-center mt-8">
                  <button
                    onClick={loadMoreResults}
                    disabled={loadingMore}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-bold py-3 px-8 rounded-full transition-colors flex items-center mx-auto space-x-2"
                  >
                    {loadingMore ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                        <span>Loading more songs...</span>
                      </>
                    ) : (
                      <>
                        <span>Load More Songs</span>
                        <span className="text-sm opacity-75">(+50 more)</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {!searchResults && !loading && (
        <div className="text-center py-12">
          <div className="text-gray-400 space-y-2">
            <div className="text-xl">🎵 Discover free music on Jamendo</div>
            <div>Search for full songs with no ads!</div>
            <div className="text-sm space-y-1">
              <div><strong>Try these searches:</strong></div>
              <div className="flex flex-wrap justify-center gap-2 mt-2">
                {['electronic', 'jazz', 'piano', 'guitar', 'ambient', 'rock'].map(genre => (
                  <button
                    key={genre}
                    onClick={() => {
                      setSearchQuery(genre);
                      setSearchResults(null);
                      setOffset(0);
                      setHasMore(true);
                      handleSearch(genre);
                      navigate(`/search/${genre}`);
                    }}
                    className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                  >
                    {genre}
                  </button>
                ))}
              </div>
            </div>
            <div className="text-green-400 mt-4">✨ Up to 50+ songs per search • Zero ads • Completely free</div>
          </div>
        </div>
      )}

      {searchResults && !loading && searchResults.tracks.items.length === 0 && !searchResults.error && (
        <div className="text-center py-8">
          <div className="text-gray-400">
            <div>No results found for "{query}"</div>
            <div className="text-sm mt-2">Try searching for:</div>
            <div className="flex flex-wrap justify-center gap-2 mt-2">
              {['electronic music', 'instrumental', 'acoustic guitar', 'piano solo'].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => {
                    setSearchQuery(suggestion);
                    setSearchResults(null);
                    setOffset(0);
                    setHasMore(true);
                    handleSearch(suggestion);
                    navigate(`/search/${encodeURIComponent(suggestion)}`);
                  }}
                  className="bg-gray-800 hover:bg-gray-700 px-3 py-1 rounded-full text-sm transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Search;