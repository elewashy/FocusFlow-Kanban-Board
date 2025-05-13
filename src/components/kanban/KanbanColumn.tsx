import { Task, TaskStatus } from "@/types";
import { TaskCard } from "./TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { TaskDialog } from "./TaskDialog";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Draggable } from "@hello-pangea/dnd";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";

interface KanbanColumnProps {
  title: string;
  status: TaskStatus;
  tasks: Task[];
  isDropDisabled?: boolean;
  onTaskCreate: (task: Partial<Task>) => void;
  onTaskUpdate: (task: Task) => void;
  onTaskDelete: (task: Task) => void;
}

export function KanbanColumn({
  title,
  status,
  tasks,
  isDropDisabled,
  onTaskCreate,
  onTaskUpdate,
  onTaskDelete,
}: KanbanColumnProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | undefined>(undefined);
  const columnTasks = tasks.filter((task) => task.status === status);

  const getColumnStyle = (status: TaskStatus) => {
    switch (status) {
      case "todo":
        return "border-blue-200 bg-blue-50/50";
      case "doing":
        return "border-amber-200 bg-amber-50/50";
      case "done":
        return "border-green-200 bg-green-50/50";
      default:
        return "border-slate-200 bg-slate-50/50";
    }
  };

  return (
    <div className={`flex flex-col rounded-lg border-2 ${getColumnStyle(status)} ${
      useIsMobile() ? "min-h-[300px]" : "h-full"
    }`}>
      <div className={`flex items-center justify-between border-b ${
        useIsMobile() ? "px-4 py-3" : "p-3"
      }`}>
        <div className="flex items-center gap-2">
          <h3 className="font-medium text-sm">{title}</h3>
          <Badge variant="secondary" className="text-xs">
            {columnTasks.length}
          </Badge>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>

      <ScrollArea className="flex-1">
        <div className={`space-y-2 ${useIsMobile() ? "p-3" : "p-2"}`}>
          {columnTasks.map((task, index) => (
            <Draggable key={task.id} draggableId={task.id} index={index}>
              {(provided, snapshot) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <TaskCard
                    task={task}
                    isDragging={snapshot.isDragging}
                    onEdit={(task) => {
                      setEditingTask(task);
                      setIsDialogOpen(true);
                    }}
                    onDelete={onTaskDelete}
                  />
                </div>
              )}
            </Draggable>
          ))}
        </div>
      </ScrollArea>

      <TaskDialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setEditingTask(undefined);
        }}
        task={editingTask}
        onSubmit={(taskData) => {
          if (editingTask) {
            onTaskUpdate({ ...editingTask, ...taskData });
          } else {
            onTaskCreate({ ...taskData, status });
          }
          setIsDialogOpen(false);
          setEditingTask(undefined);
        }}
        onDelete={onTaskDelete}
      />
    </div>
  );
}
