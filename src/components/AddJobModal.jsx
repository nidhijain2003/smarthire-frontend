import React, { useState } from "react";
import { X, AlertCircle } from "lucide-react";
import { jobService } from "../api/jobService";

export default function AddJobModal({ isOpen, onClose, onJobAdded }) {
  const [formData, setFormData] = useState({
    companyName: "",
    jobRole: "",
    status: "APPLIED",
    jobLink: "",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [validationError, setValidationError] = useState(""); // <-- NEW: Tracks validation errors

  if (!isOpen) return null;

  const validateForm = () => {
    if (!formData.companyName.trim()) {
      setValidationError("Company Name is required.");
      return false;
    }
    if (!formData.jobRole.trim()) {
      setValidationError("Job Role is required.");
      return false;
    }
    if (
      formData.jobLink.trim() &&
      !formData.jobLink.startsWith("http://") &&
      !formData.jobLink.startsWith("https://")
    ) {
      setValidationError("Job URL must begin with http:// or https://");
      return false;
    }
    setValidationError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Trigger validation logic
    if (!validateForm()) return;

    try {
      setSubmitting(true);
      const newJob = await jobService.createJob(formData);
      onJobAdded(newJob);
      onClose();
      setFormData({
        companyName: "",
        jobRole: "",
        status: "APPLIED",
        jobLink: "",
        notes: "",
      });
    } catch (err) {
      setValidationError("Failed to save the application. Please try again.");
      console.error(err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl w-full max-w-md shadow-xl border border-gray-100 overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-900">
            Add New Application
          </h2>
          <button
            onClick={onClose}
            className="p-1.5 hover:bg-gray-100 rounded-lg text-gray-400 hover:text-gray-600 transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* NEW: Dynamic Form Error Alert Banner */}
        {validationError && (
          <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-100 rounded-xl text-red-700 text-xs font-medium flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-red-500 shrink-0" />
            {validationError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Company Name *
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white transition"
              placeholder="e.g. Google"
              value={formData.companyName}
              onChange={(e) =>
                setFormData({ ...formData, companyName: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Job Role *
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white transition"
              placeholder="e.g. Software Engineer"
              value={formData.jobRole}
              onChange={(e) =>
                setFormData({ ...formData, jobRole: e.target.value })
              }
            />
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Status
            </label>
            <select
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white transition"
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value })
              }>
              <option value="APPLIED">Applied</option>
              <option value="OA">Online Assessment</option>
              <option value="INTERVIEW">Interview</option>
              <option value="OFFER">Offer</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase tracking-wider text-gray-500 mb-1">
              Job URL (Optional)
            </label>
            <input
              type="text"
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:border-blue-500 bg-white transition"
              placeholder="https://..."
              value={formData.jobLink}
              onChange={(e) =>
                setFormData({ ...formData, jobLink: e.target.value })
              }
            />
          </div>

          <div className="flex gap-3 pt-4 border-t border-gray-100 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="w-full border border-gray-200 hover:bg-gray-50 font-semibold px-4 py-2.5 rounded-xl transition text-sm text-gray-600">
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2.5 rounded-xl transition shadow-sm text-sm disabled:opacity-50">
              {submitting ? "Saving..." : "Save Tracker"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
