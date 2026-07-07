import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { jobService } from "../api/jobService";
import AddJobModal from "../components/AddJobModal";
import {
  Briefcase,
  Link2,
  LogOut,
  Plus,
  RefreshCw,
  Trash2,
} from "lucide-react";

export default function Dashboard() {
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [updatingId, setUpdatingId] = useState(null); // Tracks which row is spinning/saving

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const data = await jobService.getAllJobs();
      setJobs(data);
      setError("");
    } catch (err) {
      setError(
        "Could not connect to the backend server. Make sure Spring Boot is running on port 8081.",
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this application?")) {
      try {
        await jobService.deleteJob(id);
        setJobs(jobs.filter((job) => job.id !== id));
      } catch (err) {
        alert("Failed to delete the job entry.");
      }
    }
  };

  // NEW: Handles updating the status dropdown straight to Spring Boot
  const handleStatusChange = async (id, currentJob, newStatus) => {
    try {
      setUpdatingId(id);
      const updatedData = { ...currentJob, status: newStatus };
      await jobService.updateJob(id, updatedData);

      // Update state locally so the badge color snaps instantly
      setJobs(
        jobs.map((job) =>
          job.id === id ? { ...job, status: newStatus } : job,
        ),
      );
    } catch (err) {
      alert(
        "Failed to update status. Make sure PUT endpoint is configured correctly on the backend.",
      );
      console.error(err);
    } finally {
      setUpdatingId(null);
    }
  };

  const handleJobAdded = (newJob) => {
    setJobs([newJob, ...jobs]);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  // Dynamic Tailwind styling for our clean interactive selector background colors
  const getStatusSelectClass = (status) => {
    const base =
      "px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider border outline-none cursor-pointer transition font-medium ";
    switch (status) {
      case "OFFER":
        return (
          base +
          "bg-green-100 text-green-800 border-green-300 focus:border-green-500"
        );
      case "INTERVIEW":
        return (
          base +
          "bg-blue-100 text-blue-800 border-blue-300 focus:border-blue-500"
        );
      case "OA":
        return (
          base +
          "bg-amber-100 text-amber-800 border-amber-300 focus:border-amber-500"
        );
      case "REJECTED":
        return (
          base + "bg-red-100 text-red-800 border-red-300 focus:border-red-500"
        );
      default:
        return (
          base +
          "bg-gray-100 text-gray-800 border-gray-300 focus:border-gray-500"
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6 font-sans text-gray-900">
      <div className="max-w-6xl mx-auto">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-gray-900 flex items-center gap-2">
              <Briefcase className="text-blue-600 w-6 h-6" />
              SmartHire Dashboard
            </h1>
            <p className="text-sm text-gray-500 mt-1">
              Track and manage your active job applications
            </p>
          </div>
          <div className="flex gap-3">
            <button
              onClick={fetchJobs}
              className="p-2 text-gray-600 hover:bg-gray-100 rounded-xl transition border border-gray-200 bg-white"
              title="Refresh Data">
              <RefreshCw
                className={`w-5 h-5 ${loading ? "animate-spin" : ""}`}
              />
            </button>
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition shadow-sm">
              <Plus className="w-5 h-5" /> Add Application
            </button>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 text-red-600 hover:bg-red-50 font-semibold px-4 py-2.5 rounded-xl transition border border-red-200 bg-white"
              title="Log Out">
              <LogOut className="w-5 h-5" /> Logout
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl mb-6 text-sm">
            {error}
          </div>
        )}

        {loading ? (
          <div className="text-center py-12 text-gray-500 font-medium">
            Loading your tracking sheet...
          </div>
        ) : jobs.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-gray-100 shadow-sm">
            <p className="text-gray-500 font-medium text-lg">
              No job applications logged yet.
            </p>
            <p className="text-gray-400 text-sm mt-1">
              Click the "Add Application" button to start tracking your targets.
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50/70 border-b border-gray-100 text-xs font-semibold uppercase tracking-wider text-gray-500">
                    <th className="px-6 py-4">Company</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Applied Date</th>
                    <th className="px-6 py-4">Link</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm">
                  {jobs.map((job) => (
                    <tr key={job.id} className="hover:bg-gray-50/50 transition">
                      <td className="px-6 py-4 font-semibold text-gray-900">
                        {job.companyName}
                      </td>
                      <td className="px-6 py-4 text-gray-600">{job.jobRole}</td>

                      {/* UPDATED: Status column is now a sleek inline select menu */}
                      <td className="px-6 py-4">
                        <select
                          value={job.status}
                          disabled={updatingId === job.id}
                          onChange={(e) =>
                            handleStatusChange(job.id, job, e.target.value)
                          }
                          className={
                            getStatusSelectClass(job.status) +
                            (updatingId === job.id
                              ? " opacity-40 cursor-wait"
                              : "")
                          }>
                          <option value="APPLIED">Applied</option>
                          <option value="OA">OA</option>
                          <option value="INTERVIEW">Interview</option>
                          <option value="OFFER">Offer</option>
                          <option value="REJECTED">Rejected</option>
                        </select>
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {job.appliedDate
                          ? new Date(job.appliedDate).toLocaleDateString()
                          : "N/A"}
                      </td>
                      <td className="px-6 py-4">
                        {job.jobLink ? (
                          <a
                            href={job.jobLink}
                            target="_blank"
                            rel="noreferrer"
                            className="text-blue-600 hover:text-blue-800 flex items-center gap-1 font-medium transition">
                            <Link2 className="w-4 h-4" /> Link
                          </a>
                        ) : (
                          <span className="text-gray-400">—</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() => handleDelete(job.id)}
                          className="p-1.5 text-red-500 hover:bg-red-50 rounded-lg transition"
                          title="Delete">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      <AddJobModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onJobAdded={handleJobAdded}
      />
    </div>
  );
}
