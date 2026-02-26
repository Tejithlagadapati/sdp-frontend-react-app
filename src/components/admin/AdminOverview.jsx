import { useEffect, useMemo, useState } from "react";
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
import { getAllServices } from "../../services/CityService";
import { getAllIssues } from "../../services/IssueService";
import Card from "../common/Card";

ChartJS.register(BarElement, ArcElement, CategoryScale, LinearScale, Tooltip, Legend);

const infrastructureSeed = [
    { type: "Road", value: 2 },
    { type: "Water Supply", value: 1 },
    { type: "Electricity", value: 2 },
];

const statusClass = (value) => {
    const normalized = String(value).toLowerCase();
    if (normalized === "pending") return "pending";
    if (normalized === "resolved") return "resolved";
    if (normalized === "in progress") return "in-progress";
    return "in-progress";
};

const AdminOverview = () => {
    const [services, setServices] = useState([]);
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        const loadData = async () => {
            const [serviceData, issueData] = await Promise.all([getAllServices(), getAllIssues()]);
            setServices(serviceData);
            setIssues(issueData);
        };

        loadData();
    }, []);

    const serviceCategoryChart = useMemo(() => {
        const counts = services.reduce((accumulator, service) => {
            const key = service.category || "Other";
            accumulator[key] = (accumulator[key] || 0) + 1;
            return accumulator;
        }, {});

        return {
            labels: Object.keys(counts),
            datasets: [
                {
                    data: Object.values(counts),
                    backgroundColor: ["#5f9dd3", "#68b3a6", "#6a67d8", "#e0a33a", "#7aa2f7"],
                    borderRadius: 6,
                },
            ],
        };
    }, [services]);

    const issueStatusChart = useMemo(() => {
        const pending = issues.filter((issue) => issue.status === "Pending").length;
        const resolved = issues.filter((issue) => issue.status === "Resolved").length;
        const inProgress = Math.max(issues.length - pending - resolved, 0);

        return {
            labels: ["In Progress", "Pending", "Resolved"],
            datasets: [
                {
                    data: [inProgress || 1, pending || 1, resolved || 1],
                    backgroundColor: ["#5f9dd3", "#e0a33a", "#65b487"],
                    borderWidth: 1,
                },
            ],
        };
    }, [issues]);

    const infrastructureChart = useMemo(() => {
        return {
            labels: infrastructureSeed.map((item) => item.type),
            datasets: [
                {
                    data: infrastructureSeed.map((item) => item.value),
                    backgroundColor: ["#5f9dd3", "#68b3a6", "#6a67d8"],
                },
            ],
        };
    }, []);

    const cards = useMemo(() => {
        const pending = issues.filter((issue) => issue.status === "Pending").length;
        const resolved = issues.filter((issue) => issue.status === "Resolved").length;

        return [
            { label: "Total Services", value: services.length, note: "↑ 2 this month" },
            { label: "Infrastructure", value: infrastructureSeed.length, note: "↑ 1 added" },
            { label: "Amenities", value: Math.max(services.length - infrastructureSeed.length, 0), note: "City facilities" },
            { label: "Pending Issues", value: pending, note: "Needs attention" },
            { label: "In Progress", value: Math.max(issues.length - pending - resolved, 0), note: "Assigned tasks" },
            { label: "Resolved Issues", value: resolved, note: "↑ 33% rate" },
            { label: "Registered Users", value: 3, note: "Admin + users" },
            { label: "Feedback Submissions", value: 2, note: "Recent responses" },
        ];
    }, [services, issues]);

    return (
        <section className="admin-page-wrap">
            <div className="admin-stat-grid">
                {cards.map((card) => (
                    <Card key={card.label} className="admin-stat-card">
                        <h3>{card.value}</h3>
                        <p>{card.label}</p>
                        <small>{card.note}</small>
                    </Card>
                ))}
            </div>

            <div className="admin-chart-grid">
                <Card className="admin-chart-card">
                    <h3>📊 Services by Category</h3>
                    <div className="admin-chart-body">
                        <Bar data={serviceCategoryChart} options={{ responsive: true, plugins: { legend: { display: false } } }} />
                    </div>
                </Card>

                <Card className="admin-chart-card">
                    <h3>🔵 Issue Status Distribution</h3>
                    <div className="admin-chart-body">
                        <Pie data={issueStatusChart} options={{ responsive: true }} />
                    </div>
                </Card>

                <Card className="admin-chart-card">
                    <h3>🏗️ Infrastructure by Type</h3>
                    <div className="admin-chart-body">
                        <Bar
                            data={infrastructureChart}
                            options={{
                                indexAxis: "y",
                                responsive: true,
                                plugins: { legend: { display: false } },
                            }}
                        />
                    </div>
                </Card>
            </div>

            <Card className="admin-table-card">
                <div className="admin-table-title">🚨 Recent Issue Reports</div>
                <div className="city-table-wrap">
                    <table className="data-table admin-data-table">
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Category</th>
                                <th>Reported By</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {issues.slice(0, 4).map((issue) => (
                                <tr key={issue.id}>
                                    <td>{issue.description}</td>
                                    <td>{issue.category}</td>
                                    <td>@{issue.userEmail?.split("@")[0] || "user"}</td>
                                    <td>
                                        <span className={`status ${statusClass(issue.status)}`}>{issue.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </section>
    );
};

export default AdminOverview;