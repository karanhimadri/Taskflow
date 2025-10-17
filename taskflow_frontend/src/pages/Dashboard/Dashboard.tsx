import AdminDashboard from "./AdminDashboard";
import ManagerDashboard from "./ManagerDashboard";
import MemberDashboard from "./MemberDashboard";
import { useAuth } from "../../contexts/UserContext";

function Dashboard() {
  const { user } = useAuth(); // assuming user has a "role" property

  if (!user) return <p className="text-red-600 font-semibold text-center">Unauthorized</p>;


  switch (user.role) {
    case "ADMIN":
      return <AdminDashboard />;
    case "MANAGER":
      return <ManagerDashboard />;
    case "MEMBER":
      return <MemberDashboard />;
    default:
      return <p className="text-red-600 font-semibold text-center">Unauthorized</p>;
  }
}

export default Dashboard;
