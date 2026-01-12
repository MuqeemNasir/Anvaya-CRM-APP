import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDataContext } from "../context/DataContext";
import {
  ArrowUpDown,
  Briefcase,
  ChevronRight,
  Filter,
  Loader2,
  Plus,
  User,
} from "lucide-react";
import { createLead, getLeads } from "../services/lead.api";

const LeadList = () => {
  const { agents } = useDataContext();
  const [searchParams, setSearchParams] = useSearchParams();

  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("");

  const [showModal, setShowModal] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    source: "Website",
    salesAgent: "",
    status: "New",
    priority: "Medium",
    timeToClose: 30,
    tags: "",
  });

  const statusFilter = searchParams.get("status") || "";
  const agentFilter = searchParams.get("salesAgent") || "";

  useEffect(() => {
    fetchFilteredLeads();
  }, [statusFilter, agentFilter]);

  const fetchFilteredLeads = async () => {
    setLoading(true);
    try {
      const filters = {};
      if (statusFilter) filters.status = statusFilter;
      if (agentFilter) filters.salesAgent = agentFilter;
      const data = await getLeads(filters);
      setLeads(data);
    } catch (error) {
      setError("Failed to load leads.");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value) newParams.set(key, value);
    else newParams.delete(key);
    setSearchParams(newParams);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    try {
      const leadToSave = {
        ...formData,
        tags: formData.tags
          .split(",")
          .map((t) => t.trim())
          .filter((t) => t !== ""),
      };
      await createLead(leadToSave);
      setShowModal(false);
      fetchFilteredLeads();
    } catch (error) {
      alert(error.error || "Error creating lead");
    } finally {
      setFormLoading(false);
    }
  };

  const getProcessedLeads = () => {
    let result = [...leads];
    if (sortBy === "priority") {
      const weight = { High: 3, Medium: 2, Low: 1 };
      result.sort((a, b) => weight[b.priority] - weight[a.priority]);
    } else if (sortBy === "time") {
      result.sort((a, b) => a.timeToClose - b.timeToClose);
    }
    return result;
  };

  const getStatusBadge = (status) => {
    const colors = {
      New: "bg-info",
      Contacted: "bg-warning text-dark",
      Qualified: "bg-primary",
      "Proposal Sent": "bg-secondary",
      Closed: "bg-success",
    };
    return `badge ${colors[status] || "bg-light text-dark"}`;
  };

  return (
    <div className="container-fluid px-2 px-md-5 py-4 animate-fade-in overflow-hidden">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center mb-5 gap-3">
        <h1 className="h3 fw-bold text-dark d-flex align-items-center gap-2 mb-3">
          <Briefcase className="text-primary" size={28} /> Lead Management
        </h1>
        <button
          className="btn btn-primary px-4 py-2 fw-bold shadow-sm d-flex align-items-center gap-2"
          onClick={() => setShowModal(true)}
        >
          <Plus size={20} /> Add New Lead
        </button>
      </div>

      <div className="card border-0 shadow-sm mb-4 p-3 bg-white">
        <div className="row g-2 g-md-3 align-items-center justify-content-between">
          <div className="col-md-auto text-muted small fw-bold text-uppercase">
            <Filter size={16} className="me-1" /> Filters:
          </div>
          <div className="col-12 col-sm-6 col-md-3">
            <select
              className="form-select form-select-sm border-2 w-100"
              value={statusFilter}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">[All Statuses]</option>
              {["New", "Contacted", "Qualified", "Proposal Sent", "Closed"].map(
                (s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                )
              )}
            </select>
          </div>
          <div className="col-12 col-sm-6 col-md-3 border-end pe-md-4">
            <select
              className="form-select form-select-sm border-2 w-100"
              value={agentFilter}
              onChange={(e) => handleFilterChange("salesAgent", e.target.value)}
            >
              <option value="">[All Agents]</option>
              {agents.map((a) => (
                <option key={a._id} value={a._id}>
                  {a.name}
                </option>
              ))}
            </select>
          </div>
          <div className="col-12 col-md-auto text-muted small fw-bold text-uppercase ps-md-4">
            <ArrowUpDown size={16} className="me-1" /> Sort By:
          </div>
          <div className="col-12 col-md-auto">
            <div className="btn-group btn-group-sm w-100 shadow-sm">
              <button
                className={`btn btn-outline-primary ${
                  sortBy === "priority" ? "active" : ""
                }`}
                onClick={() =>
                  setSortBy(sortBy === "priority" ? "" : "priority")
                }
              >
                Priority
              </button>
              <button
                className={`btn btn-outline-primary ${
                  sortBy === "time" ? "active" : ""
                }`}
                onClick={() => setSortBy(sortBy === "time" ? "" : "time")}
              >
                Time to Close
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded shadow-sm border overflow-hidden">
        <div className="p-3 px-md-4 border-bottom bg-light d-none d-md-block">
          <div className="row fw-bold text-muted small text-uppercase">
            <div className="col-md-5 ps-4">Lead Name</div>
            <div className="col-md-3">Status</div>
            <div className="col-md-4">Sales Agent</div>
          </div>
        </div>

        <div className="list-group list-group-flush">
          {loading ? (
            <div className="text-center py-5">
              <Loader2 className="spinner-border text-primary" />
            </div>
          ) : getProcessedLeads().length === 0 ? (
            <div className="text-center py-5 text-muted">No leads found.</div>
          ) : (
            getProcessedLeads().map((lead) => (
              <Link
                to={`/leads/${lead._id}`}
                key={lead._id}
                className="list-group-item list-group-item-action p-3 px-md-4 py-md-3 transition-all border-bottom"
              >
                <div className="row align-items-center">
                  <div className="col-12 col-md-5 ps-md-4 mb-2 mb-md-0">
                    <span className="fw-bold text-dark fs-5">
                      [{lead.name}]
                    </span>
                  </div>
                  <div className="col-6 col-md-3 mb-2 mb-md-0">
                    <span className={getStatusBadge(lead.status)}>
                      {lead.status}
                    </span>
                  </div>
                  <div className="col-6 col-md-4 d-flex align-items-center justify-content between">
                    <div className="d-flex align-items-center gap-2 text-muted">
                      <User size={16} className="text-primary" />
                      <span>[{lead.salesAgent?.name || "Unassigned"}]</span>
                    </div>
                    <ChevronRight size={20} className="text-light-emphasis" />
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      </div>

      {showModal && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered px-3">
            <div className="modal-content border-0 shadow-lg">
              <div className="modal-header border-bottom">
                <h5 className="modal-title fw-bold">Add New Lead</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <form onSubmit={handleFormSubmit}>
                <div className="modal-body p-4">
                  <div className="row g-3">
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted text-uppercase">
                        Lead Name
                      </label>
                      <input
                        type="text"
                        className="form-control"
                        required
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                      />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted text-uppercase">
                        Lead Source
                      </label>
                      <select
                        className="form-select"
                        value={formData.source}
                        onChange={(e) =>
                          setFormData({ ...formData, source: e.target.value })
                        }
                      >
                        <option value="Website">Website</option>
                        <option value="Referral">Referral</option>
                        <option value="Cold Call">Cold Call</option>
                        <option value="Advertisement">Advertisement</option>
                        <option value="Email">Email</option>
                        <option value="Other">Other</option>
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted text-uppercase">
                        Sales Agent
                      </label>
                      <select
                        className="form-select"
                        required
                        value={formData.salesAgent}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            salesAgent: e.target.value,
                          })
                        }
                      >
                        <option value="">Select Agent</option>
                        {agents.map((a) => (
                          <option key={a._id} value={a._id}>
                            {a.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div className="col-md-6">
                      <label className="form-label small fw-bold text-muted text-uppercase">
                        Status
                      </label>
                      <select
                        className="form-select"
                        value={formData.status}
                        onChange={(e) =>
                          setFormData({ ...formData, status: e.target.value })
                        }
                      >
                        <option value="New">New</option>
                        <option value="Contacted">Contacted</option>
                        <option value="Qualified">Qualified</option>
                        <option value="Proposal Sent">Proposal Sent</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted text-uppercase">
                        Priority
                      </label>
                      <select
                        className="form-select"
                        value={formData.priority}
                        onChange={(e) =>
                          setFormData({ ...formData, priority: e.target.value })
                        }
                      >
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                      </select>
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted text-uppercase">
                        Days to Close
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        min="1"
                        required
                        value={formData.timeToClose}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            timeToClose: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label small fw-bold text-muted text-uppercase">
                        Days to Close
                      </label>
                      <input
                        type="number"
                        className="form-control"
                        placeholder="Tag1, Tag2"
                        value={formData.tags}
                        onChange={(e) =>
                          setFormData({ ...formData, tags: e.target.value })
                        }
                      />
                    </div>
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
                    className="btn btn-primary px-4 fw-bold shadow"
                    disabled={formLoading}
                  >
                    {formLoading ? "Saving..." : "Create Lead"}
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

export default LeadList;
