import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContextProvider } from "./contexts/UserContext";
import { ResourceContextProvider } from "./contexts/ResourceContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddMember from "./pages/AddMember";
import ViewProjects from "./pages/ViewProjects";
import ViewTasks from "./pages/members/ViewTasks";
import { Toaster } from "react-hot-toast";

const App = () => {
  return (
    <ResourceContextProvider>
      <UserContextProvider>
        <Router>
          {/* Hot Toast root */}
          <Toaster
            position="top-right"
            reverseOrder={false}
            toastOptions={{
              duration: 5000,
              style: {
                fontSize: '16px',       // increase font size
                padding: '16px 24px',   // increase padding for larger toast
                borderRadius: '10px',
                background: '#ffffff',  // Jira-style
                color: '#1e3a8a',
                fontWeight: '500',
                boxShadow: '0 2px 12px rgba(0,0,0,0.15)',
                minWidth: '300px',
              },
            }}
          />

          <div className="min-h-screen flex flex-col">
            <Navbar />
            <div className="flex-grow pt-16">
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<AuthPage />} />
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/:id/add-member" element={<AddMember />} />
                <Route path="/projects" element={<ViewProjects />} />
                <Route path="/tasks" element={<ViewTasks />} />
              </Routes>
            </div>
            <Footer />
          </div>
        </Router>
      </UserContextProvider>
    </ResourceContextProvider>
  );
};

export default App;
