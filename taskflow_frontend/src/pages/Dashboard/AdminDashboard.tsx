import { useEffect, useState } from "react";
import { useAuth } from "../../contexts/UserContext";
import { useNavigate } from "react-router-dom";
import RegisterUserModal from "../../components/RegisterUserModal";
import { UserService } from "../../services";

const AdminDashboard = () => {
  const { user, isAuthenticated, setUser } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [showRegisterModal, setShowRegisterModal] = useState(false);

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    if (user?.role !== "ADMIN") {
      navigate("/dashboard");
      return;
    }

    const fetchUserDetails = async () => {
      try {
        const response = await UserService.getUserDetails();
        if (response.statusCode === 200) {
          setUser(response.data);
        }
      } catch (error) {
        console.error("Failed to fetch user details:", error);
      } finally {
        setLoading(false);
      }
    };

    if (!user?.name || !user?.email) {
      fetchUserDetails();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, navigate, user, setUser]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-lg text-blue-600 font-medium animate-pulse">
          Loading your dashboard...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="flex-grow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
          
          {/* Welcome Section */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 rounded-lg shadow-md p-8 text-white">
            <h1 className="text-3xl font-bold mb-1 tracking-tight">Admin Dashboard</h1>
            <p className="text-blue-100 text-lg">
              Welcome back, <span className="font-semibold">{user?.name || "Admin"}</span>
            </p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { label: "Total Users", color: "blue", value: 0 },
              { label: "Total Managers", color: "indigo", value: 0 },
              { label: "Total Members", color: "sky", value: 0 },
              { label: "Active Users", color: "emerald", value: 0 },
            ].map((stat, index) => (
              <div
                key={index}
                className="bg-white rounded-lg border border-gray-100 shadow-sm hover:shadow-md transition-shadow duration-200 p-6"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-600 text-sm font-medium mb-1">{stat.label}</p>
                    <p className={`text-3xl font-bold text-${stat.color}-600`}>{stat.value}</p>
                  </div>
                  <div className={`bg-${stat.color}-50 w-12 h-12 rounded-full flex items-center justify-center`}>
                    <div className={`w-6 h-6 text-${stat.color}-600`}>
                      <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Admin Actions */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Actions</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setShowRegisterModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-md transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                Register New User
              </button>

              <button className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-md transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Manage Users
              </button>

              <button className="bg-sky-600 hover:bg-sky-700 text-white font-medium py-3 px-6 rounded-md transition flex items-center justify-center gap-2 shadow-sm hover:shadow-md">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m2 0a8 8 0 11-16 0 8 8 0 0116 0z" />
                </svg>
                System Overview
              </button>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
            <div className="text-center py-10 text-gray-500">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
              </svg>
              <p>No recent activity</p>
            </div>
          </div>

          {/* Admin Profile */}
          <div className="bg-white rounded-lg border border-gray-100 shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Admin Profile</h2>
            <div className="space-y-3">
              <div className="flex items-center">
                <span className="text-gray-600 w-32">Name:</span>
                <span className="font-medium text-gray-900">{user?.name || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 w-32">Email:</span>
                <span className="font-medium text-gray-900">{user?.email || "N/A"}</span>
              </div>
              <div className="flex items-center">
                <span className="text-gray-600 w-32">Role:</span>
                <span className="inline-block bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                  Administrator
                </span>
              </div>
            </div>
          </div>
        </div>
      </main>

      <RegisterUserModal
        isOpen={showRegisterModal}
        onClose={() => setShowRegisterModal(false)}
        onSuccess={() => console.log("User registered successfully!")}
      />
    </div>
  );
};

export default AdminDashboard;
