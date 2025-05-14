import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Eye, Pencil } from "lucide-react";
import { QuestionSet } from "@/types/questionSet";
import Link from "next/link";

interface QuestionSetCardProps {
  questionSet: QuestionSet;
  onEdit: (questionSet: QuestionSet) => void;
}

export const QuestionSetCard: React.FC<QuestionSetCardProps> = ({
  questionSet,
  onEdit,
}) => {
  return (
    <Card className="w-full max-w-sm rounded-2xl shadow-md">
      <CardContent className="space-y-2">
        <h2 className="text-xl font-semibold">{questionSet.name}</h2>
        <p>Duration: {questionSet.duration/60} minutes</p>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={() => onEdit(questionSet)}
          className="flex gap-2"
        >
          <Pencil className="w-4 h-4" />
          Edit
        </Button>
        <Button variant="outline">
          <Link href={`../questions/${questionSet._id}`} className="flex gap-2">
            <Eye className="w-4 h-4" />
            View
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
};
