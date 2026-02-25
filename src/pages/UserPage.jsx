import { useEffect, useState } from "react";
import { getUnreadCount } from "../services/NotificationService";

import UserLayout from "../layouts/UserLayout";

import UserHome from "../components/user/UserHome";
import ReportIssue from "../components/user/ReportIssue";
import Services from "../components/user/Services";
import MyIssues from "../components/user/MyIssues";
import Feedback from "../components/user/Feedback";
import Notifications from "../components/user/Notifications";
import MyBookings from "../components/user/MyBookings";
import TrendingPage from "../components/trending/TrendingPage";

const UserPage = ({ page }) => {
  const [notifCount, setNotifCount] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const loadNotifCount = async () => {
      try {
        // Works for both sync and async service implementations
        const count = await Promise.resolve(getUnreadCount());
        if (isMounted) {
          setNotifCount(Number(count) || 0);
        }
      } catch {
        if (isMounted) {
          setNotifCount(0);
        }
      }
    };

    // First load
    loadNotifCount();

    // Auto refresh
    const timer = setInterval(loadNotifCount, 2000);

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, []);

  return (
    <UserLayout notifCount={notifCount}>
      {page === "home" && <UserHome />}
      {page === "report" && <ReportIssue />}
      {page === "services" && <Services />}
      {page === "issues" && <MyIssues />}
      {page === "feedback" && <Feedback />}
      {page === "notifications" && <Notifications />}
      {page === "bookings" && <MyBookings />}
      {page === "trending" && <TrendingPage />}
    </UserLayout>
  );
};

export default UserPage;
