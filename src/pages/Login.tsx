import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { getSpotifyAuthUrl } from '../config/spotify';
import { Music } from 'lucide-react';

const Login: React.FC = () => {
  const { login } = useAuth();
  const [debugInfo, setDebugInfo] = useState<string>('');
  const [showDebug, setShowDebug] = useState(false);

  const handleLogin = () => {
    console.log('Login button clicked!');
    setDebugInfo('Login button clicked - calling login()...');
    try {
      login();
    } catch (error) {
      console.error('Error calling login():', error);
      setDebugInfo(`Error: ${error}`);
    }
  };

  const handleDirectLogin = () => {
    console.log('Direct login clicked!');
    try {
      const authUrl = getSpotifyAuthUrl();
      setDebugInfo(`Generated Auth URL: ${authUrl}`);
      setShowDebug(true);
      
      // Wait 3 seconds before redirecting so you can see the URL
      setTimeout(() => {
        if (authUrl) {
          window.location.href = authUrl;
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error in handleDirectLogin:', error);
      setDebugInfo(`Error: ${error}`);
    }
  };

  const handleTestSpotifyDirect = () => {
    console.log('Testing hardcoded Spotify URL...');
    const directUrl = 'https://accounts.spotify.com/authorize?client_id=208fe61eebfe4c6cb6c9747b3f64fd0c&response_type=token&redirect_uri=http%3A%2F%2F127.0.0.1%3A5173&scope=user-read-private%20user-read-email&show_dialog=true';
    setDebugInfo(`Hardcoded URL: ${directUrl}`);
    setShowDebug(true);
    
    // Wait 3 seconds before redirecting so you can see the URL
    setTimeout(() => {
      window.location.href = directUrl;
    }, 3000);
  };
  // Add this function after your other handlers
const handleLocalhostTest = () => {
  console.log('Testing with localhost...');
  const localhostUrl = 'https://accounts.spotify.com/authorize?client_id=208fe61eebfe4c6cb6c9747b3f64fd0c&response_type=token&redirect_uri=http%3A%2F%2Flocalhost%3A5173&scope=user-read-private%20user-read-email&show_dialog=true';
  setDebugInfo(`Localhost URL: ${localhostUrl}`);
  setShowDebug(true);
  
  setTimeout(() => {
    window.location.href = localhostUrl;
  }, 3000);
};

// Add this button to your JSX (after the purple button, before the green button)
<button
  onClick={handleLocalhostTest}
  className="block w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded text-sm"
>
  Test with localhost (3s delay)
</button>

  const handleTestRedirect = () => {
    console.log('Testing simple redirect...');
    window.location.href = 'https://google.com';
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('URL copied to clipboard!');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-900 to-black flex items-center justify-center">
      <div className="text-center max-w-2xl mx-auto p-4">
        <div className="flex items-center justify-center mb-8">
          <Music className="w-16 h-16 text-green-500 mr-4" />
          <h1 className="text-6xl font-bold text-white">Spotify Clone</h1>
        </div>
        
        <p className="text-xl text-gray-300 mb-8">
          Listen to millions of songs and podcasts for free.
        </p>

        {/* Debug Info Display */}
        {showDebug && (
          <div className="mb-8 p-4 bg-gray-800 rounded-lg">
            <h3 className="text-white font-bold mb-2">Debug Info:</h3>
            <div className="text-sm text-gray-300 break-all mb-4">
              {debugInfo}
            </div>
            <button
              onClick={() => copyToClipboard(debugInfo)}
              className="bg-gray-600 text-white px-4 py-2 rounded text-sm hover:bg-gray-500"
            >
              Copy URL
            </button>
            <div className="text-yellow-300 text-sm mt-2">
              Redirecting in 3 seconds... (You can copy the URL above)
            </div>
          </div>
        )}
        
        <div className="space-y-4">
          <button
            onClick={handleTestRedirect}
            className="block w-full bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded text-sm"
          >
            Test Redirect to Google ✅
          </button>

          <button
            onClick={handleTestSpotifyDirect}
            className="block w-full bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded text-sm"
          >
            Test Hardcoded Spotify URL (3s delay)
          </button>
          
          <button
            onClick={handleLogin}
            className="block w-full bg-green-500 hover:bg-green-600 text-black font-bold py-4 px-8 rounded-full text-lg transition-colors duration-200"
          >
            Login with Spotify (Context)
          </button>
          
          <button
            onClick={handleDirectLogin}
            className="block w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-4 px-8 rounded-full text-lg transition-colors duration-200"
          >
            Direct Login (Config) (3s delay)
          </button>
        </div>
        
        <p className="text-sm text-gray-400 mt-4">
          You'll be redirected to Spotify to authorize this app
        </p>
      </div>
    </div>
  );
};

export default Login;