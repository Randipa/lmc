import Tile from '../../components/Tile';
import './dashboard.css';

const StudentDashboard = () => {
  const user = JSON.parse(localStorage.getItem('user'));

  return (
    <div className="container py-5">
      <div className="hero dashboard-hero">
        <h2 className="mb-3">Student Dashboard</h2>
        {user && (
          <p className="mb-0">Welcome back, {user.firstName} {user.lastName}</p>
        )}
      </div>

      <div className="text-center mb-4">
        <h4 className="fw-semibold">Quick Links</h4>
      </div>

      <div className="row gy-4 dashboard-tiles">
        <Tile title="My Classes" icon="\uD83D\uDCDA" link="/dashboard/classes" />
        <Tile title="Payment History" icon="\uD83D\uDCB3" link="/dashboard/payments" />
        <Tile title="Attendance" icon="\u2705" link="/dashboard/attendance" />
        <Tile title="Notices" icon="\uD83D\uDCE2" link="/dashboard/notices" />
      </div>
    </div>
  );
};

export default StudentDashboard;
