import { useParams } from 'react-router-dom';
import { useState } from 'react';

const Assignments = () => {
  const { classId } = useParams();
  const [file, setFile] = useState(null);

  const handleUpload = (e) => {
    e.preventDefault();
    alert('Answer uploaded.');
  };

  return (
    <div className="container py-4">
      <h4>Assignments – {classId}</h4>
      <form onSubmit={handleUpload}>
        <input type="file" className="form-control mb-3" onChange={(e) => setFile(e.target.files[0])} />
        <button className="btn btn-warning">Upload Answer</button>
      </form>
    </div>
  );
};

export default Assignments;
