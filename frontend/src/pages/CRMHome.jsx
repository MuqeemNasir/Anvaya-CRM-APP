import { useEffect, useMemo, useState } from "react"
import { useDataContext } from "../context/DataContext"
import { getLeads } from "../services/lead.api"
import { ChevronRight, LayoutDashboard, Plus, SettingsIcon, User } from "lucide-react"
import { Link } from "react-router-dom"

const CRMHome = () => {
  const { agents } = useDataContext()
  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchDashboardData = async() => {
      try{
        const data = await getLeads()
        setLeads(data)
      }catch(err) {
        console.error("Dashboard Error: ", err)
      }finally{
        setLoading(false)
      }
    }
    fetchDashboardData()
  }, [])

  const groupedByStatus = useMemo(() => {
    const statuses = ['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'];
    return statuses.reduce((acc, s) => {
      acc[s] = leads.filter(l => l.status === s)
      return acc
    }, {})
  }, [leads])

  if(loading) return (
    <div className="text-center py-5">
      <div className="spinner-border text-primary" role="status"></div>
        <p className="mt-2 text-muted">Loading Command Center...</p>
    </div>
  )

  return(
    <div className="container-fluid px-3 px-md-5 py-4 animate-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
        <div>
          <h1 className="h3 fw-bold text-dark d-flex align-items-center gap-2 mb-1">
            <LayoutDashboard className="text-primary" size={28} /> Dashboard
          </h1>
          <p className="text-muted mb-0">Pipeline Overview and Quick Actions.</p>
        </div>
        <div className="d-flex gap-2">
          <Link to="/settings" className="btn btn-outline-secondary px-3 fw-bold shadow-sm d-flex align-items-center gap-2" >
            <SettingsIcon size={18} /> Settings
          </Link>
          <Link to="/leads" className="btn btn-primary px-4 fw-bold shadow-sm d-flex align-items-center gap-2">
            <Plus size={20} /> Add Lead
          </Link>
        </div>
      </div>
      <div className="row g-3 mb-5">
        {Object.entries(groupedByStatus).map(([status, items]) => (
          <div className="col-6 col-md-4 col-lg-2" key={status}>
            <Link to={`/leads?status=${status}`} className="card border-0 shadow-sm text-decoration-none hover-lift h-100">
              <div className="card-body p-3 text-center">
                <div className="h4 fw-bold text-primary mb-1">{items.length}</div>
                <div className="small fw-bold text-muted text-uppercase" style={{fontSize: "0.7rem"}}>{status}</div>
              </div>
            </Link>
          </div>
        ))}
      </div>
      <h5 className="fw-bold mb-4 text-dark border-start border-4 border-primary ps-3">Recent Leads</h5>
      <div className="row g-4 mb-5">
        {leads.slice(0, 3).map((lead) => (
          <div className="col-12 col-md-4" key={lead._id}>
            <div className="card border-0 shadow-sm h-100 transition-all hover-lift">
              <div className="card-body">
                <div className="d-flex justify-content-between mb-3">
                  <span className="badge bg-primary-subtle text-primary text-uppercase">{lead.status}</span>
                  <span className={`small fw-bold ${lead.priority === "High" ? "text-danger" : "text-muted"}`}>{lead.priority}</span>
                </div>
                <h6 className="fw-bold text-dark mb-2">[{lead.name}]</h6>
                <p className="small text-muted mb-3"><User size={14} />{lead.salesAgent?.name || "Unassigned"}</p>
                <Link to={`/leads/${lead._id}`} className="btn btn-sm btn-outline-primary w-100 fw-bold">View Details</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
        <div className="card border-0 shadow-sm mb-5">
          <div className="card-header bg-white py-3">
            <h5 className="fw-bold mb-0">Pipeline by Status</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light small fw-bold text-muted">
                  <tr>
                    <th className="ps-4">Status Name</th>
                    <th>Total Count</th>
                    <th className="text-end pe-5">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.entries(groupedByStatus).map(([status, items]) => (
                    <tr key={status}>
                      <td className="ps-4 fw-bold text-dark">{status}</td>
                      <td>{items.length} Leads</td>
                      <td className="text-end pe-2">
                        <Link to={`/status/${status}`} className="btn btn-sm btn-link text-decoration-none fw-bold">Detailed View <ChevronRight size={14} /></Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <div className="card border-0 shadow-sm mb-5">
          <div className="card-header bg-white py-3">
            <h5 className="fw-bold mb-0">Team Workload</h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead className="bg-light small fw-bold text-muted">
                  <tr>
                    <th className="ps-4">Agent Name</th>
                    <th>Active Leads</th>
                    <th className="text-end pe-4">Performance</th>
                  </tr>
                </thead>
                <tbody>
                  {agents.map((agent) => (
                    <tr key={agent._id}>
                      <td className="ps-4 fw-bold text-dark">{agent.name}</td>
                      <td>
                        {leads.filter((l) => l.salesAgent?._id === agent._id).length} Assigned 
                      </td>
                      <td className="text-end pe-2">
                        <Link to={`/agent-performance/${agent._id}`} className="btn btn-sm btn-link text-decoration-none fw-bold text-success">View Performance <ChevronRight size={14} /></Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        
    </div>
  )
}

export default CRMHome