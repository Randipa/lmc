import { useEffect, useState } from 'react';
import api from '../../api';

function BunnyVideoList() {
  const [videos, setVideos] = useState([]);

  useEffect(() => {
    api.get('/bunny/videos')
      .then(res => setVideos(res.data.videos || []))
      .catch(() => setVideos([]));
  }, []);

  return (
    <div className="container mt-4">
      <h2>Bunny Videos</h2>
      <ul className="list-group">
        {videos.map(v => (
          <li key={v.guid} className="list-group-item">
            {v.title || v.guid}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default BunnyVideoList;
