import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { PlayerProvider } from './contexts/PlayerContext';
import { PlaylistProvider } from './contexts/PlaylistContext';
import Layout from './components/Layout';
import Home from './pages/Home';
import Search from './pages/Search';
import Library from './pages/Library';
import Playlist from './pages/Playlist';
import Album from './pages/Album';
import Artist from './pages/Artist';

function App() {
  return (
    <PlayerProvider>
      <PlaylistProvider>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="search" element={<Search />} />
            <Route path="search/:query" element={<Search />} />
            <Route path="library" element={<Library />} />
            <Route path="playlist/:id" element={<Playlist />} />
            <Route path="album/:id" element={<Album />} />
            <Route path="artist/:id" element={<Artist />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        </Routes>
      </PlaylistProvider>
    </PlayerProvider>
  );
}

export default App;