"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";

interface PracticeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (isExam: boolean, duration: number) => Promise<void>;
  defaultDuration: number;
}

export default function PracticeDialog({
  isOpen,
  onClose,
  onSubmit,
  defaultDuration,
}: PracticeDialogProps) {
  const [isExam, setIsExam] = useState(false);
  const [duration, setDuration] = useState(Number(defaultDuration) / 60);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    await onSubmit(isExam, duration);
    setIsSubmitting(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Start Practice Session</DialogTitle>
          <DialogDescription>
            Configure your practice or exam settings before you begin.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="isExam"
              checked={isExam}
              onCheckedChange={(checked: boolean) =>
                setIsExam(checked === true)
              }
            />
            <Label htmlFor="isExam" className="text-base cursor-pointer">
              Take as Exam
            </Label>
          </div>

          {isExam && (
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration" className="text-right col-span-1">
                Duration
              </Label>
              <div className="col-span-3 flex items-center gap-2">
                <Input
                  id="duration"
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(Number(e.target.value))}
                  min={1}
                  className="col-span-2"
                />
                <span className="text-sm text-muted-foreground">minutes</span>
              </div>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={onClose} disabled={isSubmitting}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isSubmitting}>
            {isSubmitting ? (
              <div className="flex items-center gap-2">Creating test...</div>
            ) : (
              "Start"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
