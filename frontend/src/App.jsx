import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Menu } from "lucide-react";
import 'bootstrap/dist/css/bootstrap.min.css';

import { DataProvider } from "./context/DataContext";
import Sidebar from "./components/Sidebar";
import AgentList from "./pages/AgentList";
import LeadList from "./pages/LeadList";
import LeadDetails from "./pages/LeadDetails";
import Reports from "./pages/Reports";
import CRMHome from "./pages/CRMHome"
import LeadStatusView from "./pages/LeadStatusView";
import SalesAgentView from "./pages/SalesAgentView";
import Settings from "./pages/Settings";

function App() {
  const [isMobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const toggleSidebar = () => setMobileSidebarOpen(!isMobileSidebarOpen);

  return (
    <DataProvider>
      <Router>
        <div className="d-flex overflow-hidden" style={{maxWidth: '100vw'}}>
          <Sidebar isOpen={isMobileSidebarOpen} toggleSidebar={toggleSidebar} />
          <div className="flex-grow-1 min-vh-100 bg-light d-flex flex-column" style={{minWidth: 0}}>
            <header className="d-md-none bg-white shadow-sm p-3 d-flex align-items-center justify-content-between w-100">
              <h1 className="h5 mb-0 fw-bold text-primary">Anvaya</h1>
              <button
                className="btn btn-outline-primary btn-sm border-0"
                onClick={toggleSidebar}
              >
                <Menu size={24} />
              </button>
            </header>
            <main className="p-2 p-md-4 flex-grow-1">
              <div className="container-fluid">
                <Routes>
                  <Route path="/" element={<CRMHome />} />
                  <Route path="/leads" element={<LeadList />} />
                  <Route path="/leads/:id" element={<LeadDetails />} />
                  <Route path="/agents" element={<AgentList />} />
                  <Route path="/reports" element={<Reports />} />
                  <Route path="/status/:statusName" element={<LeadStatusView />} />
                  <Route path="/agent-performance/:agentId" element={<SalesAgentView />} />
                  <Route path="/settings" element={<Settings />} />
                </Routes>
              </div>
            </main>
          </div>
        </div>
      </Router>
    </DataProvider>
  );
}

export default App;
