import {
  BarChart3,
  Briefcase,
  ChevronLeft,
  LayoutDashboard,
  Users,
  X,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const isHome = location.pathname === "/";

  const navItems = [
    { name: "Dashboard", path: "/", icon: <LayoutDashboard size={20} /> },
    { name: "Leads", path: "/leads", icon: <Briefcase size={20} /> },
    { name: "Sales Agents", path: "/agents", icon: <Users size={20} /> },
    { name: "Report", path: "/reports", icon: <BarChart3 size={20} /> },
  ];

  const NavigationLinks = () => (
    <ul className="nav nav-pills flex-column mb-auto">
      {isHome ? (
        navItems.map((item) => (
          <li key={item.path} className="nav-item mb-2" onClick={isOpen ? toggleSidebar : null }>
            <Link to={item.path} className={`nav-link text-white d-flex align-items-center gap-2 ${location.pathname === item.path ? "active bg-primary" : "hover-opacity"}`}>
              {item.icon} {item.name}
            </Link>
          </li>
        ))
      ) : (
        <li className="nav-item" onClick={isOpen ? toggleSidebar : null}>
          <Link to="/" className="nav-link text-primary d-flex align-items-center gap-2 fw-bold border border-primary py-2">
            <ChevronLeft size={20} /> Back to Dashboard
          </Link>
        </li>
      )}
    </ul>
  )

  return (
    <>
      <div
        className="d-none d-md-flex flex-column bg-dark text-white vh-100 p-3 position-sticky top-0"
        style={{ width: "260px" }}
      >
        <h2 className="h4 mb-4 text-primary fw-bold px-2">Anvaya CRM</h2>
        <NavigationLinks />
      </div>

      <div
        className={`offcanvas offcanvas-start bg-dark text-white 
        ${isOpen ? "show" : ""}`}
        tabIndex="-1"
        style={{
          visibility: isOpen ? "visible" : "hidden",
          transition: "transform 0.3s ease-in-out",
          zIndex: 1050
        }}
      >
        <div className="offcanvas-header d-flex justify-content-between align-items-center w-100">
          <h5 className="offcanvas-title text-primary fw-bold">Anvaya CRM</h5>
          <button
            type="button"
            className="btn text-white p-0 ms-auto"
            onClick={toggleSidebar}
            aria-label="Close"
          >
            <X />
          </button>
        </div>
        <div className="offcanvas-body">
          <NavigationLinks />
        </div>
      </div>
        {isOpen && 
          <div
            className="modal-backdrop fade show d-md-none"
            onClick={toggleSidebar} style={{zIndex: 1040}}
          ></div>
        }
    </>
  );
};

export default Sidebar;