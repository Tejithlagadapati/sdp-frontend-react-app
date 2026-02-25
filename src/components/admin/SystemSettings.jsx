import { useState } from "react";
import Card from "../common/Card";

const SystemSettings = () => {
    const [emailAlerts, setEmailAlerts] = useState(true);
    const [smsAlerts, setSmsAlerts] = useState(false);
    const [autoEscalation, setAutoEscalation] = useState(true);
    const [message, setMessage] = useState("");

    const handleSave = (event) => {
        event.preventDefault();
        setMessage("System settings updated successfully.");
    };

    return (
        <section className="admin-settings-wrap">
            <h1>System Settings</h1>
            <p className="muted">Manage alerts, escalation, and platform preferences.</p>

            <form onSubmit={handleSave} className="admin-settings-grid">
                <Card>
                    <h3>Notification Preferences</h3>
                    <label className="settings-row">
                        <span>Email Alerts</span>
                        <input
                            type="checkbox"
                            checked={emailAlerts}
                            onChange={(event) => setEmailAlerts(event.target.checked)}
                        />
                    </label>

                    <label className="settings-row">
                        <span>SMS Alerts</span>
                        <input
                            type="checkbox"
                            checked={smsAlerts}
                            onChange={(event) => setSmsAlerts(event.target.checked)}
                        />
                    </label>
                </Card>

                <Card>
                    <h3>Issue Management</h3>
                    <label className="settings-row">
                        <span>Auto Escalation for Pending Issues</span>
                        <input
                            type="checkbox"
                            checked={autoEscalation}
                            onChange={(event) => setAutoEscalation(event.target.checked)}
                        />
                    </label>

                    <label className="settings-field">
                        <span>Default Response SLA (hours)</span>
                        <input type="number" min="1" defaultValue="24" />
                    </label>
                </Card>

                <Card>
                    <h3>Platform</h3>
                    <label className="settings-field">
                        <span>City Display Name</span>
                        <input type="text" defaultValue="CitySphere" />
                    </label>

                    <label className="settings-field">
                        <span>Support Contact</span>
                        <input type="text" defaultValue="support@citysphere.gov" />
                    </label>
                </Card>

                <Card>
                    <h3>Save Changes</h3>
                    <p className="muted">Apply updated admin settings to this dashboard.</p>
                    <button type="submit" className="primary-btn">Save Settings</button>
                    {message && <p className="success">{message}</p>}
                </Card>
            </form>
        </section>
    );
};

export default SystemSettings;