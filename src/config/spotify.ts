export const spotifyConfig = {
  clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID || '208fe61eebfe4c6cb6c9747b3f64fd0c',
  redirectUri: import.meta.env.VITE_SPOTIFY_REDIRECT_URI || 'http://127.0.0.1:5173',
  scopes: [
    'user-read-private',
    'user-read-email',
    'playlist-read-private',
    'playlist-read-collaborative',
    'user-library-read',
    'user-library-modify',
    'user-read-playback-state',
    'user-modify-playback-state',
    'user-read-currently-playing',
    'streaming',
    'playlist-modify-private',
    'playlist-modify-public',
    'user-follow-read',
    'user-follow-modify'
  ]
};

// Debug log
console.log('Spotify Config:', spotifyConfig);
console.log('Client ID:', spotifyConfig.clientId);
console.log('Redirect URI:', spotifyConfig.redirectUri);

export const getSpotifyAuthUrl = (): string => {
  const params = new URLSearchParams({
    client_id: spotifyConfig.clientId,
    response_type: 'token', // Changed from 'code' to 'token' for implicit flow
    redirect_uri: spotifyConfig.redirectUri,
    scope: spotifyConfig.scopes.join(' '),
    show_dialog: 'true'
  });

  return `https://accounts.spotify.com/authorize?${params.toString()}`;
};