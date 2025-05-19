"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { toast } from "react-toastify";
import axios, { AxiosError } from "axios";
import { Course, courseStatus } from "@/types/course";
import { ApiResponse } from "@/types/ApiResponse";
import CourseCardSkeleton from "@/components/skeleton/CourseCardSkeleton";
import { EnrollmentRequest } from "@/types/enrollment";

export default function BrowseCourses() {
  const { status } = useSession();
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [requestingCourseIds, setRequestingCourseIds] = useState<Set<string>>(
    new Set()
  );

  // Helper: Format date with time in a clean way
  const formatDate = (dateString: string | Date) =>
    new Date(dateString).toLocaleString("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    });

  // Fetch courses
  useEffect(() => {
    async function fetchCourses() {
      try {
        const response = await axios.get<ApiResponse<Course[]>>("/api/courses");
        if (response.data.success) {
          setCourses(response.data.data as Course[]);
        } else {
          toast.error(response.data.message);
        }
      } catch (error) {
        console.error("Error fetching courses:", error);
        toast.error("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    }
    fetchCourses();
  }, []);

  const handleRequestAccess = async (courseId: string) => {
    if (status !== "authenticated") {
      router.push(`/signin`);
      return;
    }

    setRequestingCourseIds((prev) => new Set([...prev, courseId]));

    try {
      const response = await axios.post<ApiResponse<EnrollmentRequest>>(
        "/api/enrollmentrequests",
        { courseId }
      );

      if (response.data.success) {
        setCourses((prevCourses) =>
          prevCourses.map((course) =>
            course._id === courseId
              ? {
                  ...course,
                  enrollmentStatus: courseStatus.PENDING,
                  date: new Date(response.data.data?.requestedAt as string),
                }
              : course
          )
        );
        toast.success("Access requested successfully!");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<undefined>>;
      const errorMessage =
        axiosError.response?.data?.message || "Failed to request access.";
      toast.error(errorMessage);
    } finally {
      setRequestingCourseIds((prev) => {
        const updated = new Set([...prev]);
        updated.delete(courseId);
        return updated;
      });
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-primary mb-8 uppercase">
          Browse Courses
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array(6)
            .fill(0)
            .map((_, index) => (
              <CourseCardSkeleton key={index} />
            ))}
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <h1 className="text-3xl font-bold text-primary mb-8 uppercase">
        Browse Courses
      </h1>
      {courses.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg mb-4">
            No courses available at the moment.
          </p>
          <p className="text-muted-foreground">
            Check back later for new course offerings.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {courses.map((course) => (
            <div key={course._id}>
              <Card className="h-full flex flex-col overflow-hidden hover:shadow-md transition-shadow duration-300">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg font-semibold text-gray-800 line-clamp-2">
                      {course.name}
                    </CardTitle>
                    {course.enrollmentStatus === courseStatus.ENROLLED && (
                      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
                        Enrolled
                      </Badge>
                    )}
                    {course.enrollmentStatus === courseStatus.PENDING && (
                      <Badge className="bg-yellow-100 text-yellow-800 hover:bg-yellow-200">
                        Pending
                      </Badge>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="flex-grow pt-2">
                  <div className="aspect-video relative mb-4 rounded-md overflow-hidden">
                    <Image
                      src={course.image?.url || "/assets/placeholder.png"}
                      alt={course.name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <p className="text-gray-600 line-clamp-3 mb-3">
                    {course.description}
                  </p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <span className="inline-flex items-center gap-1">
                      <span className="w-2 h-2 bg-primary rounded-full"></span>
                      {course.categoriesCount || 0} Categor
                      {course.categoriesCount === 1 ? "y" : "ies"}
                    </span>
                  </div>
                </CardContent>
                <CardFooter className="pt-2">
                  {course.enrollmentStatus === courseStatus.ENROLLED ? (
                    <div className="flex flex-col items-center w-full gap-2 text-center">
                      <Button variant="outline" className="w-full" disabled>
                        Enrolled
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        Enrolled on: {formatDate(course?.date || "")}
                      </p>
                    </div>
                  ) : course.enrollmentStatus === courseStatus.PENDING ? (
                    <div className="flex flex-col items-center w-full gap-2 text-center">
                      <Button variant="outline" className="w-full" disabled>
                        Requested
                      </Button>
                      <p className="text-sm text-muted-foreground">
                        Requested on: {formatDate(course?.date || "")}
                      </p>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center w-full gap-2 text-center">
                      <Button
                        onClick={() => handleRequestAccess(course._id)}
                        className="w-full"
                        disabled={requestingCourseIds.has(course._id)}
                      >
                        {requestingCourseIds.has(course._id)
                          ? "Requesting..."
                          : "Request Access"}
                      </Button>
                      {course.enrollmentStatus === courseStatus.REJECTED && (
                        <p className="text-sm text-muted-foreground">
                          Rejected on: {formatDate(course?.date || "")}
                        </p>
                      )}
                    </div>
                  )}
                </CardFooter>
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
