import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { UserContextProvider } from "./contexts/UserContext";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import HomePage from "./pages/HomePage";
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard/Dashboard";
import AddMember from "./pages/AddMember";
import ViewProjects from "./pages/ViewProjects";
import ViewTasks from "./pages/members/ViewTasks";
import { ResourceContextProvider } from "./contexts/ResourceContext";

const App = () => {
  return (
    <ResourceContextProvider>
      <UserContextProvider>
        <Router>
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
