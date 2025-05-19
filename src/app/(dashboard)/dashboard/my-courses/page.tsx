"use client";

import React, { useEffect, useState } from "react";
import { Course } from "@/types/course";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import CourseCardSkeleton from "@/components/skeleton/CourseCardSkeleton";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Eye } from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse<Course[]>>(
        "/api/my-courses"
      );

      if (response.data.success && Array.isArray(response.data.data)) {
        setCourses(response.data.data as Course[]);
      } else {
        toast.error("Failed to load courses.");
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<Course[]>>;
      const errorMessage =
        axiosError.response?.data?.message || "Error fetching courses.";
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);
  
  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <h1 className="text-3xl font-bold text-primary mb-8 uppercase">
          MY COURSES
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
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-transparent">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">My COURSES</h1>
      </div>

      {!loading && courses.length > 0 && (
        <p className="text-lg text-gray-500 mb-4">
          {courses.length} courses found
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          courses.map((course: Course, id) => (
            <Card className="w-full max-w-sm rounded-2xl shadow-md" key={id}>
              <CardHeader>
                <div className="relative w-full h-48 rounded-lg overflow-hidden">
                  <Image
                    src={course.image.url}
                    alt={course.name}
                    fill
                    className="object-cover"
                  />
                </div>
              </CardHeader>

              <CardContent className="space-y-2">
                <h2 className="text-xl font-semibold">{course.name}</h2>
                <p className="text-sm text-muted-foreground line-clamp-3">
                  {course.description}
                </p>
              </CardContent>

              <CardFooter className="flex justify-between">
                <Button variant="outline">
                  <Link
                    href={`my-courses/${course._id}`}
                    className="flex gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          ))}
      </div>

      {!loading && courses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-lg text-gray-500 mb-4">No courses found</p>
          <Button>
            <Link href={"./browse-course"}>Enroll in a course</Link>
          </Button>
        </div>
      )}
    </div>
  );
}
