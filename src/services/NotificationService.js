
export const getNotifications = () => {
  return JSON.parse(localStorage.getItem("notifications")) || [];
};


export const addNotification = (message) => {
  const list = getNotifications();

  const newItem = {
    id: Date.now(),
    message,
    date: new Date().toLocaleString(),
    read: false
  };

  const updated = [newItem, ...list];

  localStorage.setItem("notifications", JSON.stringify(updated));
};


export const markAllRead = () => {
  const list = getNotifications().map(n => ({
    ...n,
    read: true
  }));

  localStorage.setItem("notifications", JSON.stringify(list));
};


export const getUnreadCount = () => {
  return getNotifications().filter(n => !n.read).length;
};