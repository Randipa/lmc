import { Link } from 'react-router-dom';

const Tile = ({ title, icon, link }) => {
  return (
    <div className="col-6 col-md-3 text-center">
      <Link to={link} className="text-decoration-none text-dark">
        <div className="border rounded p-4 shadow-sm h-100 d-flex flex-column justify-content-center">
          <div style={{ fontSize: '3rem' }}>{icon}</div>
          <h5 className="mt-2">{title}</h5>
        </div>
      </Link>
    </div>
  );
};

export default Tile;
