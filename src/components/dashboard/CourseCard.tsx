import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import Image from "next/image";
import { Course } from "@/types/course";

interface CourseCardProps {
  course: Course;
  onEdit: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onEdit }) => {
  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-md">
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
        <Button
          variant="outline"
          onClick={() => onEdit(course)}
          className="flex gap-2"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </Button>
        <Button
          variant="outline"
          onClick={() => onEdit(course)}
          className="flex gap-2"
        >
          <Eye className="w-4 h-4" />
          View
        </Button>
      </CardFooter>
    </Card>
  );
};
