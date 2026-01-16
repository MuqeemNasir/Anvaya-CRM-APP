import { useParams } from "react-router-dom"
import { useDataContext } from "../context/DataContext"
import { useEffect, useState } from "react"
import { getLeadById, updateLead } from "../services/lead.api"
import { addComment, getCommentByLead } from "../services/comment.api"
import { AlertCircle, CheckCircle, Clock, Edit2, MessageSquare, Send } from "lucide-react"

const LeadDetails = () => {
    const {id} = useParams()
    const { agents } = useDataContext()

    const [lead, setLead] = useState(null)
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)

    const [isEditing, setIsEditing] = useState(false)
    const [newComment, setNewComment] = useState("")
    const [selectedAuthor, setSelectedAuthor] = useState("")
    const [commentLoading, setCommentLoading] = useState(false)

    const [alert, setAlert] = useState({type: '', msg: ''})

    useEffect(() => {
        fetchData()
    }, [id])

    const fetchData = async () => {
        setLoading(true)
        try{
            const leadData = await getLeadById(id)
            const commentData = await getCommentByLead(id)
            setLead(leadData)
            setComments(commentData)
            if(leadData.salesAgent?._id) setSelectedAuthor(leadData.salesAgent._id)
        }catch(error){
            showAlert('danger', 'Failed to load details')
        }finally{
            setLoading(false)
        }
    }

    const showAlert = (type, msg) => {
        setAlert({type, msg})
        window.scrollTo(0, 0)
        setTimeout(() => setAlert({type: '', msg: ''}), 4000)
    }

    const handleUpdateLead = async (e) => {
        e.preventDefault()
        try{
            const updateData = {
                name: lead.name,
                status: lead.status,
                priority: lead.priority,
                source: lead.source,
                timeToClose: Number(lead.timeToClose),
                tags: lead.tags,

                salesAgent: lead.salesAgent?._id || lead.salesAgent                 
            }
            const updated = await updateLead(id, updateData)
            setLead(updated)
            setIsEditing(false)
            showAlert('success', 'Lead updated successfully!')
        }catch(error){
            showAlert('danger', "Update failed. Check all required fields.")
        }
    }

    const handleAddComment = async (e) => {
        e.preventDefault()
        if(!newComment.trim() || !selectedAuthor){
            return showAlert('warning', "Please enter your comment and select an author.")
        }
        setCommentLoading(true)
        
        try{
            const savedComment = await addComment(id, newComment, selectedAuthor)
            setComments([savedComment, ...comments])
            setNewComment("")
            showAlert('success', "Comment added")
        }catch(error){
            showAlert('danger', "Failed to add comment")
        }finally{
            setCommentLoading(false)
        }
    }

    if(loading) return <div className="text-center py-5 mt-5">
        <div className="spinner-border text-primary"></div>
    </div>

    if(!lead) return <div className="alert alert-danger m-5">Lead not found.</div>

    return(
        <div className="container-fluid px-2 px-md-4 py-4 animate-fade-in">
            {alert.msg && (
                <div className={`alert alert-${alert.type} shadow-sm d-flex align-items-center gap-2 mb-4 sticky-top`}>
                    {alert.type === 'success' ? <CheckCircle size={18} /> : 
                    <AlertCircle size={20} /> }
                    <span className="fw-bold">{alert.msg}</span>
                </div>
            )}
            <div className="row g-4">
                <div className="col-12 col-lg-5">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-white py-3 d-flex justify-content-between align-items-center border-bottom">
                            <h5 className="fw-bold mb-0 text-dark">Lead Details</h5>
                            <button className={`btn btn-sm ${isEditing ? 'btn-outline-danger' : 'btn-outline-primary'}`} onClick={() => setIsEditing(!isEditing)}>
                                {isEditing ? "Cancel" : <><Edit2 size={14} className="me-1" />Edit</>}
                            </button>
                        </div>
                        <div className="card-body">
                            {isEditing ? (
                                <form onSubmit={handleUpdateLead} className="row g-3">
                                    <div className="col-12">
                                        <label className="small fw-bold text-muted">Status</label>
                                        <select className="form-select border-2" value={lead.status} onChange={(e) => setLead({...lead, status: e.target.value})}>
                                            {['New', 'Contacted', 'Qualified', 'Proposal Sent', 'Closed'].map(s => <option key={s} value={s}>{s}</option> )}
                                        </select>
                                    </div>
                                    <div className="col-12">
                                        <label className="small fw-bold text-muted">Sales Agent</label>
                                        <select className="form-select border-2" value={lead.salesAgent?._id || lead.salesAgent || ""} onChange={(e) => setLead({...lead, salesAgent:  e.target.value})}>
                                            <option value="">Select Agent</option>
                                            {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option> )}
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="small fw-bold text-muted">Priority</label>
                                        <select className="form-select border-2" value={lead.priority} onChange={(e) => setLead({...lead, priority: e.target.value})}>
                                            <option value="High">High</option>
                                            <option value="Medium">Medium</option>
                                            <option value="Low">Low</option>
                                        </select>
                                    </div>
                                    <div className="col-6">
                                        <label className="small fw-bold text-muted">Time to Close</label>
                                        <input type="number" className="form-control border-2" value={lead.timeToClose} onChange={(e) => setLead({...lead, timeToClose: e.target.value})} />
                                    </div>
                                    <div className="col-12 mt-4">
                                        <button type="submit" className="btn btn-primary w-100 fw-bold py-2">Save Changes</button>
                                    </div>
                                </form>
                            ) : (
                                <div className="list-group list-group-flush border-0">
                                    <div className="list-group-item d-flex justify-content-between py-3">
                                        <span className="text-muted small fw-bold text-uppercase">Lead Name</span>
                                        <span className="fw-bold text-dark">{lead.name}</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between py-3">
                                        <span className="text-muted small fw-bold text-uppercase">Sales Agent</span>
                                        <span className="fw-bold text-primary">{lead.salesAgent?.name || "Unassigned"}</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between py-3">
                                        <span className="text-muted small fw-bold text-uppercase">Lead Source</span>
                                        <span className={`badge ${lead.status === 'Closed' ? 'bg-success' : 'bg-info'} px-3`}>{lead.source}</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between py-3">
                                        <span className="text-muted small fw-bold text-uppercase">Lead Status</span>
                                        <span className={`badge ${lead.status === 'Closed' ? 'bg-success' : 'bg-info'} px-3`}>{lead.status}</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between py-3">
                                        <span className="text-muted small fw-bold text-uppercase">Priority</span>
                                        <span className={`fw-bold ${lead.priority === 'High' ? 'text-danger' : 'text-muted'}`}>{lead.priority}</span>
                                    </div>
                                    <div className="list-group-item d-flex justify-content-between py-3">
                                        <span className="text-muted small fw-bold text-uppercase">Time to close</span>
                                        <span className="text-dark"><Clock size={14} className="me-1" /> {lead.timeToClose} Days</span>
                                    </div>
                                    <div className="list-group-item py-3">
                                        <p className="text-muted small fw-bold mb-2 text-uppercase">Tags</p>
                                        <div className="d-flex flex-wrap gap-2">
                                            {lead.tags?.map(tag => <span key={tag} className="badge bg-primary-subtle text-primary border border-primary-subtle">#{tag}</span> )}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                <div className="col-12 col-lg-7">
                    <div className="card shadow-sm border-0 h-100">
                        <div className="card-header bg-white py-3 border-bottom d-flex align-items-center justify-content-between">
                            <h5 className="fw-bold mb-0 d-flex align-items-center gap-2">
                                <MessageSquare size={20} className="text-primary" />
                                Comments Section
                            </h5>
                            <div className="d-flex align-items-center gap-2">
                                <span className="small text-muted fw-bold">BY:</span>
                                <select className="form-select form-select-sm border-primary" style={{width: '160px'}} value={selectedAuthor} onChange={(e) => setSelectedAuthor(e.target.value)}>
                                    <option value="">Select Author</option>
                                    {agents.map(a => <option key={a._id} value={a._id}>{a.name}</option> )}
                                </select>
                            </div>
                        </div>
                        <div className="card-body bg-light-subtle d-flex flex-column">
                            <form onSubmit={handleAddComment} className="mb-4">
                                <div className="input-group shadow-sm bg-white rounded overflow-hidden border border-primary">
                                    <textarea className="form-control border-0 p-3"
                                       placeholder="Add a new comment or progress update..."
                                       style={{resize: 'none'}}
                                       rows="2"
                                       value={newComment}
                                       onChange={(e) => setNewComment(e.target.value)}
                                    />
                                    <button type="submit" disabled={commentLoading} className="btn btn-primary px-4">
                                        {commentLoading ? <div className="spinner-border spinner-border-sm"></div>
                                        : <Send size={18} /> }
                                    </button>
                                </div>
                            </form>

                            <div className="overflow-auto" style={{maxHeight: '500px'}}>
                                {comments.length === 0 ? (
                                    <div className="text-center py-5 text-muted">No interactions documented yet.</div>
                                ) : (
                                    comments.map((comment) => (
                                        <div key={comment.id} className="bg-white p-3 rounded shadow-sm border mb-3 border-start border-4 border-start-primary">
                                            <div className="d-flex justify-content-between mb-1">
                                                <span className="fw-bold text-dark small">{comment.author}</span>
                                                <span className="text-muted" style={{fontSize: '0.7rem'}}>
                                                    {new Date(comment.createdAt).toLocaleString([], {dateStyle: 'short', timeStyle: 'short'})}
                                                </span>
                                            </div>
                                                <p className="mb-0 text-secondary-emphasis small">Comment: {comment.commentText}</p>
                                        </div>
                                    ))
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default LeadDetails