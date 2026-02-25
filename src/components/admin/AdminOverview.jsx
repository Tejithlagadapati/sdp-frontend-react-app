import { useEffect, useMemo, useState } from "react";
import { getAllServices } from "../../services/CityService";
import { getAllIssues } from "../../services/IssueService";
import Card from "../common/Card";

const trendPoints = [420, 390, 510, 470, 620, 540, 590];

const logsSeed = [
    {
        id: 1,
        time: "10:42 AM",
        event: 'Bridge sensor triggered "Structure Load" alert',
        category: "Infrastructure",
        status: "Warning",
    },
    {
        id: 2,
        time: "09:15 AM",
        event: 'New amenity "Public Library" added to directory',
        category: "Public Service",
        status: "Success",
    },
    {
        id: 3,
        time: "Yesterday",
        event: "Main power grid redundancy test completed",
        category: "Utilities",
        status: "Completed",
    },
    {
        id: 4,
        time: "Yesterday",
        event: "Pothole report #8423 assigned to maintenance",
        category: "Roads",
        status: "Pending",
    },
    {
        id: 5,
        time: "May 28",
        event: "Global system security patch deployed",
        category: "Security",
        status: "Success",
    },
];

const AdminOverview = () => {
    const [services, setServices] = useState([]);
    const [issues, setIssues] = useState([]);

    useEffect(() => {
        const load = async () => {
            const [serviceData, issueData] = await Promise.all([
                getAllServices(),
                getAllIssues(),
            ]);
            setServices(serviceData);
            setIssues(issueData);
        };

        load();
    }, []);

    const activeServices = useMemo(
        () => services.filter((service) => service.status === "Active").length,
        [services]
    );

    const unresolvedIssues = useMemo(
        () => issues.filter((issue) => issue.status !== "Resolved").length,
        [issues]
    );

    const satisfaction = useMemo(() => {
        const resolved = issues.filter((issue) => issue.status === "Resolved").length;
        if (issues.length === 0) {
            return "4.8/5";
        }
        const score = 3.6 + (resolved / issues.length) * 1.4;
        return `${score.toFixed(1)}/5`;
    }, [issues]);

    const trendPath = useMemo(() => {
        const width = 620;
        const height = 180;
        const min = Math.min(...trendPoints);
        const max = Math.max(...trendPoints);
        const xStep = width / (trendPoints.length - 1);

        return trendPoints
            .map((point, index) => {
                const x = index * xStep;
                const y = height - ((point - min) / (max - min || 1)) * height;
                return `${index === 0 ? "M" : "L"}${x},${y}`;
            })
            .join(" ");
    }, []);

    return (
        <section className="admin-overview-wrap">
            <div className="admin-overview-head">
                <div>
                    <h1>Admin Dashboard</h1>
                    <p className="muted">Overview of city-wide services and infrastructure performance.</p>
                </div>

                <div className="admin-overview-actions">
                    <button type="button" className="secondary-btn">Export Report</button>
                    <button type="button" className="primary-btn">Switch to User Portal</button>
                </div>
            </div>

            <div className="admin-kpi-grid">
                <Card>
                    <p className="muted">Public Services</p>
                    <h3>{services.length}</h3>
                    <small>{activeServices} active registered services</small>
                </Card>

                <Card>
                    <p className="muted">System Uptime</p>
                    <h3>99.92%</h3>
                    <small>Real-time infrastructure health</small>
                </Card>

                <Card>
                    <p className="muted">Citizen Reports</p>
                    <h3>{issues.length}</h3>
                    <small>{unresolvedIssues} unresolved urgent issues</small>
                </Card>

                <Card>
                    <p className="muted">Satisfaction</p>
                    <h3>{satisfaction}</h3>
                    <small>Based on recent feedback</small>
                </Card>
            </div>

            <div className="admin-overview-main-grid">
                <Card className="admin-trend-card">
                    <div className="admin-trend-head">
                        <div>
                            <h3>Service Request Trends</h3>
                            <p className="muted">Daily volume of citizen reports and inquiries</p>
                        </div>
                        <span className="category-pill">Last 30 Days</span>
                    </div>

                    <div className="admin-trend-chart">
                        <svg viewBox="0 0 620 180" preserveAspectRatio="none" role="img" aria-label="Trend line">
                            <path d={trendPath} className="admin-trend-line" />
                        </svg>
                    </div>
                </Card>

                <Card className="admin-quick-card">
                    <h3>Quick Command</h3>
                    <p className="muted">Frequent admin tasks</p>

                    <button type="button" className="admin-quick-btn">Add New Service</button>
                    <button type="button" className="admin-quick-btn admin-quick-btn-alert">
                        Maintenance Alert
                    </button>
                    <button type="button" className="admin-quick-btn">System Audit</button>
                    <button type="button" className="admin-quick-btn">User Feedback</button>

                    <div className="admin-health-row">
                        <span>System Health</span>
                        <strong>Healthy</strong>
                    </div>
                </Card>
            </div>

            <Card>
                <div className="admin-log-head">
                    <h3>Recent System Logs</h3>
                    <button type="button" className="ghost-btn">View All History</button>
                </div>

                <div className="city-table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Timestamp</th>
                                <th>Event Description</th>
                                <th>Category</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {logsSeed.map((log) => (
                                <tr key={log.id}>
                                    <td>{log.time}</td>
                                    <td>{log.event}</td>
                                    <td>
                                        <span className="category-pill">{log.category}</span>
                                    </td>
                                    <td>
                                        <span className={`status ${String(log.status).toLowerCase()}`}>
                                            {log.status}
                                        </span>
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