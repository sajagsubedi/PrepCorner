import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import { Category } from "@/types/category";
import Link from "next/link";

interface CategoryCardProps {
  category: Category;
  onEdit: (category: Category) => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  onEdit,
}) => {
  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-md">
      <CardContent className="space-y-2">
        <h2 className="text-xl font-semibold">{category.name}</h2>
        <p className="text-sm text-muted-foreground line-clamp-3">
          {category.description}
        </p>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => onEdit(category)}
          className="flex gap-2"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </Button>
        <Button variant="outline">
          <Link href={`../categories/${category._id}`} className="flex gap-2">
            <Eye className="w-4 h-4" />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
