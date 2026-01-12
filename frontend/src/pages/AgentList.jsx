import { useState } from "react";
import { useDataContext } from "../context/DataContext";
import {
  AlertCircle,
  Loader2,
  Mail,
  Plus,
  User,
  UserCheck,
} from "lucide-react";
import { createAgent } from "../services/agent.api";

const AgentList = () => {
  const { agents, loading, error, refreshAgents } = useDataContext();

  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({ name: "", email: "" });
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError(null);

    try {
      await createAgent(formData);
      await refreshAgents();
      setFormData({ name: "", email: "" });
      setShowModal(false);
    } catch (error) {
      setFormError(
        error.error || "Failed to create agent. Check if email is unique."
      );
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="container-fluid px-3 px-md-5 py-4 animate-fade-in">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
        <div>
          <h1 className="h4 fw-bold text-dark d-flex align-items-center gap-2 mb-1">
            <UserCheck className="text-primary" size={28} /> Sales Agents List
          </h1>
          <p className="text-muted mb-0">
            View and manage you sales team members.
          </p>
        </div>
        <button
          className="btn btn-primary px-4 py-2 fw-bold d-flex justify-content-center align-items-center gap-2 shadow-sm"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} /> Add New Agent
        </button>
      </div>

      {error && (
        <div className="alert alert-danger d-flex align-items-center gap-2 small mb-4">
          <AlertCircle size={18} /> {error}
        </div>
      )}

      <div className="bg-white rounded shadow-sm border overflow-hidden">
        <div className="p-3 px-md-4 border-bottom bg-light d-none d-md-block">
          <div className="row align-items-center">
            <div className="col-md-6 ps-5"><span className="fw-bold text-muted small text-uppercase tracking-wider">Agent Details</span></div>
            <div className="col-md-6 ps-5"><span className="fw-bold text-muted small text-uppercase tracking-wider">Contact Information</span></div>
          </div>
        </div>
        <div className="list-group list-group-flush">
            {loading ? (
                <div className="text-center py-5">
                    <Loader2 className="spinner-border text-primary mb-2" style={{border: 'none'}} />
                    <p className="text-muted small">Loading Team...</p>
                </div>
            ) : agents.length === 0 ? (
                <div className="text-center py-5 text-muted small">
                    No agents found in the system.
                </div>
            ) : (
                agents.map((agent) => (
                    <div key={agent._id} className="list-group-item p-3 p-md-4 hover-bg-light transition-all border-bottom">
                        <div className="row align-items-center">
                            <div className="col-12 col-md-6 mb-3 mb-md-0 ps-md-0">
                                <div className="d-flex align-items-center gap-3">
                                    <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center flex-shrink-0 shadow-sm" style={{width: '40px', height: '40px'}}>
                                        <User size={24} />
                                    </div>
                                    <div className="text-truncate">
                                        <div className="fw-bold text-dark h5 mb-0">Agent: [{agent.name}]</div>
                                        <div className="d-md-none text-muted small mt-1">
                                            <Mail size={12} className="me-1" /> {agent.email}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6 d-none d-md-block ps-md-4">
                                <div className="text-secondary d-inline-flex align-items-center gap-2 bg-light px-3 py-2 rounded border border-light-subtle shadow-sm">
                                    <Mail size={16} className="text-primary me-1" /> <span className="font-monospace text-dark">{agent.email}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))
            )}
        </div>
      </div>

      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-dialog-centered px-3">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-bottom-0">
                <h5 className="modal-title fw-bold text-dark">Create Sales Agent</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleSubmit}>
                <div className="modal-body pt-0">
                  {formError && (
                    <div className="alert alert-danger py-2 small mb-3">
                      {formError}
                    </div>
                  )}
                  <div className="mb-3">
                    <label className="form-label small fw-bold text-uppercase text-muted">
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      className="form-control form-control-lg fs-6"
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label small fw-bold text-uppercase text-muted">
                      Email Address
                    </label>
                    <input
                      type="email"
                      name="email"
                      className="form-control form-control-lg fs-6"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>
                <div className="modal-footer bg-light border-top">
                  <button
                    type="button"
                    className="btn btn-outline-secondary px-4"
                    onClick={() => setShowModal(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary px-4 fw-bold"
                    disabled={formLoading}
                  >
                    {formLoading ? "Creating..." : "Create Agent"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AgentList;
