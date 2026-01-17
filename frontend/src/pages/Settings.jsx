import { useEffect, useState } from "react";
import { useDataContext } from "../context/DataContext";
import { deleteLead, getLeads } from "../services/lead.api";
import { deleteAgent, getAgents } from "../services/agent.api";
import { AlertTriangle, Briefcase, CheckCircle, Loader2, Settings as SettingsIcon, Trash2, User } from "lucide-react";

const Settings = () => {
  const { refreshAgents } = useDataContext();

  const [leads, setLeads] = useState([]);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [confirmModal, setConfirmModal] = useState({
    show: false,
    id: null,
    type: "",
    title: "",
    body: ""
  })

  useEffect(() => {
    fetchAllData();
  }, []);

  const fetchAllData = async () => {
    setLoading(true);
    try {
      const [leadsData, agentsData] = await Promise.all([
        getLeads(),
        getAgents(),
      ]);
      setLeads(leadsData);
      setAgents(agentsData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const initiateDelete = (id, type, name) => {
    setConfirmModal({
      show: true,
      id,
      type,
      title: `Delete ${type === 'lead' ? 'Lead' : 'Sales Agent'}`,
      body: `Are you sure you want to remove "[${name}]"? This action cannot be undone.`
    })
  }

  const handleConfirmDelete = async () => {
    const { id, type } = confirmModal
    setConfirmModal({...confirmModal, show: false })
      try {
        if(type === 'lead'){
          await deleteLead(id);
          setLeads(leads.filter((l) => l._id !== id));
          showToast("success", "Lead removed successfully");
        }else{
          await deleteAgent(id)
          setAgents(agents.filter((a) => a._id !== id))
          await refreshAgents()
          showToast("success", "Agent removed successfully")
        }
      } catch (err) {
        showToast("danger", "Failed to delete lead");
      }
  };

  const showToast = (type, text) => {
    setMessage({type, text})
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setMessage({type: '', text: ''}), 3000);
  }

  if(loading) return <div className="text-center py-5"><Loader2 className="spinner-border text-primary" style={{border: 'none'}} /></div>

  return(
    <div className="container-fluid px-3 px-md-5 py-4 animate-fade-in overflow-x-hidden">
        <div className="mb-5">
            <h1 className="h3 fw-bold text-dark d-flex align-items-center gap-2">
                <SettingsIcon className="text-secondary" size={28} /> System Settings
            </h1>
            <p className="text-muted">Manage your database and clean up records.</p>
        </div>

        {message.text && (
            <div className={`alert alert-${message.type} shadow-sm border-0 d-flex align-items-center gap-2 mb-4 animate-fade-in`}>
                {message.type === 'success' ? <CheckCircle size={18} /> : <AlertTriangle size={18} /> }
                <span className="fw-bold">{message.text}</span>
            </div>
        )}

        <div className="row g-4">
            <div className="col-12 col-xl-6">
                <div className="card border-0 shadow-sm h-100">
                    <div className="card-header bg-white py-3 border-bottom d-flex align-items-center gap-2">
                        <User size={18} className="text-primary" />
                        <h6 className="fw-bold mb-0 text-uppercase small">Manage Sales Agents</h6>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive" style={{maxHeight: '450px'}}>
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light sticky-top">
                                    <tr>
                                        <th className="ps-4 py-3 small">Agent Name</th>
                                        <th className="text-end pe-4 small">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {agents.map(agent => (
                                        <tr key={agent._id}>
                                            <td className="ps-4">
                                                <span className="fw-bold text-dark">{agent.name}</span>
                                                <div className="small text-muted">{agent.email}</div>
                                            </td>
                                            <td className="text-end pe-4">
                                                <button className="btn btn-outline-danger btn-sm border-0" onClick={() => initiateDelete(agent._id, 'agent', agent.name)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
            <div className="col-12 col-xl-6">
                <div className="card-border-0 shadow-sm h-100">
                    <div className="card-header bg-white py-3 border-bottom d-flex align-items-center gap-2">
                        <Briefcase size={18} className="text-primary" />
                        <h6 className="fw-bold mb-0 text-uppercase small">Manage All Leads</h6>
                    </div>
                    <div className="card-body p-0">
                        <div className="table-responsive" style={{maxHeight: '450px'}}>
                            <table className="table table-hover align-middle mb-0">
                                <thead className="bg-light sticky-top">
                                    <tr>
                                        <th className="ps-4 py-3 small">Lead Name</th>
                                        <th className="small">Status</th>
                                        <th className="text-end pe-4 small">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {leads.map(lead => (
                                        <tr key={lead._id}>
                                            <td className="ps-4">
                                                <span className="fw-bold text-dark">{lead.name}</span>
                                                <div className="small text-muted">{lead.salesAgent?.name || 'No Agent'}</div>
                                            </td>
                                            <td>
                                                <span className="badge bg-light text-dark border small">{lead.status}</span>
                                            </td>
                                            <td className="text-end pe-4">
                                                <button className="btn btn-outline-danger btn-sm border-0" onClick={() => initiateDelete(lead._id, 'lead', lead.name)}>
                                                    <Trash2 size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        {confirmModal.show && (
          <>
            <div className="modal fade show d-block animate-fade-in" style={{zIndex: 1060}}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content border-0 shadow-lg">
                  <div className="modal-header border-0 bg-light rounded-top">
                    <h5 className="modal-title fw-bold text-dark d-flex align-items-center gap-2">
                      <AlertTriangle className="text-danger" size={20} />
                    </h5>
                    <button type="button" className="btn-close" onClick={() => setConfirmModal({ ...confirmModal, show: false })}></button>
                  </div>
                  <div className="modal-body p-4 text-center">
                    <p className="mb-0 fs-5">{confirmModal.body}</p>
                  </div>
                  <div className="modal-footer border-0 justify-content-center pb-4">
                    <button type="button" className="btn-light px-4 fw-bold" onClick={() => setConfirmModal({ ...confirmModal, show: false })}>Cancel</button>
                    <button type="button" className="btn btn-danger px-4 fw-bold shadow-sm" onClick={handleConfirmDelete}>Confirm Delete</button>
                  </div>
                </div>
              </div>
            </div>
            <div className="modal-backdrop fade show" style={{zIndex: 1050}}></div>
          </>
        )}
    </div>
  )
};

export default Settings;
