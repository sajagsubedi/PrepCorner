import { Card, CardContent } from "@/components/ui/card";
import { Statistics } from "@/types/enrollment";
import { Clock, CheckCircle, XCircle, FileText } from "lucide-react";

interface StatisticsProps {
  statistics: Statistics;
}

export default function StatisticsCards({ statistics }: StatisticsProps) {
  const stats = [
    {
      title: "Total Requests",
      value: statistics.total,
      icon: FileText,
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
    {
      title: "Pending",
      value: statistics.pending,
      icon: Clock,
      color: "text-yellow-500",
      bgColor: "bg-yellow-50",
    },
    {
      title: "Approved",
      value: statistics.approved,
      icon: CheckCircle,
      color: "text-green-500",
      bgColor: "bg-green-50",
    },
    {
      title: "Rejected",
      value: statistics.rejected,
      icon: XCircle,
      color: "text-red-500",
      bgColor: "bg-red-50",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;

        return (
          <Card
            key={index}
            className="border-border/40 shadow-sm hover:shadow-md transition-shadow"
          >
            <CardContent className="p-6 flex items-center space-x-4">
              <div className={`p-3 rounded-full ${stat.bgColor}`}>
                <Icon className={`h-6 w-6 ${stat.color}`} />
              </div>

              <div>
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.title}
                </p>
                <p className="text-2xl font-bold">{stat.value}</p>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
