import { useEffect, useState } from "react";
import {
  getNotifications,
  markAllRead
} from "../../services/NotificationService";

const Notifications = () => {

  const [list, setList] = useState([]);

  useEffect(() => {
    const data = getNotifications();
    setList(data);

    // Mark as read
    markAllRead();
  }, []);

  return (
    <div className="card">

      <h2>Notifications</h2>

      {list.length === 0 && (
        <p>No notifications yet.</p>
      )}

      {list.map(item => (
        <div
          key={item.id}
          style={{
            background: "#f9fafb",
            padding: "10px",
            marginTop: "10px",
            borderRadius: "6px"
          }}
        >
          <p>{item.message}</p>
          <small>{item.date}</small>
        </div>
      ))}

    </div>
  );
};

export default Notifications;