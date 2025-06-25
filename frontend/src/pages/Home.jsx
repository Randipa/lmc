import Tile from '../components/Tile';

const Home = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="container py-5">
      <div className="hero">
        <h2 className="mb-2">Welcome to the Learning Platform</h2>
        {user && (
          <p className="mb-0">Hello, {user.firstName} {user.lastName}</p>
        )}
      </div>
      <div className="text-center mb-4">
        <h4 className="fw-semibold">Quick Access</h4>
      </div>

      <div className="row gy-4">
        <Tile title="Classes" icon="🎓" link="/classes" />
        <Tile title="Shop" icon="🛒" link="/shop" />
        <Tile title="Student Dashboard" icon="📊" link="/dashboard" />
        <Tile title="E-Library" icon="📚" link="/e-library" />
        {user?.userRole === 'admin' && (
          <>
          <Tile title="Admin" icon="⚙️" link="/admin/courses" />
          <Tile title="Payments" icon="💳" link="/admin/payments" />
          <Tile title="Videos" icon="🎞️" link="/admin/videos" />
          <Tile title="Teachers" icon="🧑‍🏫" link="/admin/teachers" />
          <Tile title="Notices" icon="📢" link="/admin/notices" />
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
