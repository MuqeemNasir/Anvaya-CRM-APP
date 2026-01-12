import { useEffect, useMemo, useState } from "react";
import {
  fetchLastWeekReport,
  fetchPipelineReport,
} from "../services/report.api";
import { getLeads } from "../services/lead.api";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from "chart.js";
import { Bar, Pie } from "react-chartjs-2";
import {
  BarChart3,
  Briefcase,
  CheckCircle,
  Clock,
  Loader2,
  PieChart,
  TrendingUp,
  Users,
} from "lucide-react";

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

const Reports = () => {
  const [pipelineTotal, setPipelineTotal] = useState(0);
  const [closedLastWeek, setClosedLastWeek] = useState([]);
  const [allLeads, setAllLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getReportData = async () => {
      try {
        const [pipeline, lastWeek, leads] = await Promise.all([
          fetchPipelineReport(),
          fetchLastWeekReport(),
          getLeads(),
        ]);
        setPipelineTotal(pipeline.totalLeadsInPipeline);
        setClosedLastWeek(lastWeek);
        setAllLeads(leads);
      } catch (error) {
        console.error("Report Fetch Error: ", error);
      } finally {
        setLoading(false);
      }
    };
    getReportData();
  }, []);

  const pipelineVsClosedData = useMemo(() => {
    const closedCount = allLeads.filter((l) => l.status === "Closed").length;
    const inPipelineCount = allLeads.filter(
      (l) => l.status !== "Closed"
    ).length;

    return {
      labels: ["Closed Leads", "In Pipeline"],
      datasets: [
        {
          data: [closedCount, inPipelineCount],
          backgroundColor: ["#198754", "#0d6efd"],
          hoverOffset: 4,
          borderWidth: 0,
        },
      ],
    };
  }, [allLeads]);

  const closedAgentChartData = useMemo(() => {
    const closedByAgent = allLeads
      .filter((lead) => lead.status === "Closed")
      .reduce((acc, lead) => {
        const name = lead.salesAgent?.name || "Unassigned";
        acc[name] = (acc[name] || 0) + 1;
        return acc;
      }, {});

    return {
      labels: Object.keys(closedByAgent),
      datasets: [
        {
          label: "Leads Closed",
          data: Object.values(closedByAgent),
          backgroundColor: "rgba(25, 135, 84, 0.8)",
          borderColor: "#198754",
          borderWidth: 1,
          borderRadius: 4,
        },
      ],
    };
  }, [allLeads]);

  const statusDistributionData = useMemo(() => {
    const statusCounts = allLeads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {});

    return {
      labels: Object.keys(statusCounts),
      datasets: [
        {
          label: "Lead Count",
          data: Object.values(statusCounts),
          backgroundColor: [
            "#0dcaf0",
            "#ffc107",
            "#0d6efd",
            "#6c757d",
            "#198754",
          ],
          borderRadius: 4,
        },
      ],
    };
  }, [allLeads]);

  const barOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { display: false } },
    scales: { y: { beginAtZero: true, ticks: { stepSize: 1, precision: 0 } } },
  };

  if (loading)
    return (
      <div className="d-flex flex-column align-items-center justify-content-center vh-100">
        <Loader2
          className="spinner-border text-primary mb-3"
          style={{ border: "none" }}
        />
        <h5 className="text-muted fw-light">Analyzing pipeline data...</h5>
      </div>
    );

  return (
    <div className="container-fluid px-3 px-md-5 py-4 animate-fade-in">
      <div className="mb-5">
          <h1 className="h3 fw-bold text-dark d-flex align-items-center gap-2 mb-1">
            <TrendingUp className="text-primary" size={32} /> Anvaya CRM Reports Overview
          </h1>
          <p className="text-muted mb-0">
            Real-time overview of your sales funnel and agent activity.
          </p>
      </div>

      <div className="row g-4 mb-5">
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm bg-primary text-white p-4 h-100">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="text-uppercase small fw-bold opacity-75">
                  Pipeline Total
                </h6>
                <h2 className="fw-bold mb-0">{pipelineTotal} Leads</h2>
              </div>
              <Briefcase size={32} className="opacity-25" />
            </div>
            <small className="mt-2 d-block opacity-75">
              Active leads excluding closed deals
            </small>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm bg-success text-white p-4 h-100">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="text-uppercase small fw-bold opacity-75">
                  Wins This Week
                </h6>
                <h2 className="fw-bold mb-0">{closedLastWeek.length} Leads</h2>
              </div>
              <CheckCircle size={32} className="opacity-25" />
            </div>
            <small className="mt-2 d-block opacity-75">
              Leads successfully closed (Last 7 Days)
            </small>
          </div>
        </div>
        <div className="col-12 col-md-4">
          <div className="card border-0 shadow-sm bg-dark text-white p-4 h-100">
            <div className="d-flex justify-content-between">
              <div>
                <h6 className="text-uppercase small fw-bold opacity-75">
                  Avg. Close Time
                </h6>
                <h2 className="fw-bold mb-0">
                  {allLeads.length > 0
                    ? (
                        allLeads.reduce((a, b) => a + b.timeToClose, 0) /
                        allLeads.length
                      ).toFixed(0)
                    : 0}{" "}
                  Days
                </h2>
              </div>
              <Clock size={32} className="opacity-25" />
            </div>
            <small className="mt-2 d-block opacity-75">
              Global average estimation to close
            </small>
          </div>
        </div>
      </div>
      <div className="row g-4 mb-4">
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3 border-bottom d-flex align-items-center gap-2">
              <PieChart size={18} className="text-primary" />
              <h6 className="fw-bold mb-0 text-uppercase small">
                Pipeline vs. Closed Leads
              </h6>
            </div>
            <div
              className="card-body d-flex justify-content-center align-items-center"
              style={{ minHeight: "300px" }}
            >
              <div style={{ width: "80%" }}>
                <Pie
                  data={pipelineVsClosedData}
                  options={{
                    maintainAspectRatio: true,
                    plugins: { legend: { position: "bottom" } },
                  }}
                />
              </div>
            </div>
          </div>
        </div>
        <div className="col-12 col-lg-6">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3 border-bottom d-flex align-items-center gap-2">
              <Users size={18} className="text-primary" />
              <h6 className="fw-bold mb-0 text-uppercase small">
                Leads Closed by Sales Agent
              </h6>
            </div>
            <div className="card-body" style={{ minHeight: "300px" }}>
              <Bar data={closedAgentChartData} options={barOptions} />
            </div>
          </div>
        </div>
        <div className="col-12">
          <div className="card border-0 shadow-sm h-100">
            <div className="card-header bg-white py-3 border-bottom d-flex align-items-center gap-2">
              <BarChart3 size={18} className="text-primary" />
              <h6 className="fw-bold mb-0 text-uppercase small">
                Global Lead Status Distribution
              </h6>
            </div>
            <div className="card-body" style={{ minHeight: "300px" }}>
              <Bar data={statusDistributionData} options={barOptions} />
            </div>
          </div>
        </div>

        <div className="col-12 mb-5">
          <div className="card border-0 shadow-sm overflow-hidden">
            <div className="card-header bg-white py-3 border-bottom d-flex align-items-center gap-2">
              <CheckCircle size={18} className="text-success" />
              <h6 className="fw-bold mb-0 text-uppercase small">
                Recent Success Detail (Last 7 Days)
              </h6>
            </div>
            <div className="card-body p-0">
              <div className="table-responsive">
                <table className="table table-hover mb-0 align-middle">
                  <thead className="bg-light small text-muted text-uppercase">
                    <tr>
                      <th className="ps-4 border-0">Lead Name</th>
                      <th className="border-0">Closing Agent</th>
                      <th className="text-end pe-4 border-0">Date Close</th>
                    </tr>
                  </thead>
                  <tbody>
                    {closedLastWeek.length === 0 ? (
                      <tr>
                        <td
                          colSpan="3"
                          className="text-center py-5 text-muted fw-light"
                        >
                          No Lead Closed recorded this week yet. Keep pushing!
                        </td>
                      </tr>
                    ) : (
                      closedLastWeek.map((lead) => (
                        <tr key={lead.id}>
                          <td className="ps-4 fw-bold text-dark">
                            {lead.name}
                          </td>
                          <td className="text-muted">
                            <Users size={14} className="me-2" />
                            {lead.salesAgent}
                          </td>
                          <td className="text-end pe-4 text-muted small">
                            {lead.closedAt
                              ? new Date(lead.closedAt).toLocaleDateString(
                                  "en-GB",
                                  { day: "2-digit", month: "short" }
                                )
                              : "N/A"}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Reports;
