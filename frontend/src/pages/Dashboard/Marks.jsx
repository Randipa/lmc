import { useParams } from 'react-router-dom';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(BarElement, CategoryScale, LinearScale);

const Marks = () => {
  const { classId } = useParams();
  const papers = ['P1', 'P2', 'P3', 'P4'];
  const marks = [75, 60, 88, 95];

  return (
    <div className="container py-4">
      <h4>Marks – {classId}</h4>
      <Bar
        data={{
          labels: papers,
          datasets: [
            {
              label: 'Marks',
              data: marks,
              backgroundColor: 'rgba(0,123,255,0.6)'
            }
          ]
        }}
        height={300}
        options={{ maintainAspectRatio: false }}
      />
    </div>
  );
};

export default Marks;
