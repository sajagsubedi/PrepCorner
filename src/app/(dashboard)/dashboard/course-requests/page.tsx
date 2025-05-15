"use client";

import React, { useCallback, useEffect, useState } from "react";
import { Eye, RefreshCw, FileText, Loader2, X } from "lucide-react";
import { EnrollmentRequest, EnrollmentStatus } from "@/types/enrollment";
import { format } from "date-fns";
import { ApiResponse } from "@/types/ApiResponse";
import axios from "axios";
import RequestStatusBadge from "@/components/dashboard/RequestStatusBadge";

const CourseRequests: React.FC = () => {
  const [requests, setRequests] = useState<EnrollmentRequest[]>([]);
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | "all">(
    "all"
  );
  const [selectedRequest, setSelectedRequest] =
    useState<EnrollmentRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const filter = statusFilter === "all" ? "" : statusFilter;
      const response = await axios.get<ApiResponse<EnrollmentRequest[]>>(
        `/api/enrollmentrequests?status=${filter}`
      );
      if (response.data.success && response.data.data) {
        setRequests(response.data.data);
      } else {
        console.error(response.data.message);
      }
    } catch (error) {
      console.error("Failed to load enrollment requests:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshRequests = () => {
    setRefreshing(true);
    fetchData();
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatusFilter(e.target.value as EnrollmentStatus | "all");
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">My Course Requests</h1>
        <p className="text-gray-600 mt-1">
          View the status of your course enrollment requests
        </p>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-4 py-5 sm:px-6 flex justify-between items-center flex-wrap gap-4 bg-gray-50">
          <select
            value={statusFilter}
            onChange={handleFilterChange}
            className="block px-2 py-1 rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
          >
            <option value="all">All Requests</option>
            <option value={EnrollmentStatus.PENDING}>Pending</option>
            <option value={EnrollmentStatus.APPROVED}>Approved</option>
            <option value={EnrollmentStatus.REJECTED}>Rejected</option>
          </select>

          <button
            onClick={refreshRequests}
            disabled={refreshing}
            className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
          </div>
        ) : requests.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
            <FileText className="h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-1">
              No Requests Found
            </h3>
            <p className="text-gray-500">
              {statusFilter === "all"
                ? "You haven't made any course enrollment requests yet."
                : `You don't have any ${statusFilter.toLowerCase()} enrollment requests.`}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Course
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Requested Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Details
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {requests.map((request) => (
                  <tr
                    key={request._id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {request.course.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {format(new Date(request.requestedAt), "MMM d, yyyy")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <RequestStatusBadge status={request.status} />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-blue-600 hover:text-blue-900 inline-flex items-center"
                      >
                        <Eye className="h-4 w-4 mr-1" />
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Dialog */}
      {selectedRequest && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 transition-opacity duration-300">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-auto">
            <div className="px-6 py-4 border-b flex justify-between items-center">
              <h3 className="text-lg font-medium text-gray-900">
                Enrollment Request Details
              </h3>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-400 hover:text-gray-600 transition"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="px-6 py-4 space-y-4">
              <div>
                <p className="text-sm font-medium text-gray-500">Status</p>
                <RequestStatusBadge status={selectedRequest.status} />
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">Course</p>
                <p className="text-base font-medium">
                  {selectedRequest.course.name}
                </p>
                {selectedRequest.course.description && (
                  <p className="text-sm text-gray-600 mt-1 line-clamp-3">
                    {selectedRequest.course.description}
                  </p>
                )}
              </div>

              <div>
                <p className="text-sm font-medium text-gray-500">
                  Requested Date
                </p>
                <p className="text-sm">
                  {format(
                    new Date(selectedRequest.requestedAt),
                    "MMMM d, yyyy"
                  )}
                </p>
              </div>

              {selectedRequest.reason && (
                <div>
                  <p className="text-sm font-medium text-gray-500">Reason</p>
                  <p className="text-base text-gray-800">
                    {selectedRequest.reason}
                  </p>
                </div>
              )}
            </div>

            <div className="px-6 py-3 bg-gray-50 flex justify-end">
              <button
                onClick={() => setSelectedRequest(null)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseRequests;
