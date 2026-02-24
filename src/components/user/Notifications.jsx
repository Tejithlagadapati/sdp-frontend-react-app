import { useEffect, useState } from "react";
import { getNotifications, markAllRead } from "../../services/NotificationService";

const Notifications = () => {
  const [list, setList] = useState([]);

  useEffect(() => {
    const data = getNotifications();
    setList(data);
    markAllRead();
  }, []);

  return (
    <div className="card">
      <h2>Notifications</h2>
      <p className="muted">Recent updates from your city services.</p>

      {list.length === 0 && <p>No notifications yet.</p>}

      {list.map((item) => (
        <div key={item.id} className="list-item-card">
          <p>{item.message}</p>
          <small>{item.date}</small>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
