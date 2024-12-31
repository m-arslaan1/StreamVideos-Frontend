import { useState, useEffect } from 'react';
import axios from 'axios';

const VideoStream = () => {
  const [videoFile, setVideoFile] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [videoList, setVideoList] = useState([]);

  useEffect(() => {
    const fetchVideoList = async () => {
      try {
        const response = await axios.get('https://streamvideos-backend.onrender.com/video//list');
        setVideoList(response.data);
      } catch (err) {
        setError('Error fetching video list');
        console.error(err);
      }
    };

    fetchVideoList();
  }, []);

  const handleVideoChange = (e) => {
    setVideoFile(e.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!videoFile) {
      setError('Please select a video file');
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await axios.get(`https://streamvideos-backend.onrender.com/video/stream/${videoFile}`, {
        responseType: 'blob',
        headers: { 'Range': 'bytes=0-' },
      });

      setVideoUrl(URL.createObjectURL(response.data));
    } catch (err) {
      setError('Error streaming the video. Please try again.');
      console.error(err);
    }

    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      <form onSubmit={handleSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl mb-4 text-center">Video Streaming App</h1>
        <label className="block mb-2">
          Select Video:
          <select
            value={videoFile}
            onChange={handleVideoChange}
            className="block w-full mt-1 p-2 bg-gray-700 border border-gray-600 rounded"
          >
            <option value="">--Select a video--</option>
            {videoList.map((video, index) => (
              <option key={index} value={video}>
                {video}
              </option>
            ))}
          </select>
        </label>
        <button
          type="submit"
          disabled={isLoading}
          className="w-full mt-4 p-2 bg-blue-600 hover:bg-blue-700 rounded text-white"
        >
          {isLoading ? 'Loading...' : 'Stream Video'}
        </button>
        {error && <p className="mt-4 text-red-500">{error}</p>}
      </form>

      {videoUrl && !error && (
        <div className="mt-8 w-full max-w-2xl">
          <h3 className="text-xl mb-4">Playing: {videoFile}</h3>
          <video autoPlay controls width="100%" src={videoUrl} className="rounded-lg shadow-lg"></video>
        </div>
      )}
    </div>
  );
};

export default VideoStream;