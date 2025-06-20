import { useState } from 'react';

const resources = [
  {
    id: 'r1',
    title: 'Grade 10 Science Notes',
    type: 'pdf',
    url: 'https://example.com/science.pdf'
  },
  {
    id: 'r2',
    title: 'Physics Demo Video',
    type: 'video',
    url: 'https://www.youtube.com/embed/dQw4w9WgXcQ'
  },
  {
    id: 'r3',
    title: 'External Resource - Biology',
    type: 'link',
    url: 'https://www.khanacademy.org/science/biology'
  }
];

const ELibrary = () => {
  const [active, setActive] = useState(null);

  const openViewer = (res) => {
    setActive(res);
  };

  return (
    <div className="container py-4">
      <h4>E-Library</h4>
      <ul className="list-group mb-4">
        {resources.map((res) => (
          <li
            key={res.id}
            className="list-group-item d-flex justify-content-between"
          >
            {res.title}
            <button className="btn btn-outline-primary btn-sm" onClick={() => openViewer(res)}>
              View
            </button>
          </li>
        ))}
      </ul>

      {active && (
        <div className="border p-3 bg-light">
          <h5 className="mb-3">Preview: {active.title}</h5>
          {active.type === 'pdf' && (
            <iframe
              src={active.url}
              width="100%"
              height="500px"
              title="PDF Preview"
            />
          )}
          {active.type === 'video' && (
            <div className="ratio ratio-16x9">
              <iframe
                src={active.url}
                title="Video"
                allowFullScreen
              ></iframe>
            </div>
          )}
          {active.type === 'link' && (
            <a href={active.url} target="_blank" rel="noopener noreferrer">
              Open in New Tab →
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default ELibrary;
