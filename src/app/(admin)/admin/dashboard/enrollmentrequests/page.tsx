"use client";

import { useCallback, useEffect, useState } from "react";
import axios, { AxiosError } from "axios";
import {
  EnrollmentRequest,
  EnrollmentStatus,
  Statistics,
} from "@/types/enrollment";
import { Eye, RefreshCw, FileText, UserCheck, XCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";
import { toast } from "react-toastify";
import RequestStatusBadge from "@/components/dashboard/RequestStatusBadge";
import StatisticsCards from "@/components/dashboard/StatisticsCards";
import { ApiResponse } from "@/types/ApiResponse";
import Image from "next/image";
import Loader from "@/components/shared/Loader";

export default function EnrollmentRequestsContent() {
  const [requests, setRequests] = useState<EnrollmentRequest[]>([]);
  const [statistics, setStatistics] = useState<Statistics>({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0,
  });
  const [statusFilter, setStatusFilter] = useState<EnrollmentStatus | "all">(
    "all"
  );
  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [denyDialogOpen, setDenyDialogOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] =
    useState<EnrollmentRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Fetch requests and statistics
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      const [requestsRes, statsRes] = await Promise.all([
        axios.get<ApiResponse<EnrollmentRequest[]>>(
          `/api/admin/enrollment-requests?status=${statusFilter}`
        ),
        axios.get<ApiResponse<Statistics>>(
          "/api/admin/enrollment-requests/statistics"
        ),
      ]);

      if (requestsRes.data.success) {
        setRequests(requestsRes.data.data as EnrollmentRequest[]);
      } else {
        toast.error(requestsRes.data.message);
      }

      if (statsRes.data.success) {
        setStatistics(statsRes.data.data as Statistics);
      } else {
        toast.error(statsRes.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error("Failed to load data.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [statusFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const refreshRequests = async () => {
    setRefreshing(true);
    await fetchData();
  };

  const handleApprove = async (id: string) => {
    try {
      const response = await axios.put<ApiResponse<EnrollmentRequest>>(
        `/api/admin/enrollment-requests/${id}`,
        { status: EnrollmentStatus.APPROVED }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setRequests((prev) =>
          prev.map((r) =>
            r._id === id ? { ...r, status: EnrollmentStatus.APPROVED } : r
          )
        );
        setStatistics((prev) => ({
          ...prev,
          pending: prev.pending - 1,
          approved: prev.approved + 1,
        }));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<undefined>>;
      toast.error(
        axiosError.response?.data?.message || "Failed to approve request."
      );
    }
  };

  const handleDeny = async (id: string, reason: string) => {
    try {
      const response = await axios.put<ApiResponse<EnrollmentRequest>>(
        `/api/admin/enrollment-requests/${id}`,
        { status: EnrollmentStatus.REJECTED, reason }
      );
      if (response.data.success) {
        toast.success(response.data.message);
        setRequests((prev) =>
          prev.map((r) =>
            r._id === id
              ? { ...r, status: EnrollmentStatus.REJECTED, reason }
              : r
          )
        );
        setStatistics((prev) => ({
          ...prev,
          pending: prev.pending - 1,
          denied: prev.rejected + 1,
        }));
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<undefined>>;
      toast.error(
        axiosError.response?.data?.message || "Failed to deny request."
      );
    }
  };

  const openViewDialog = (request: EnrollmentRequest) => {
    setSelectedRequest(request);
    setViewDialogOpen(true);
  };

  const openDenyDialog = (request: EnrollmentRequest) => {
    setSelectedRequest(request);
    setRejectionReason("");
    setDenyDialogOpen(true);
  };

  const handleDenySubmit = async () => {
    if (!selectedRequest) return;
    await handleDeny(selectedRequest._id, rejectionReason);
    setDenyDialogOpen(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 flex justify-center">
        <Loader />
      </div>
    );
  }

  const filteredRequests =
    statusFilter === "all"
      ? requests
      : requests.filter((req) => req.status === statusFilter);

  return (
    <>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold text-primary uppercase">
            Enrollment Requests
          </h1>
          <p className="text-muted-foreground mt-2">
            Manage student enrollment requests for courses
          </p>
        </div>

        <StatisticsCards statistics={statistics} />

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <Select
            value={statusFilter}
            onValueChange={(value) =>
              setStatusFilter(value as EnrollmentStatus | "all")
            }
          >
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Requests</SelectItem>
              <SelectItem value={EnrollmentStatus.PENDING}>Pending</SelectItem>
              <SelectItem value={EnrollmentStatus.APPROVED}>
                Approved
              </SelectItem>
              <SelectItem value={EnrollmentStatus.REJECTED}>
                Rejected
              </SelectItem>
            </SelectContent>
          </Select>

          <Button
            variant="outline"
            size="sm"
            onClick={refreshRequests}
            disabled={refreshing}
          >
            <RefreshCw
              className={`h-4 w-4 mr-2 ${refreshing ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>

        <Card className="overflow-hidden border-border/40 shadow-md">
          <CardHeader className="bg-muted/30">
            <CardTitle className="text-xl font-medium text-primary">
              Enrollment Requests
            </CardTitle>
            <CardDescription>
              {filteredRequests.length} request
              {filteredRequests.length !== 1 ? "s" : ""}
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {filteredRequests.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
                <FileText className="h-12 w-12 text-muted-foreground/60 mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-1">
                  No Requests Found
                </h3>
                <p className="text-muted-foreground">
                  {statusFilter === "all"
                    ? "There are no enrollment requests in the system."
                    : `There are no ${statusFilter} enrollment requests.`}
                </p>
              </div>
            ) : (
              <div className="overflow-auto max-h-[600px]">
                <Table>
                  <TableHeader className="bg-muted/30 sticky top-0">
                    <TableRow>
                      <TableHead>Student</TableHead>
                      <TableHead>Course</TableHead>
                      <TableHead>Requested Date</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredRequests.map((req) => (
                      <TableRow key={req._id}>
                        <TableCell>
                          <div className="font-medium">{req.user.fullName}</div>
                          <div className="text-xs text-muted-foreground">
                            {req.user.email}
                          </div>
                        </TableCell>
                        <TableCell>{req.course.name}</TableCell>
                        <TableCell className="text-sm">
                          {format(new Date(req.requestedAt), "MMM d, yyyy")}
                        </TableCell>
                        <TableCell className="text-sm">
                          <RequestStatusBadge status={req.status} />
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => openViewDialog(req)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>

                            {req.status === EnrollmentStatus.PENDING && (
                              <>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleApprove(req._id)}
                                >
                                  <UserCheck className="h-4 w-4 mr-1" />
                                  Approve
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openDenyDialog(req)}
                                  className="text-destructive border-destructive/40 hover:bg-destructive/10"
                                >
                                  <XCircle className="h-4 w-4 mr-1" />
                                  Deny
                                </Button>
                              </>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>

        {/* View Dialog */}
        <Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Enrollment Request Details</DialogTitle>
            </DialogHeader>

            {selectedRequest && (
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <RequestStatusBadge status={selectedRequest.status} />
                </div>

                <div>
                  <p className="text-sm font-medium">Student</p>
                  <div className="flex items-end gap-2 mt-2">
                    <Image
                      src={selectedRequest.user.profilePicture.url}
                      alt="Student Profile Picture"
                      width={40}
                      className="rounded-full w-10 h-10 overflow-hidden object-cover"
                      height={40}
                    />

                    <div>
                      <p>{selectedRequest.user.fullName}</p>
                      <p className="text-sm text-muted-foreground">
                        {selectedRequest.user.email}
                      </p>
                    </div>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium">Course</p>
                  <p>{selectedRequest.course.name}</p>
                </div>

                <div>
                  <p className="text-sm font-medium">Requested Date</p>
                  <p className="text-sm">
                    {format(
                      new Date(selectedRequest.requestedAt),
                      "MMMM d, yyyy"
                    )}
                  </p>
                </div>

                {selectedRequest.reason && (
                  <div>
                    <p className="text-sm font-medium">Rejection Reason</p>
                    <p className="text-sm">{selectedRequest.reason}</p>
                  </div>
                )}
              </div>
            )}

            <DialogFooter>
              <Button onClick={() => setViewDialogOpen(false)}>Close</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Deny Dialog */}
        <Dialog open={denyDialogOpen} onOpenChange={setDenyDialogOpen}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Deny Enrollment Request</DialogTitle>
              <DialogDescription>
                Please provide a reason for denying this enrollment request.
              </DialogDescription>
            </DialogHeader>

            <div className="py-2">
              <Input
                placeholder="Reason for rejection (optional)"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
              />
            </div>

            <DialogFooter>
              <Button
                variant="outline"
                onClick={() => setDenyDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDenySubmit}>
                Deny Request
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
