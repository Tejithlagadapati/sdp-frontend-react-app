import {
  Chart as ChartJS,
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar, Pie } from "react-chartjs-2";

ChartJS.register(
  BarElement,
  ArcElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend
);

const AdminAnalytics = ({ issues }) => {

  // Count categories
  const categoryCount = {};

  issues.forEach((i) => {
    categoryCount[i.category] =
      (categoryCount[i.category] || 0) + 1;
  });

  const barData = {
    labels: Object.keys(categoryCount),
    datasets: [
      {
        label: "Complaints",
        data: Object.values(categoryCount),
        backgroundColor: "#4f46e5",
      },
    ],
  };

  // Status count
  const resolved = issues.filter(
    (i) => i.status === "Resolved"
  ).length;

  const pending = issues.length - resolved;

  const pieData = {
    labels: ["Resolved", "Pending"],
    datasets: [
      {
        data: [resolved, pending],
        backgroundColor: ["#22c55e", "#facc15"],
      },
    ],
  };

  return (
    <div className="analytics-grid">

      <div className="card">
        <h3>Complaints by Category</h3>
        <Bar data={barData} />
      </div>

      <div className="card">
        <h3>Resolution Status</h3>
        <Pie data={pieData} />
      </div>

    </div>
  );
};

export default AdminAnalytics;