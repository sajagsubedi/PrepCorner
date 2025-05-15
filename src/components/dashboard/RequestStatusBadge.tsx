import { EnrollmentStatus } from "@/types/enrollment";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface RequestStatusBadgeProps {
  status: EnrollmentStatus;
}

export default function RequestStatusBadge({
  status,
}: RequestStatusBadgeProps) {
  const getStatusConfig = () => {
    switch (status) {
      case EnrollmentStatus.PENDING:
        return {
          label: "Pending",
          className:
            "bg-yellow-100 text-yellow-800 hover:bg-yellow-100 border-yellow-200",
        };
      case EnrollmentStatus.APPROVED:
        return {
          label: "Approved",
          className:
            "bg-green-100 text-green-800 hover:bg-green-100 border-green-200",
        };
      case EnrollmentStatus.REJECTED:
        return {
          label: "Rejected",
          className: "bg-red-100 text-red-800 hover:bg-red-100 border-red-200",
        };
      default:
        return {
          label: status,
          className:
            "bg-gray-100 text-gray-800 hover:bg-gray-100 border-gray-200",
        };
    }
  };

  const { label, className } = getStatusConfig();

  return (
    <Badge
      variant="outline"
      className={cn("font-medium capitalize py-1 px-2 rounded-md", className)}
    >
      {label}
    </Badge>
  );
}
