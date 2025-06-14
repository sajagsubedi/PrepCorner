import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function TestCardSkeleton() {
  return (
    <Card className="overflow-hidden border border-border p-0">
      <div className="flex flex-col h-full">
        {/* Top Content */}
        <div className="p-4 pb-2">
          <div className="flex justify-between items-start mb-1">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-12 rounded-full" />
          </div>
          <Skeleton className="h-3 w-1/2 mb-1" />
          <Skeleton className="h-3 w-24" />
        </div>

        {/* Bottom Content */}
        <CardContent className="p-2 pt-2 flex-grow">
          <div className="flex flex-col gap-4 justify-between h-full">
            <div className="flex items-center gap-4">
              {/* Circular Progress */}
              <Skeleton className="w-10 h-10 rounded-full" />

              {/* Text Info */}
              <div className="flex-grow min-w-0 space-y-1">
                <Skeleton className="h-3 w-20" />
                <Skeleton className="h-3 w-28" />
                <Skeleton className="h-3 w-16" />
              </div>
            </div>

            {/* Action Button */}
            <Skeleton className="h-8 w-full mt-4 rounded-md" />
          </div>
        </CardContent>
      </div>
    </Card>
  );
}
