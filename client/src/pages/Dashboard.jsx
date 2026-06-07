import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDashboardStatsThunk } from "../features/dashboard/dashboardSlice";
import Layout from "../components/layout/Layout";
import Spinner from "../components/common/Spinner";
import AdminDashboard from "../components/dashboard/AdminDashboard";
import AgentDashboard from "../components/dashboard/AgentDashboard";
import UserDashboard from "../components/dashboard/UserDashboard";

const Dashboard = () => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.dashboard);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(getDashboardStatsThunk());
    }
  }, [dispatch, user]);

  return (
    <Layout title="Dashboard">
      {loading || !stats ? (
        <Spinner />
      ) : (
        <>
          {user?.role === "admin" && (
            <AdminDashboard stats={stats} user={user} />
          )}
          {user?.role === "agent" && (
            <AgentDashboard stats={stats} user={user} />
          )}
          {user?.role === "user" && <UserDashboard stats={stats} user={user} />}
        </>
      )}
    </Layout>
  );
};

export default Dashboard;
