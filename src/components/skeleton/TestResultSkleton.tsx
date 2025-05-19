import { Skeleton } from "@/components/ui/skeleton";

const TestResultsSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 flex items-center justify-center p-6">
      <div className="relative w-full max-w-4xl rounded-2xl shadow-2xl p-8">
        {/* Close Button Skeleton */}
        <Skeleton className="absolute top-4 right-4 w-10 h-10 rounded-full" />

        {/* Header Skeleton */}
        <Skeleton className="h-8 w-48 mx-auto mb-8" />

        {/* Main Content Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Statistics Card Skeleton */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
            <Skeleton className="h-6 w-32 mb-4" />
            <div className="flex items-center justify-between">
              <div className="flex flex-col items-center">
                <Skeleton className="w-32 h-32 rounded-full" />
              </div>
              <div className="space-y-3">
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-28" />
                <Skeleton className="h-5 w-28" />
              </div>
            </div>
          </div>

          {/* Performance Metrics Card Skeleton */}
          <div className="bg-gray-50 p-6 rounded-xl shadow-sm">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="space-y-4">
              <Skeleton className="h-12 w-full rounded-lg" />
              <Skeleton className="h-12 w-full rounded-lg" />
            </div>
          </div>
        </div>

        {/* Feedback Message Skeleton */}
        <div className="mt-8 text-center">
          <Skeleton className="h-4 w-3/4 mx-auto" />
          <Skeleton className="h-4 w-2/3 mx-auto mt-2" />
        </div>

        {/* Action Buttons Skeleton */}
        <div className="flex justify-center gap-4 mt-8">
          <Skeleton className="h-12 w-32 rounded-lg" />
          <Skeleton className="h-12 w-32 rounded-lg" />
        </div>
      </div>
    </div>
  );
};

export default TestResultsSkeleton;
