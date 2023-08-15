import './App.css';
import VideoPlayer from './VideoPlayer';

function App() {
  const serverUrl = "http://file-system-service:3000/stream/small_demo.mkv";

  return (
    <div className="App h-screen bg-gray-100 flex flex-col items-center justify-center">
      <header className="text-2xl mb-8 font-bold text-gray-700">
        Video Streamer
      </header>
      <VideoPlayer videoUrl={serverUrl} />
    </div>
  );
}

export default App;
