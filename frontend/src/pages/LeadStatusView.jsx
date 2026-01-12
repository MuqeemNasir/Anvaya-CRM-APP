import { Link, useParams } from "react-router-dom"
import { useDataContext } from "../context/DataContext"
import { useEffect, useMemo, useState } from "react"
import { getLeads } from "../services/lead.api"
import { ArrowUpDown, Activity, Briefcase, ChevronRight, Clock, Filter, Loader2, Target, User } from "lucide-react"

const LeadStatusView = () => {
  const { statusName } = useParams()
  const { agents } = useDataContext()

  const [leads, setLeads] = useState([])
  const [loading, setLoading] = useState(true)

  const [agentFilter, setAgentFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [sortOrder, setSortOrder] = useState('asc')

  useEffect(() => {
    const fetchStatusData = async () => {
      setLoading(true)
      try{
        const data = await getLeads({status: statusName})
        setLeads(data)
      }catch(err){
        console.error(err)
      }finally{
        setLoading(false)
      }
    }
    fetchStatusData()
  }, [statusName])

  const processedLeads = useMemo(() => {
    let result = leads.filter(l => {
      const matchAgent = agentFilter ? l.salesAgent?._id === agentFilter : true
      const matchPriority = priorityFilter ? l.priority === priorityFilter : true
      return matchAgent && matchPriority
    })

    result.sort((a, b) => {
      return sortOrder === 'asc' ? a.timeToClose - b.timeToClose : b.timeToClose - a.timeToClose
    })

    return result
  }, [leads, agentFilter, priorityFilter, sortOrder])

  const getThemeColor = () => {
    const map = {'New': 'info', 'Contacted': 'warning', 'Qualified': 'primary', 'Proposal Sent': 'secondary', 'Closed': 'success'}
    return map[statusName] || 'primary'
  }

  if(loading) return(
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Loader2 className="spinner-border text-primary" style={{border: 'none'}} />
    </div>
  )

  return(
    <div className="container-fluid px-3 px-md-5 py-4 animate-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
        <div>
          <div className="d-flex align-items-center gap-2 mb-1">
            <div className={`p-2 bg-${getThemeColor()}-subtle rounded text-${getThemeColor()}`}><Target size={24} /></div>
            <h1 className="h3 fw-bold text-dark mb-0">Stage: {statusName}</h1>
          </div>
          <p className="text-muted mb-0">Reviewing leads in the "{statusName}" pipeline phase.</p>
        </div>
        <div className="bg-white px-4 py-2 rounded shadow-sm border-bottom border-4 border-primary">
          <span className="text-muted small fw-bold text-uppercase d-block">Result Count</span>
          <span className="h4 fw-bold text-primary mb-0">{processedLeads.length}</span>
        </div>
      </div>
      <div className="card border-0 shadow-sm mb-4 bg-white">
        <div className="card-body p-3">
          <div className="row g-3 align-items-center justify-content-between">
            <div className="col-auto text-muted small fw-bold text-uppercase d-flex align-items-center">
              <Filter size={16} className="me-1" /> Filters: 
            </div>
            <div className="col-12 col-md-3">
              <select className="form-select form-select-sm border-2" value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)}>
                <option value="">All Agents</option>
                {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option> )}
              </select>
            </div>
            <div className="col-12 col-md-3">
              <select className="form-select form-select-sm border-2" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}>
                <option value="">All Priorities</option>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>
            </div>
            <div className="col-auto text-muted small fw-bold text-uppercase ps-md-3 d-flex align-items-center">
              <ArrowUpDown size={16} className="me-1" /> Sort: 
            </div>
            <div className="col-auto">
              <button className="btn btn-sm btn-outline-primary fw-bold d-flex align-items-center gap-2" onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}>
                Time: {sortOrder === 'asc' ? "Shortest First" : "Longest First"}
              </button>
            </div>
            <div className="col-auto ms-auto d-none d-lg-block">
              <span className="text-muted small">Showing {processedLeads.length} of {leads.length} leads in this stage</span>
            </div>
          </div>
        </div>
      </div>
      <div className="row g-3">
        {processedLeads.length === 0 ? (
          <div className="col-12 text-center py-5 bg-white rounded border shadow-sm">
            <Activity size={48} className="text-muted opacity-25 mb-3" />
            <h5 className="text-muted">No leads match your criteria.</h5>
            <button className="btn btn-link btn-sm" onClick={() => {setAgentFilter(''); setPriorityFilter('');}}>Clear Filters</button>
          </div>
        ) : (
          processedLeads.map(lead => (
            <div key={lead._id} className="col-12">
              <Link to={`/leads/${lead._id}`} className="card border-0 shadow-sm list-group-item-action transition-all hover-lift overflow-hidden text-decoration-none">
                <div className="card-body p-3 p-md-4">
                  <div className="row align-items-center">
                    <div className="col-12 col-md-5 mb-3 mb-md-0">
                      <div className="d-flex align-items-center gap-3">
                        <div className={`bg-${getThemeColor()} text-white rounded p-2 d-flex align-items-center justify-content-center flex-shrink-0`} style={{width: '45px', height: '45px'}}>
                          <Briefcase size={22} />
                        </div>
                        <div>
                          <h6 className="fw-bold text-dark mb-1 fs-5">{lead.name}</h6>
                          <div className="d-flex gap-2 align-items-center">
                            <span className={`badge bg-${getThemeColor()}-subtle text-${getThemeColor()}`}>{lead.status}</span>
                            <span className={`small fw-bold ${lead.priority === 'High' ? 'text-danger' : 'text-muted'}`}>• {lead.priority} Priority</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-3">
                      <div className="d-flex align-items-center gap-2 text-muted">
                        <User size={16} className="text-primary" />
                        <div className="d-flex flex-column">
                          <span className="small fw-bold text-uppercase opacity-50" style={{fontSize: '0.65rem'}}>Agent</span>
                          <span className="text-dark fw-medium">{lead.salesAgent?.name || "Unassigned"}</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-6 col-md-3 ps-5">
                      <div className="d-flex justify-content-end align-items-center gap-2 text-muted">
                        <Clock size={16} className="text-warning" />
                        <div className="d-flex flex-column">
                          <span className="small fw-bold text-uppercase opacity-50" style={{fontSize: '0.65rem'}}>EST. Close</span>
                          <span className="text-dark fw-medium">{lead.timeToClose} Days</span>
                        </div>
                      </div>
                    </div>
                    <div className="col-md-1 text-end d-none d-md-block">
                      <ChevronRight className="text-muted opacity-50" />
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
 export default LeadStatusView