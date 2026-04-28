import { useLocation } from "react-router-dom";

const titleMap = {
    "/admin": { title: "Dashboard", subtitle: "Overview & statistics" },
    "/admin/public-services": { title: "Public Services", subtitle: "City services directory" },
    "/admin/infrastructure": { title: "Infrastructure", subtitle: "Roads, water & electricity" },
    "/admin/amenities": { title: "Amenities", subtitle: "Parks, malls & libraries" },
    "/admin/issue-reports": { title: "Issue Reports", subtitle: "Citizen reported issues" },
};

const AdminTopbar = () => {
    const location = useLocation();
    const current = titleMap[location.pathname] || titleMap["/admin"];

    return (
        <header className="admin-topbar">
            <div className="admin-topbar-left">
                <button type="button" className="admin-icon-btn" aria-label="menu">
                    ☰
                </button>
                <div>
                    <h1>{current.title}</h1>
                    <p>{current.subtitle}</p>
                </div>
            </div>

            <div className="admin-topbar-actions">
                <button type="button" className="admin-icon-btn" aria-label="theme">
                    ◔
                </button>
                <button type="button" className="admin-icon-btn" aria-label="notifications">
                    🔔
                    <span className="admin-alert-dot">1</span>
                </button>
                <span className="admin-avatar">A</span>
            </div>
        </header>
    );
};

export default AdminTopbar;
