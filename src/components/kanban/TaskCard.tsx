import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Task } from "@/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { 
  Calendar, 
  MessageCircle, 
  Bell,
  Tag,
  Edit2,
  Trash2,
  Clock
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface TaskCardProps {
  task: Task;
  isDragging?: boolean;
  onEdit?: (task: Task) => void;
  onDelete?: (task: Task) => void;
}

export function TaskCard({ task, isDragging, onEdit, onDelete }: TaskCardProps) {
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  
  const statusColors = {
    backlog: "bg-slate-100 text-slate-700 border-slate-200",
    todo: "bg-blue-100 text-blue-700 border-blue-200",
    doing: "bg-amber-100 text-amber-700 border-amber-200",
    done: "bg-green-100 text-green-700 border-green-200",
  };

  const tagColors = {
    dev: "bg-purple-100 text-purple-700 border-purple-200",
    content: "bg-emerald-100 text-emerald-700 border-emerald-200",
    design: "bg-pink-100 text-pink-700 border-pink-200",
    bug: "bg-red-100 text-red-700 border-red-200",
  };

  const priorityColors = {
    low: "bg-slate-100 text-slate-700 border-slate-200",
    medium: "bg-yellow-100 text-yellow-700 border-yellow-200",
    high: "bg-red-100 text-red-700 border-red-200",
  };

  return (
    <>
      <div
        className={`
          bg-white rounded-lg border
          ${useIsMobile() ? "p-4" : "p-3"}
          ${isDragging 
            ? "shadow-lg scale-105" 
            : "hover:shadow-md hover:scale-[1.02] hover:border-primary/20"
          }
          transition-all duration-200 ease-in-out
          relative group
        `}
      >
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge 
              variant="secondary" 
              className={`${statusColors[task.status]} text-xs capitalize`}
            >
              {task.status}
            </Badge>
            <Badge 
              variant="secondary" 
              className={`${priorityColors[task.priority]} text-xs capitalize`}
            >
              {task.priority}
            </Badge>
          </div>
          <div className={`flex items-center gap-1 ${
            useIsMobile() 
              ? "opacity-100" 
              : "opacity-0 group-hover:opacity-100 transition-opacity"
          }`}>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onEdit?.(task);
              }}
              className={`rounded-full transition-colors ${
                useIsMobile()
                  ? "p-2 active:bg-gray-200"
                  : "p-1.5 hover:bg-gray-100"
              }`}
              title="Edit task"
            >
              <Edit2 className="h-3.5 w-3.5 text-gray-500" />
            </button>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                setShowDeleteAlert(true);
              }}
              className={`rounded-full transition-colors ${
                useIsMobile()
                  ? "p-2 active:bg-red-100"
                  : "p-1.5 hover:bg-red-50"
              }`}
              title="Delete task"
            >
              <Trash2 className="h-3.5 w-3.5 text-red-500" />
            </button>
          </div>
        </div>

        <h3 className={`font-medium mb-2 line-clamp-2 ${
          useIsMobile() ? "text-base" : ""
        }`}>{task.title}</h3>
        
        {task.description && (
          <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
            {task.description}
          </p>
        )}

        {task.tags && task.tags.length > 0 && (
          <div className="flex items-center gap-2 mb-3 flex-wrap">
            {task.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className={`${tagColors[tag]} text-xs px-2 py-0`}>
                <Tag className="h-3 w-3 mr-1" />
                {tag}
              </Badge>
            ))}
          </div>
        )}

        <div className={`flex items-center justify-between text-muted-foreground ${
          useIsMobile() ? "text-sm" : "text-xs"
        }`}>
          <div className="flex items-center gap-3">
            {task.dueDate && (
              <div className="flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
              </div>
            )}
            {task.timeSpent && (
              <div className="flex items-center">
                <Clock className="h-3.5 w-3.5 mr-1" />
                {Math.floor(task.timeSpent / 60)}m
              </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {task.hasNotifications && (
              <Badge variant="destructive" className="h-5 w-5 rounded-full p-0 flex items-center justify-center">
                <Bell className="h-3 w-3" />
              </Badge>
            )}
            {task.comments?.length > 0 && (
              <Badge variant="secondary" className="flex items-center gap-1">
                <MessageCircle className="h-3 w-3" />
                {task.comments.length}
              </Badge>
            )}
            {task.assignedTo && (
              <Avatar className="h-6 w-6">
                <AvatarImage src={`https://avatar.vercel.sh/${task.assignedTo}.png`} />
                <AvatarFallback>
                  {task.assignedTo.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            )}
          </div>
        </div>
      </div>

      <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                onDelete?.(task);
                setShowDeleteAlert(false);
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
