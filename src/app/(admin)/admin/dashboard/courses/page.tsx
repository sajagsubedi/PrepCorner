"use client";

import React, { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { CourseCard } from "@/components/dashboard/cards/CourseCard";
import CourseModal from "@/components/dashboard/modals/CourseModal";
import { Course } from "@/types/course";
import { CourseInput } from "@/schemas/courseSchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import { toast } from "react-toastify";
import Loader from "@/components/shared/Loader";
import { Button } from "@/components/ui/button";

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  const handleAddClick = () => {
    setSelectedCourse(null);
    setDialogOpen(true);
  };

  const handleEditClick = (course: Course) => {
    setSelectedCourse(course);
    setDialogOpen(true);
  };

  const onCancel = () => {
    setSelectedCourse(null);
    setDialogOpen(false);
  };

  const handleSave = async (data: CourseInput) => {
    try {
      const { name, description, image, isVisible } = data;

      const formData = new FormData();
      formData.append("isVisible", String(isVisible));
      if (name) formData.append("name", name);
      if (description) formData.append("description", description);
      if (image) formData.append("image", image);

      if (!selectedCourse) {
        const response = await axios.post<ApiResponse<Course>>(
          "/api/admin/courses",
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success(response.data.message);
        if (response.data.success) {
          setCourses((prev) => [...prev, response.data.data as Course]);
          setDialogOpen(false);
        }
      } else {
        const response = await axios.put<ApiResponse<Course>>(
          `/api/admin/courses/${selectedCourse._id}`,
          formData,
          {
            headers: {
              "Content-Type": "multipart/form-data",
            },
          }
        );
        if (response.data.success) {
          setCourses((prev) =>
            prev.map((course) =>
              course._id === selectedCourse._id
                ? (response.data.data as Course)
                : course
            )
          );
          toast.success(response.data.message);
          setDialogOpen(false);
        }
      }
    } catch (error) {
      const axiosError = error as AxiosError<ApiResponse<Course>>;
      const errorMessage =
        axiosError?.response?.data?.message ||
        "There was a problem saving the course. Please try again.";
      toast.error(errorMessage);
    }
  };

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const response = await axios.get<ApiResponse<Course[]>>(
        "/api/admin/courses"
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

  return (
    <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-10 bg-transparent">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-primary">COURSES</h1>
        <Button onClick={handleAddClick}>
          <Plus size={18} className="mr-2" />
          Add Course
        </Button>
      </div>
      {loading && (
        <div className="flex items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
          <Loader />
        </div>
      )}

      {!loading && courses.length > 0 && (
        <p className="text-lg text-gray-500 mb-4">
          {courses.length} courses found
        </p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {!loading &&
          courses.map((course: Course) => (
            <CourseCard
              key={course._id}
              course={course}
              onEdit={handleEditClick}
            />
          ))}
      </div>

      {!loading && courses.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 px-4 border-2 border-dashed border-gray-200 rounded-lg">
          <p className="text-lg text-gray-500 mb-4">No courses found</p>
          <Button onClick={handleAddClick}>Add first course</Button>
        </div>
      )}

      <CourseModal
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSave={handleSave}
        course={selectedCourse}
        onCancel={onCancel}
      />
    </div>
  );
}
