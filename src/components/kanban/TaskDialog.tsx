import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Task } from "@/types";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface TaskFormProps {
  task?: Task;
  title: string;
  setTitle: (title: string) => void;
  description: string;
  setDescription: (description: string) => void;
  date: Date | undefined;
  setDate: (date: Date | undefined) => void;
  priority: "low" | "medium" | "high";
  setPriority: (priority: "low" | "medium" | "high") => void;
  tags: string;
  setTags: (tags: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  onDeleteClick?: () => void;
}

const TaskForm = ({
  task,
  title,
  setTitle,
  description,
  setDescription,
  date,
  setDate,
  priority,
  setPriority,
  tags,
  setTags,
  handleSubmit,
  onCancel,
  onDeleteClick,
}: TaskFormProps) => (
  <form onSubmit={handleSubmit} className="space-y-4">
    <div className="space-y-2">
      <Label htmlFor="title">Title</Label>
      <Input
        id="title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Task title"
        required
      />
    </div>
    
    <div className="space-y-2">
      <Label htmlFor="description">Description</Label>
      <Textarea
        id="description"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="Task description"
      />
    </div>
    
    <div className="space-y-2">
      <Label>Due Date</Label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            className={cn(
              "w-full justify-start text-left font-normal",
              !date && "text-muted-foreground"
            )}
          >
            <CalendarIcon className="mr-2 h-4 w-4" />
            {date ? format(date, "PPP") : "Pick a date"}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="center">
          <Calendar
            mode="single"
            selected={date}
            onSelect={setDate}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    </div>
    
    <div className="space-y-2">
      <Label>Priority</Label>
      <Select 
        value={priority} 
        onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}
      >
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="low">Low</SelectItem>
          <SelectItem value="medium">Medium</SelectItem>
          <SelectItem value="high">High</SelectItem>
        </SelectContent>
      </Select>
    </div>
    
    <div className="space-y-2">
      <Label htmlFor="tags">Tags</Label>
      <Input
        id="tags"
        value={tags}
        onChange={(e) => setTags(e.target.value)}
        placeholder="Enter tags separated by commas"
      />
      <p className="text-xs text-muted-foreground">
        Example: dev, content, design
      </p>
    </div>
    
    <div className="flex justify-between items-center">
      {task && onDeleteClick && (
        <Button 
          type="button" 
          variant="destructive" 
          onClick={onDeleteClick}
        >
          Delete Task
        </Button>
      )}
      <div className="flex gap-2 ml-auto"> {/* Ensure buttons are on the right if delete is not present */}
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button type="submit">
          {task ? "Update Task" : "Create Task"}
        </Button>
      </div>
    </div>
  </form>
);

interface TaskDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task?: Task;
  onSubmit: (taskData: Partial<Task>) => void;
  onDelete?: (task: Task) => void;
}

export function TaskDialog({ open, onOpenChange, task, onSubmit, onDelete }: TaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState<Date | undefined>(undefined);
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const [tags, setTags] = useState("");
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const isMobile = useIsMobile();

  // Update form values when task changes
  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setDate(task.dueDate ? new Date(task.dueDate) : undefined);
      setPriority(task.priority || "medium");
      setTags(task.tags?.join(", ") || "");
    } else {
      // Reset form when creating new task
      setTitle("");
      setDescription("");
      setDate(undefined);
      setPriority("medium");
      setTags("");
    }
  }, [task]);

  const internalHandleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      title,
      description,
      dueDate: date?.toISOString(),
      priority,
      tags: tags.split(",").map(tag => tag.trim()).filter(Boolean),
    });
    
    // Reset form only if it's a new task submission, not an edit
    if (!task) {
      setTitle("");
      setDescription("");
      setDate(undefined);
      setPriority("medium");
      setTags("");
    }
    // onOpenChange(false); // Close dialog on submit
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteAlert(true);
  };

  return (
    <>
      {isMobile ? (
        <Sheet open={open} onOpenChange={onOpenChange}>
          <SheetContent side="bottom" className="h-[85vh] pt-6 overflow-y-auto">
            <SheetHeader className="text-left mb-6">
              <SheetTitle>{task ? "Edit Task" : "Create Task"}</SheetTitle>
              <SheetDescription>
                Add the details for your new task here.
              </SheetDescription>
            </SheetHeader>
            <TaskForm
              task={task}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              date={date}
              setDate={setDate}
              priority={priority}
              setPriority={setPriority}
              tags={tags}
              setTags={setTags}
              handleSubmit={internalHandleSubmit}
              onCancel={handleCancel}
              onDeleteClick={task ? handleDeleteClick : undefined}
            />
          </SheetContent>
        </Sheet>
      ) : (
        <Dialog open={open} onOpenChange={onOpenChange}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>{task ? "Edit Task" : "Create Task"}</DialogTitle>
              <DialogDescription>
                Add the details for your new task here.
              </DialogDescription>
            </DialogHeader>
            <TaskForm
              task={task}
              title={title}
              setTitle={setTitle}
              description={description}
              setDescription={setDescription}
              date={date}
              setDate={setDate}
              priority={priority}
              setPriority={setPriority}
              tags={tags}
              setTags={setTags}
              handleSubmit={internalHandleSubmit}
              onCancel={handleCancel}
              onDeleteClick={task ? handleDeleteClick : undefined}
            />
          </DialogContent>
        </Dialog>
      )}

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (task && onDelete) {
                  onDelete(task);
                  onOpenChange(false);
                }
              }}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
